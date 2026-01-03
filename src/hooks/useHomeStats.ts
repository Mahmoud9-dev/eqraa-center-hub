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
  const today = new Date().toISOString().split('T')[0];

  // Execute all queries in parallel for better performance
  const [studentsResult, teachersResult, attendanceResult, meetingsResult] = await Promise.all([
    supabase
      .from('students')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('teachers')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('students')
      .select('attendance')
      .eq('is_active', true)
      .not('attendance', 'is', null),
    supabase
      .from('meetings')
      .select('id', { count: 'exact', head: true })
      .gte('meeting_date', today)
      .eq('status', 'scheduled'),
  ]);

  const { count: studentsCount, error: studentsError } = studentsResult;
  const { count: teachersCount, error: teachersError } = teachersResult;
  const { data: attendanceData, error: attendanceError } = attendanceResult;
  const { count: meetingsCount, error: meetingsError } = meetingsResult;

  // Handle errors by throwing to trigger React Query error state
  if (studentsError) {
    console.error('Error fetching students count:', studentsError);
    throw new Error('Failed to fetch student statistics');
  }

  if (teachersError) {
    console.error('Error fetching teachers count:', teachersError);
    throw new Error('Failed to fetch teacher statistics');
  }

  if (attendanceError) {
    console.error('Error fetching attendance data:', attendanceError);
    throw new Error('Failed to fetch attendance data');
  }

  if (meetingsError) {
    console.error('Error fetching meetings count:', meetingsError);
    throw new Error('Failed to fetch meeting statistics');
  }

  // Calculate attendance percentage from students with attendance data
  let attendancePercentage = 0;
  if (attendanceData && attendanceData.length > 0) {
    const totalAttendance = attendanceData.reduce(
      (sum, student) => sum + (student.attendance || 0),
      0
    );
    attendancePercentage = Math.round(totalAttendance / attendanceData.length);
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
