"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Create your account",
    description: "Sign up in seconds. No credit card required."
  },
  {
    number: "02", 
    title: "Find your people",
    description: "Browse communities or let Smart Matching do the work."
  },
  {
    number: "03",
    title: "Start connecting", 
    description: "Join conversations, make friends, build relationships."
  }
];

export const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
    },
    visible: {
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center space-y-4 mb-16"
        >
          <motion.div 
            variants={itemVariants}
            className="text-xs font-semibold tracking-widest uppercase text-primary"
          >
            Process
          </motion.div>
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-semibold tracking-tight"
          >
            Three steps to connection
          </motion.h2>
        </motion.div>

        {/* Steps Grid */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center space-y-5"
            >
              {/* Step Number */}
              <motion.div 
                className="text-4xl lg:text-5xl font-bold text-primary"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {step.number}
              </motion.div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
