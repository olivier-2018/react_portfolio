import { createClient } from "@supabase/supabase-js";
import type { Database } from '@/services/types';

/**
 * Initializes the Supabase client with the provided URL and Anon Key.
 * This client can be used to interact with the Supabase database.
 *
 * @returns {Object} The initialized Supabase client.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or Anon Key is missing from environment variables. Please check your .env file."
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Fetch project categories
export const fetchCategories = async () => {
  const { data, error } = await supabase.from("project_categories").select("*");
  if (error) throw error;
  return data;
};

// Fetch projects
export const fetchProjects = async (category?: string) => {
  let query = supabase.from("projects").select("*");
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Fetch skill categories
export const fetchSkillCategories = async () => {
  const { data, error } = await supabase.from("skill_categories").select("*");
  if (error) throw error;
  return data;
};

// Fetch skills
export const fetchSkills = async (category?: string) => {
  let query = supabase.from("skills").select("*");
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Fetch all feedback entries
export const fetchFeedbacks = async () => {
  const { data, error } = await supabase.from("customer_feedbacks").select("*");
  if (error) throw error;
  return data;
};
