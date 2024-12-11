"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Brain, Shield } from "lucide-react";
import {
  FactCheckDemo,
  FactCheckSection,
  FinalSection,
  HeroSection,
  MicroLearningSection,
  TrustValidationSection,
} from "@/app/community/ActiveSectoins";

const BattleSection = () => {
  const [votes, setVotes] = useState({ left: 45, right: 55 });
  const [showTip, setShowTip] = useState(true);

  return (
    <section className="py-24 bg-gradient-to-b from-orange-50/50 to-amber-50/50 dark:from-gray-900 dark:to-gray-800 border-orange-500 border-y-2">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
              <Brain className="w-4 h-4 mr-2" />
              Battle Arena
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Choose Your Side
              </span>
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Engage in meaningful debates through our innovative battle system.
              Pick a side, contribute insights, and watch real-time consensus
              building in action.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { value: "2.5M+", label: "Votes Cast" },
                { value: "85%", label: "Engagement" },
              ].map((metric, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold text-orange-500 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {showTip && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm">
                Click on either side to vote!
                <button
                  className="ml-2 text-orange-400 hover:text-orange-300"
                  onClick={() => setShowTip(false)}
                >
                  Got it
                </button>
              </div>
            )}

            <div className="p-8 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="flex gap-4 items-center">
                <div
                  className="flex-1 p-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
                  onClick={() =>
                    setVotes((prev) => ({
                      left: Math.min(prev.left + 1, 100),
                      right: Math.max(prev.right - 1, 0),
                    }))
                  }
                >
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-blue-500"
                    style={{
                      width: `${votes.left}%`,
                      transition: "width 0.3s ease-out",
                    }}
                  />
                  <div className="text-center font-bold mb-4">JavaScript</div>
                  <div className="text-3xl text-center text-blue-600 dark:text-blue-400">
                    {votes.left}%
                  </div>
                </div>

                <div className="text-2xl font-bold">VS</div>

                <div
                  className="flex-1 p-6 rounded-lg bg-purple-100 dark:bg-purple-900/30 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
                  onClick={() =>
                    setVotes((prev) => ({
                      left: Math.max(prev.left - 1, 0),
                      right: Math.min(prev.right + 1, 100),
                    }))
                  }
                >
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-purple-500"
                    style={{
                      width: `${votes.right}%`,
                      transition: "width 0.3s ease-out",
                    }}
                  />
                  <div className="text-center font-bold mb-4">Python</div>
                  <div className="text-3xl text-center text-purple-600 dark:text-purple-400">
                    {votes.right}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { BattleSection };

export default function EnhancedSections() {
  return (
    <div className="-mt-24 pt-24 min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <HeroSection />
      <BattleSection />
      <TrustValidationSection />
      {/*<MicroLearningSection/>*/}
      <FactCheckDemo />
      <FinalSection />
    </div>
  );
}
