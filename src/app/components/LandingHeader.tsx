"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
// import { useQuery } from "@tanstack/react-query";
// import { isUserSubscribed } from "../(Views)/actions";

const LandingHeader = () => {
  const [menu, setMenu] = useState(false);
  const handleMenu = () => {
    setMenu(!menu);
  };

  // const isSubscribed = true;
  const { isAuthenticated } = useKindeBrowserClient();
  // const { data } = useQuery({
  //   queryKey: ["isUserSubscribed"],
  //   queryFn: async () => isUserSubscribed(),
  // });
  // const isSubscribed = data?.subscribed;
  return (
    <>
      <header className="hidden md:flex justify-between bg-black py-1 px-2">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/POSLogo.png"
            alt="Point of sale Logo"
            width={30}
            height={20}
          />
          <h1 className="ml-2 font-bold">URUZ POS</h1>
        </div>
        {/* End Logo */}
        {/* Navigation Menu */}
        <nav className="flex flex-row items-center">
          <Link href="#" className="mx-2">
            Features
          </Link>
          <Link href="#" className="mx-2">
            Testimonies
          </Link>
          <Link href="#" className="mx-2">
            How it works
          </Link>
          <Link href="#" className="mx-2">
            Pricing
          </Link>
        </nav>
        {/* End Navigation Menu */}
        {/* Sign In - Sign Up */}
        <div className="flex">
          {isAuthenticated && (
            <Link
              href="/api/auth/logout"
              className="flex items-center bg-orange-500 p-2 rounded-md text-white"
            >
              Logout
              <LogOut className="w-4 h-4 ml-2" />
            </Link>
          )}

          {isAuthenticated && (
            <Link
              rel="noreferrer noopener"
              href="/dashboard"
              className="bg-orange-500 p-2 mx-2 rounded-md text-white"
            >
              Dashboard
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              rel="noreferrer noopener"
              href="/api/auth/login"
              className="bg-orange-500 p-2 mx-2 rounded-md text-white"
            >
              Login
            </Link>
          )}
        </div>
        {/* End Sign In - Sign Up */}
      </header>
      <header className="flex md:hidden justify-between relative bg-black py-1 px-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <Image
              src="/POSLogo.png"
              alt="Point of sale Logo"
              width={30}
              height={20}
            />
            <h1 className="ml-2 font-bold">URUZ POS</h1>
          </div>

          <button onClick={handleMenu}>
            <Menu />
          </button>
        </div>
        <nav
          className={`${
            menu ? "flex transition-all" : "hidden"
          } fixed top-0 left-0 min-h-screen flex-col items-center bg-slate-800 z-50 py-1 px-2`}
        >
          <div className="flex justify-between w-[300px] mb-8">
            <div className="flex items-center">
              <Image
                src="/POSLogo.png"
                alt="Point of sale Logo"
                width={30}
                height={20}
              />
              <h1 className="ml-2 font-bold">URUZ POS</h1>
            </div>
            <button onClick={handleMenu}>
              <X />
            </button>
          </div>
          <div className="flex mb-8">
            {isAuthenticated && (
              <Link
                href="/api/auth/logout"
                className="flex items-center bg-orange-500 p-2 rounded-md text-white"
              >
                Logout
                <LogOut className="w-4 h-4 ml-2" />
              </Link>
            )}

            {isAuthenticated && (
              <Link
                rel="noreferrer noopener"
                href="/dashboard"
                className="bg-orange-500 p-2 mx-2 rounded-md text-white"
              >
                Dashboard
              </Link>
            )}

            {!isAuthenticated && (
              <Link
                rel="noreferrer noopener"
                href="/api/auth/login"
                className="bg-orange-500 p-2 mx-2 rounded-md text-white"
              >
                Login
              </Link>
            )}
          </div>
          <div className="flex flex-col items-center">
            <Link href="#" className="mx-2 mb-2">
              Features
            </Link>
            <Link href="#" className="mx-2 mb-2">
              Testimonies
            </Link>
            <Link href="#" className="mx-2 mb-2">
              How it works
            </Link>
            <Link href="#" className="mx-2 mb-2">
              Pricing
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default LandingHeader;
