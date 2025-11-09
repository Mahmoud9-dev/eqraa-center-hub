-- Update database for Eqraa Center v2
-- Adding new tables and updating existing ones

-- 1. Update students table with grade_level
ALTER TABLE public.students ADD COLUMN grade_level TEXT;
-- Add comment for grade_level
COMMENT ON COLUMN public.students.grade_level IS 'المرحلة الدراسية التفصيلية: "ابتدائي أول"، "ابتدائي ثاني"، "ابتدائي ثالث"، "إعدادي أول"، "إعدادي ثاني"، "ثانوي أول"، "ثانوي ثاني"';

-- 2. Update teachers table with bio and expanded department
ALTER TABLE public.teachers ADD COLUMN bio TEXT;
ALTER TABLE public.teachers ADD COLUMN user_id UUID REFERENCES public.users(id);
-- Update department check constraint to include 'sharia'
ALTER TABLE public.teachers DROP CONSTRAINT teachers_department_check;
ALTER TABLE public.teachers ADD CONSTRAINT teachers_department_check CHECK (department IN ('quran', 'tajweed', 'tarbawi', 'sharia'));

-- 3. Update quran_sessions table with new fields
ALTER TABLE public.quran_sessions ADD COLUMN audio_recording_url TEXT;
ALTER TABLE public.quran_sessions ADD COLUMN session_type TEXT CHECK (session_type IN ('ماضي بعيد', 'ماضي قريب', 'جديد')) DEFAULT 'جديد';

-- 4. Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'teacher')),
  date DATE NOT NULL,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('حاضر', 'غائب', 'متأخر', 'انصراف مبكر')) DEFAULT 'حاضر',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure unique attendance record per user per day
  UNIQUE(user_id, date)
);

-- 5. Create exams table
CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL CHECK (subject IN ('قرآن', 'تجويد', 'تربوي')),
  description TEXT,
  exam_date TIMESTAMPTZ NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 100,
  duration_minutes INTEGER DEFAULT 60,
  teacher_id UUID REFERENCES public.teachers(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create exam_results table
CREATE TABLE public.exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0),
  max_score INTEGER NOT NULL,
  notes TEXT,
  evaluated_by UUID REFERENCES public.teachers(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure unique result per student per exam
  UNIQUE(exam_id, student_id)
);

-- 7. Create exam_questions table
CREATE TABLE public.exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('نصي', 'اختياري', 'تلاوة')) DEFAULT 'نصي',
  max_score INTEGER DEFAULT 10,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Create educational_content table
CREATE TABLE public.educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('عقيدة', 'فقه', 'سيرة', 'تفسير', 'حديث', 'تربية', 'لغة عربية')),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('فيديو', 'صوت', 'PDF', 'مقال', 'صورة')),
  content_url TEXT NOT NULL,
  thumbnail_url TEXT,
  teacher_id UUID REFERENCES public.teachers(id),
  duration_minutes INTEGER,
  file_size BIGINT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Create assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES public.educational_content(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  max_score INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Create assignment_submissions table
CREATE TABLE public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  submission_text TEXT,
  file_url TEXT,
  score INTEGER,
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  evaluated_at TIMESTAMPTZ,
  evaluated_by UUID REFERENCES public.teachers(id),
  
  -- Ensure unique submission per student per assignment
  UNIQUE(assignment_id, student_id)
);

-- 11. Create schedules table
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  recurring_type TEXT CHECK (recurring_type IN ('يومي', 'أسبوعي', 'شهري', 'مرة واحدة')) DEFAULT 'مرة واحدة',
  recurring_days INTEGER[],
  location TEXT,
  teacher_id UUID REFERENCES public.teachers(id),
  schedule_type TEXT CHECK (schedule_type IN ('حلقة قرآن', 'درس تجويد', 'محاضرة تربوية', 'اجتماع', 'امتحان')) DEFAULT 'حلقة قرآن',
  is_active BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  notification_minutes_before INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Create schedule_participants table
CREATE TABLE public.schedule_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES public.schedules(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL,
  participant_type TEXT CHECK (participant_type IN ('student', 'teacher')) NOT NULL,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure unique participant per schedule
  UNIQUE(schedule_id, participant_id, participant_type)
);

