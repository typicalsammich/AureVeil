create extension if not exists pgcrypto;
create extension if not exists vector;

create type public.artwork_visibility as enum ('public','unlisted','private');
create type public.order_status as enum ('pending','paid','processing','shipped','completed','cancelled','refunded','disputed');
create type public.wallet_tx_type as enum ('deposit','purchase','sale','commission_payment','commission_earning','refund','promotion','withdrawal','platform_fee');
create type public.wallet_tx_status as enum ('pending','completed','failed','reversed');
create type public.commission_status as enum ('request_sent','discussing','awaiting_payment','in_progress','preview_sent','revision_requested','completed','cancelled','disputed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-zA-Z0-9_]{3,30}$'),
  display_name text not null default '', bio text not null default '', location text,
  website text, instagram text, avatar_url text, cover_url text,
  is_private boolean not null default false, creator_mode boolean not null default false,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  interests text[] not null default '{}', goals text[] not null default '{}', mature_content boolean not null default false, personalization_enabled boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.artist_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  specialties text[] not null default '{}', styles text[] not null default '{}', commissions_open boolean not null default false,
  payout_enabled boolean not null default false, stripe_connect_account_id text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.artworks (
  id uuid primary key default gen_random_uuid(), creator_id uuid not null references public.profiles(id) on delete cascade,
  slug text unique not null, title text not null, description text not null default '', category text not null,
  medium text, style text, subject text, tags text[] not null default '{}', year_created int,
  original_dimensions text, ai_tools_involved boolean not null default false, availability text not null default 'showcase',
  price_cents int check (price_cents is null or price_cents >= 0), currency text not null default 'usd',
  visibility public.artwork_visibility not null default 'public', mature boolean not null default false,
  comments_enabled boolean not null default true, rights text not null default 'All Rights Reserved',
  view_count bigint not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index artworks_creator_idx on public.artworks(creator_id);
create index artworks_created_idx on public.artworks(created_at desc);
create index artworks_category_idx on public.artworks(category);
create index artworks_tags_gin on public.artworks using gin(tags);

create table public.artwork_images (
  id uuid primary key default gen_random_uuid(), artwork_id uuid not null references public.artworks(id) on delete cascade,
  storage_path text not null, alt_text text not null default '', sort_order int not null default 0,
  width int, height int, created_at timestamptz not null default now()
);

create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade,
  following_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(), primary key(follower_id,following_id), check(follower_id <> following_id)
);
create table public.likes (
  user_id uuid references public.profiles(id) on delete cascade, artwork_id uuid references public.artworks(id) on delete cascade,
  created_at timestamptz not null default now(), primary key(user_id,artwork_id)
);
create table public.collections (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null, description text not null default '', is_public boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.collection_items (
  collection_id uuid references public.collections(id) on delete cascade, artwork_id uuid references public.artworks(id) on delete cascade,
  sort_order int not null default 0, created_at timestamptz not null default now(), primary key(collection_id,artwork_id)
);
create table public.comments (
  id uuid primary key default gen_random_uuid(), artwork_id uuid not null references public.artworks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade, parent_id uuid references public.comments(id) on delete cascade,
  body text not null check(char_length(body) between 1 and 2000), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(), artwork_id uuid references public.artworks(id) on delete set null,
  seller_id uuid not null references public.profiles(id) on delete cascade, type text not null,
  title text not null, description text not null default '', price_cents int not null check(price_cents >= 0), currency text not null default 'usd',
  quantity int, requires_shipping boolean not null default false, active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.carts (id uuid primary key default gen_random_uuid(), user_id uuid unique not null references public.profiles(id) on delete cascade, updated_at timestamptz not null default now());
create table public.cart_items (cart_id uuid references public.carts(id) on delete cascade, product_id uuid references public.products(id) on delete cascade, quantity int not null default 1 check(quantity > 0), primary key(cart_id,product_id));
create table public.orders (
  id uuid primary key default gen_random_uuid(), buyer_id uuid not null references public.profiles(id), status public.order_status not null default 'pending',
  subtotal_cents int not null, platform_fee_cents int not null default 0, shipping_cents int not null default 0, total_cents int not null,
  currency text not null default 'usd', stripe_checkout_session_id text unique, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id), seller_id uuid not null references public.profiles(id), quantity int not null,
  unit_price_cents int not null, platform_fee_cents int not null, creator_amount_cents int not null
);

create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  type public.wallet_tx_type not null, amount_cents bigint not null, currency text not null default 'usd', status public.wallet_tx_status not null,
  stripe_payment_id text, order_id uuid references public.orders(id), description text not null default '', idempotency_key text unique,
  created_at timestamptz not null default now()
);
create index wallet_transactions_user_idx on public.wallet_transactions(user_id,created_at desc);

create or replace function public.wallet_balance(p_user_id uuid) returns bigint language sql stable security definer set search_path=public as $$
  select coalesce(sum(case when status='completed' then
    case when type in ('deposit','sale','commission_earning','refund') then amount_cents else -amount_cents end else 0 end),0)::bigint
  from public.wallet_transactions where user_id=p_user_id;
