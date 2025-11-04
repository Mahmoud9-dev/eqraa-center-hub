export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      educational_sessions: {
        Row: {
          attendance: boolean | null
          created_at: string | null
          description: string
          id: string
          notes: string | null
          performance_rating: number | null
          session_date: string | null
          student_id: string | null
          teacher_id: string | null
          topic: string
        }
        Insert: {
          attendance?: boolean | null
          created_at?: string | null
          description: string
          id?: string
          notes?: string | null
          performance_rating?: number | null
          session_date?: string | null
          student_id?: string | null
          teacher_id?: string | null
          topic: string
        }
        Update: {
          attendance?: boolean | null
          created_at?: string | null
          description?: string
          id?: string
          notes?: string | null
          performance_rating?: number | null
          session_date?: string | null
          student_id?: string | null
          teacher_id?: string | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "educational_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educational_sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          agenda: string[] | null
          attendees: string[] | null
          created_at: string | null
          description: string
          id: string
          meeting_date: string
          notes: string | null
          status: string | null
          title: string
        }
        Insert: {
          agenda?: string[] | null
          attendees?: string[] | null
          created_at?: string | null
          description: string
          id?: string
          meeting_date: string
          notes?: string | null
          status?: string | null
          title: string
        }
        Update: {
          agenda?: string[] | null
          attendees?: string[] | null
          created_at?: string | null
          description?: string
          id?: string
          meeting_date?: string
          notes?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      quran_sessions: {
        Row: {
          attendance: boolean | null
          created_at: string | null
          id: string
          notes: string | null
          performance_rating: number | null
          session_date: string | null
          student_id: string | null
          surah_name: string
          teacher_id: string | null
          verses_from: number
          verses_to: number
        }
        Insert: {
          attendance?: boolean | null
          created_at?: string | null
          id?: string
          notes?: string | null
          performance_rating?: number | null
          session_date?: string | null
          student_id?: string | null
          surah_name: string
          teacher_id?: string | null
          verses_from: number
          verses_to: number
        }
        Update: {
          attendance?: boolean | null
          created_at?: string | null
          id?: string
          notes?: string | null
          performance_rating?: number | null
          session_date?: string | null
          student_id?: string | null
          surah_name?: string
          teacher_id?: string | null
          verses_from?: number
          verses_to?: number
        }
        Relationships: [
          {
            foreignKeyName: "quran_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quran_sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          age: number
          attendance: number | null
          created_at: string | null
          current_progress: string | null
          department: string
          grade: string
          id: string
          is_active: boolean | null
          name: string
          parent_name: string | null
          parent_phone: string | null
          parts_memorized: number | null
          previous_progress: string | null
          teacher_id: string | null
        }
        Insert: {
          age: number
          attendance?: number | null
          created_at?: string | null
          current_progress?: string | null
          department: string
          grade: string
          id?: string
          is_active?: boolean | null
          name: string
          parent_name?: string | null
          parent_phone?: string | null
          parts_memorized?: number | null
          previous_progress?: string | null
          teacher_id?: string | null
        }
        Update: {
          age?: number
          attendance?: number | null
          created_at?: string | null
          current_progress?: string | null
          department?: string
          grade?: string
          id?: string
          is_active?: boolean | null
          name?: string
          parent_name?: string | null
          parent_phone?: string | null
          parts_memorized?: number | null
          previous_progress?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          priority: string | null
          status: string
          suggested_by: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          status?: string
          suggested_by?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          status?: string
          suggested_by?: string | null
          title?: string
        }
        Relationships: []
      }
      tajweed_lessons: {
        Row: {
          attendees: string[] | null
          created_at: string | null
          description: string
          id: string
          lesson_date: string | null
          resources: string[] | null
          teacher_id: string | null
          topic: string
        }
        Insert: {
          attendees?: string[] | null
          created_at?: string | null
          description: string
          id?: string
          lesson_date?: string | null
          resources?: string[] | null
          teacher_id?: string | null
          topic: string
        }
        Update: {
          attendees?: string[] | null
          created_at?: string | null
          description?: string
          id?: string
          lesson_date?: string | null
          resources?: string[] | null
          teacher_id?: string | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "tajweed_lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string | null
          department: string
          email: string | null
          experience: number | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          specialization: string
        }
        Insert: {
          created_at?: string | null
          department: string
          email?: string | null
          experience?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          specialization: string
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string | null
          experience?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          specialization?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
