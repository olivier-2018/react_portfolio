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

// Fetch all projects
export const fetchProjects = async (categoryId) => {
  let query = supabase.from("projects").select("*");
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Fetch all skills
export const fetchSkills = async () => {
  const { data, error } = await supabase.from("skills").select("*");
  if (error) throw error;
  return data;
};

// Fetch all categories
export const fetchCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data;
};

// Fetch all skill categories
export const fetchSkillCategories = async () => {
  const { data, error } = await supabase.from("skill_categories").select("*");
  if (error) throw error;
  return data;
};

// Fetch all feedback entries
export const fetchFeedbacks = async () => {
  const { data, error } = await supabase.from("customer_feedbacks").select("*");
  if (error) throw error;
  return data;
};
