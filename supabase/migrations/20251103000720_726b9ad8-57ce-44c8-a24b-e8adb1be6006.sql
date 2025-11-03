-- Create tables for Eqraa Center Management System

-- Teachers table
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  department TEXT NOT NULL CHECK (department IN ('quran', 'tajweed', 'tarbawi')),
  is_active BOOLEAN DEFAULT true,
  email TEXT,
  phone TEXT,
  experience INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  grade TEXT NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id),
  department TEXT NOT NULL CHECK (department IN ('quran', 'tajweed', 'tarbawi')),
  parts_memorized INTEGER DEFAULT 0,
  current_progress TEXT,
  previous_progress TEXT,
  is_active BOOLEAN DEFAULT true,
  parent_name TEXT,
  parent_phone TEXT,
  attendance INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Suggestions table
CREATE TABLE public.suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('تم', 'لم يتم')) DEFAULT 'لم يتم',
  suggested_by TEXT,
  priority TEXT CHECK (priority IN ('عالي', 'متوسط', 'منخفض')) DEFAULT 'متوسط',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Meetings table
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  meeting_date TIMESTAMPTZ NOT NULL,
  attendees TEXT[],
  agenda TEXT[],
  notes TEXT,
  status TEXT CHECK (status IN ('مجدولة', 'مكتملة', 'ملغاة')) DEFAULT 'مجدولة',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quran sessions table
CREATE TABLE public.quran_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id),
  session_date TIMESTAMPTZ DEFAULT now(),
  surah_name TEXT NOT NULL,
  verses_from INTEGER NOT NULL,
  verses_to INTEGER NOT NULL,
  performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 10),
  notes TEXT,
  attendance BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tajweed lessons table
CREATE TABLE public.tajweed_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.teachers(id),
  lesson_date TIMESTAMPTZ DEFAULT now(),
  topic TEXT NOT NULL,
  description TEXT NOT NULL,
  attendees TEXT[],
  resources TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tajweed_lessons ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can make these more restrictive later)
CREATE POLICY "Allow all operations on teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on suggestions" ON public.suggestions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on meetings" ON public.meetings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on quran_sessions" ON public.quran_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tajweed_lessons" ON public.tajweed_lessons FOR ALL USING (true) WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX idx_students_teacher_id ON public.students(teacher_id);
CREATE INDEX idx_students_department ON public.students(department);
CREATE INDEX idx_teachers_department ON public.teachers(department);
CREATE INDEX idx_quran_sessions_student_id ON public.quran_sessions(student_id);
CREATE INDEX idx_quran_sessions_teacher_id ON public.quran_sessions(teacher_id);
CREATE INDEX idx_tajweed_lessons_teacher_id ON public.tajweed_lessons(teacher_id);