import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroPortrait from "@/assets/hero-portrait.png";

/**
 * Hero section component with animated introduction
 * Features floating animations and smooth scroll to next section
 */
export function HeroSection() {
  const { ref, isIntersecting } = useIntersectionObserver();
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    setForceVisible(true); // Set immediately on mount
  }, []);

  const scrollToSkills = () => {
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center  overflow-hidden bg-gradient-hero"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div
            className={`flex-1 text-center lg:text-left transition-all duration-1000 ${
              isIntersecting || forceVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Hello, I'm 
              </span>
              {/* <br /> */}
              <span className="text-primary-glow"> Oli !</span>
            </h1>

            <p className="text-xl lg:text-2xl text-primary-foreground mb-8 max-w-2xl font-medium">
              Passionate full-stack developer specializing in{" "}
              <span className="text-primary font-semibold">React</span>,{" "}
              <span className="text-secondary font-semibold">
                Machine Learning
              </span>
              , and <span className="text-accent font-semibold">Robotics</span>.
              I create innovative solutions that bridge technology and
              creativity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                onClick={() => scrollToSkills()}
              >
                Explore My Work
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary/50 hover:bg-primary/10 transition-all duration-300"
                onClick={() => {
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Get In Touch
              </Button>
            </div>
          </div>

          {/* Profile Image */}
          <div
            className={`flex-1 flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${
              isIntersecting || forceVisible
                ? "opacity-100 scale-100"
                : "opacity-0 scale-90"
            }`}
          >
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-glow animate-pulse-glow border-4 border-primary/30">
                <img
                  src={heroPortrait}
                  alt="John Developer - Full Stack Developer"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              {/* Floating elements around the image */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full animate-float" />
              <div
                className="absolute -bottom-6 -right-6 w-12 h-12 bg-secondary rounded-full animate-float"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute top-1/2 -left-8 w-6 h-6 bg-accent rounded-full animate-float"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute  bottom-1 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
            isIntersecting || forceVisible ? "opacity-100" : "opacity-0"
          }`}
        >

          <button
            onClick={scrollToSkills}
            className="flex flex-col  items-center text-pink-950 hover:text-rose-500 transition-colors duration-300 group"
          >
            <span className="text-xl mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6 animate-bounce group-hover:text-ternary" />
          </button>

        </div>
      </div>
    </section>
  );
}
