import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { SkillsSection } from "@/components/sections/SkillsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div id="home">
          <HeroSection />
        </div>
        <div id="skills">
          <SkillsSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
