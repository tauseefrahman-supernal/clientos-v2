-- Stella's memory: one row per call, linked to the projects it belongs to; match rules per project;
-- pending vault facts; sync state; chunks tied to their owners; and one hybrid search function.
-- Runs in a single transaction. See docs/superpowers/specs/2026-11-18-stella-memory-design.md.

-- ---------- calls: new columns ----------
alter table clientos.transcripts
  add column speakers  jsonb not null default '[]'::jsonb,
  add column status    text  not null default 'pending' check (status in ('pending', 'digested', 'failed', 'personnel')),
  add column cuts      jsonb not null default '[]'::jsonb,       -- personnel or private stretches removed from body
  add column gone_at   timestamptz,                              -- missing at the source since this sync
  add column synced_at timestamptz;

-- ---------- new tables ----------
create table clientos.transcript_accounts (
  transcript_id uuid not null references clientos.transcripts(id) on delete cascade,
  account_id    uuid not null references clientos.accounts(id) on delete cascade,
  headline      text not null default '',                        -- this project's one-line part of the call
  source        text not null default 'auto' check (source in ('auto', 'manual')),
  primary key (transcript_id, account_id)
);
create index transcript_accounts_account_idx on clientos.transcript_accounts (account_id);

-- Manual choices that every later sync respects.
create table clientos.transcript_overrides (
  id            uuid primary key default gen_random_uuid(),
  transcript_id uuid not null references clientos.transcripts(id) on delete cascade,
  account_id    uuid references clientos.accounts(id) on delete cascade,   -- null for personnel overrides
  action        text not null check (action in ('assign', 'unassign', 'personnel', 'not_personnel')),
  by            text,
  at            timestamptz not null default now()
);
create index transcript_overrides_transcript_idx on clientos.transcript_overrides (transcript_id);

-- How the sync decides a call belongs to a project.
create table clientos.match_rules (
  account_id uuid not null references clientos.accounts(id) on delete cascade,
  kind       text not null check (kind in ('keyword', 'email', 'domain')),
  value      text not null,
  source     text not null default 'manual' check (source in ('seed', 'accountos', 'manual')),
  primary key (account_id, kind, value)
);

-- Facts Stella proposes from a call, until a strategist accepts or rejects them.
create table clientos.vault_suggestions (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid not null references clientos.accounts(id) on delete cascade,
  file_path     text not null,
  section       text,
  text          text not null,
  transcript_id uuid references clientos.transcripts(id) on delete cascade,
  met_at        timestamptz,
  status        text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  decided_by    text,
  decided_at    timestamptz
);
create index vault_suggestions_account_idx on clientos.vault_suggestions (account_id, status);

create table clientos.sync_state (
  provider    text primary key check (provider in ('granola', 'fathom')),
  cursor      text,
  last_run_at timestamptz,
  last_error  text
);

-- ---------- data move: one transcripts row per call ----------
-- The earliest-pulled copy of each call (ties broken by id) is kept with its own fields; every old
-- row becomes a project link carrying its summary as that project's headline.
create temporary table _keep as
select t.id as old_id, t.account_id, t.summary,
       first_value(t.id) over (partition by t.provider, t.external_id order by t.pulled_at, t.id) as keep_id
from clientos.transcripts t;

insert into clientos.transcript_accounts (transcript_id, account_id, headline, source)
select keep_id, account_id, summary, 'auto' from _keep where account_id is not null;

-- Body, links and participants missing on the kept copy come from the earliest-pulled copy that has them.
update clientos.transcripts t set
  body         = coalesce(m.body, t.body),
  url          = coalesce(m.url, t.url),
  alt_url      = coalesce(m.alt_url, t.alt_url),
  participants = coalesce(m.participants, t.participants)
