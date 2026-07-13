
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS premium_until timestamptz;

CREATE OR REPLACE FUNCTION public.grant_premium_30_days(target_user_id uuid)
RETURNS timestamptz
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_until timestamptz;
BEGIN
  new_until := now() + interval '30 days';
  UPDATE public.profiles
    SET premium_until = new_until,
        updated_at = now()
    WHERE id = target_user_id;
  RETURN new_until;
END;
$$;

GRANT EXECUTE ON FUNCTION public.grant_premium_30_days(uuid) TO authenticated;
