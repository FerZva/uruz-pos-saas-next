"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "$1M+", label: "Daily Sales" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export default function Stats() {
  return (
    <section className="py-20">
      <div className="container m-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-4xl font-bold text-blue-400"
              >
                {stat.value}
              </motion.div>
              <motion.div
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
                className="mt-2 text-gray-300"
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
