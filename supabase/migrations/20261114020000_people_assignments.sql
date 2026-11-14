-- Who is on the team, which projects each person is assigned to, and expansions linked to their account.

create table clientos.people (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,                 -- full name, e.g. "Tauseef Rahman"
  email       text unique,                          -- filled when the person first signs in
  user_id     uuid unique references auth.users(id) on delete set null,
  role        text not null default 'member' check (role in ('admin', 'member')),   -- admins see every project
  title       text,                                 -- Strategist, Account manager, Mason, FDE, Account executive
  squad       text,
  source      text not null default 'import' check (source in ('import', 'signin', 'manual')),
  created_at  timestamptz not null default now()
);

create table clientos.assignments (
  id          uuid primary key default gen_random_uuid(),
  account_id  uuid not null references clientos.accounts(id) on delete cascade,
  person_id   uuid not null references clientos.people(id) on delete cascade,
  role        text not null check (role in ('strategist', 'am', 'mason', 'fde', 'ae', 'other')),
  source      text not null default 'manual' check (source in ('import', 'manual')),   -- import = from Account OS pods and deals
  created_by  text,
  created_at  timestamptz not null default now(),
  unique (account_id, person_id, role)
);
create index assignments_person_idx on clientos.assignments (person_id);

-- An expansion deal is a scoping project of its own, linked to the account it expands.
alter table clientos.accounts add column parent_slug text;

alter table clientos.people      enable row level security;
alter table clientos.assignments enable row level security;
grant all on clientos.people, clientos.assignments to service_role;
