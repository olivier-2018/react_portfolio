const projectVideoAssets = import.meta.glob('@/assets/project_movies/*.{mp4,webm,ogv}', { eager: true, query: '?url', import: 'default' });

export const projectVideoMap: Record<string, string> = {};

Object.entries(projectVideoAssets).forEach(([path, url]) => {
  const filename = path.split('/project_movies/').pop();
  if (filename) projectVideoMap[filename] = url as string;
});