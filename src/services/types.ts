export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Skill Category
export interface SkillCategory {
  name: string;
  created_at: string;
  updated_at: string;
}

// Skill
export interface Skill {
  id: string;
  name: string;
  category: string;
  mastery_level: number;
  created_at: string;
  updated_at: string;
}

// Project Category
export interface ProjectCategory {
  name: string;
  created_at: string;
  updated_at: string;
}

// Project
export interface Project {
  name: string;
  category: string;
  project_description: string;
  skills_list: string[];
  github_url: string | null;
  website_url: string | null;
  image_filename: string | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

// Customer Feedback
export interface CustomerFeedback {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  role: string; 
  message: string;
  rating: number;
  created_at: string;
  updated_at: string;
}
export interface CustomerFeedbackForm {
  first_name: string;
  last_name: string;
  company_name: string;
  role: string; 
  message: string;
  rating: number;
}
// Database type for Supabase
export interface Database {
  public: {
    Tables: {
      skills: {
        Row: Skill;
        Insert: Omit<Partial<Skill>, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Skill>;
      };
      skill_categories: {
        Row: SkillCategory;
        Insert: Omit<Partial<SkillCategory>, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<SkillCategory>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Partial<Project>, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Project>;
      };
      project_categories: {
        Row: ProjectCategory;
        Insert: Omit<Partial<ProjectCategory>, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<ProjectCategory>;
      };
      customer_feedbacks: {
        Row: CustomerFeedback;
        Insert: Omit<Partial<CustomerFeedback>, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<CustomerFeedback>;
      };
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Row"];

export type TablesInsert<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Insert"];

export type TablesUpdate<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Update"];

export type Enums<
  EnumName extends keyof DefaultSchema["Enums"]
> = DefaultSchema["Enums"][EnumName];

export type CompositeTypes<
  CompositeTypeName extends keyof DefaultSchema["CompositeTypes"]
> = DefaultSchema["CompositeTypes"][CompositeTypeName];

export type Views<
  ViewName extends keyof DefaultSchema["Views"]
> = DefaultSchema["Views"][ViewName];

export type Functions<
  FunctionName extends keyof DefaultSchema["Functions"]
> = DefaultSchema["Functions"][FunctionName];