-- 13. Create library_items table
CREATE TABLE public.library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  item_type TEXT NOT NULL CHECK (item_type IN ('كتاب PDF', 'مقطع صوتي', 'فيديو', 'مقال', 'رابط خارجي')),
  file_url TEXT,
  external_url TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('عقيدة', 'فقه', 'سيرة', 'تفسير', 'حديث', 'لغة عربية', 'أخلاق', 'تربية')),
  tags TEXT[],
  language TEXT DEFAULT 'العربية',
  file_size BIGINT,
  duration_minutes INTEGER,
  pages_count INTEGER,
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  added_by UUID REFERENCES public.teachers(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT CHECK (announcement_type IN ('عام', 'للمشايخ', 'للطلاب', 'للإدارة')) DEFAULT 'عام',
  priority TEXT CHECK (priority IN ('عالي', 'متوسط', 'منخفض')) DEFAULT 'متوسط',
  is_active BOOLEAN DEFAULT true,
  show_popup BOOLEAN DEFAULT false,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  target_audience TEXT[],
  attachments TEXT[],
  created_by UUID REFERENCES public.teachers(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 15. Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('طالب', 'مدرس', 'مشرف', 'إدارة')) DEFAULT 'طالب',
  permissions TEXT[],
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  email_verified BOOLEAN DEFAULT false,
  phone TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 16. Create activity_log table
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add foreign key constraints for existing tables
ALTER TABLE public.students ADD COLUMN user_id UUID REFERENCES public.users(id);

-- Create indexes for better performance
CREATE INDEX idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX idx_attendance_date ON public.attendance(date);
CREATE INDEX idx_attendance_user_type ON public.attendance(user_type);
CREATE INDEX idx_exams_subject ON public.exams(subject);
CREATE INDEX idx_exams_date ON public.exams(exam_date);
CREATE INDEX idx_exam_results_student ON public.exam_results(student_id);
CREATE INDEX idx_educational_content_category ON public.educational_content(category);
CREATE INDEX idx_schedules_start_time ON public.schedules(start_time);
CREATE INDEX idx_schedules_type ON public.schedules(schedule_type);
CREATE INDEX idx_announcements_type ON public.announcements(announcement_type);
CREATE INDEX idx_announcements_active ON public.announcements(is_active);
CREATE INDEX idx_activity_log_user ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_created ON public.activity_log(created_at);
CREATE INDEX idx_students_grade_level ON public.students(grade_level);

-- Enable Row Level Security for new tables
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY "Allow all operations on attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on exams" ON public.exams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on exam_results" ON public.exam_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on exam_questions" ON public.exam_questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on educational_content" ON public.educational_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on assignments" ON public.assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on assignment_submissions" ON public.assignment_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on schedules" ON public.schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on schedule_participants" ON public.schedule_participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on library_items" ON public.library_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on announcements" ON public.announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on activity_log" ON public.activity_log FOR ALL USING (true) WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at on new tables
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON public.attendance 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON public.exams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_results_updated_at BEFORE UPDATE ON public.exam_results 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_educational_content_updated_at BEFORE UPDATE ON public.educational_content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON public.schedules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_library_items_updated_at BEFORE UPDATE ON public.library_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for statistics
CREATE VIEW public.student_statistics AS
SELECT 
    s.id,
    s.name,
    s.grade_level,
    s.department,
    s.parts_memorized,
    COUNT(DISTINCT qs.id) as total_sessions,
    AVG(qs.performance_rating) as avg_rating,
    COUNT(DISTINCT CASE WHEN a.status = 'حاضر' THEN a.id END) as attendance_days,
    COUNT(DISTINCT CASE WHEN er.id IS NOT NULL THEN er.id END) as exams_taken,
    AVG(er.score) as avg_exam_score
FROM public.students s
LEFT JOIN public.quran_sessions qs ON s.id = qs.student_id
LEFT JOIN public.attendance a ON s.id = a.user_id AND a.user_type = 'student'
LEFT JOIN public.exam_results er ON s.id = er.student_id
GROUP BY s.id, s.name, s.grade_level, s.department, s.parts_memorized;

CREATE VIEW public.teacher_statistics AS
SELECT 
    t.id,
    t.name,
    t.department,
    COUNT(DISTINCT s.id) as total_students,
    COUNT(DISTINCT qs.id) as total_sessions,
    AVG(qs.performance_rating) as avg_session_rating,
    COUNT(DISTINCT e.id) as total_exams,
    COUNT(DISTINCT ec.id) as total_content
FROM public.teachers t
LEFT JOIN public.students s ON t.id = s.teacher_id
LEFT JOIN public.quran_sessions qs ON t.id = qs.teacher_id
LEFT JOIN public.exams e ON t.id = e.teacher_id
LEFT JOIN public.educational_content ec ON t.id = ec.teacher_id
GROUP BY t.id, t.name, t.department;