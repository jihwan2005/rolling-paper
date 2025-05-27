export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          profile_id: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          profile_id: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          profile_id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      rolling_paper: {
        Row: {
          created_at: string
          join_code: string
          profile_id: string
          rolling_paper_id: number
          rolling_paper_title: string
        }
        Insert: {
          created_at?: string
          join_code: string
          profile_id: string
          rolling_paper_id?: never
          rolling_paper_title: string
        }
        Update: {
          created_at?: string
          join_code?: string
          profile_id?: string
          rolling_paper_id?: never
          rolling_paper_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "rolling_paper_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      rolling_paper_text: {
        Row: {
          angle: number
          fill: string
          font_family: string
          font_size: number
          left: number
          profile_id: string
          rolling_paper_id: number
          scaleX: number
          scaleY: number
          text_content: string
          text_node_id: number
          top: number
        }
        Insert: {
          angle: number
          fill: string
          font_family: string
          font_size: number
          left: number
          profile_id: string
          rolling_paper_id: number
          scaleX: number
          scaleY: number
          text_content: string
          text_node_id?: never
          top: number
        }
        Update: {
          angle?: number
          fill?: string
          font_family?: string
          font_size?: number
          left?: number
          profile_id?: string
          rolling_paper_id?: number
          scaleX?: number
          scaleY?: number
          text_content?: string
          text_node_id?: never
          top?: number
        }
        Relationships: [
          {
            foreignKeyName: "rolling_paper_text_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "rolling_paper_text_rolling_paper_id_rolling_paper_rolling_paper"
            columns: ["rolling_paper_id"]
            isOneToOne: false
            referencedRelation: "rolling_paper"
            referencedColumns: ["rolling_paper_id"]
          },
          {
            foreignKeyName: "rolling_paper_text_rolling_paper_id_rolling_paper_rolling_paper"
            columns: ["rolling_paper_id"]
            isOneToOne: false
            referencedRelation: "rolling_paper_view"
            referencedColumns: ["rolling_paper_id"]
          },
        ]
      }
      rolling_paper_visitor: {
        Row: {
          profile_id: string
          rolling_paper_id: number | null
          visited_at: string
        }
        Insert: {
          profile_id: string
          rolling_paper_id?: number | null
          visited_at?: string
        }
        Update: {
          profile_id?: string
          rolling_paper_id?: number | null
          visited_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rolling_paper_visitor_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "rolling_paper_visitor_rolling_paper_id_rolling_paper_rolling_pa"
            columns: ["rolling_paper_id"]
            isOneToOne: false
            referencedRelation: "rolling_paper"
            referencedColumns: ["rolling_paper_id"]
          },
          {
            foreignKeyName: "rolling_paper_visitor_rolling_paper_id_rolling_paper_rolling_pa"
            columns: ["rolling_paper_id"]
            isOneToOne: false
            referencedRelation: "rolling_paper_view"
            referencedColumns: ["rolling_paper_id"]
          },
        ]
      }
    }
    Views: {
      rolling_paper_view: {
        Row: {
          author_name: string | null
          created_at: string | null
          join_code: string | null
          profile_id: string | null
          rolling_paper_id: number | null
          rolling_paper_title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rolling_paper_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
