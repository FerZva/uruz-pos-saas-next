import React from "react";
import { HeroSection } from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Stats from "../components/Stats";
import Pricing from "../components/Pricing";

const LandingPage = async () => {
  return (
    <main className=" flex flex-col justify-center">
      <HeroSection />
      <Features />
      <Stats />
      <Testimonials />
      <Pricing />
    </main>
  );
};

export default LandingPage;