from (
  select k.keep_id,
         (array_agg(o.body         order by o.pulled_at, o.id) filter (where o.body is not null))[1]    as body,
         (array_agg(o.url          order by o.pulled_at, o.id) filter (where o.url is not null))[1]     as url,
         (array_agg(o.alt_url      order by o.pulled_at, o.id) filter (where o.alt_url is not null))[1] as alt_url,
         (array_agg(o.participants order by o.pulled_at, o.id) filter (where o.participants <> '[]'::jsonb))[1] as participants
  from _keep k join clientos.transcripts o on o.id = k.old_id
  group by k.keep_id
  having count(*) > 1
) m
where t.id = m.keep_id;

-- Chunks of a dropped copy move to the kept row before the copy goes.
update clientos.chunks c set owner_id = k.keep_id
from _keep k where c.owner_type = 'transcript' and c.owner_id = k.old_id and k.old_id <> k.keep_id;

delete from clientos.transcripts t using _keep k where t.id = k.old_id and k.old_id <> k.keep_id;
drop table _keep;

alter table clientos.transcripts drop constraint transcripts_account_provider_external_key;
drop index if exists clientos.transcripts_account_idx;
alter table clientos.transcripts drop column account_id;
alter table clientos.transcripts add constraint transcripts_provider_external_id_key unique (provider, external_id);
create index transcripts_met_at_idx on clientos.transcripts (met_at desc);

-- ---------- chunks ----------
alter table clientos.chunks
  add column layer         text check (layer in ('vault', 'chapter', 'summary', 'transcript')),
  add column met_at        timestamptz,
  add column speakers      text[] not null default '{}',
  add column seq           int,
  add column transcript_id uuid references clientos.transcripts(id) on delete cascade,
  add column vault_file_id uuid references clientos.vault_files(id) on delete cascade,
  add column chapter_id    uuid references clientos.book_chapters(id) on delete cascade;

-- Chunks whose owner no longer exists point at nothing: remove them, then tie the rest to their owner.
delete from clientos.chunks c where
     (c.owner_type = 'transcript' and not exists (select 1 from clientos.transcripts t where t.id = c.owner_id))
  or (c.owner_type = 'file'       and not exists (select 1 from clientos.vault_files f where f.id = c.owner_id))
  or (c.owner_type = 'chapter'    and not exists (select 1 from clientos.book_chapters b where b.id = c.owner_id));
update clientos.chunks set transcript_id = owner_id, layer = 'transcript' where owner_type = 'transcript';
update clientos.chunks set vault_file_id = owner_id, layer = 'vault'      where owner_type = 'file';
update clientos.chunks set chapter_id    = owner_id, layer = 'chapter'    where owner_type = 'chapter';
update clientos.chunks c set met_at = t.met_at from clientos.transcripts t where c.transcript_id = t.id;
alter table clientos.chunks add constraint chunks_one_owner check (num_nonnulls(transcript_id, vault_file_id, chapter_id) <= 1);

create index chunks_transcript_idx on clientos.chunks (transcript_id);
create index chunks_vault_file_idx on clientos.chunks (vault_file_id);
create index chunks_chapter_idx    on clientos.chunks (chapter_id);
create index chunks_embedding_idx  on clientos.chunks using hnsw (embedding vector_cosine_ops);
-- chunks_fts_idx (gin on to_tsvector('english', body)) stays as it is.

-- A chunk of a call that covers several projects belongs to each of them.
create table clientos.chunk_accounts (
  chunk_id   uuid not null references clientos.chunks(id) on delete cascade,
  account_id uuid not null references clientos.accounts(id) on delete cascade,
  primary key (chunk_id, account_id)
);
create index chunk_accounts_account_idx on clientos.chunk_accounts (account_id);
insert into clientos.chunk_accounts (chunk_id, account_id)
select id, account_id from clientos.chunks where account_id is not null;
-- A call's chunks belong to every project the call is linked to.
insert into clientos.chunk_accounts (chunk_id, account_id)
select c.id, ta.account_id from clientos.chunks c join clientos.transcript_accounts ta on ta.transcript_id = c.transcript_id
on conflict do nothing;

