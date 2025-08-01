import * as supabaseApi from './supabaseClient';
import * as localApi from './localApi';

const dbSelect = import.meta.env.VITE_DB_SELECT || 'supabase';

let api: typeof supabaseApi | typeof localApi;
if (dbSelect === 'postgres') {
  api = localApi;
} else {
  api = supabaseApi;
}

export const fetchProjects = api.fetchProjects;
export const fetchCategories = api.fetchCategories;
export const fetchSkills = api.fetchSkills;
export const fetchSkillCategories = api.fetchSkillCategories;

