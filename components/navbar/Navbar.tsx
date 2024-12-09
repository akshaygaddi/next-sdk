'use client'

import React, { useState, useEffect, startTransition } from "react";
import { Home, Users, DoorOpen, User2, Settings, Bell, LogOut, Menu, Sun, Moon, Target } from "lucide-react";
import { useTheme } from 'next-themes';
import { redirect, usePathname, useRouter } from "next/navigation";
import Link from 'next/link';
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { logout } from "@/app/auth/signout/action";


const MENU_ITEMS = [
  { id: 'home', name: 'Home', icon: Home, path: '/home' },
  { id: 'community', name: 'Community', icon: Users, path: '/community' },
  { id: 'rooms', name: 'Rooms', icon: DoorOpen, path: '/rooms' },
  { id: 'about', name: 'About Us', icon: Target, path: '/about' }
];

const PROFILE_MENU_ITEMS = [

  // TODO add the menu items later
  // { id: 'profile', name: 'Profile', icon: User2, path: '/profile' },
  // { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' }
];

interface ProfileMenuProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  user: User | null;
  handleSignOut: () => Promise<void>;
}

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="relative group cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
          <span className="text-white font-bold text-xl">S</span>
        </div>
      </div>
    </div>
    <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
      SkillBridge
    </span>
  </div>
);

interface NavItemProps {
  item: {
    id: string;
    name: string;
    icon: any;
    path: string;
  };
  onClick: (id: string) => void;
  onHover: (id: string | null) => void;
}

const NavItem = ({ item, onClick, onHover }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === item.path;

  return (
    <Link href={item.path}>
      <button
        onClick={() => onClick(item.id)}
        onMouseEnter={() => onHover(item.id)}
        onMouseLeave={() => onHover(null)}
        className={`relative group flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-600 dark:text-orange-400'
            : 'hover:bg-orange-50 dark:hover:bg-orange-900/20'
        }`}
      >
        <item.icon className={`w-5 h-5 transition-all duration-300 ${
          isActive ? 'text-orange-600 dark:text-orange-400 scale-110' : 'group-hover:scale-110'
        }`} />
        <span className={`font-medium ${
          isActive ? 'bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent' : ''
        }`}>{item.name}</span>
        {isActive && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
        )}
      </button>
    </Link>
  );
};

const NotificationBell = () => (
  <button className="relative p-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 group">
    <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
    <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
  </button>
);





// Add ThemeToggle component
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 group"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      )}
    </button>
  );
};

const ProfileMenu = ({ isOpen, onToggle, user, handleSignOut }: ProfileMenuProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onToggle(false);
      setIsClosing(false);
    }, 200);
  };

  const handleMenuItemClick = async (item: { id: string; path?: string }) => {
    if (item.id === "logout") {
      setIsLoggingOut(true);
      try {
        await handleSignOut();
      } finally {
        setIsLoggingOut(false);
        handleClose();
      }
    } else if (item.path) {
      router.push(item.path);
      handleClose();
    }
  };


useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (isOpen && !(event.target as Element).closest('.profile-menu')) {
      handleClose();
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isOpen]);

if (!isOpen) return null;

return (
  <div
    className={`profile-menu absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-orange-100 dark:border-orange-900/30 overflow-hidden transform transition-all duration-200 ${
      isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
    }`}>
    <div
      className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-b border-orange-100 dark:border-orange-900/30">
      <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
      <p className="text-sm font-medium">{user?.user?.email}</p>
    </div>
    <div className="p-2">
      {PROFILE_MENU_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => handleMenuItemClick(item)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 group"
        >
          <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-medium">{item.name}</span>
        </button>
      ))}
      <button
        onClick={() => handleMenuItemClick({ id: "logout" })}
        disabled={isLoggingOut}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoggingOut ? (
          <>
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">Signing out...</span>
          </>
        ) : (
          <>
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-medium">Logout</span>
          </>
        )}
      </button>
    </div>
  </div>
);
};

interface ElasticNavbarProps {
  user: User | null;
}

const ElasticNavbar = ({ user }) => {
  const [activeNav, setActiveNav] = useState("home");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logout();

      if (result.success) {
        toast({
          title: "Successfully logged out",
          description: "Please Visit Again!",
          variant: "default"
        });
        router.push("/home");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };


  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  if (!user.user) {
    return (
      <nav className={`fixed w-full top-0 z-50 px-4 py-3 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="relative px-6 py-3">
              <div className="flex items-center justify-between">
              <Logo />
                <div className="flex items-center gap-6">
                  {/* Theme Toggle */}
                  <ThemeToggle />

                  {/* Auth Buttons */}
                  <div className="flex gap-4">
                    {/* Sign In - Primary Button */}
                    <Link href="/auth/login">
                      <button className="relative group px-6 py-2 overflow-hidden rounded-xl">
                        {/* Animated gradient background */}
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:via-amber-600 group-hover:to-orange-600 transition-all duration-300"></div>

                        {/* Shimmering effect overlay */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>

                        {/* Button content */}
                        <div className="relative flex items-center gap-2">
                          <span className="text-white font-medium">Sign In</span>
                        </div>

                        {/* Subtle border glow */}
                        <div
                          className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-orange-500/50 to-amber-500/50 blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                      </button>
                    </Link>

                    {/* Sign Up - Secondary Button */}
                    <Link href="/auth/signup">
                      <button
                        className="relative group px-6 py-2 overflow-hidden rounded-xl border border-orange-500/20 dark:border-orange-400/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:border-orange-500/50 dark:hover:border-orange-400/50 transition-all duration-300">
                        {/* Hover overlay */}
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/5 group-hover:to-amber-500/5 transition-all duration-300"></div>

                        {/* Button content */}
                        <div className="relative flex items-center gap-2">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent font-medium">
                Sign Up
              </span>
                        </div>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed w-full top-0 z-50 px-4 py-3 transition-transform duration-300 ${
      isVisible ? "translate-y-0" : "-translate-y-full"
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-lg">
          <div
            className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 rounded-2xl animate-gradient-x"></div>

          <div className="relative px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Logo />
                <div className="hidden md:flex items-center gap-3">
                  {MENU_ITEMS.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      onClick={setActiveNav}
                      onHover={setHoveredItem}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <ThemeToggle />
                <NotificationBell />

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                  >
                    <div className="relative group">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
                      <div
                        className="relative w-9 h-9 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-0.5 transform group-hover:scale-105 transition-transform duration-300">
                        <div
                          className="w-full h-full rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center">
                          <span className="text-sm font-medium text-orange-600">
                           {user?.user?.email?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                  <ProfileMenu
                    isOpen={isProfileOpen}
                    onToggle={setIsProfileOpen}
                    user={user}
                    handleSignOut={handleSignOut}
                  />

                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${
              isMobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'
            }`}>
              <div className="space-y-2 pb-4">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveNav(item.id);
                      setIsMobileMenuOpen(false);
                      router.push(item.path);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                      activeNav === item.id
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'
                        : 'hover:bg-orange-50 dark:hover:bg-orange-900/20'
                    } transition-all duration-200`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default ElasticNavbar;