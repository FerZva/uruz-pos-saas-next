"use client";
import React, { useState } from "react";
import Image from "next/image";
import { navigation } from "../services/navigation";
import Link from "next/link";
import { Sidebar } from "lucide-react";

const Siderbar = () => {
  const [menu, setMenu] = useState(false);

  const toogleMenu = () => {
    setMenu(!menu);
  };

  return (
    <div
      className={`w-full ${
        menu ? "max-w-[300px]" : "max-w-[100px]"
      } min-h-screen border border-slate-200`}
    >
      <div
        className={`flex justify-between ${
          menu ? "flex-row" : "flex-col"
        } items-center p-2`}
      >
        <div>
          <Image
            src="/POSLogo.png"
            width={500}
            height={500}
            alt="POS System Logo"
            className="max-w-10"
          />
        </div>
        <div>
          <Sidebar
            className={`text-[25px] cursor-pointer ${menu ? "" : "mt-2"}`}
            onClick={toogleMenu}
          />
        </div>
      </div>
      <nav className="flex flex-col m-auto p-2">
        {navigation.map((item) => (
          <Link
            key={item.linkId}
            href={item.linkUrl}
            className="rounded-md px-1 py-[0.60rem] flex items-center my-2 hover:bg-slate-300"
          >
            <item.linkIcon className={`${menu ? "" : "m-auto"} text-[25px]`} />
            <p className={`${menu ? "ml-4" : ""}`}>
              {menu ? item.linkName : ""}
            </p>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Siderbar;
