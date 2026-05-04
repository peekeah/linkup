"use client";

import { 
  IconCode, 
  IconPalette, 
  IconBriefcase, 
  IconSchool,
  IconMicroscope,
  IconUsers
} from "@tabler/icons-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const categories = [
  {
    icon: <IconCode className="h-6 w-6" />,
    title: "Developers",
    description: "Code collaboration",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: <IconPalette className="h-6 w-6" />,
    title: "Designers",
    description: "Creative feedback",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: <IconBriefcase className="h-6 w-6" />,
    title: "Professionals",
    description: "Network & grow",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: <IconSchool className="h-6 w-6" />,
    title: "Students",
    description: "Study together",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: <IconMicroscope className="h-6 w-6" />,
    title: "Researchers",
    description: "Share findings",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: <IconUsers className="h-6 w-6" />,
    title: "Communities",
    description: "Connect & share",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

export const WhoUsesLinkup = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <section className="py-20 lg:py-24">
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
            Community
          </motion.div>
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-semibold tracking-tight"
          >
            Who uses Linkup
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4"
          >
            The perfect platform for diverse communities and collaboration
          </motion.p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="group p-4 rounded-xl bg-card border hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-center"
            >
              <div className="space-y-3">
                {/* Icon */}
                <motion.div 
                  className="inline-flex p-3 rounded-xl bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors duration-200 mx-auto"
                >
                  {category.icon}
                </motion.div>

                {/* Content */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {category.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-10"
        >
          <motion.div 
            className="inline-flex items-center gap-2 text-primary font-medium cursor-pointer border border-primary/25 px-4 py-2 rounded-lg hover:border-primary/60 hover:bg-primary/5 transition-all duration-200"
            whileHover={{ x: 8 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Find your community
            <motion.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
