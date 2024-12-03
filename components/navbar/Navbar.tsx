import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { logout } from "@/app/auth/signout/action";
import { getUserData } from "@/utils/getSupabase/getServer";
import React from "react";
import { DarkModeToggle } from "@/components/darkMode/DarkModeToggle";

const Navbar = async () => {
  const { user } = await getUserData();

  return (
    <nav className="w-full bg-white dark:bg-neutral-dark shadow-md dark:shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" aria-label="Go to Home">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer">
                Skill Bridge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {["Home", "Community", "Rooms", "About Us"].map((item, index) => (
              <Link
                key={index}
                href={`/${item.toLowerCase().replace(" ", "")}`}
                className="p-2 text-neutral-dark dark:text-white hover:bg-neutral-light/70 dark:hover:bg-neutral-dark  rounded-md transition"
                aria-label={`Go to ${item}`}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative hidden md:flex items-center bg-neutral-light dark:bg-neutral-dark rounded-full px-4 py-2 shadow-sm">
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              className="bg-transparent border-none focus:outline-none text-neutral-dark dark:text-neutral-light w-48"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-neutral-dark dark:text-neutral-light">
                  {user.email}
                </span>
                <form>
                  <Button
                    className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-md transition flex items-center"
                    formAction={logout}
                  >
                    Logout
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </form>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/auth/login" aria-label="Login">
                  <Button variant="outline" className="px-4 py-2">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" aria-label="Sign Up">
                  <Button variant="default" className="px-4 py-2">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Mobile Menu */}
            <button
              className="md:hidden text-neutral-dark dark:text-neutral-light focus:outline-none"
              aria-label="Toggle Menu"
            >
              {/* Add hamburger menu icon */}
              <div className="space-y-2">
                <span className="block w-6 h-0.5 bg-current"></span>
                <span className="block w-6 h-0.5 bg-current"></span>
                <span className="block w-6 h-0.5 bg-current"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 space-y-2">
          {["Home", "Community", "Room", "About Us"].map((item, index) => (
            <Link
              key={index}
              href={`/${item.toLowerCase().replace(" ", "")}`}
              className="block text-neutral-dark dark:text-neutral-light px-4 py-2 rounded-md hover:red-500 dark:hover:bg-neutral-dark transition"
              aria-label={`Go to ${item}`}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
