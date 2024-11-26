"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Laptop } from "lucide-react";

export default function ThemeToggleDropdown() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary p-2 rounded-full"
        aria-label="Select theme"
      >
        {theme === "dark" && <Moon className="h-5 w-5" />}
        {theme === "light" && <Sun className="h-5 w-5" />}
        {theme === "system" && <Laptop className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-1 bg-background-card dark:bg-dark-background-card rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-primary/10 dark:hover:bg-dark-primary/10
                  ${theme === option.value ? "text-primary dark:text-dark-primary" : "text-text dark:text-dark-text"}`}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
