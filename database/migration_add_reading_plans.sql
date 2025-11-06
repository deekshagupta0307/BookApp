-- Migration: Add reading_plans table
-- Run this in your Supabase SQL Editor if you already have the base schema

-- Create reading_plans table (for everyday and weekly reading plans)
CREATE TABLE IF NOT EXISTS public.reading_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT CHECK (plan_type IN ('everyday', 'weekly')) NOT NULL,
  pages_per_day INTEGER, -- For everyday plans
  weekly_schedule JSONB, -- For weekly plans: {"Mon": 5, "Tue": 10, ...}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id, plan_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reading_plans_user_id ON public.reading_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_plans_book_id ON public.reading_plans(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_plans_type ON public.reading_plans(plan_type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.reading_plans ENABLE ROW LEVEL SECURITY;

-- Reading plans policies
DROP POLICY IF EXISTS "Users can view own reading plans" ON public.reading_plans;
CREATE POLICY "Users can view own reading plans" ON public.reading_plans
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own reading plans" ON public.reading_plans;
CREATE POLICY "Users can insert own reading plans" ON public.reading_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reading plans" ON public.reading_plans;
CREATE POLICY "Users can update own reading plans" ON public.reading_plans
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reading plans" ON public.reading_plans;
CREATE POLICY "Users can delete own reading plans" ON public.reading_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_reading_plans_updated_at ON public.reading_plans;
CREATE TRIGGER update_reading_plans_updated_at BEFORE UPDATE ON public.reading_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

