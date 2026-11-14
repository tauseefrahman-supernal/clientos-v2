-- Stella chats can span several projects, carry documents Stella wrote, and attachments people added.

alter table clientos.stella_chats alter column account_id drop not null;
alter table clientos.stella_chats add column scope text[] not null default '{}';   -- project slugs; '{*}' = all projects
update clientos.stella_chats c set scope = array[a.slug] from clientos.accounts a where a.id = c.account_id and c.scope = '{}';

alter table clientos.stella_messages
  add column documents   jsonb not null default '[]'::jsonb,   -- [{id, title, content, projects}]
  add column attachments jsonb not null default '[]'::jsonb;   -- [{name, kind, size, text?}] (text files only keep their text)
