import React from "react";
import Header from "../components/Header";
import Sidebar from "@/app/components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default layout;
