-- Migration: Add student_notes and attendance_records tables
-- Description: Create tables to replace localStorage data persistence

-- ============================================
-- 1. Create student_notes table
-- ============================================
CREATE TABLE IF NOT EXISTS student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('إيجابي', 'سلبي')),
  content TEXT NOT NULL,
  note_date DATE NOT NULL DEFAULT CURRENT_DATE,
  teacher_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups by student
CREATE INDEX IF NOT EXISTS idx_student_notes_student_id ON student_notes(student_id);
CREATE INDEX IF NOT EXISTS idx_student_notes_date ON student_notes(note_date);

-- ============================================
-- 2. Create attendance_records table
-- ============================================
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('حاضر', 'غائب', 'مأذون')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_teacher_id ON attendance_records(teacher_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(record_date);

-- ============================================
-- 3. Enable Row Level Security
-- ============================================
ALTER TABLE student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. RLS Policies for student_notes
-- ============================================

-- Admins can do everything
CREATE POLICY "Admins can manage all student notes"
  ON student_notes
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Teachers can view notes for their students
CREATE POLICY "Teachers can view student notes for their students"
  ON student_notes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = student_notes.student_id
      AND s.teacher_id IN (
        SELECT t.id FROM teachers t WHERE t.id::text = auth.uid()::text
      )
    )
    OR has_role(auth.uid(), 'teacher')
  );

-- Teachers can create notes
CREATE POLICY "Teachers can create student notes"
  ON student_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'teacher') OR is_admin(auth.uid()));

-- Teachers can update their own notes
CREATE POLICY "Teachers can update student notes"
  ON student_notes
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'teacher') OR is_admin(auth.uid()))
  WITH CHECK (has_role(auth.uid(), 'teacher') OR is_admin(auth.uid()));

-- ============================================
-- 5. RLS Policies for attendance_records
-- ============================================

-- Admins can do everything
CREATE POLICY "Admins can manage all attendance records"
  ON attendance_records
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Teachers can view attendance for their students
CREATE POLICY "Teachers can view attendance for their students"
  ON attendance_records
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = attendance_records.student_id
      AND s.teacher_id IN (
        SELECT t.id FROM teachers t WHERE t.id::text = auth.uid()::text
      )
    )
    OR has_role(auth.uid(), 'teacher')
  );

-- Teachers can create attendance records
CREATE POLICY "Teachers can create attendance records"
  ON attendance_records
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'teacher') OR is_admin(auth.uid()));

-- Teachers can update attendance records
CREATE POLICY "Teachers can update attendance records"
  ON attendance_records
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'teacher') OR is_admin(auth.uid()))
  WITH CHECK (has_role(auth.uid(), 'teacher') OR is_admin(auth.uid()));

-- ============================================
-- 6. Seed Data
-- ============================================

-- Insert sample teachers if not exists (needed for foreign keys)
INSERT INTO teachers (id, name, specialization, department, is_active, email)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'الشيخ خالد أحمد', 'حفظ القرآن', 'quran', true, 'khalid@eqraa.com'),
  ('22222222-2222-2222-2222-222222222222', 'الشيخ أحمد محمد', 'التجويد', 'tajweed', true, 'ahmed@eqraa.com'),
  ('33333333-3333-3333-3333-333333333333', 'الشيخ محمد حسن', 'التربية الإسلامية', 'tarbawi', true, 'mohammed@eqraa.com')
ON CONFLICT (id) DO NOTHING;

-- Insert sample students
INSERT INTO students (id, name, age, grade, teacher_id, department, parts_memorized, current_progress, previous_progress, is_active, parent_name, parent_phone, attendance, images)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'أحمد محمد علي',
    12,
    'السادس ابتدائي',
    '11111111-1111-1111-1111-111111111111',
    'quran',
    5,
    'سورة آل عمران - الآية 50',
    'سورة البقرة - الآية 200',
    true,
    'محمد علي',
    '01234567890',
    85,
    '{"new": "سورة النساء - الآية 1-30", "recent1": "سورة آل عمران - الآية 1-50", "recent2": "سورة البقرة - الآية 200-250", "recent3": "سورة البقرة - الآية 150-200", "distant1": "سورة البقرة - الآية 100-150", "distant2": "سورة البقرة - الآية 50-100", "distant3": "سورة الفاتحة"}'::jsonb
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'عمر خالد حسن',
    14,
    'الثالث إعدادي',
    '22222222-2222-2222-2222-222222222222',
    'tajweed',
    8,
    'سورة النساء - الآية 100',
    'سورة آل عمران - الآية 50',
    true,
    'خالد حسن',
    '01234567891',
    92,
    '{"new": "سورة المائدة - الآية 1-20", "recent1": "سورة النساء - الآية 50-100", "recent2": "سورة آل عمران - الآية 50-100", "recent3": "سورة آل عمران - الآية 1-50", "distant1": "سورة البقرة - الآية 200-285", "distant2": "سورة البقرة - الآية 150-200", "distant3": "سورة البقرة - الآية 100-150"}'::jsonb
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'محمد سعيد أحمد',
    11,
    'الخامس ابتدائي',
    '33333333-3333-3333-3333-333333333333',
    'tarbawi',
    3,
    'سورة البقرة - الآية 150',
    'سورة البقرة - الآية 100',
    true,
    'سعيد أحمد',
    '01234567892',
    78,
    '{"new": "سورة الأنعام - الآية 1-30", "recent1": "سورة البقرة - الآية 150-200", "recent2": "سورة البقرة - الآية 100-150", "recent3": "سورة البقرة - الآية 50-100", "distant1": "سورة البقرة - الآية 1-50", "distant2": "سورة الفاتحة", "distant3": ""}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample student notes
INSERT INTO student_notes (student_id, type, content, note_date, teacher_name)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'إيجابي', 'مشاركة ممتازة في الحلقة', '2025-11-01', 'الشيخ خالد'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'سلبي', 'تأخير في الحضور', '2025-10-28', 'الشيخ خالد'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'إيجابي', 'حفظ ممتاز للأحكام', '2025-11-02', 'الشيخ أحمد');

-- Insert sample attendance records
INSERT INTO attendance_records (student_id, teacher_id, record_date, status, notes)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '2025-11-05', 'حاضر', 'حضور ممتاز'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '2025-11-05', 'غائب', 'غياب بعذر'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '2025-11-05', 'حاضر', NULL);
