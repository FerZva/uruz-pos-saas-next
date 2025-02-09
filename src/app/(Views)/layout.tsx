"use client";
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../../app/components/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => setMenu(!menu);
  return (
    <div className="flex w-full">
      <Sidebar menu={menu} toggleMenu={toggleMenu} />
      <div className="flex flex-col w-full dark:bg-slate-900">
        <Header toggleMenu={toggleMenu} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
