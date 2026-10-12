BEGIN;

ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS would_recommend BOOLEAN;

ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS recommendation_invalid BOOLEAN;

COMMIT;
