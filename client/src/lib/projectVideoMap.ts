// Dynamically import all project card movies and GIFs from the assets/projectVideoAssets folder
const projectVideoAssets = import.meta.glob(
  "@/assets/project_movies/*.{mp4,webm,ogv,gif}",
  { eager: true, query: "?url", import: "default" }
);

export const projectVideoMap: Record<string, string> = {};

Object.entries(projectVideoAssets).forEach(([path, url]) => {
  // console.debug(`Processing path: ${path} Mapped URL: ${url}`); // Debug log
  const filename = path.split("/project_movies/").pop();
  if (filename) projectVideoMap[filename] = url as string;
});
