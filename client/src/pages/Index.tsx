import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { SkillsSection } from "@/components/sections/SkillsSection"
import { ProjectsSection } from "@/components/sections/ProjectsSection"
import { FeedbackSection } from "@/components/sections/FeedbackSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { Footer } from "@/components/sections/Footer"

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
            <div id="projects">
               <ProjectsSection />
            </div>
            <div id="testimonials">
               <FeedbackSection />
            </div>
            <div id="contact">
               <ContactSection />
            </div>
            <Footer />
         </main>
      </div>
   )
}

export default Index
