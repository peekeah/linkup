import { IconMessage, IconShieldLock, IconUsers } from "@tabler/icons-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const featuresList = [
  {
    icon: <IconUsers size={20} />,
    title: "Communities",
    description: "Discover and join communities of shared interests. Engage in meaningful group conversations with people who get you."
  },
  {
    icon: <IconMessage size={20} />,
    title: "Private Chat",
    description: "Real-time one-on-one conversations in a smooth, distraction-free chat experience designed for focus."
  },
  {
    icon: <IconShieldLock size={20} />,
    title: "Security",
    description: "Your conversations are yours. Strong privacy and security so you can communicate without compromise."
  }
];

export const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
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
    <section id="features" className="py-20 lg:py-24">
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
            Features
          </motion.div>
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-semibold tracking-tight"
          >
            Everything you need to connect
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4"
          >
            Built for meaningful conversation, not noise
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {featuresList.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                borderColor: "rgba(var(--primary), 0.4)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-card/60 border rounded-2xl p-6 space-y-4 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
            >
              <motion.div 
                className="p-3 bg-primary/10 w-fit rounded-xl text-muted-foreground group-hover:text-primary transition-colors duration-200"
              >
                {feature.icon}
              </motion.div>
              <div>
                <h3 className="text-base font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

