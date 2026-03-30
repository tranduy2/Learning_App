-- Ensure RLS is enabled for exercises
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Keep public read access if it already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'exercises'
      AND policyname = 'Anyone can view exercises'
  ) THEN
    CREATE POLICY "Anyone can view exercises" ON exercises
      FOR SELECT USING (true);
  END IF;
END $$;

-- Allow authenticated users to manage exercises.
-- NOTE: tighten this later with an admin check when admin roles are available.
DROP POLICY IF EXISTS "Authenticated users can insert exercises" ON exercises;
DROP POLICY IF EXISTS "Authenticated users can update exercises" ON exercises;
DROP POLICY IF EXISTS "Authenticated users can delete exercises" ON exercises;

CREATE POLICY "Authenticated users can insert exercises" ON exercises
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update exercises" ON exercises
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete exercises" ON exercises
  FOR DELETE TO authenticated
  USING (true);
