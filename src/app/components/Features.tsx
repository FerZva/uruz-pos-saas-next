"use client";

import { motion } from "framer-motion";
import { ShoppingCart, BarChart3, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: ShoppingCart,
    title: "Intuitive Interface",
    description:
      "Streamlined design for effortless transactions and management",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Gain deep insights into your business performance in real-time",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized for speed, ensuring smooth operations even during peak hours",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "State-of-the-art encryption and fraud prevention measures",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <section className="py-20">
      <div className="container m-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-1 shadow-lg transition-all duration-300 hover:from-blue-500/20 hover:to-blue-600/20"
            >
              <div className="h-full rounded-lg bg-gray-900/90 p-6 backdrop-blur-sm">
                <feature.icon className="mb-4 h-12 w-12 text-blue-400" />
                <h3 className="mb-2 text-xl font-semibold text-blue-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
