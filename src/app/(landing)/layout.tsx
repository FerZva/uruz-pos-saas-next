import React from "react";
import Header from "../components/Header";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <Header />
      {children}
    </div>
  );
};

export default layout;
