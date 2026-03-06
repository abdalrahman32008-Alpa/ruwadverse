-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create ideas table with vector for semantic search
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  customers TEXT NOT NULL,
  market_size TEXT NOT NULL,
  advantage TEXT NOT NULL,
  demand_proof TEXT NOT NULL,
  team TEXT NOT NULL,
  risks TEXT NOT NULL,
  embedding vector(768), -- For semantic search (e.g., Gemini embeddings)
  sentiment_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT CHECK (user_type IN ('idea', 'skill', 'investor')),
  full_name TEXT,
  skills TEXT[],
  experience_years INTEGER DEFAULT 0,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create matches table for collaborative filtering
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  match_score FLOAT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversations table for context memory
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb,
  emotion_state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create market_cache table for Google Trends
CREATE TABLE IF NOT EXISTS market_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT UNIQUE NOT NULL,
  trend_data JSONB NOT NULL,
  last_fetched TIMESTAMPTZ DEFAULT NOW()
);

-- Function to search similar ideas (Semantic Search)
CREATE OR REPLACE FUNCTION match_ideas (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ideas.id,
    ideas.title,
    1 - (ideas.embedding <=> query_embedding) AS similarity
  FROM ideas
  WHERE 1 - (ideas.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
