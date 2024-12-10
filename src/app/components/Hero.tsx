"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container relative z-10 m-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="mb-6 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            Elevate Your Business with URUZ POS System
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
            Experience the future of point-of-sale systems. Seamless
            transactions, powerful analytics, and unparalleled efficiency all in
            one elegant solution.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-700"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-500 text-blue-400 transition-all duration-300 hover:bg-blue-950 hover:text-blue-300"
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="mt-16"
        >
          <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-1 shadow-2xl">
            <div className="h-full w-full rounded-lg bg-gray-900/90 p-4 backdrop-blur-sm">
              <Image
                alt="URUZ Point of sale system photo preview"
                src="/preview.png"
                className="w-full"
                width={1000}
                height={1500}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_70%)]" />
    </section>
  );
}
