// API calls to local Postgres container via local Express server

const API_URL = 'http://localhost:3001/api';

export const fetchProjects = async (categoryId?: string) => {
  const url = categoryId ? `${API_URL}/projects?category=${categoryId}` : `${API_URL}/projects`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const fetchSkills = async () => {
  const response = await fetch(`${API_URL}/skills`);
  if (!response.ok) throw new Error('Failed to fetch skills');
  return response.json();
};

export const fetchSkillCategories = async () => {
  const response = await fetch(`${API_URL}/skill-categories`);
  if (!response.ok) throw new Error('Failed to fetch skill categories');
  return response.json();
};
