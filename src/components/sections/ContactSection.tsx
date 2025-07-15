import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import emailjs from '@emailjs/browser';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useSubmitCustomerFeedback } from '@/hooks/useCustomerFeedbacks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Star } from 'lucide-react';

/**
 * Contact section with email sending functionality and customer feedback form
 * Features: Dual forms (Email/Feedback) with switch and golden capsule toggle
 * Used in: Index.tsx as main contact form
 */
export function ContactSection() {
  const [activeTab, setActiveTab] = useState<'email' | 'feedback'>('email');
  const [emailFormData, setEmailFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [feedbackFormData, setFeedbackFormData] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    message: '',
    rating: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { ref, isIntersecting } = useIntersectionObserver();
  const [forceVisible, setForceVisible] = useState(false);
  const { toast } = useToast();
  const submitFeedbackMutation = useSubmitCustomerFeedback();
  const queryClient = useQueryClient();

  useEffect(() => {
    setForceVisible(true); // Set immediately on mount
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formRef.current) {
        throw new Error('Form reference not found');
      }

      // EmailJS configuration - these would normally be environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        from_name: `${emailFormData.firstName} ${emailFormData.lastName}`,
        from_email: emailFormData.email,
        company: emailFormData.company,
        subject: emailFormData.subject,
        message: emailFormData.message,
        to_name: 'Portfolio Owner',
      };

      console.log('Sending email with params:', templateParams);

      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
      });

      // Reset form
      setEmailFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again or contact me directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (feedbackFormData.rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await submitFeedbackMutation.mutateAsync(feedbackFormData);
      toast({
        title: "Feedback submitted successfully!",
        description: "Thank you for your valuable feedback.",
      });
      // Reset form
      setFeedbackFormData({
        first_name: '',
        last_name: '',
        company_name: '',
        message: '',
        rating: 0,
      });
      // Add 2 seconds delay before reloading feedbacks
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['customer-feedbacks'] });
      }, 2000);
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast({
        title: "Failed to submit feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEmailFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeedbackInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFeedbackFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFeedbackFormData(prev => ({
      ...prev,
      rating,
    }));
  };

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ${
            isIntersecting || forceVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              {activeTab === 'email' ? 'Get In Touch' : 'Share Your Feedback'}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {activeTab === 'email' 
              ? "Ready to start your next project? Let's discuss how we can work together to bring your ideas to life."
              : "Help us improve by sharing your experience with our services."
            }
          </p>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Information - Left Side */}
            <div 
              className={`lg:col-span-2 transition-all duration-1000 delay-100 ${
                isIntersecting || forceVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'
              }`}
            >
              <Card className="p-6 bg-gradient-card border-primary/20 h-fit">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="p-2 rounded-full bg-primary/20">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">brontechsolutions@protonmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="p-2 rounded-full bg-primary/20">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">+41 79 xxx xxxx</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="p-2 rounded-full bg-primary/20">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">Switzerland, AG</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/20">
                  <h4 className="font-bold text-foreground mb-2">Let's Connect</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {activeTab === 'email' 
                      ? "I'm always interested in new opportunities and interesting projects. Whether you have a specific project in mind or just want to connect, feel free to reach out!"
                      : "Your feedback helps us deliver better services and improve our client experience."
                    }
                  </p>
                </div>
              </Card>
            </div>

            {/* Contact Form - Right Side */}
            <div className="lg:col-span-3">
              {/* Golden Capsule Switch */}
              <div 
                className={`mb-8 transition-all duration-1000 delay-200 ${
                  isIntersecting || forceVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'
                }`}
              >
                <div className="flex justify-start">
                  <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-2 border-yellow-400/30 backdrop-blur-sm">
                    <span className={`text-sm font-medium transition-colors ${activeTab === 'email' ? 'text-yellow-200' : 'text-yellow-300/70'}`}>
                      Email
                    </span>
                    <div className="p-1 rounded-full bg-yellow-400/20">
                      <Switch
                        checked={activeTab === 'feedback'}
                        onCheckedChange={(checked) => setActiveTab(checked ? 'feedback' : 'email')}
                        className="data-[state=checked]:bg-yellow-500"
                      />
                    </div>
                    <span className={`text-sm font-medium transition-colors ${activeTab === 'feedback' ? 'text-yellow-200' : 'text-yellow-300/70'}`}>
                      Feedback
                    </span>
                  </div>
                </div>
              </div>
              
              <Card 
                className={`p-8 bg-gradient-card border-primary/20 transition-all duration-1000 delay-300 ${
                  isIntersecting || forceVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'
                }`}
              >
                {activeTab === 'email' ? (
                  // Email Form
                  <form ref={formRef} onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-foreground mb-2">Send a Message</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={emailFormData.firstName}
                          onChange={handleEmailInputChange}
                          required
                          placeholder="John"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={emailFormData.lastName}
                          onChange={handleEmailInputChange}
                          required
                          placeholder="Doe"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={emailFormData.email}
                        onChange={handleEmailInputChange}
                        required
                        placeholder="john.doe@example.com"
                        className="bg-background/50 border-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        name="company"
                        value={emailFormData.company}
                        onChange={handleEmailInputChange}
                        placeholder="Your Company"
                        className="bg-background/50 border-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={emailFormData.subject}
                        onChange={handleEmailInputChange}
                        placeholder="What's this about?"
                        className="bg-background/50 border-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={emailFormData.message}
                        onChange={handleEmailInputChange}
                        required
                        rows={6}
                        placeholder="Tell me about your project or idea..."
                        className="bg-background/50 border-primary/20 focus:border-primary resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  // Feedback Form
                  <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-foreground mb-2">Customer Feedback</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name *</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={feedbackFormData.first_name}
                          onChange={handleFeedbackInputChange}
                          required
                          placeholder="John"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name *</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={feedbackFormData.last_name}
                          onChange={handleFeedbackInputChange}
                          required
                          placeholder="Doe"
                          className="bg-background/50 border-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        name="company_name"
                        value={feedbackFormData.company_name}
                        onChange={handleFeedbackInputChange}
                        required
                        placeholder="Your Company"
                        className="bg-background/50 border-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Quality Assessment *</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingClick(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= feedbackFormData.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feedback_message">Your Feedback *</Label>
                      <Textarea
                        id="feedback_message"
                        name="message"
                        value={feedbackFormData.message}
                        onChange={handleFeedbackInputChange}
                        required
                        rows={6}
                        placeholder="Share your experience with our services..."
                        className="bg-background/50 border-primary/20 focus:border-primary resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4 mr-2" />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
