-- ============================================
-- FIX RLS POLICY FOR QUOTATIONS TABLE
-- ============================================

-- 1. Enable RLS on quotations table
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Allow all operations" ON quotations;
DROP POLICY IF EXISTS "Enable read access for all users" ON quotations;
DROP POLICY IF EXISTS "Enable insert for all users" ON quotations;
DROP POLICY IF EXISTS "Enable update for all users" ON quotations;
DROP POLICY IF EXISTS "Enable delete for all users" ON quotations;
DROP POLICY IF EXISTS "Allow select" ON quotations;
DROP POLICY IF EXISTS "Allow insert" ON quotations;
DROP POLICY IF EXISTS "Allow update" ON quotations;
DROP POLICY IF EXISTS "Allow delete" ON quotations;

-- 3. Create new permissive policies
-- Policy for SELECT (read all records)
CREATE POLICY "Allow select"
ON quotations
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy for INSERT (create new records)
CREATE POLICY "Allow insert"
ON quotations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy for UPDATE (modify existing records)
CREATE POLICY "Allow update"
ON quotations
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Policy for DELETE (remove records)
CREATE POLICY "Allow delete"
ON quotations
FOR DELETE
TO anon, authenticated
USING (true);

-- ============================================
-- VERIFY POLICIES
-- ============================================

-- Check if RLS is enabled and policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'quotations';
