import { useState, useEffect } from "react";
import { ExternalLink, Github, Heart, Play, X } from "lucide-react";
import {
  useProjectCategories,
  useProjectsByCategory,
  useLikeProject,
} from "@/hooks/useProjects";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { projectPictureMap } from "@/lib/projectPictureMap";
import { projectVideoMap } from "@/lib/projectVideoMap";


/**
 * Helper to get project pictures asset URL by filename (from DB)
 */
const getProjectPictureUrl = (filename?: string) => {
  if (!filename) return undefined;
  // Debug: log available keys
  if (process.env.NODE_ENV === 'development') {
    console.log(`filename: ${filename} projectPictureMap: ${projectPictureMap[filename]}`);
  }
  // Direct match only (e.g. 'analytics-dashboard.jpg')
  return projectPictureMap[filename];
};
/**
 * Helper to get project videos asset URL by filename (from DB)
 */
const getProjectVideoUrl = (filename?: string) => {
  if (!filename) return undefined;
  return projectVideoMap[filename];
};



/**
 * Video popup component for displaying project demos
 */
function VideoPopup({
  videoSrc,
  isOpen,
  onClose,
  title,
}: {
  videoSrc: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <video
            src={videoSrc}
            controls
            autoPlay
            loop
            className="w-full h-auto rounded-lg"
            style={{ maxHeight: "80vh" }}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="p-4 bg-background border-t">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Individual project card component
 * Features hover animations and interactive elements
 */
function ProjectCard({ project }: { project: any }) {
  const likeProject = useLikeProject();
  const { toast } = useToast();
  const [videoPopup, setVideoPopup] = useState<{
    isOpen: boolean;
    videoSrc: string;
    title: string;
  }>({
    isOpen: false,
    videoSrc: "",
    title: "",
  });

  const handleLike = async () => {
    try {
      await likeProject.mutateAsync(project.id);
      toast({
        title: "Project Liked!",
        description: `You liked "${project.title}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like project",
        variant: "destructive",
      });
    }
  };

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const isVideoFile = (filename: string) => {
    if (!filename) return false;
    const videoExtensions = [".mp4", ".webm", ".ogv"];
    return videoExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  };

  const handleImageClick = () => {
    if (project.website_url && isVideoFile(project.website_url)) {
      const videoSrc = getProjectVideoUrl(project.website_url);
      // const videoSrc = videoMap[project.website_url];
      if (videoSrc) {
        setVideoPopup({
          isOpen: true,
          videoSrc,
          title: project.title,
        });
      }
    } else if (project.website_url) {
      openLink(project.website_url);
    }
  };

  const projectImage = project.image_filename
    ? getProjectPictureUrl(project.image_filename)
    : null;
  const hasVideo =
    project.website_url &&
    isVideoFile(project.website_url) && 
    getProjectVideoUrl(project.website_url);

  return (
    <>
      <Card className="group overflow-hidden bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:scale-105 hover:shadow-primary">
        {/* Project Image */}
        <div
          className="relative h-48 overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          {projectImage ? (
            <>
              <img
                src={projectImage}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              {hasVideo && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-primary/80 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Play className="w-6 h-6 text-white fill-current" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-semibold">No Image</span>
            </div>
          )}

          {/* Overlay with action button */}
          {!hasVideo && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                disabled={!project.website_url}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Project
              </Button>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          {/* Skills Used */}
          <div className="flex flex-wrap gap-2">
            {project.skills.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {project.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.skills.length - 3} more
              </Badge>
            )}
          </div>

          {/* Project Title */}
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>

          {/* Project Description */}
          <p className="text-muted-foreground text-sm line-clamp-3">
            {project.description}
          </p>

          {/* Project Links and Like Button */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center space-x-2">
              {project.github_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openLink(project.github_url)}
                  className="hover:text-primary transition-colors duration-200"
                >
                  <Github className="w-4 h-4" />
                </Button>
              )}
              {project.website_url && !isVideoFile(project.website_url) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openLink(project.website_url)}
                  className="hover:text-primary transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={likeProject.isPending}
              className="hover:text-red-500 transition-colors duration-200 group/like"
            >
              <Heart className="w-4 h-4 mr-1 group-hover/like:fill-red-500 transition-all duration-200" />
              <span className="text-sm">{project.likes_count}</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Video Popup */}
      <VideoPopup
        videoSrc={videoPopup.videoSrc}
        isOpen={videoPopup.isOpen}
        onClose={() =>
          setVideoPopup({ isOpen: false, videoSrc: "", title: "" })
        }
        title={videoPopup.title}
      />
    </>
  );
}

/**
 * Projects section component with category filtering
 * Features responsive grid layout and smooth animations
 */
export function ProjectsSection() {
  const { data: categories } = useProjectCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { data: projects, isLoading } = useProjectsByCategory(selectedCategory);
  const { ref, isIntersecting } = useIntersectionObserver();
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setForceVisible(true);
    }
  }, [isLoading]);

  // Set initial category when categories load
  if (categories && categories.length > 0 && !selectedCategory) {
    setSelectedCategory(categories[0].id);
  }

  return (
    <section id="projects" ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isIntersecting || forceVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore my latest work across different domains of technology and
            innovation
          </p>
        </div>

        {/* Category Filters */}
        {categories && categories.length > 0 && (
          <div
            className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-300 ${
              isIntersecting || forceVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? "bg-gradient-primary shadow-primary"
                    : "hover:border-primary/50 hover:text-primary"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-20 bg-muted rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-1000 delay-500 ${
              isIntersecting || forceVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No projects found for this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
