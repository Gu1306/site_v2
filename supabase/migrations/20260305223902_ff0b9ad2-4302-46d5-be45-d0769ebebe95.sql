
create extension if not exists pgcrypto;

create table if not exists public.envio_resultados (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamptz not null default now(),
  nome text not null,
  prova text not null,
  data_prova date not null,
  distancia text not null,
  tipo text not null,
  tempo text not null,
  avaliacao integer not null check (avaliacao >= 1 and avaliacao <= 5),
  rpe integer not null check (rpe >= 1 and rpe <= 10),
  observacoes text,
  arquivos jsonb not null default '[]'::jsonb
);

alter table public.envio_resultados enable row level security;

drop policy if exists "Anyone can insert results" on public.envio_resultados;
create policy "Anyone can insert results"
on public.envio_resultados
for insert
to anon
with check (true);

drop policy if exists "Authenticated can read results" on public.envio_resultados;
create policy "Authenticated can read results"
on public.envio_resultados
for select
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('resultados-atletas', 'resultados-atletas', false)
on conflict (id) do update set public = false;

drop policy if exists "Anyone can upload athlete results" on storage.objects;
drop policy if exists "Public read access for athlete results" on storage.objects;
drop policy if exists "Authenticated can read athlete uploads" on storage.objects;

create policy "Anyone can upload athlete results"
on storage.objects
for insert
to anon
with check (bucket_id = 'resultados-atletas');

create policy "Authenticated can read athlete uploads"
on storage.objects
for select
to authenticated
using (bucket_id = 'resultados-atletas');