-- ---------- hybrid search ----------
-- Reciprocal-rank fusion (k = 60) of vector similarity and full-text rank. Without an explicit date
-- range the fused score halves every 60 days of age; chunks with no date are not penalised.
-- A null q_embedding searches full text only. Projects are deny by default: only chunks linked to
-- account_ids are searched, and a null or empty list finds nothing unless all_projects is true
-- (admins). Other null filters mean "no filter".
create or replace function clientos.search_chunks(
  q_embedding vector(1024) default null,
  q_text      text         default null,
  account_ids uuid[]       default null,
  layers      text[]       default null,
  since       timestamptz  default null,
  until       timestamptz  default null,
  speakers    text[]       default null,
  k           int          default 6,
  all_projects boolean     default false
) returns table (chunk_id uuid, transcript_id uuid, account_id uuid, layer text, label text, body text, met_at timestamptz, speakers text[], score real)
language sql stable
set search_path = clientos, public, extensions
set hnsw.iterative_scan = 'relaxed_order'   -- keep scanning the index until filtered rows are found
set hnsw.ef_search = 200
as $$
  with base as not materialized (
    select c.id, c.embedding, c.body
    from clientos.chunks c
    where c.usable
      and (search_chunks.layers is null or c.layer = any (search_chunks.layers))
      and (search_chunks.since  is null or c.met_at >= search_chunks.since)
      and (search_chunks.until  is null or c.met_at <  search_chunks.until)
      and (search_chunks.speakers is null or c.speakers && search_chunks.speakers)
      and (search_chunks.all_projects or exists (
            select 1 from clientos.chunk_accounts ca where ca.chunk_id = c.id and ca.account_id = any (search_chunks.account_ids)))
  ),
  vec as (
    select b.id, row_number() over (order by b.embedding <=> search_chunks.q_embedding) as r
    from base b
    where search_chunks.q_embedding is not null and b.embedding is not null
    order by b.embedding <=> search_chunks.q_embedding
    limit greatest(search_chunks.k, 1) * 10
  ),
  fts as (
    select b.id, row_number() over (order by ts_rank_cd(to_tsvector('english', b.body), q) desc) as r
    from base b, websearch_to_tsquery('english', coalesce(search_chunks.q_text, '')) q
    where coalesce(search_chunks.q_text, '') <> '' and to_tsvector('english', b.body) @@ q
    order by ts_rank_cd(to_tsvector('english', b.body), q) desc
    limit greatest(search_chunks.k, 1) * 10
  ),
  fused as (
    select x.id, sum(1.0 / (60 + x.r)) as s
    from (select * from vec union all select * from fts) x
    group by x.id
  )
  select c.id, c.transcript_id,
         coalesce((select ca.account_id from clientos.chunk_accounts ca
                   where ca.chunk_id = c.id and (search_chunks.all_projects or ca.account_id = any (search_chunks.account_ids))
                   order by ca.account_id = c.account_id desc nulls last limit 1), c.account_id),
         c.layer, c.label, c.body, c.met_at, c.speakers,
         (f.s * case when search_chunks.since is null and search_chunks.until is null and c.met_at is not null
                     then power(0.5, greatest(0, extract(epoch from now() - c.met_at) / 86400.0) / 60.0)
                     else 1 end)::real as score
  from fused f join clientos.chunks c on c.id = f.id
  order by score desc
  limit greatest(search_chunks.k, 1);
$$;

revoke all on function clientos.search_chunks(vector, text, uuid[], text[], timestamptz, timestamptz, text[], int, boolean) from public, anon, authenticated;
grant execute on function clientos.search_chunks(vector, text, uuid[], text[], timestamptz, timestamptz, text[], int, boolean) to service_role;

-- ---------- access: service role only, like the other clientos tables ----------
alter table clientos.transcript_accounts  enable row level security;
alter table clientos.transcript_overrides enable row level security;
alter table clientos.match_rules          enable row level security;
alter table clientos.vault_suggestions    enable row level security;
alter table clientos.sync_state           enable row level security;
alter table clientos.chunk_accounts       enable row level security;
grant all on clientos.transcript_accounts, clientos.transcript_overrides, clientos.match_rules,
             clientos.vault_suggestions, clientos.sync_state, clientos.chunk_accounts to service_role;
