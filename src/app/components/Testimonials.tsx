"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "This POS system has revolutionized how we handle transactions. It's fast, reliable, and our staff love using it.",
    author: "Sarah Johnson",
    role: "Restaurant Owner",
  },
  {
    quote:
      "The analytics features have given us invaluable insights into our business performance. Highly recommended!",
    author: "Michael Chen",
    role: "Retail Manager",
  },
  {
    quote:
      "Customer support is outstanding. Any issues we've had were resolved quickly and professionally.",
    author: "Emily Rodriguez",
    role: "Store Owner",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-black py-20">
      <div className="container m-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold text-white md:text-4xl"
        >
          What Our Customers Say
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-1"
            >
              <div className="h-full rounded-lg bg-gray-900/90 p-6">
                <p className="mb-4 text-gray-400">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-800">
                    <Image
                      src="/placeholder.svg"
                      alt={testimonial.author}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