$$;

create table public.commission_services (
  id uuid primary key default gen_random_uuid(), artist_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, description text not null default '', starting_price_cents int not null, turnaround_days int,
  revisions int not null default 0, deliverables text[] not null default '{}', commercial_use_available boolean not null default false, active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.commission_requests (
  id uuid primary key default gen_random_uuid(), service_id uuid references public.commission_services(id), buyer_id uuid not null references public.profiles(id),
  artist_id uuid not null references public.profiles(id), status public.commission_status not null default 'request_sent', brief text not null,
  desired_style text, dimensions text, deadline date, usage text, budget_cents int, agreed_price_cents int,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.conversations (id uuid primary key default gen_random_uuid(), commission_id uuid references public.commission_requests(id), created_at timestamptz not null default now());
create table public.conversation_members (conversation_id uuid references public.conversations(id) on delete cascade, user_id uuid references public.profiles(id) on delete cascade, last_read_at timestamptz, primary key(conversation_id,user_id));
create table public.messages (
  id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id), body text not null default '', attachment_path text,
  created_at timestamptz not null default now()
);
create index messages_conversation_idx on public.messages(conversation_id,created_at);

create table public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id), type text not null, entity_type text, entity_id uuid, read_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.promotions (
  id uuid primary key default gen_random_uuid(), artist_id uuid not null references public.profiles(id), artwork_id uuid not null references public.artworks(id),
  starts_at timestamptz not null, ends_at timestamptz not null, status text not null default 'pending', cost_cents int not null,
  impressions bigint not null default 0, clicks bigint not null default 0, profile_visits bigint not null default 0, saves bigint not null default 0,
  created_at timestamptz not null default now()
);
create table public.reports (
  id uuid primary key default gen_random_uuid(), reporter_id uuid not null references public.profiles(id), target_type text not null,
  target_id uuid not null, reason text not null, details text not null default '', status text not null default 'open', created_at timestamptz not null default now()
);
create table public.blocks (blocker_id uuid references public.profiles(id) on delete cascade, blocked_id uuid references public.profiles(id) on delete cascade, created_at timestamptz not null default now(), primary key(blocker_id,blocked_id));
create table public.search_history (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, query text not null, created_at timestamptz not null default now());
create index search_history_user_created_idx on public.search_history(user_id, created_at desc);
create table public.recommendation_events (id bigint generated always as identity primary key, user_id uuid references public.profiles(id) on delete cascade, artwork_id uuid references public.artworks(id) on delete cascade, event_type text not null, metadata jsonb not null default '{}', created_at timestamptz not null default now());
create index recommendation_events_user_created_idx on public.recommendation_events(user_id, created_at desc);
create index recommendation_events_artwork_idx on public.recommendation_events(artwork_id, created_at desc);
create table public.visual_embeddings (artwork_id uuid primary key references public.artworks(id) on delete cascade, provider text not null, model text not null, embedding vector(768), updated_at timestamptz not null default now());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,username,display_name)
  values(new.id, coalesce(nullif(new.raw_user_meta_data->>'username',''),'user_'||substr(new.id::text,1,8)), coalesce(new.raw_user_meta_data->>'display_name',''));
  insert into public.user_preferences(user_id) values(new.id);
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.artist_profiles enable row level security;
alter table public.artworks enable row level security;
alter table public.artwork_images enable row level security;
alter table public.follows enable row level security;
alter table public.likes enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.comments enable row level security;
alter table public.products enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.commission_services enable row level security;
alter table public.commission_requests enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.promotions enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;
alter table public.search_history enable row level security;
alter table public.recommendation_events enable row level security;
alter table public.visual_embeddings enable row level security;

