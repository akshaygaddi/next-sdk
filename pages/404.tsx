'use client'


import React, { useState, useEffect } from 'react';
import { Home, Sparkles, Bot, Ghost } from 'lucide-react';
import '@/app/globals.css'

const NotFound = () => {
  const [excuseIndex, setExcuseIndex] = useState(0);
  const [vibeCheck, setVibeCheck] = useState(false);
  const [intensity, setIntensity] = useState(0);
  const [showDoge, setShowDoge] = useState(false);

  const memeExcuses = [
    "404: Server went to get milk... (hasn't returned in 15 years)",
    "Page was caught touching grass, touch some yourself maybe?",
    "Error 404: Page failed the vibe check fr fr no cap",
    "Instructions unclear, server became a butterfly 🦋",
    "POV: You're looking for a page that got Thanos snapped",
    "This page is busy cranking 90s in Fortnite rn",
    "Server went ultra instinct and dodged your request",
    "404: Page wasn't built different enough",
    "Live footage of your page: 'Aight imma head out'",
    "Page got ratio'd by a null pointer exception",
    "This URL is now a core memory (gone wrong)(emotional)",
    "Page got canceled on Twitter (real)(not clickbait)",
    "Error 404: Page took an arrow to the knee",
  ];

  const chaosLevels = [
    "Spilled the dev's monster energy on the server",
    "Server started a podcast about crypto",
    "Database became a Discord mod",
    "AI gained consciousness and left to become a TikToker",
    "Servers joined a K-pop stan account",
    "Page became an NFT (worth 0.0001 ETH)",
    "404's?? In this economy??",
    "Page got distracted watching cat videos",
  ];

  useEffect(() => {
    if (intensity > 7) {
      setShowDoge(true);
    }
  }, [intensity]);

  const handleChaos = () => {
    setIntensity(prev => prev + 1);
    setExcuseIndex((prev) => (prev + 1) % memeExcuses.length);
    if (Math.random() > 0.7) setVibeCheck(true);
    setTimeout(() => setVibeCheck(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 overflow-hidden">
      {/* Meme Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {Array(intensity * 2 + 1).fill(null).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {i % 3 === 0 ? '💀' : i % 3 === 1 ? '👾' : '🗿'}
          </div>
        ))}
      </div>

      <div className="max-w-lg w-full space-y-8 relative">
        <div className={`backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 rounded-2xl shadow-lg border border-white/20 dark:border-gray-800/20 p-8 transform transition-all duration-500 ${vibeCheck ? 'animate-wiggle scale-105' : ''}`}>
          <div className="text-center space-y-6">
            {/* 404 Title */}
            <div className="relative">
              <h1 className={`text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 mb-2 ${intensity > 5 ? 'animate-pulse' : ''}`}>
                404
              </h1>
              {showDoge && (
                <div className="absolute top-0 right-0 animate-bounce">
                  <span className="text-4xl">🐕</span>
                </div>
              )}
            </div>

            {/* Current Excuse */}
            <div className="relative">
              <p className={`text-xl font-medium text-gray-700 dark:text-gray-300 ${intensity > 3 ? 'animate-pulse' : ''}`}>
                {memeExcuses[excuseIndex]}
              </p>
              {intensity > 4 && (
                <div className="absolute -right-4 -top-4 animate-spin text-2xl">
                  💫
                </div>
              )}
            </div>

            {/* Chaos Level Indicator */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Chaos Level: {intensity}/8
              <div className="flex justify-center gap-1 mt-2">
                {Array(8).fill(null).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < intensity
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Chaos Button */}
            <button
              onClick={handleChaos}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 group"
            >
              <span className="flex items-center justify-center">
                <Sparkles className={`w-5 h-5 mr-2 ${intensity > 4 ? 'animate-spin' : ''}`} />
                {intensity > 7 ? "MAXIMUM CHAOS ACHIEVED" : "Need More Chaos"}
              </span>
            </button>

            {/* Chaos Status */}
            {intensity > 0 && (
              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                {chaosLevels[Math.min(intensity - 1, chaosLevels.length - 1)]}
              </p>
            )}
          </div>
        </div>

        {/* Home Button */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-white/20 dark:border-gray-800/20"
          >
            <Ghost className={`w-5 h-5 mr-2 ${intensity > 6 ? 'animate-bounce' : ''}`} />
            Escape to Safety
          </a>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {intensity > 7 ? (
            "Achievement Unlocked: Maximum Chaos™️"
          ) : (
            "Warning: Pressing buttons may cause unexpected memes"
          )}
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default NotFound;