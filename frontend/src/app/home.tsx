"use client";

import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { Features } from "@/components/features";
import { HeroIllustration } from "@/components/hero-illustration";
import { Statistics } from "@/components/statistics";
import { Testimonials } from "@/components/testimonials";
import { UseCases } from "@/components/use-cases";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import { signIn } from "next-auth/react";
import { motion, useScroll, useTransform } from "framer-motion";

const Home = () => {
  const handleGetStarted = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const { scrollYProgress } = useScroll();
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div 
        style={{ translateY, opacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 lg:pt-24 relative"
      >
        {/* Radial Glow Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-[800px] h-[600px] bg-primary opacity-8 rounded-full blur-3xl"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh] relative z-10">
          <div className="space-y-6 lg:space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
            >
              <span className="text-primary">Connect</span> with <br /> like-minded people
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              Join passionate individuals just like you who are eager to share ideas and learn from one another.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  className="relative px-8 py-4 text-primary-foreground font-semibold rounded-lg 
                    border-2 border-primary/40
                    bg-gradient-to-r from-primary/90 to-primary
                    hover:from-primary hover:to-primary/90
                    shadow-[0_0_20px_rgba(var(--primary),0.3)]
                    hover:shadow-[0_0_40px_rgba(var(--primary),0.5)]
                    transition-all duration-300
                    overflow-hidden group"
                  onClick={handleGetStarted}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="flex gap-2 items-center relative z-10">
                    Get Started <IconArrowRight className="w-4 h-4" />
                  </div>
                </Button>
              </motion.div>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
            className="hidden lg:flex lg:justify-end"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </motion.div>

      {/* Other Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-0">
        <Features />
        <div className="bg-accent/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <Statistics />
        </div>
        <Testimonials />
        <div className="bg-accent/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <UseCases />
        </div>
        <FAQ />
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;
