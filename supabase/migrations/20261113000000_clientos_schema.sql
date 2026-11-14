-- ClientOS v2 schema. Lives beside the existing `presales` schema in the same Supabase project.
-- Account OS stays the system of record for accounts, deals, health and stakeholders;
-- these tables hold the context, structure and work ClientOS adds on top.

create schema if not exists clientos;
create extension if not exists vector with schema extensions;  -- no-op if the project already has it

-- ---------- accounts and deals (read from Account OS) ----------
create table clientos.accounts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  accountos_id  text unique,
  name          text not null,
  stage         text not null default 'delivery' check (stage in ('delivery', 'sales')),  -- sales = a deal being scoped
  industry      text,
  squad         text,                                    -- Origin, Polaris, ...
  pod           jsonb not null default '{}'::jsonb,      -- {am, strategist, fde}
  strategist    text,
  summary       jsonb not null default '{}'::jsonb,      -- mrr, closed value, health snapshot, freshness lines
  synced_at     timestamptz,
  created_at    timestamptz not null default now()
);

create table clientos.deals (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid not null references clientos.accounts(id) on delete cascade,
  accountos_id  text unique,
  name          text not null,
  value         text,
  stage         text,
  phase         smallint not null default 0 check (phase between 0 and 3),  -- Sales, Deal, Technical, Delivery
  note          text,
  motion        text,                                    -- New, Expansion
  owner         text,                                    -- AE
  pod_strategist text,
  confidence    text,
  mrr           text,
  expected_close date,
  next_step     text,
  description   text,
  people        jsonb not null default '[]'::jsonb,
  accountos_updated_at timestamptz,
  sort          int not null default 0
);

create table clientos.squads (
  name     text primary key,
  members  text[] not null default '{}',
  source   text
);

-- ---------- template library ----------
create table clientos.template_groups (
  id    smallint primary key,                 -- 0 Sales, 1 Deal, 2 Technical, 3 Delivery
  name  text not null unique
);
insert into clientos.template_groups (id, name) values
  (0, 'Sales Strategy'), (1, 'Deal Strategy'), (2, 'Technical Strategy'), (3, 'Delivery Strategy');

create type clientos.share_status as enum ('local', 'proposed', 'shared', 'standard');

create table clientos.template_categories (
  id                 uuid primary key default gen_random_uuid(),
  group_id           smallint not null references clientos.template_groups(id),
  slug               text not null unique,
  name               text not null,
  description        text not null default '',
  status             clientos.share_status not null default 'local',
  is_core            boolean not null default false,
  created_by         text,
  origin_account_id  uuid references clientos.accounts(id) on delete set null,
  created_at         timestamptz not null default now()
);

create table clientos.templates (
  id                 uuid primary key default gen_random_uuid(),
  category_id        uuid not null references clientos.template_categories(id) on delete cascade,
  name               text not null,                -- e.g. Feature-Rationale
  description        text not null default '',
  body               text not null default '',     -- markdown skeleton
  status             clientos.share_status not null default 'local',
  only_account_id    uuid references clientos.accounts(id) on delete cascade,   -- custom to one project
  created_by         text,
  origin_account_id  uuid references clientos.accounts(id) on delete set null,
  version            int not null default 1,
  updated_at         timestamptz not null default now(),
  unique (category_id, name)
);

create table clientos.approvals (
  id            uuid primary key default gen_random_uuid(),
  target_type   text not null check (target_type in ('category', 'template')),
  target_id     uuid not null,
  requested_by  text not null,
  requested_at  timestamptz not null default now(),
  reviewer      text,
  decision      text check (decision in ('approved', 'changes_requested')),
  comment       text,
  decided_at    timestamptz
);

-- ---------- vault ----------
create type clientos.file_state as enum ('active', 'hidden', 'archived', 'deleted');

create table clientos.vault_files (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid not null references clientos.accounts(id) on delete cascade,
  category_id   uuid references clientos.template_categories(id) on delete set null,
  template_id   uuid references clientos.templates(id) on delete set null,     -- null = custom file
  path          text not null,                                                 -- e.g. Product/Feature-Rationale
  summary       text not null default '',
  content       text not null default '',
  source        text not null default 'template' check (source in ('template', 'human', 'stella', 'import')),
  state         clientos.file_state not null default 'active',
  in_book       boolean not null default true,
  shown         boolean,                                 -- in the vault sidebar; null = shown when it has content
  updated_by    text,
  updated_at    timestamptz not null default now(),
  unique (account_id, path)
);

create table clientos.vault_file_versions (
  id          uuid primary key default gen_random_uuid(),
  file_id     uuid not null references clientos.vault_files(id) on delete cascade,
  content     text not null,
  saved_by    text,
  saved_at    timestamptz not null default now()
);

-- ---------- sources ----------
create table clientos.transcripts (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid references clientos.accounts(id) on delete cascade,
  provider      text not null check (provider in ('granola', 'fathom', 'upload')),
  external_id   text not null,
  title         text not null,
  met_at        timestamptz,
  participants  jsonb not null default '[]'::jsonb,
  summary       text not null default '',
  body          text,
  unique (provider, external_id)
);

