ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS career_goal text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_role text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_salary_min integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_salary_max integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_country text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;