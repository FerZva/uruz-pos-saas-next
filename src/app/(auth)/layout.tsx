import React from "react";
import Header from "../components/Header";

const ViewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex justify-center items-center">{children}</div>
  );
};

export default ViewLayout;
