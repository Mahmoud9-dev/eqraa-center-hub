-- Step 1: Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student', 'parent', 'viewer');

-- Step 2: Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 4: Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Step 5: RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Step 6: Drop all existing permissive policies
DROP POLICY IF EXISTS "Allow all operations on students" ON public.students;
DROP POLICY IF EXISTS "Allow all operations on teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow all operations on quran_sessions" ON public.quran_sessions;
DROP POLICY IF EXISTS "Allow all operations on educational_sessions" ON public.educational_sessions;
DROP POLICY IF EXISTS "Allow all operations on tajweed_lessons" ON public.tajweed_lessons;
DROP POLICY IF EXISTS "Allow all operations on meetings" ON public.meetings;
DROP POLICY IF EXISTS "Allow all operations on suggestions" ON public.suggestions;

-- Step 7: Create secure RLS policies for STUDENTS table
CREATE POLICY "Admins can view all students"
ON public.students
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view their assigned students"
ON public.students
FOR SELECT
TO authenticated
USING (teacher_id = auth.uid());

CREATE POLICY "Admins can insert students"
ON public.students
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update students"
ON public.students
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete students"
ON public.students
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 8: Create secure RLS policies for TEACHERS table
CREATE POLICY "Authenticated users can view teachers"
ON public.teachers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert teachers"
ON public.teachers
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update teachers"
ON public.teachers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can update their own info"
ON public.teachers
FOR UPDATE
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admins can delete teachers"
ON public.teachers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 9: Create secure RLS policies for QURAN_SESSIONS table
CREATE POLICY "Admins can view all quran sessions"
ON public.quran_sessions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view their sessions"
ON public.quran_sessions
FOR SELECT
TO authenticated
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can insert their sessions"
ON public.quran_sessions
FOR INSERT
TO authenticated
WITH CHECK (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can update their sessions"
ON public.quran_sessions
FOR UPDATE
TO authenticated
USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete quran sessions"
ON public.quran_sessions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 10: Create secure RLS policies for EDUCATIONAL_SESSIONS table
CREATE POLICY "Admins can view all educational sessions"
ON public.educational_sessions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view their educational sessions"
ON public.educational_sessions
FOR SELECT
TO authenticated
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can insert their educational sessions"
ON public.educational_sessions
FOR INSERT
TO authenticated
WITH CHECK (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can update their educational sessions"
ON public.educational_sessions
FOR UPDATE
TO authenticated
USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete educational sessions"
ON public.educational_sessions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 11: Create secure RLS policies for TAJWEED_LESSONS table
CREATE POLICY "Authenticated users can view tajweed lessons"
ON public.tajweed_lessons
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Teachers can insert tajweed lessons"
ON public.tajweed_lessons
FOR INSERT
TO authenticated
WITH CHECK (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can update their tajweed lessons"
ON public.tajweed_lessons
FOR UPDATE
TO authenticated
USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tajweed lessons"
ON public.tajweed_lessons
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 12: Create secure RLS policies for MEETINGS table
CREATE POLICY "Authenticated users can view meetings"
ON public.meetings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert meetings"
ON public.meetings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update meetings"
ON public.meetings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete meetings"
ON public.meetings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 13: Create secure RLS policies for SUGGESTIONS table
CREATE POLICY "Authenticated users can view suggestions"
ON public.suggestions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert suggestions"
ON public.suggestions
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can update suggestions"
ON public.suggestions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete suggestions"
ON public.suggestions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));