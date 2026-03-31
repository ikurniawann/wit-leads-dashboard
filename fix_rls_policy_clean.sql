ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select" ON quotations;
DROP POLICY IF EXISTS "Allow insert" ON quotations;
DROP POLICY IF EXISTS "Allow update" ON quotations;
DROP POLICY IF EXISTS "Allow delete" ON quotations;

CREATE POLICY "Allow select" ON quotations FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow insert" ON quotations FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow update" ON quotations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete" ON quotations FOR DELETE TO anon, authenticated USING (true);