import { useState, useRef, useEffect, useMemo } from "react";
import { useCustomerFeedbacks } from "@/hooks/useCustomerFeedbacks";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Card } from "@/components/ui/card";
import { Star, X } from "lucide-react";

/**
 * Customer feedback section with constant speed right-to-left scrolling and popup functionality
 * Features: testimonials scroll at constant speed from right to left, click to magnify
 * Used in: Index.tsx for displaying customer testimonials
 */
export function CustomerFeedbackSection() {
  const { data: feedbacks, isLoading, error } = useCustomerFeedbacks();
  const { ref, isIntersecting } = useIntersectionObserver();
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setForceVisible(true);
    }
  }, [isLoading]);

  console.log("Customer feedback section render:", {
    feedbacks,
    isLoading,
    error,
  });

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedFeedback && event.target instanceof Element) {
        // Don't close if clicking on the popup content itself
        if (!event.target.closest(".popup-content")) {
          setSelectedFeedback(null);
        }
      }
    };

    if (selectedFeedback) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [selectedFeedback]);

  // Duplicate feedbacks for seamless scrolling (optimized)
  const duplications = 2;
  const duplicatedFeedbacks = useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) return [];
    const arr = new Array(duplications * feedbacks.length);
    for (let i = 0; i < duplications; i++) {
      const offset = i * feedbacks.length;
      for (let j = 0; j < feedbacks.length; j++) {
        arr[offset + j] = feedbacks[j];
      }
    }
    return arr;
  }, [feedbacks]);

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4" />
              <div className="h-4 bg-muted rounded w-96 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Customer feedbacks error:", error);
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="text-destructive">
            Error loading testimonials: {error.message}
          </p>
        </div>
      </section>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Client Testimonials
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            No testimonials available
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isIntersecting || forceVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Client Testimonials
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            What my clients say about working with me.
          </p>
        </div>

        {/* Constant Speed Right-to-Left Scrolling Testimonials Container */}
        <div className="relative overflow-hidden py-16">
          <div
            className={`flex gap-6 animate-scroll-right transition-all duration-700 ${
              isIntersecting || forceVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              width: `${duplicatedFeedbacks.length * 380}px`,
              animationDuration: "25s",
            }}
          >
            {duplicatedFeedbacks.map((feedback, index) => (
              <Card
                key={`${feedback.id}-${index}`}
                className={`flex-shrink-0 w-96 p-6 bg-gradient-card border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:scale-105 hover:shadow-primary cursor-pointer ${
                  isIntersecting || forceVisible
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-90"
                }`}
                style={{
                  animationDelay: `${(index % feedbacks.length) * 50}ms`,
                }}
                onClick={() => setSelectedFeedback(feedback)}
              >
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < feedback.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Message */}
                  <p className="text-muted-foreground italic leading-relaxed line-clamp-4">
                    "{feedback.message}"
                  </p>

                  {/* Client Info */}
                  <div className="pt-4 border-t border-primary/10">
                    <p className="font-semibold text-foreground">
                      {feedback.first_name} {feedback.last_name}
                    </p>
                    <p className="text-sm text-primary/70">
                      {feedback.company_name}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Popup Modal for Selected Feedback */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="popup-content max-w-2xl w-full p-8 bg-gradient-card border-primary/20 relative animate-scale-in">
            <button
              onClick={() => setSelectedFeedback(null)}
              className="absolute top-4 right-4 p-2 hover:bg-primary/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* Rating Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < selectedFeedback.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Message */}
              <p className="text-muted-foreground italic leading-relaxed text-lg">
                "{selectedFeedback.message}"
              </p>

              {/* Client Info */}
              <div className="pt-6 border-t border-primary/10">
                <p className="font-semibold text-foreground text-xl">
                  {selectedFeedback.first_name} {selectedFeedback.last_name}
                </p>
                <p className="text-primary/70">
                  {selectedFeedback.company_name}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}
