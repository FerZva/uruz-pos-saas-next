"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";

interface HeaderProps {
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  const pathname = usePathname();

  const pageNames: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/products": "Products",
    "/pos": "Point of Sale",
    "/sales": "Sales",
    "/clients": "Clients",
    "/employees": "Employees",
    "/providers": "Providers",
    "/settings": "Settings",
  };

  const pageName = pageNames[pathname] || "page";
  // const isSubscribed = true;
  const { user } = useKindeBrowserClient();
  return (
    <div className="flex justify-between items-center px-8 py-4">
      <div className="flex items-center">
        <Menu className="cursor-pointer" onClick={toggleMenu} />
        <h1 className="text-2xl font-bold ml-4">{pageName}</h1>
      </div>
      {/* <UserButton /> */}
      <div className="flex">
        <ThemeSwitcher />
        {user && (
          <Link
            href="/api/auth/logout"
            className="flex items-center bg-slate-900 p-2 rounded-md text-white ml-2"
          >
            Logout
            <LogOut className="w-4 h-4 ml-2" />
          </Link>
        )}

        {user && (
          <Image
            src={user.picture || ""}
            width={40}
            height={40}
            alt="User Profile"
            className="rounded-full"
          />
        )}

        {!user && (
          <Link
            rel="noreferrer noopener"
            href="/api/auth/login"
            className="bg-slate-900 p-2 rounded-md text-white ml-2"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
