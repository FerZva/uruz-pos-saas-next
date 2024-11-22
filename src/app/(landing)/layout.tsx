import React from "react";
import LandingHeader from "../components/LandingHeader";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <LandingHeader />
      {children}
    </div>
  );
};

export default layout;