create table clientos.artifacts (
  id               uuid primary key default gen_random_uuid(),
  account_id       uuid not null references clientos.accounts(id) on delete cascade,
  kind             text not null,
  title            text not null,
  dated            text,
  description      text not null default '',
  url              text,
  provider         text,                                   -- Drive, Slack, Notion, claude.ai, Web
  sensitive        boolean not null default false,          -- client's own customers' data: never shown, never chunked
  excluded_reason  text
);

create table clientos.source_links (
  id           uuid primary key default gen_random_uuid(),
  from_type    text not null check (from_type in ('file', 'chapter', 'workflow_run')),
  from_id      uuid not null,
  to_type      text not null check (to_type in ('transcript', 'artifact', 'file', 'note')),
  to_id        uuid,
  label        text not null                              -- readable citation, e.g. "QBR, 29 Oct"
);

-- ---------- the book ----------
create table clientos.book_chapters (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid not null references clientos.accounts(id) on delete cascade,
  sort          int not null,
  title         text not null,
  minutes       int not null default 1,
  lenses        text[] not null default array['all'],
  body          text not null,
  generated_at  timestamptz not null default now(),
  stale         boolean not null default false
);

-- ---------- Stella's memory ----------
create table clientos.chunks (
  id           uuid primary key default gen_random_uuid(),
  account_id   uuid references clientos.accounts(id) on delete cascade,
  owner_type   text not null check (owner_type in ('file', 'transcript', 'artifact', 'chapter', 'context_doc')),
  owner_id     uuid,
  label        text not null,                              -- citation shown to the user
  body         text not null,
  embedding    vector(1024),
  usable       boolean not null default true,              -- false when the owner is hidden, archived, deleted or sensitive
  created_at   timestamptz not null default now()
);
create index chunks_account_idx on clientos.chunks (account_id) where usable;
create index chunks_fts_idx on clientos.chunks using gin (to_tsvector('english', body));

-- ---------- work ----------
create table clientos.workflows (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid references clientos.accounts(id) on delete cascade,   -- null = standard on every account
  slug          text not null,
  name          text not null,
  kind          text not null check (kind in ('external', 'internal')),
  cadence       text,
  audience      text,
  inputs        text[] not null default '{}',
  output        text,
  instructions  text not null default '',
  note          text,
  unique (account_id, slug)
);

create table clientos.workflow_runs (
  id            uuid primary key default gen_random_uuid(),
  workflow_id   uuid not null references clientos.workflows(id) on delete cascade,
  account_id    uuid not null references clientos.accounts(id) on delete cascade,
  started_by    text,
  status        text not null default 'running' check (status in ('running', 'draft', 'approved', 'sent', 'failed')),
  draft         text,
  approved_by   text,
  sent_to       text,
  started_at    timestamptz not null default now(),
  finished_at   timestamptz
);

-- Access: the app server uses the service role. Row-level security is enabled so the anon key reads nothing.
alter table clientos.accounts            enable row level security;
alter table clientos.deals               enable row level security;
alter table clientos.template_categories enable row level security;
alter table clientos.templates           enable row level security;
alter table clientos.approvals           enable row level security;
alter table clientos.vault_files         enable row level security;
alter table clientos.vault_file_versions enable row level security;
alter table clientos.transcripts         enable row level security;
alter table clientos.artifacts           enable row level security;
alter table clientos.source_links        enable row level security;
alter table clientos.book_chapters       enable row level security;
alter table clientos.chunks              enable row level security;
alter table clientos.workflows           enable row level security;
alter table clientos.workflow_runs       enable row level security;
alter table clientos.squads              enable row level security;
alter table clientos.template_groups     enable row level security;

-- ---------- Stella conversations ----------
create table clientos.stella_chats (
  id          uuid primary key default gen_random_uuid(),
  account_id  uuid not null references clientos.accounts(id) on delete cascade,
  created_by  uuid references auth.users(id) on delete set null,
  title       text not null default 'New chat',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index stella_chats_user_idx on clientos.stella_chats (created_by, updated_at desc);

create table clientos.stella_messages (
  id          uuid primary key default gen_random_uuid(),
  chat_id     uuid not null references clientos.stella_chats(id) on delete cascade,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null default '',
  steps       jsonb not null default '[]'::jsonb,       -- retrieval steps shown under the answer
  error       text,
  usage       jsonb,                                    -- token counts for cost tracking
  created_at  timestamptz not null default now()
);
create index stella_messages_chat_idx on clientos.stella_messages (chat_id, created_at);

alter table clientos.stella_chats    enable row level security;
alter table clientos.stella_messages enable row level security;

-- The app reads and writes from the server with the service role. No policies are defined, so
-- the anon and authenticated roles see nothing until sign-in and per-user policies are added.
grant usage on schema clientos to service_role;
grant all on all tables in schema clientos to service_role;
grant all on all sequences in schema clientos to service_role;
alter default privileges in schema clientos grant all on tables to service_role;
alter default privileges in schema clientos grant all on sequences to service_role;
