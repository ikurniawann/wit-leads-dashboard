-- Insert status values jika belum ada
INSERT INTO quotation_statuses (status_id, status_name, description, display_order, color_code, is_active)
VALUES 
  ('NEW', 'New', 'New quotation', 1, '#6B7280', true),
  ('APPROVED', 'Approved', 'Quotation approved', 2, '#10B981', true),
  ('IN_PROGRESS', 'In Progress', 'Work in progress', 3, '#F59E0B', true),
  ('DONE', 'Done', 'Project completed', 4, '#3B82F6', true),
  ('CANCELLED', 'Cancelled', 'Quotation cancelled', 5, '#EF4444', true)
ON CONFLICT (status_id) DO NOTHING;

-- Verifikasi
SELECT * FROM quotation_statuses ORDER BY display_order;
