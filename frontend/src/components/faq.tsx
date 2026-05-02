"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const faqData = [
  {
    id: 1,
    question: "How do I get started with Linkup?",
    answer: "Getting started is easy! Simply sign up with your Google account, create your profile, and join communities that interest you. You can start chatting immediately with other members."
  },
  {
    id: 2,
    question: "Can I create my own community?",
    answer: "Yes! Pro and Enterprise users can create and manage their own communities. You'll have access to moderation tools, custom branding, and member management features."
  },
  {
    id: 3,
    question: "Is Linkup free to use?",
    answer: "Linkup offers a free tier with basic features, plus paid plans for advanced functionality. You can start with the free plan and upgrade as your needs grow."
  },
  {
    id: 4,
    question: "How secure is my data on Linkup?",
    answer: "We take security seriously. All conversations are encrypted, we follow GDPR compliance, and we never sell your data. Your privacy is our top priority."
  },
  {
    id: 5,
    question: "Can I use Linkup on mobile?",
    answer: "Yes! Linkup works on all modern web browsers and we have native mobile apps for iOS and Android. You can chat on the go from any device."
  },
  {
    id: 6,
    question: "How do I report inappropriate content?",
    answer: "We have robust moderation tools and a dedicated team to handle reports. You can report any inappropriate content directly in the app, and we'll take immediate action."
  }
];

const FAQItem = ({ 
  item, 
  isOpen, 
  onToggle 
}: { 
  item: typeof faqData[0]; 
  isOpen: boolean; 
  onToggle: () => void;
}) => {
  return (
    <motion.div 
      className="rounded-lg overflow-hidden hover:bg-white/5 transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ 
        borderColor: "rgba(var(--primary), 0.3)",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.button
        onClick={onToggle}
        className="w-full cursor-pointer px-6 py-4 text-left flex items-center justify-between hover:bg-accent/50 transition-colors"
        whileHover={{ backgroundColor: "rgba(var(--accent), 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <span className="font-medium text-foreground">{item.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 text-muted-foreground leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

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
      y: 30
    },
    visible: {
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <section id="faq" className="py-20 lg:py-24">
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
            FAQ
          </motion.div>
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-semibold tracking-tight"
          >
            Frequently asked questions
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4"
          >
            Got questions? We've got answers. Find everything you need to know about Linkup.
          </motion.p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqData.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openItems.includes(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </motion.div>

        {/* Still Have Questions */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <motion.div 
            className="inline-flex items-center gap-2 text-primary font-medium cursor-pointer border border-primary/25 px-4 py-2 rounded-lg hover:border-primary/60 hover:bg-primary/5 transition-all duration-200"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Contact our support team
            <motion.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ x: [0, 3, 0] }}
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
