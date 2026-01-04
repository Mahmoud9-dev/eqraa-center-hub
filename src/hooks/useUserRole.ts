import { useEffect, useState } from "react";
import { getSupabase } from "@/integrations/supabase/client";

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'viewer';

export function useUserRole() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      const { data: { session } } = await getSupabase().auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await getSupabase()
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
      } else {
        setRoles(data?.map(r => r.role as UserRole) || []);
      }

      setLoading(false);
    };

    fetchUserRoles();

    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(() => {
      fetchUserRoles();
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = hasRole('admin');
  const isTeacher = hasRole('teacher');

  return { roles, loading, hasRole, isAdmin, isTeacher };
}
