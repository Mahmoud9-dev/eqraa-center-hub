'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface HomeStats {
  totalStudents: number;
  attendancePercentage: number;
  activeCircles: number;
  upcomingExams: number;
}

async function fetchHomeStats(): Promise<HomeStats> {
  // Fetch total students count
  const { count: studentsCount, error: studentsError } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (studentsError) {
    console.error('Error fetching students count:', studentsError);
  }

  // Fetch total teachers (as a proxy for active circles for now)
  const { count: teachersCount, error: teachersError } = await supabase
    .from('teachers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (teachersError) {
    console.error('Error fetching teachers count:', teachersError);
  }

  // Calculate attendance percentage from students with attendance data
  const { data: attendanceData, error: attendanceError } = await supabase
    .from('students')
    .select('attendance')
    .eq('is_active', true)
    .not('attendance', 'is', null);

  if (attendanceError) {
    console.error('Error fetching attendance data:', attendanceError);
  }

  let attendancePercentage = 0;
  if (attendanceData && attendanceData.length > 0) {
    const totalAttendance = attendanceData.reduce(
      (sum, student) => sum + (student.attendance || 0),
      0
    );
    attendancePercentage = Math.round(totalAttendance / attendanceData.length);
  }

  // Fetch upcoming meetings as a proxy for upcoming exams
  const today = new Date().toISOString().split('T')[0];
  const { count: meetingsCount, error: meetingsError } = await supabase
    .from('meetings')
    .select('*', { count: 'exact', head: true })
    .gte('meeting_date', today)
    .eq('status', 'scheduled');

  if (meetingsError) {
    console.error('Error fetching meetings count:', meetingsError);
  }

  return {
    totalStudents: studentsCount || 0,
    attendancePercentage: attendancePercentage || 0,
    activeCircles: teachersCount || 0, // Using teachers count as proxy for circles
    upcomingExams: meetingsCount || 0, // Using meetings count as proxy for exams
  };
}

export function useHomeStats() {
  return useQuery({
    queryKey: ['homeStats'],
    queryFn: fetchHomeStats,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
}
