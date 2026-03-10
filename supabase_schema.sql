-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  role text check (role in ('founder', 'skill', 'investor', 'system')),
  avatar_url text,
  bio text,
  skills text[],
  kyc_status text default 'pending' check (kyc_status in ('pending', 'verified', 'rejected')),
  level integer default 1,
  xp integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ideas Table
create table public.ideas (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.users(id) not null,
  title text not null,
  description text,
  sector text,
  success_rate integer,
  funding_needed numeric,
  equity_offered numeric,
  raed_score integer,
  is_locked boolean default false,
  status text check (status in ('analyzing', 'listed', 'matched', 'funded')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Idea Timestamps (Idea Vault)
create table public.idea_timestamps (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) not null,
  hash text not null,
  verified_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NDAs (Digital Non-Disclosure Agreements)
create table public.ndas (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) not null,
  user_id uuid references public.users(id) not null,
  ip_address text,
  accepted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(idea_id, user_id)
);

-- Deal Rooms
create table public.deal_rooms (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) not null,
  status text default 'active' check (status in ('active', 'closed', 'successful')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Deal Room Members
create table public.deal_room_members (
  id uuid default uuid_generate_v4() primary key,
  deal_room_id uuid references public.deal_rooms(id) not null,
  user_id uuid references public.users(id) not null,
  role text check (role in ('owner', 'investor', 'lawyer', 'advisor')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(deal_room_id, user_id)
);

-- Deal Room Documents
create table public.deal_room_documents (
  id uuid default uuid_generate_v4() primary key,
  deal_room_id uuid references public.deal_rooms(id) not null,
  uploader_id uuid references public.users(id) not null,
  name text not null,
  file_url text not null,
  size integer,
  status text default 'pending' check (status in ('pending', 'verified', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Partnerships Table
create table public.partnerships (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) not null,
  skill_user_id uuid references public.users(id) not null,
  percentage numeric,
  status text check (status in ('pending', 'accepted', 'rejected', 'active')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Investments Table
create table public.investments (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) not null,
  investor_id uuid references public.users(id) not null,
  amount numeric not null,
  equity_percentage numeric,
  status text check (status in ('pending', 'completed', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages Table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users(id) not null,
  receiver_id uuid references public.users(id) not null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications Table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  type text not null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reviews Table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  reviewer_id uuid references public.users(id) not null,
  reviewed_id uuid references public.users(id) not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Contracts Table
create table public.contracts (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) not null,
  parties jsonb, -- Array of user IDs and roles
  terms text,
  signed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bookmarks Table
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  idea_id uuid references public.ideas(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, idea_id)
);

-- Referrals Table
create table public.referrals (
  id uuid default uuid_generate_v4() primary key,
  referrer_id uuid references public.users(id) not null,
  referred_email text not null,
  status text default 'pending' check (status in ('pending', 'joined', 'rewarded')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reactions Table (for Feed)
create table public.reactions (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) not null,
  user_id uuid references public.users(id) not null,
  type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(idea_id, user_id)
);

-- Comments Table (for Feed)
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references public.ideas(id) not null,
  user_id uuid references public.users(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.ideas enable row level security;
alter table public.idea_timestamps enable row level security;
alter table public.ndas enable row level security;
alter table public.deal_rooms enable row level security;
alter table public.deal_room_members enable row level security;
alter table public.deal_room_documents enable row level security;
alter table public.partnerships enable row level security;
alter table public.investments enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.contracts enable row level security;
alter table public.bookmarks enable row level security;
alter table public.referrals enable row level security;
alter table public.reactions enable row level security;
alter table public.comments enable row level security;

-- Create Policies (Basic examples, refine as needed)
create policy "Public profiles are viewable by everyone." on public.users for select using (true);
create policy "Users can insert their own profile." on public.users for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.users for update using (auth.uid() = id);

create policy "Ideas are viewable by everyone." on public.ideas for select using (true);
create policy "Owners can insert ideas." on public.ideas for insert with check (auth.uid() = owner_id);
create policy "Owners can update ideas." on public.ideas for update using (auth.uid() = owner_id);

create policy "Users can view their own bookmarks." on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users can insert their own bookmarks." on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users can delete their own bookmarks." on public.bookmarks for delete using (auth.uid() = user_id);

create policy "Users can view NDAs they are part of." on public.ndas for select using (auth.uid() = user_id);
create policy "Users can insert NDAs." on public.ndas for insert with check (auth.uid() = user_id);

create policy "Users can view their notifications." on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update their notifications." on public.notifications for update using (auth.uid() = user_id);

-- Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.ideas;
alter publication supabase_realtime add table public.deal_room_documents;
