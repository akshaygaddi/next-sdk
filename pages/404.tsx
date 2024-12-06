'use client'
import React, { useState, useEffect } from 'react';
import { Home, Search, RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const NotFoundPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) * 0.05,
        y: (e.clientY - window.innerHeight / 2) * 0.05
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSearchClick = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4 py-16 flex flex-col items-center text-center">
        {/* 404 Text with Glitch Effect */}
        <div className="relative mb-8">
          <div className="text-[12rem] font-bold leading-none select-none">
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent relative inline-block">
              4
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent blur-sm opacity-75"
                    style={{
                      transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
                    }}
              >4</span>
            </span>
            <span className="animate-bounce inline-block">0</span>
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent relative inline-block">
              4
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent blur-sm opacity-75"
                    style={{
                      transform: `translate(${mousePosition.x * -0.1}px, ${mousePosition.y * -0.1}px)`
                    }}
              >4</span>
            </span>
          </div>
        </div>

        {/* Message Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-2xl">
            <MessageSquare className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Oops! Room Not Found
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-lg">
          Looks like this conversation has moved or doesn't exist.
          Let's get you back to where the discussions are happening!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/">
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-6 text-lg rounded-xl"
            >
              <Home className="mr-2" />
              Go Home
            </Button>
          </Link>

          <Button
            variant="outline"
            className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-orange-500/10 relative"
            onClick={handleSearchClick}
          >
            <Search className={`mr-2 ${isSearching ? 'animate-spin' : ''}`} />
            Search Rooms
          </Button>

          <Button
            variant="outline"
            className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-orange-500/10"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2" />
            Refresh Page
          </Button>
        </div>

        {/* Interactive Elements */}
        <div className="mt-16 flex items-center justify-center gap-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;