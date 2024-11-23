import React from "react";
import LandingHeader from "../components/LandingHeader";
import Footer from "@/app/components/Footer";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <LandingHeader />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
