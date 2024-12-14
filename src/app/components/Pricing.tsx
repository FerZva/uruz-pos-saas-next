"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { features } from "process";

export default function Pricing() {
  const [prices, setPrices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        const data = await res.json();
        setPrices(data);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    }
    fetchPrices();
  }, []);

  return (
    <section className="py-20">
      <div className="container m-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold text-blue-300 md:text-4xl"
        >
          Transparent Pricing for Every Business
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3 m-auto">
          {prices.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-1 shadow-lg"
            >
              <div className="h-full rounded-lg bg-gray-900/90 p-6 backdrop-blur-sm">
                <h3 className="mb-2 text-xl font-semibold text-blue-300">
                  {plan.nickname}
                </h3>
                <div className="mb-4 text-3xl font-bold text-white">
                  <ul className="mb-6 space-y-4">
                    {plan.product.marketing_features?.map(
                      (feature: any, index: number) => (
                        <li
                          className="flex items-center gap-2 text-gray-300 text-[20px]"
                          key={index}
                        >
                          <Check className="h-5 w-5 text-blue-400" />
                          {feature.name}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="mb-4 text-3xl font-bold text-white">
                  ${plan.unit_amount! / 100}
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-700">
                  Get Started
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
