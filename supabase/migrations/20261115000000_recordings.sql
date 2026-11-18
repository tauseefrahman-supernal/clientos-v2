-- Recordings: the meetings pulled in for each project (Granola, Fathom), listed with a link.
-- The same meeting can belong to several projects (a pipeline review covers many deals).

alter table clientos.transcripts drop constraint transcripts_provider_external_id_key;
alter table clientos.transcripts add constraint transcripts_account_provider_external_key unique (account_id, provider, external_id);
alter table clientos.transcripts
  add column kind     text not null default 'client' check (kind in ('client', 'internal', 'multi')),
  add column url      text,
  add column alt_url  text,
  add column pulled_at timestamptz not null default now();
create index transcripts_account_idx on clientos.transcripts (account_id, met_at desc);
