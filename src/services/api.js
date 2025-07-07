import { supabase } from "./supabaseClient";

/**
 * Fetches all projects from the database table 'projects'
 * @returns {Promise<Array>} A promise that resolves to an array of projects.
 */
export const getProjects = async () => {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  return data;
};

/**
 * Fetches all skills from the database table 'skills'
 * @returns {Promise<Array>} A promise that resolves to an array of skills.
 */
export const getSkills = async () => {
  const { data, error } = await supabase.from("skills").select("*");

  if (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }

  return data;
};

/**
 * Fetches all feedback entries from the database 'customer_feedbacks' table
 * @returns {Promise<Array>} A promise that resolves to an array of feedback entries.
 */
export const getFeedbacks = async () => {
  const { data, error } = await supabase.from("customer_feedbacks").select("*");

  if (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }

  return data;
};