create policy "public profiles readable" on public.profiles for select using (not is_private or auth.uid()=id);
create policy "own profile update" on public.profiles for update using(auth.uid()=id) with check(auth.uid()=id);
create policy "own preferences" on public.user_preferences for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "artist profiles readable" on public.artist_profiles for select using(true);
create policy "own artist profile" on public.artist_profiles for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "public artwork readable" on public.artworks for select using(visibility='public' or auth.uid()=creator_id);
create policy "creator artwork write" on public.artworks for all using(auth.uid()=creator_id) with check(auth.uid()=creator_id);
create policy "artwork images readable" on public.artwork_images for select using(exists(select 1 from public.artworks a where a.id=artwork_id and (a.visibility='public' or a.creator_id=auth.uid())));
create policy "creator artwork images write" on public.artwork_images for all using(exists(select 1 from public.artworks a where a.id=artwork_id and a.creator_id=auth.uid())) with check(exists(select 1 from public.artworks a where a.id=artwork_id and a.creator_id=auth.uid()));
create policy "follows readable" on public.follows for select using(true); create policy "own follows" on public.follows for insert with check(auth.uid()=follower_id); create policy "own unfollows" on public.follows for delete using(auth.uid()=follower_id);
create policy "likes readable" on public.likes for select using(true); create policy "own likes" on public.likes for insert with check(auth.uid()=user_id); create policy "own unlike" on public.likes for delete using(auth.uid()=user_id);
create policy "collections readable" on public.collections for select using(is_public or auth.uid()=user_id); create policy "own collections" on public.collections for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "collection items readable" on public.collection_items for select using(exists(select 1 from public.collections c where c.id=collection_id and (c.is_public or c.user_id=auth.uid()))); create policy "own collection items" on public.collection_items for all using(exists(select 1 from public.collections c where c.id=collection_id and c.user_id=auth.uid())) with check(exists(select 1 from public.collections c where c.id=collection_id and c.user_id=auth.uid()));
create policy "comments readable" on public.comments for select using(true); create policy "own comments insert" on public.comments for insert with check(auth.uid()=user_id); create policy "own comments modify" on public.comments for update using(auth.uid()=user_id); create policy "own comments delete" on public.comments for delete using(auth.uid()=user_id);
create policy "active products readable" on public.products for select using(active or auth.uid()=seller_id); create policy "seller products" on public.products for all using(auth.uid()=seller_id) with check(auth.uid()=seller_id);
create policy "own cart" on public.carts for all using(auth.uid()=user_id) with check(auth.uid()=user_id); create policy "own cart items" on public.cart_items for all using(exists(select 1 from public.carts c where c.id=cart_id and c.user_id=auth.uid())) with check(exists(select 1 from public.carts c where c.id=cart_id and c.user_id=auth.uid()));
create policy "buyer orders read" on public.orders for select using(auth.uid()=buyer_id); create policy "seller order items read" on public.order_items for select using(auth.uid()=seller_id or exists(select 1 from public.orders o where o.id=order_id and o.buyer_id=auth.uid()));
create policy "wallet own read only" on public.wallet_transactions for select using(auth.uid()=user_id);
create policy "commission services readable" on public.commission_services for select using(active or auth.uid()=artist_id); create policy "artist commission services" on public.commission_services for all using(auth.uid()=artist_id) with check(auth.uid()=artist_id);
create policy "commission participants" on public.commission_requests for select using(auth.uid() in (buyer_id,artist_id));
create policy "buyer requests commission" on public.commission_requests for insert with check(auth.uid()=buyer_id);
create policy "commission participant update" on public.commission_requests for update using(auth.uid() in (buyer_id,artist_id));
create policy "conversation members read" on public.conversations for select using(exists(select 1 from public.conversation_members cm where cm.conversation_id=id and cm.user_id=auth.uid()));
create policy "members readable" on public.conversation_members for select using(exists(select 1 from public.conversation_members mine where mine.conversation_id=conversation_id and mine.user_id=auth.uid()));
create policy "messages read" on public.messages for select using(exists(select 1 from public.conversation_members cm where cm.conversation_id=conversation_id and cm.user_id=auth.uid()));
create policy "messages insert" on public.messages for insert with check(auth.uid()=sender_id and exists(select 1 from public.conversation_members cm where cm.conversation_id=conversation_id and cm.user_id=auth.uid()));
create policy "notifications own" on public.notifications for select using(auth.uid()=user_id); create policy "notifications own update" on public.notifications for update using(auth.uid()=user_id);
create policy "promotions readable" on public.promotions for select using(status='active' or auth.uid()=artist_id); create policy "own promotions" on public.promotions for insert with check(auth.uid()=artist_id);
create policy "reports own insert" on public.reports for insert with check(auth.uid()=reporter_id); create policy "reports own read" on public.reports for select using(auth.uid()=reporter_id);
create policy "blocks own" on public.blocks for all using(auth.uid()=blocker_id) with check(auth.uid()=blocker_id);
create policy "search history own" on public.search_history for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "rec events own insert" on public.recommendation_events for insert with check(auth.uid()=user_id); create policy "rec events own read" on public.recommendation_events for select using(auth.uid()=user_id);
create policy "visual embeddings public read" on public.visual_embeddings for select using(true);

-- Wallet writes, payment state changes, order creation after payment, and embedding writes intentionally have no authenticated-client write policies.
-- They must be performed by trusted server/service-role code after authorization or verified provider webhooks.


-- Angel / Demon mode support
do $$ begin
  create type artwork_mode as enum ('demon','angel','both');
exception
  when duplicate_object then null;
end $$;

alter table if exists artworks
  add column if not exists discovery_mode artwork_mode not null default 'both';

alter table if exists profiles
  add column if not exists angel_seconds bigint not null default 0,
  add column if not exists demon_seconds bigint not null default 0;

create or replace function profile_affinity_badge(p_angel_seconds bigint, p_demon_seconds bigint)
returns text
language sql
immutable
as $$
  select case
    when abs(coalesce(p_angel_seconds,0) - coalesce(p_demon_seconds,0)) < 60 then 'balanced'
    when coalesce(p_angel_seconds,0) > coalesce(p_demon_seconds,0) then 'angel'
    else 'demon'
  end
$$;
