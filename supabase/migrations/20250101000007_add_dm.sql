-- Conversations (1:1 per booking)
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null,
  created_at timestamptz not null default now(),
  last_message_at timestamptz,
  last_message_text text
);

-- Participants (user / provider)
create table if not exists public.conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid not null,
  role text check (role in ('user','provider')) not null,
  primary key(conversation_id, user_id)
);

-- Messages (text only)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid not null,
  content text not null check (length(content) > 0),
  created_at timestamptz not null default now()
);

create unique index if not exists idx_conversations_booking_unique on public.conversations(booking_id);
create index if not exists idx_messages_conv_time on public.messages(conversation_id, created_at desc);

-- RLS
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

create policy conv_select on public.conversations
for select using (
  exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = conversations.id
      and cp.user_id = auth.uid()
  )
);

create policy cp_select on public.conversation_participants
for select using (
  user_id = auth.uid() or exists (
    select 1 from public.conversation_participants cp2
    where cp2.conversation_id = conversation_participants.conversation_id
      and cp2.user_id = auth.uid()
  )
);

create policy msg_select on public.messages
for select using (
  exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
  )
);

create policy msg_insert on public.messages
for insert with check (
  sender_id = auth.uid() and exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
  )
);

-- RPC to ensure conversation exists for a booking (derives participants securely)
create or replace function public.ensure_conversation(
  p_booking_id uuid
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  conv_id uuid;
  v_user_id uuid;
  v_provider_user_id uuid;
begin
  -- derive booking user and provider's user_id
  select b.user_id, pr.user_id
    into v_user_id, v_provider_user_id
  from public.bookings b
  join public.experiences e on e.id = b.experience_id
  join public.providers pr on pr.id = e.provider_id
  where b.id = p_booking_id
  limit 1;

  if v_user_id is null or v_provider_user_id is null then
    raise exception 'booking not found or provider missing';
  end if;

  -- caller must be one of participants
  if auth.uid() is distinct from v_user_id and auth.uid() is distinct from v_provider_user_id then
    raise exception 'not allowed';
  end if;

  insert into public.conversations (booking_id)
  values (p_booking_id)
  on conflict (booking_id) do nothing;

  select id into conv_id from public.conversations where booking_id = p_booking_id;

  insert into public.conversation_participants (conversation_id, user_id, role)
  values (conv_id, v_user_id, 'user')
  on conflict do nothing;

  insert into public.conversation_participants (conversation_id, user_id, role)
  values (conv_id, v_provider_user_id, 'provider')
  on conflict do nothing;

  return conv_id;
end;
$$;


