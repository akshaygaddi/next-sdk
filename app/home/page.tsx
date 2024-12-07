'use client'



import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Shield, Brain, Rocket, MessageSquare, Trophy,
  Share2, BookOpen, ChevronRight, ArrowRight, Globe,
  Code, Lock, Zap, GitBranch, Layout, Video, FileText
} from 'lucide-react';

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(482);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const roomFeatures = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Smart Code Handling",
      description: "Automatic syntax highlighting, code formatting, and language detection. Share and discuss code effortlessly."
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "GitHub Integration",
      description: "Direct GitHub links transform into rich previews. Discuss PRs and issues seamlessly."
    },
    {
      icon: <Layout className="w-8 h-8" />,
      title: "Rich Media Support",
      description: "Links automatically expand into rich previews. Share content without leaving the discussion."
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Quick Polls & Voting",
      description: "Create instant polls for group decisions. Get real-time feedback from your community."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Document Collaboration",
      description: "Real-time collaborative editing. Perfect for documentation and shared notes."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Focused Discussions",
      description: "Threaded conversations keep topics organized. Set time limits for focused sessions."
    }
  ];

  const upcomingFeatures = [
    {
      icon: <Trophy className="w-12 h-12" />,
      title: "Battle Arena",
      description: "Structure debates with team-based discussions. Real-time consensus tracking and visual engagement metrics.",
      comingSoon: "Transform how your community compares ideas and reaches decisions."
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Truth & Trust System",
      description: "Community-driven knowledge validation with expert verification. Build reliable information ecosystems.",
      comingSoon: "Create a trusted knowledge base within your community."
    },
    {
      icon: <Share2 className="w-12 h-12" />,
      title: "Knowledge Validation",
      description: "Fact-checking system with evidence-backed claims. Community voting on most convincing arguments.",
      comingSoon: "Ensure quality information flows through your community."
    }
  ];

  return (
    <div className="-mt-24 pt-24 min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Where Communities
              <br />
              Come Alive
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Experience our revolutionary Rooms feature today, while we build the future of
              community engagement.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
            >
              Get Early Access
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Live Rooms Features */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Rooms: Available Now
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience our feature-rich Rooms today. Built for developers, teams, and communities
              who need more than just chat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomFeatures.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
              >
                <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 p-3 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Testing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Help Shape the Future
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              As a beta tester, your feedback will directly influence our platform's evolution.
              Experience our Rooms feature today and help us build the next generation of
              community features.
            </p>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
              Beta Tester Benefits
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <Rocket className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Early Access to Features</h4>
                  <p className="text-gray-600 dark:text-gray-300">Be the first to try new features and shape their development</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Users className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Direct Impact</h4>
                  <p className="text-gray-600 dark:text-gray-300">Your feedback directly influences feature development</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="py-20 bg-gradient-to-br from-orange-500/10 to-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              What You're Waiting For
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our upcoming features will revolutionize how communities interact, share knowledge,
              and reach consensus.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingFeatures.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 shadow-xl"
              >
                <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 p-4 rounded-xl inline-block mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>
                <p className="text-sm text-orange-500 font-medium">
                  {feature.comingSoon}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-800 dark:text-gray-100">
                Join the Evolution
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Start with our powerful Rooms feature today, and be first in line for our
                upcoming community innovations.
              </p>
              <div className="flex flex-col items-center space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center gap-2"
                >
                  Request Early Access
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join {waitlistCount.toLocaleString()} others waiting for access
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;