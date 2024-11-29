"use client";

import { useState } from "react";
import { useTheme } from "@/app/hooks/useTheme";
import { Computer, Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setIsOpen(false); // Cierra el dropdown después de seleccionar
  };

  return (
    <div className="relative">
      {/* Botón para abrir el dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-gray-200 dark:bg-slate-800 rounded focus:outline-none"
      >
        {theme === "light" && <Sun />}
        {theme === "dark" && <Moon />}
        {theme === "system" && <Computer />}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
          <button
            onClick={() => handleThemeChange("light")}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
              theme === "light" ? "font-bold" : ""
            }`}
          >
            <Sun />
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
              theme === "dark" ? "font-bold" : ""
            }`}
          >
            <Moon />
          </button>
          <button
            onClick={() => handleThemeChange("system")}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
              theme === "system" ? "font-bold" : ""
            }`}
          >
            <Computer />
          </button>
        </div>
      )}
    </div>
  );
}
