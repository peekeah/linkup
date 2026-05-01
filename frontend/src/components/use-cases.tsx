"use client";

import { 
  IconCode, 
  IconPalette, 
  IconBriefcase, 
  IconSchool,
  IconMicroscope,
  IconCamera,
  IconMusic,
  IconBook
} from "@tabler/icons-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const useCases = [
  {
    icon: <IconCode className="h-8 w-8" />,
    title: "Development Teams",
    description: "Collaborate on code reviews, share best practices, and find solutions to technical challenges.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: <IconPalette className="h-8 w-8" />,
    title: "Design Communities",
    description: "Get feedback on designs, share inspiration, and connect with fellow creative professionals.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: <IconBriefcase className="h-8 w-8" />,
    title: "Business Networking",
    description: "Build professional relationships, discuss industry trends, and explore partnership opportunities.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: <IconSchool className="h-8 w-8" />,
    title: "Educational Groups",
    description: "Study together, share learning resources, and get help from peers and mentors.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: <IconMicroscope className="h-8 w-8" />,
    title: "Research Collaboration",
    description: "Discuss findings, share methodologies, and connect with researchers in your field.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: <IconCamera className="h-8 w-8" />,
    title: "Creative Arts",
    description: "Share your work, get constructive feedback, and collaborate on creative projects.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: <IconMusic className="h-8 w-8" />,
    title: "Music & Audio",
    description: "Connect with musicians, share compositions, and discuss production techniques.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: <IconBook className="h-8 w-8" />,
    title: "Book Clubs",
    description: "Discuss literature, share reading lists, and engage in thoughtful literary conversations.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
];

export const UseCases = () => {
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
      y: 60,
      scale: 0.8
    },
    visible: {
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <section className="py-20 lg:py-24 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center space-y-4 mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-semibold tracking-tight"
          >
            Perfect for every community
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4"
          >
            Whether you're a professional team, study group, or hobby community, Linkup adapts to your needs
          </motion.p>
        </motion.div>

        {/* Use Cases Grid */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                borderColor: "rgba(var(--primary), 0.3)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="group p-6 rounded-xl border border-border border-t-2 border-t-primary/25 bg-card hover:border-t-primary/60 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div className="space-y-4">
                {/* Icon */}
                <motion.div 
                  className="inline-flex p-3 rounded-xl bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors duration-200"
                >
                  {useCase.icon}
                </motion.div>

                {/* Content */}
                <div>
                  <h3 className="text-base font-semibold mb-2 text-foreground">
                    {useCase.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            And many more use cases
          </p>
          <motion.div 
            className="inline-flex items-center gap-2 text-primary font-medium cursor-pointer border border-primary/25 px-4 py-2 rounded-lg hover:border-primary/60 hover:bg-primary/5 transition-all duration-200"
            whileHover={{ x: 10 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Create your own community
            <motion.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
