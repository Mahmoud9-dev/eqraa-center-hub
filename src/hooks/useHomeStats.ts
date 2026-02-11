'use client';

import { useQuery } from '@tanstack/react-query';
import * as studentsService from '@/lib/db/services/students';
import * as teachersService from '@/lib/db/services/teachers';
import * as meetingsService from '@/lib/db/services/meetings';

interface HomeStats {
  totalStudents: number;
  attendancePercentage: number;
  activeCircles: number;
  upcomingExams: number;
}

async function fetchHomeStats(): Promise<HomeStats> {
  // Execute all queries in parallel for better performance
  const [studentsCount, teachersCount, attendanceData, meetingsCount] = await Promise.all([
    studentsService.getActiveCount(),
    teachersService.getActiveCount(),
    studentsService.getAttendanceData(),
    meetingsService.getUpcomingCount(),
  ]);

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
