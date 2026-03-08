-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  role text check (role in ('founder', 'skill', 'investor')),
  avatar_url text,
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
  status text check (status in ('analyzing', 'listed', 'matched', 'funded')),
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

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.ideas enable row level security;
alter table public.partnerships enable row level security;
alter table public.investments enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.contracts enable row level security;
alter table public.bookmarks enable row level security;

-- Create Policies (Basic examples, refine as needed)
create policy "Public profiles are viewable by everyone." on public.users for select using (true);
create policy "Users can insert their own profile." on public.users for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.users for update using (auth.uid() = id);

create policy "Ideas are viewable by everyone." on public.ideas for select using (true);
create policy "Owners can insert ideas." on public.ideas for insert with check (auth.uid() = owner_id);

create policy "Users can view their own bookmarks." on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users can insert their own bookmarks." on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users can delete their own bookmarks." on public.bookmarks for delete using (auth.uid() = user_id);

-- Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
