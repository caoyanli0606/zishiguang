create table if not exists public.tts_queue (
  id text primary key,
  family_id text not null,
  text text not null check (char_length(text) between 1 and 300),
  status text not null default 'pending' check (status in ('pending', 'generated')),
  created_at timestamptz not null default now(),
  generated_at timestamptz
);

alter table public.tts_queue enable row level security;
grant select, insert, update on public.tts_queue to anon;

drop policy if exists "tts queue can be read by family" on public.tts_queue;
drop policy if exists "tts queue can be created by family" on public.tts_queue;
drop policy if exists "tts queue can be updated by family" on public.tts_queue;

create policy "tts queue can be read by family"
on public.tts_queue for select to anon
using ((current_setting('request.headers', true)::json ->> 'x-family-id') = family_id);

create policy "tts queue can be created by family"
on public.tts_queue for insert to anon
with check ((current_setting('request.headers', true)::json ->> 'x-family-id') = family_id);

create policy "tts queue can be updated by family"
on public.tts_queue for update to anon
using ((current_setting('request.headers', true)::json ->> 'x-family-id') = family_id)
with check ((current_setting('request.headers', true)::json ->> 'x-family-id') = family_id);

create index if not exists tts_queue_pending_idx on public.tts_queue (status, created_at);
