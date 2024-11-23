"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    features: ["1 Register", "Basic Analytics", "24/7 Support", "Cloud Backup"],
  },
  {
    name: "Professional",
    price: "$99",
    features: [
      "3 Registers",
      "Advanced Analytics",
      "Priority Support",
      "Inventory Management",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited Registers",
      "Custom Analytics",
      "Dedicated Support",
      "Custom Integration",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="bg-black py-20">
      <div className="container m-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold text-white md:text-4xl"
        >
          Simple, Transparent Pricing
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-1"
            >
              <div className="h-full rounded-lg bg-gray-900/90 p-6">
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {plan.name}
                </h3>
                <div className="mb-4 text-3xl font-bold text-orange-500">
                  {plan.price}
                </div>
                <ul className="mb-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2 text-gray-400"
                    >
                      <Check className="h-5 w-5 text-orange-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-orange-500 hover:bg-orange-600">
                  Get Started
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
