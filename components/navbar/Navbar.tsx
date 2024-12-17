'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home, Users, DoorOpen, LogOut, Menu, Sun, Moon, Target, X, ChevronLeft
} from "lucide-react";

// Menu items remain the same...
const MENU_ITEMS = [
  { id: "home", name: "Home", icon: Home, path: "/home" },
  { id: "community", name: "Community", icon: Users, path: "/community" },
  { id: "rooms", name: "Rooms", icon: DoorOpen, path: "/rooms" },
  { id: "about", name: "About Us", icon: Target, path: "/about" },

];

// Enhanced Logo Component
const Logo = () => (
  <Link href="/home">
    <div className="group flex items-center gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-secondary opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
        <div className="relative h-full w-full flex items-center justify-center font-bold text-white text-xl">
          D
        </div>
      </div>
      <span className="font-semibold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Domora
      </span>
    </div>
  </Link>
);

// Improved NavItem Component
const NavItem = ({ item, isActive }) => {
  return (
    <Link href={item.path}>
      <div className={`
        group flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300
        ${isActive
        ? 'bg-primary/10 text-primary'
        : 'hover:bg-muted/80'
      }
      `}>
        <item.icon className={`w-5 h-5 ${
          isActive
            ? 'text-primary'
            : 'text-muted-foreground group-hover:text-foreground'
        }`} />
        <span className={`font-medium ${
          isActive
            ? 'text-primary'
            : 'text-muted-foreground group-hover:text-foreground'
        }`}>
          {item.name}
        </span>
      </div>
    </Link>
  );
};

// Enhanced Theme Toggle
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl hover:bg-muted/80 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-orange-400" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

// First, define pages that should hide navbar immediately
const IMMEDIATE_HIDE_PAGES = [
  '/rooms',  // Add your specific pages here
  '/community',
  '/home',
  '/about'
];

// Modified scroll behavior hook with immediate hide config
const useScrollBehavior = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const pathname = usePathname();

  // Check if current page should hide navbar immediately
  // Check if current path matches any of the immediate hide patterns
  const shouldHideImmediately = IMMEDIATE_HIDE_PAGES.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (currentScrollY / totalScrollHeight) * 100;
      const scrollDelta = currentScrollY - lastScrollY;
      const newDirection = scrollDelta > 0 ? 'down' : 'up';
      const scrollSpeed = Math.abs(scrollDelta) / totalScrollHeight;

      if (shouldHideImmediately) {
        // For immediate hide pages, hide navbar as soon as scrolling down starts
        if (currentScrollY > 0 && newDirection === 'down') {
          setIsVisible(false);
        } else if (
          (newDirection === 'up' && scrollSpeed > 0.05) ||
          (newDirection === 'up' && (lastScrollY - currentScrollY) / window.innerHeight > 0.1) ||
          currentScrollY < 100
        ) {
          setIsVisible(true);
        }
      } else {
        // Original behavior for other pages
        if (
          (newDirection === 'up' && scrollSpeed > 0.05) ||
          (newDirection === 'up' && (lastScrollY - currentScrollY) / window.innerHeight > 0.1) ||
          currentScrollY < 100 ||
          scrollPercentage < 30
        ) {
          setIsVisible(true);
        } else if (scrollPercentage > 30 && newDirection === 'down') {
          setIsVisible(false);
        }
      }

      setScrollDirection(newDirection);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, shouldHideImmediately, pathname]);

  return isVisible;
};



// Enhanced Mobile Menu with Animations and Gestures
const MobileMenu = ({ isOpen, onClose, children }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum distance for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;

    if (isLeftSwipe) {
      onClose();
    }
  };

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-background/80 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`
          fixed top-[3.5rem] right-0 h-[calc(100vh-3.5rem)] w-full max-w-sm
          bg-background border-l z-50
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Close Menu</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

// Improved Profile Menu
const ProfileMenu = ({ user, isOpen, onClose, handleSignOut }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-card border shadow-lg py-2 animate-in slide-in-from-top-2 duration-200">
      <div className="px-4 py-3 border-b">
        <p className="text-sm text-muted-foreground">Signed in as</p>
        <p className="text-sm font-medium truncate mt-0.5">{user?.user?.email}</p>
      </div>
      <div className="p-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );
};

// Responsive Navbar Component
const ImprovedNavbar = ({ user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isVisible = useScrollBehavior();

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    // Your existing sign out logic
  };

  const navbarClasses = `
    fixed top-0 w-full z-50 transition-all duration-300
    ${isVisible ? 'translate-y-0' : '-translate-y-full'}
  `;

  // Auth navigation version
  if (!user?.user) {
    return (
      <nav className={navbarClasses}>
        <div className="bg-background/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 sm:h-16 items-center justify-between">
              <Logo />
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="hidden sm:flex items-center gap-3">
                  <Link href="/auth/login">
                    <button className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl bg-primary text-white hover:bg-primary/90 transition-all duration-300">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl border-2 border-primary/20 hover:bg-primary/10 transition-all duration-300">
                      Sign Up
                    </button>
                  </Link>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="sm:hidden p-2 rounded-xl hover:bg-muted/80 transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile auth menu */}
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          <div className="space-y-3">
            <Link href="/auth/login" className="block">
              <button className="w-full px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup" className="block">
              <button className="w-full px-5 py-2.5 rounded-xl border-2 border-primary/20 hover:bg-primary/10 transition-all">
                Sign Up
              </button>
            </Link>
          </div>
        </MobileMenu>
      </nav>
    );
  }

  // Main navigation version
  return (
    <nav className={navbarClasses}>
      <div className="bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-8">
              <Logo />
              <div className="hidden md:flex items-center gap-2">
                {MENU_ITEMS.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={pathname === item.path || (item.path === '/rooms' && pathname.startsWith('/rooms/'))}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted/80 transition-all duration-300"
                >
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-medium">
                    {user?.user?.email?.[0]?.toUpperCase()}
                  </div>
                </button>
                <ProfileMenu
                  user={user}
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  handleSignOut={handleSignOut}
                />
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-muted/80 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <div className="space-y-1">
          {MENU_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={pathname === item.path}
            />
          ))}
        </div>
      </MobileMenu>
    </nav>
  );
};

export default ImprovedNavbar;