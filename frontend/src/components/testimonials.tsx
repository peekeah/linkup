"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "UX Designer",
    avatar: "SJ",
    content: "Linkup has completely transformed how I connect with other designers. The communities are vibrant and the conversations are always meaningful.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Developer",
    avatar: "MC",
    content: "Finally found a platform where technical discussions stay focused and productive. The private chat feature is perfect for deep-dive conversations.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Product Manager",
    avatar: "ER",
    content: "The quality of connections I've made through Linkup has been incredible. It's like having a focused professional network at your fingertips.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Data Scientist",
    avatar: "DK",
    content: "What sets Linkup apart is the thoughtful community design. No noise, just genuine conversations with people who share your interests.",
    rating: 5,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Marketing Lead",
    avatar: "LT",
    content: "I've connected with so many brilliant minds here. The platform makes it easy to find your tribe and have meaningful discussions.",
    rating: 5,
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Startup Founder",
    avatar: "JW",
    content: "Linkup has become my go-to platform for networking and finding collaborators. The quality of people here is unmatched.",
    rating: 5,
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating
              ? "fill-primary text-primary"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
};

export const Testimonials = () => {
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
      x: -50,
      scale: 0.9
    },
    visible: {
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
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
            Loved by professionals worldwide
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4"
          >
            See what our community members have to say about their Linkup experience
          </motion.p>
        </motion.div>

        {/* Testimonials Scrolling Container */}
        <div className="relative overflow-hidden">
          <motion.div 
            className="flex gap-8"
            animate={{ x: [0, -320 * testimonials.length] }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop"
            }}
          >
            {/* Duplicate testimonials for seamless loop */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={`${testimonial.id}-${index}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.02,
                  borderColor: "rgba(var(--primary), 0.3)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex-shrink-0 w-80 p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-200"
              >
                <div className="space-y-4">
                  {/* Rating */}
                  <StarRating rating={testimonial.rating} />

                  {/* Content */}
                  <blockquote className="text-sm leading-relaxed text-muted-foreground">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-2">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div>
                      <div className="font-medium text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

              </div>
    </section>
  );
};
