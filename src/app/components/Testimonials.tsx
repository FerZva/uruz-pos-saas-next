"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "This POS system has transformed our business operations. It's intuitive, fast, and incredibly reliable.",
    author: "Sarah Johnson",
    role: "Restaurant Owner",
  },
  {
    quote:
      "The analytics features provide invaluable insights. It's like having a business consultant on demand.",
    author: "Michael Chen",
    role: "Retail Manager",
  },
  {
    quote:
      "Customer support is unparalleled. Any issues are resolved swiftly, keeping our business running smoothly.",
    author: "Emily Rodriguez",
    role: "Store Owner",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="container m-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold text-blue-300 md:text-4xl"
        >
          Trusted by Industry Leaders
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-1 shadow-lg"
            >
              <div className="h-full rounded-lg bg-gray-900/90 p-6 backdrop-blur-sm">
                <p className="mb-4 text-gray-300">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-blue-500 p-[2px]">
                    <div className="h-full w-full rounded-full bg-gray-900">
                      <Image
                        src="/placeholder.svg"
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-300">
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
