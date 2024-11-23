"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className=" relative overflow-hidden bg-black py-20 md:py-32">
      <div className="m-auto container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="mb-6 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            Next Generation URUZ POS System
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
            Transform your business with our advanced point of sale solution.
            Powerful features, real-time analytics, and seamless integration.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-orange-500 hover:bg-orange-600">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="border-orange-500 text-orange-500 hover:bg-orange-950">
              Watch Demo
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16"
        >
          <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-1">
            <div className="h-full w-full rounded-lg bg-gray-900/90 p-4">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="mt-4 grid grid-cols-12 gap-4">
                <div className="col-span-3 space-y-4">
                  <div className="h-8 rounded bg-gray-800" />
                  <div className="h-8 rounded bg-gray-800" />
                  <div className="h-8 rounded bg-gray-800" />
                  <div className="h-8 rounded bg-gray-800" />
                </div>
                <div className="col-span-9 rounded-lg bg-gray-800 p-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg bg-gray-700"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,139,0,0.1),transparent_50%)]" />
    </section>
  );
}
