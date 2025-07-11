import { useState, useEffect, useMemo } from 'react';
import { useSkills } from '@/hooks/useSkills';
import { useSkillCategories } from '@/hooks/useSkillCategories';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Circular progress component for skill mastery visualization
 * Used in: SkillsSection.tsx
 * Features animated progress circle with gradient styling
 */
function CircularProgress({ value, size = 120 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{value}%</span>
      </div>
    </div>
  );
}

// Custom hook for window size
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowSize;
}

/**
 * Skills section with category filtering and constant speed scrolling
 * Features: category buttons and smooth left-to-right scrolling
 * Used in: Index.tsx as main skills showcase component
 */
export function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { width: windowWidth } = useWindowSize();
  const { data: categories, isLoading: categoriesLoading } = useSkillCategories();
  const { data: skills, isLoading: skillsLoading, error } = useSkills(selectedCategory);
  const { ref, isIntersecting } = useIntersectionObserver();
  const [forceVisible, setForceVisible] = useState(false);

  const isLoading = categoriesLoading || skillsLoading;

  useEffect(() => {
    if (!isLoading) {
      setForceVisible(true);
    }
  }, [isLoading]);

  // Prepare categories with loading state handling
  const allCategories = useMemo<string[]>(() => {
    if (categoriesLoading) return ['All'];
    return ['All', ...(categories || [])].map(cat => String(cat));
  }, [categories, categoriesLoading]);

  // Memoize duplicated skills with optimized calculation
  const duplicatedSkills = useMemo(() => {
    if (!skills || skills.length === 0) return [];
    
    const cardWidth = 280; // width of each skill card including gap
    const minCardsNeeded = Math.ceil(windowWidth / cardWidth) + 2;
    const duplications = Math.max(2, Math.ceil(minCardsNeeded / skills.length));
    
    // Optimize array creation for better performance
    const duplicated = new Array(duplications * skills.length);
    for (let i = 0; i < duplications; i++) {
      const offset = i * skills.length;
      for (let j = 0; j < skills.length; j++) {
        duplicated[offset + j] = skills[j];
      }
    }
    return duplicated;
  }, [skills, windowWidth]);

  const renderLoadingState = () => (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              My Skills
            </span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-muted rounded w-20" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="flex-shrink-0 w-64 h-64 p-6 animate-pulse">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full bg-muted" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  if (isLoading) {
    return renderLoadingState();
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-destructive">Error loading skills: {error.message}</p>
        </div>
      </section>
    );
  }

  if (!skills || skills.length === 0) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              My Skills
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">No skills data available</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isIntersecting || forceVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              My Skills
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my technical expertise and proficiency levels across various technologies and frameworks.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-700 ${
          isIntersecting || forceVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {allCategories.map((category, idx) => (
            <Button
              key={typeof category === 'string' ? category : `category-${idx}`}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'hover:bg-primary/10 hover:scale-105'
              }`}
              disabled={categoriesLoading}
            >
              {category}
              {categoriesLoading && (
                <span className="ml-2 inline-block animate-spin">⟳</span>
              )}
            </Button>
          ))}
        </div>

        {/* Constant Speed Left-to-Right Scrolling Skills Container */}
        <div className="relative overflow-hidden py-16">
          <div
            className={`flex gap-6 animate-scroll-left transition-all duration-700 ${
              isIntersecting || forceVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              width: `${duplicatedSkills.length * 280}px`,
              animationDuration: `${duplicatedSkills.length * 0.5}s`,
            }}
          >
            {duplicatedSkills.map((skill, index) => (
              <Card
                key={skill && skill.id ? `${skill.id}-${index}` : `skill-${index}`}
                className={`flex-shrink-0 w-64 p-6 text-center bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:scale-105 hover:shadow-primary ${
                  isIntersecting || forceVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                style={{ 
                  transitionDelay: `${Math.min((index % (skills?.length || 1)) * 50, 1000)}ms`,
                  transitionProperty: 'all'
                }}
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Circular Progress */}
                  <CircularProgress value={skill.mastery_level} />
                  
                  {/* Skill Name */}
                  <h3 className="text-xl font-semibold text-foreground">
                    {skill.name}
                  </h3>
                  
                  {/* Skill Category */}
                  <div className="text-xs text-primary/70 bg-primary/10 px-2 py-1 rounded-full">
                    {skill.skill_category}
                  </div>
                  
                  {/* Mastery Level Text */}
                  <div className="text-sm text-muted-foreground">
                    {skill.mastery_level >= 90 && 'Expert'}
                    {skill.mastery_level >= 80 && skill.mastery_level < 90 && 'Advanced'}
                    {skill.mastery_level >= 60 && skill.mastery_level < 80 && 'Intermediate'}
                    {skill.mastery_level < 60 && 'Beginner'}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
