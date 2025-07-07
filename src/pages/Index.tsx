import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";

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
