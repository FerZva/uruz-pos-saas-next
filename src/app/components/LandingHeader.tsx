"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";

const LandingHeader = () => {
  // const isSubscribed = true;
  const { isAuthenticated } = useKindeBrowserClient();
  return (
    <div className="flex justify-between">
      <h1>Header</h1>
      {/* <UserButton /> */}
      <div className="flex">
        {isAuthenticated && (
          <Link
            href="/api/auth/logout"
            className="flex items-center bg-slate-900 p-2 rounded-md text-white"
          >
            Logout
            <LogOut className="w-4 h-4 ml-2" />
          </Link>
        )}

        {!isAuthenticated && (
          <Link
            rel="noreferrer noopener"
            href="/api/auth/login"
            className="bg-slate-900 p-2 rounded-md text-white"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default LandingHeader;
