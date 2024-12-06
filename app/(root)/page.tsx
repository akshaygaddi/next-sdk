'use client'
import React, { useCallback, useEffect, useState } from "react";
import {
  Users, MessageSquare, Code, Link, PieChart,
  Mic, Timer, Sparkles, ArrowRight, CheckCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";


export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;

    // Smooth cursor following
    setCursorPosition({
      x: clientX,
      y: clientY
    });

    // Parallax effect
    setMousePosition({
      x: (clientX / window.innerWidth - 0.5) * 30,
      y: (clientY / window.innerHeight - 0.5) * 30
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const roomFeatures = [
    {
      icon: Code,
      title: "Smart Code Sharing",
      description: "Beautiful syntax highlighting and automatic code formatting for seamless technical discussions"
    },
    {
      icon: Link,
      title: "Rich Link Previews",
      description: "Links transform into informative previews, keeping discussions focused and contextual"
    },
    {
      icon: PieChart,
      title: "Instant Polls",
      description: "Create quick polls for group decisions and get immediate community feedback"
    },
    {
      icon: Timer,
      title: "Timed Discussions",
      description: "Set time limits to keep conversations focused and productive"
    },
    {
      icon: Mic,
      title: "Voice Notes",
      description: "Add a personal touch with quick voice messages and audio sharing"
    }
  ];

  return (
    <div className="-mt-24 pt-24 min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-2xl text-white">
                  <MessageSquare className="w-8 h-8" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Redefining Digital
              </span>
              <br />
              <span className="text-gray-800 dark:text-gray-200">
                Conversations
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Experience the future of online discussions with our feature-rich Rooms.
              Connect, share, and engage in meaningful conversations like never before.
            </p>

            <div className="flex items-center justify-center gap-6">
              <Button
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-6 text-lg rounded-xl"
              >
                Join a Room
                <ArrowRight className="ml-2" />
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-orange-500/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Feature Showcase */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Smart Rooms
            </span>
            <span className="text-gray-800 dark:text-gray-200"> in Action</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our innovative features that make online discussions more engaging and productive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roomFeatures.map((feature, index) => (
            <div
              key={index}
              className="relative group p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:scale-105"
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <feature.icon className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="relative bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-3xl p-12 overflow-hidden">
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center bg-orange-500/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Coming Soon
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Communities
                </span>
                <br />
                <span className="text-gray-800 dark:text-gray-200">
                  Are Coming
                </span>
              </h2>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Get ready for a revolutionary community experience with interactive battles,
                trust-based validation, and evidence-backed discussions.
              </p>

              <div className="space-y-4">
                {['Battle Arena', 'Truth & Trust System', 'Fact Check Revolution'].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full p-0.5">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <Users className="w-32 h-32 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}