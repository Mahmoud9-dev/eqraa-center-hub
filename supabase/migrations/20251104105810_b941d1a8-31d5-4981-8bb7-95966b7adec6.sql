-- Create educational_sessions table for recording educational program sessions
CREATE TABLE public.educational_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  description TEXT NOT NULL,
  session_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 10),
  attendance BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.educational_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for all operations
CREATE POLICY "Allow all operations on educational_sessions"
ON public.educational_sessions
FOR ALL
USING (true)
WITH CHECK (true);