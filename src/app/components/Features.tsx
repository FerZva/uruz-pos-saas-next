"use client";

import { motion } from "framer-motion";
import { ShoppingCart, BarChart3, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: ShoppingCart,
    title: "Intuitive Interface",
    description:
      "Simple and easy-to-use interface designed for speed and efficiency",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Get instant insights into your sales, inventory, and customer behavior",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Process transactions quickly with our optimized system architecture",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Enterprise-grade security for all your payment processing needs",
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
    <section className="bg-black py-20">
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
              className="group rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-1"
            >
              <div className="h-full rounded-lg bg-gray-900/90 p-6">
                <feature.icon className="mb-4 h-12 w-12 text-orange-500" />
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
