"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
// import { Switch } from "@/components/ui/switch";
// import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-blue-400" />
        )}
      </button> 
    </div>
  );
}
