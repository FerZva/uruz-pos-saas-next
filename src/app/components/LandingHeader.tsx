"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
// import { useQuery } from "@tanstack/react-query";
// import { isUserSubscribed } from "../(Views)/actions";

const navItems = [
  { name: "Home", href: "#" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

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
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-blue-400">
                URUZ POS
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden md:block">
              {isAuthenticated && (
                <Link href="/api/auth/logout">
                  <Button className="mx-1 bg-blue-500 hover:bg-blue-600 text-white">
                    Logout
                  </Button>
                </Link>
              )}
              {isAuthenticated && (
                <Link rel="noreferrer noopener" href="/dashboard">
                  <Button className="mx-1 bg-blue-500 hover:bg-blue-600 text-white">
                    Dashboard
                  </Button>
                </Link>
              )}
              {!isAuthenticated && (
                <Link rel="noreferrer noopener" href="/api/auth/login">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Login
                  </Button>
                </Link>
              )}
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated && (
                <Link href="/api/auth/logout">
                  <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                    Logout
                  </Button>
                </Link>
              )}
              {isAuthenticated && (
                <Link rel="noreferrer noopener" href="/dashboard">
                  <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                    Dashboard
                  </Button>
                </Link>
              )}
              {!isAuthenticated && (
                <Link rel="noreferrer noopener" href="/api/auth/login">
                  <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                    Login
                  </Button>
                </Link>
              )}
              {/* <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                Get Started
              </Button> */}
            </div>
          </motion.div>
        )}
      </motion.header>
      {/* <header className="flex md:hidden justify-between relative bg-black py-1 px-2">
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
      </header> */}
    </>
  );
};

export default LandingHeader;
