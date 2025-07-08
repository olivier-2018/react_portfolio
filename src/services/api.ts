import * as supabaseApi from './supabaseClient';
import * as localApi from './localApi';

const dbSelect = import.meta.env.VITE_DB_SELECT || 'supabase';

export const fetchProjects = (...args: any[]) =>
  dbSelect === 'postgres'
    ? localApi.fetchProjects(...args)
    : supabaseApi.fetchProjects(...args);

export const fetchCategories = (...args: any[]) =>
  dbSelect === 'postgres'
    ? localApi.fetchCategories(...args)
    : supabaseApi.fetchCategories(...args);

export const fetchSkills = (...args: any[]) =>
  dbSelect === 'postgres'
    ? localApi.fetchSkills(...args)
    : supabaseApi.fetchSkills(...args);

export const fetchSkillCategories = (...args: any[]) =>
  dbSelect === 'postgres'
    ? localApi.fetchSkillCategories(...args)
    : supabaseApi.fetchSkillCategories(...args);