"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Shield,
  Users,
  Brain,
  Rocket,
  Lock,
  Code,
  MessageSquare,
  Trophy,
  Share2,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

const AboutPage = () => {
  const [waitlistCount, setWaitlistCount] = useState(482); // Example starting count
  const router = useRouter();
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      title: "Trust & Safety First",
      description:
        "Built with end-to-end encryption and robust content moderation to ensure safe, meaningful interactions.",
      status: "Live",
    },
    {
      icon: <Brain className="w-8 h-8 text-orange-500" />,
      title: "AI-Enhanced Engagement",
      description:
        "Smart topic suggestions and intelligent content organization to keep discussions focused and valuable.",
      status: "In Development",
    },
    {
      icon: <Code className="w-8 h-8 text-orange-500" />,
      title: "Developer-Friendly",
      description:
        "Native code highlighting, GitHub integration, and technical discussion tools built right in.",
      status: "Live",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-orange-500" />,
      title: "Real-time Collaboration",
      description:
        "Seamless group discussions with live editing and instant updates.",
      status: "Live",
    },
  ];

  const upcomingFeatures = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Battle Arena",
      description:
        "Structured debate platform with real-time voting and team-based discussions",
      releaseDate: "Q2 2024",
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Knowledge Validation",
      description:
        "Community-driven fact-checking and expertise verification system",
      releaseDate: "Q3 2024",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Micro-Learning Hub",
      description: "Bite-sized learning modules with community validation",
      releaseDate: "Q4 2024",
    },
  ];

  return (
    <div className="-mt-24 pt-24 min-h-screen bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Where Communities Come Alive
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Building the future of online communities with trust, innovation,
              and meaningful engagement at our core.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Our Vision & Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              We're reimagining online communities by creating spaces where
              authenticity, trust, and meaningful engagement flourish. Our
              platform isn't just another social network – it's a carefully
              crafted ecosystem where knowledge sharing meets community
              validation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Values Cards */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 shadow-xl"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Why We're Different
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-2">
                    <Lock className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      Trust-First Approach
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Every feature is built with user safety and data privacy
                      as the foundation.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-2">
                    <Users className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      Community Validation
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Knowledge and expertise are verified by the community,
                      creating reliable information ecosystems.
                    </p>
                  </div>
                </li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 shadow-xl"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Our Commitment
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  We're committed to building a platform where:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Rocket className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Every voice has the opportunity to be heard
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Knowledge is validated, not just shared
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Users className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Communities thrive through meaningful engagement
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="pb-2 text-3xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Current & Upcoming Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    feature.status === "Live"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                  }`}
                >
                  {feature.status}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Upcoming Features */}
          <div className="mt-20">
            <h3 className="text-2xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
              In Development
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {upcomingFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                >
                  <div className="mb-4 text-orange-500">{feature.icon}</div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {feature.description}
                  </p>
                  <span className="text-sm font-medium text-orange-500">
                    Expected: {feature.releaseDate}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Beta Access Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500/10 to-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-800 dark:text-gray-100">
              Join the Future of Community
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Be part of our early access program and help shape the future of
              online communities.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={() => router.push("/waitlist")}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300"
              >
                Request Early Access
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Join {waitlistCount.toLocaleString()} others waiting for access
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
