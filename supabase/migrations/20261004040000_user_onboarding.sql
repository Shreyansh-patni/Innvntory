-- Migration: 20261004040000_user_onboarding.sql
-- Description: Adds first-time onboarding tracking to user_preferences

ALTER TABLE public.user_preferences
    ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS onboarding_step INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS onboarding_data JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.user_preferences.onboarding_completed IS 'Flag indicating if the user has finished the first-time setup wizard';
COMMENT ON COLUMN public.user_preferences.onboarding_step IS 'Current step in the onboarding sequence for resume capability';
COMMENT ON COLUMN public.user_preferences.onboarding_completed_at IS 'Timestamp when the user completed first-time onboarding';
COMMENT ON COLUMN public.user_preferences.onboarding_data IS 'JSON storage for draft setup inputs across wizard steps';
