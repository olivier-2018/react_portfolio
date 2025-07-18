import { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageModal } from '@/components/ui/imageModal';
import myLogo from '/logo-BTS.gif';


/**
 * Responsive navigation bar component
 * Features smooth scrolling to sections and mobile menu
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'testimonials', label: 'Feedback' },
    { id: 'contact', label: 'Contact' },
  ];

  // Social links
  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/olivier-2018',
      label: 'GitHub',
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/olivier-abc',
      label: 'LinkedIn',
    },
    {
      icon: Youtube,
      href: 'https://www.youtube.com/@bigtechfan-AI',
      label: 'YouTube',
    },
    {
      icon: Mail,
      href: '#contact',
      label: 'Contact',
      isSection: true,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-lg border-b border-border shadow-card'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          {/* <div className="text-2xl font-bold bg-gradient-ternary bg-clip-text text-transparent">
            Portfolio
          </div> */}

          <div  className="flex items-center justify-between px-4 py-0" >
            <img  
              src={myLogo}  
              alt="Logo" 
              className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 cursor-pointer"
              onClick={handleOpen}
            />
            <ImageModal isOpen={isModalOpen} imageSrc={myLogo}  onClose={handleClose} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground hover:text-primary transition-colors duration-200 text-lg relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Social Links - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (link.isSection) {
                    scrollToSection('contact');
                  } else {
                    window.open(link.href, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              >
                <link.icon className="w-5 h-5" />
                <span className="sr-only">{link.label}</span>
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-foreground hover:text-primary transition-colors duration-200 py-2"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Social Links - Mobile */}
              <div className="flex items-center space-x-4 pt-4 border-t border-border">
                {socialLinks.map((link) => (
                  <Button
                    key={link.label}
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (link.isSection) {
                        scrollToSection('contact');
                      } else {
                        window.open(link.href, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="sr-only">{link.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
