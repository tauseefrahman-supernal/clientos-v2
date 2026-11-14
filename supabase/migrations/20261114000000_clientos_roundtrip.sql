-- Columns the app needs to store its model without loss. Additive only.

-- Files keep the template and category they came from by name, so a file survives its template
-- being renamed or removed.
alter table clientos.vault_files
  add column category_slug text,
  add column template_name text;

-- Who or what a category or template came from, as shown in the library ("every project" or a project name).
alter table clientos.template_categories add column origin text;
alter table clientos.templates
  add column origin text,
  add column category_slug text;

-- Two projects can each add a local template with the same name in the same category.
alter table clientos.templates drop constraint templates_category_id_name_key;
alter table clientos.templates add constraint templates_category_name_project_key unique nulls not distinct (category_id, name, only_account_id);

alter table clientos.book_chapters add column sources text[] not null default '{}';
alter table clientos.artifacts add column key text;
alter table clientos.workflows add column standard boolean not null default false;

create index vault_files_account_idx on clientos.vault_files (account_id);
create index book_chapters_account_idx on clientos.book_chapters (account_id, sort);
create index artifacts_account_idx on clientos.artifacts (account_id);
create index workflows_account_idx on clientos.workflows (account_id);
create index deals_account_idx on clientos.deals (account_id);
create index stella_chats_account_idx on clientos.stella_chats (account_id, updated_at desc);
