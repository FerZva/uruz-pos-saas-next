"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
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
      <div className="flex items-center">
        {user && (
          <div className="flex items-center">
            <ThemeSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative h-10 w-10 rounded-full ml-4">
                  <Image
                    src={user.picture || ""}
                    width={40}
                    height={40}
                    alt={user.given_name ?? "User"}
                    className="rounded-full w-full"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 dark:bg-slate-800"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.given_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <Link href="/api/auth/logout">
                  <DropdownMenuItem className="cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
