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
-- 6. Composite Index for Optimized Queries
-- ============================================

-- Add composite index for common query pattern (student_id + type)
CREATE INDEX IF NOT EXISTS idx_student_notes_student_type
  ON student_notes(student_id, type);

-- ============================================
-- 7. Seed Data (Development/Testing Only)
-- ============================================
-- NOTE: In production, remove this section or move to a separate seed script.
-- Seed data uses database-generated UUIDs instead of hard-coded values.

DO $$
DECLARE
  teacher1_id UUID;
  teacher2_id UUID;
  teacher3_id UUID;
  student1_id UUID;
  student2_id UUID;
  student3_id UUID;
BEGIN
  -- Insert sample teachers and capture their IDs
  INSERT INTO teachers (name, specialization, department, is_active, email)
  VALUES ('الشيخ خالد أحمد', 'حفظ القرآن', 'quran', true, 'khalid@eqraa.com')
  ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO teacher1_id;

  INSERT INTO teachers (name, specialization, department, is_active, email)
  VALUES ('الشيخ أحمد محمد', 'التجويد', 'tajweed', true, 'ahmed@eqraa.com')
  ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO teacher2_id;

  INSERT INTO teachers (name, specialization, department, is_active, email)
  VALUES ('الشيخ محمد حسن', 'التربية الإسلامية', 'tarbawi', true, 'mohammed@eqraa.com')
  ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO teacher3_id;

  -- Insert sample students and capture their IDs
  INSERT INTO students (name, age, grade, teacher_id, department, parts_memorized, current_progress, previous_progress, is_active, parent_name, parent_phone, attendance, images)
  VALUES (
    'أحمد محمد علي',
    12,
    'السادس ابتدائي',
    teacher1_id,
    'quran',
    5,
    'سورة آل عمران - الآية 50',
    'سورة البقرة - الآية 200',
    true,
    'محمد علي',
    '01234567890',
    85,
    '{"new": "سورة النساء - الآية 1-30", "recent1": "سورة آل عمران - الآية 1-50", "recent2": "سورة البقرة - الآية 200-250", "recent3": "سورة البقرة - الآية 150-200", "distant1": "سورة البقرة - الآية 100-150", "distant2": "سورة البقرة - الآية 50-100", "distant3": "سورة الفاتحة"}'::jsonb
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO student1_id;

  INSERT INTO students (name, age, grade, teacher_id, department, parts_memorized, current_progress, previous_progress, is_active, parent_name, parent_phone, attendance, images)
  VALUES (
    'عمر خالد حسن',
    14,
    'الثالث إعدادي',
    teacher2_id,
    'tajweed',
    8,
    'سورة النساء - الآية 100',
    'سورة آل عمران - الآية 50',
    true,
    'خالد حسن',
    '01234567891',
    92,
    '{"new": "سورة المائدة - الآية 1-20", "recent1": "سورة النساء - الآية 50-100", "recent2": "سورة آل عمران - الآية 50-100", "recent3": "سورة آل عمران - الآية 1-50", "distant1": "سورة البقرة - الآية 200-285", "distant2": "سورة البقرة - الآية 150-200", "distant3": "سورة البقرة - الآية 100-150"}'::jsonb
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO student2_id;

  INSERT INTO students (name, age, grade, teacher_id, department, parts_memorized, current_progress, previous_progress, is_active, parent_name, parent_phone, attendance, images)
  VALUES (
    'محمد سعيد أحمد',
    11,
    'الخامس ابتدائي',
    teacher3_id,
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
  ON CONFLICT DO NOTHING
  RETURNING id INTO student3_id;

  -- Insert sample student notes (only if students were inserted)
  IF student1_id IS NOT NULL THEN
    INSERT INTO student_notes (student_id, type, content, note_date, teacher_name)
    VALUES
      (student1_id, 'إيجابي', 'مشاركة ممتازة في الحلقة', CURRENT_DATE - INTERVAL '4 days', 'الشيخ خالد'),
      (student1_id, 'سلبي', 'تأخير في الحضور', CURRENT_DATE - INTERVAL '7 days', 'الشيخ خالد');
  END IF;

  IF student2_id IS NOT NULL THEN
    INSERT INTO student_notes (student_id, type, content, note_date, teacher_name)
    VALUES (student2_id, 'إيجابي', 'حفظ ممتاز للأحكام', CURRENT_DATE - INTERVAL '3 days', 'الشيخ أحمد');
  END IF;

  -- Insert sample attendance records (only if students/teachers were inserted)
  IF student1_id IS NOT NULL AND teacher1_id IS NOT NULL THEN
    INSERT INTO attendance_records (student_id, teacher_id, record_date, status, notes)
    VALUES (student1_id, teacher1_id, CURRENT_DATE, 'حاضر', 'حضور ممتاز');
  END IF;

  IF student2_id IS NOT NULL AND teacher2_id IS NOT NULL THEN
    INSERT INTO attendance_records (student_id, teacher_id, record_date, status, notes)
    VALUES (student2_id, teacher2_id, CURRENT_DATE, 'غائب', 'غياب بعذر');
  END IF;

  IF student3_id IS NOT NULL AND teacher3_id IS NOT NULL THEN
    INSERT INTO attendance_records (student_id, teacher_id, record_date, status, notes)
    VALUES (student3_id, teacher3_id, CURRENT_DATE, 'حاضر', NULL);
  END IF;
END $$;
