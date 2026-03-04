-- Add unique constraint for upsert on interview_progress
ALTER TABLE public.interview_progress ADD CONSTRAINT interview_progress_user_question_unique UNIQUE (user_id, question_id);