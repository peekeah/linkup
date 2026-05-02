"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { IconUsers, IconMessageCircle, IconBuildingCommunity, IconTrendingUp } from "@tabler/icons-react";
import { useRef } from "react";

const stats = [
  {
    icon: <IconUsers className="h-6 w-6" />,
    value: 50000,
    label: "Active Users",
    suffix: "+",
  },
  {
    icon: <IconBuildingCommunity className="h-6 w-6" />,
    value: 1200,
    label: "Communities",
    suffix: "+",
  },
  {
    icon: <IconMessageCircle className="h-6 w-6" />,
    value: 2500000,
    label: "Messages Sent",
    suffix: "+",
  },
  {
    icon: <IconTrendingUp className="h-6 w-6" />,
    value: 98,
    label: "Satisfaction Rate",
    suffix: "%",
  },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Determine display value and abbreviation
  const getDisplayValue = (num: number) => {
    if (num >= 1000000) {
      return { value: num / 1000000, suffix: 'M' };
    } else if (num >= 1000) {
      return { value: num / 1000, suffix: 'K' };
    }
    return { value: num, suffix: '' };
  };

  const { value: displayValue, suffix: abbreviation } = getDisplayValue(value);
  const finalSuffix = abbreviation + suffix;

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = displayValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= displayValue) {
        setCount(displayValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10); // Keep 1 decimal place for K/M values
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, displayValue]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{finalSuffix}
    </span>
  );
};

export const Statistics = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
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
            Statistics
          </motion.div>
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-semibold tracking-tight"
          >
            Trusted by thousands worldwide
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4"
          >
            Join a growing community of passionate individuals connecting and collaborating
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                borderColor: "rgba(var(--primary), 0.3)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-center space-y-3 p-6 rounded-xl bg-card hover:-translate-y-0.5 transition-all duration-200"
            >
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="flex justify-center text-primary"
              >
                {stat.icon}
              </motion.div>
              <div className="text-4xl md:text-5xl font-bold text-foreground">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
          {/* Rating Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              borderColor: "rgba(var(--primary), 0.3)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-center space-y-3 p-6 rounded-xl bg-card hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, index) => (
                <svg key={index} className="h-6 w-6 fill-primary text-primary" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="text-4xl md:text-5xl font-bold text-foreground">
              4.9/5
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Average Rating
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
