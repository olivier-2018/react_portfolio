// Dynamically import all project card images from the assets/project_pictures folder
const projectPictureAssets = import.meta.glob(
  "@/assets/project_pictures/*.{jpg,png,jpeg}",
  { eager: true, query: "?url", import: "default" }
);

export const projectPictureMap: Record<string, string> = {};

Object.entries(projectPictureAssets).forEach(([path, url]) => {
  // console.debug(`Processing path: ${path} Mapped URL: ${url}`); // Debug log
  const filename = path.split("/project_pictures/").pop();
  if (filename) projectPictureMap[filename] = url as string;
});
