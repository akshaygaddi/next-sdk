"use client";

import React, { useState, useEffect } from "react";
import {
  Rocket,
  Star,
  Users,
  Sparkles,
  Code,
  Lightbulb,
  ChevronRight,
  ArrowRight,
  Trophy,
  Target,
  Send,
  Menu,
} from "lucide-react";

const StartupCareersPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeStory, setActiveStory] = useState(0);

  const successStories = [
    {
      name: "Sarah Chen",
      role: "Started as Beta Tester",
      now: "Now Product Lead",
      story:
        "Joined us in beta, shaped core features, now leading product strategy",
    },
    {
      name: "Alex Rivera",
      role: "Former Marketing Intern",
      now: "Now Growth Manager",
      story: "Drove early user acquisition strategies, grew with the platform",
    },
    {
      name: "Mia Patel",
      role: "Early Community Member",
      now: "Now Community Director",
      story: "Built our first user communities, defining engagement strategies",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStory((current) => (current + 1) % successStories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const opportunities = [
    {
      id: 1,
      type: "Founding Team",
      title: "Marketing Co-Founder",
      commitment: "Full-time",
      equity: "Significant equity stake",
      description:
        "Be the driving force behind our growth strategy. Join as a co-founder and shape the future of online communities.",
      badges: ["Leadership", "Equity", "Innovation"],
      requirements: [
        "Proven marketing expertise",
        "Startup mindset",
        "Ability to work without initial salary",
        "Vision for community-driven platforms",
      ],
      benefits: [
        "Substantial equity ownership",
        "Leadership role",
        "Direct impact on company direction",
        "Future team building opportunity",
      ],
    },
    {
      id: 2,
      type: "Founding Team",
      title: "Creative Design Lead",
      commitment: "Full-time",
      equity: "Early-employee equity",
      description:
        "Own our visual identity and marketing campaigns as an early team member with significant equity.",
      badges: ["Design", "Creativity", "Growth"],
      requirements: [
        "Strong design portfolio",
        "Marketing campaign experience",
        "Ability to work for equity initially",
        "Passion for innovation",
      ],
      benefits: [
        "Early-employee equity package",
        "Creative freedom",
        "Portfolio growth",
        "Leadership opportunity",
      ],
    },
    {
      id: 3,
      type: "Beta Program",
      title: "Beta Tester & Community Builder",
      commitment: "Part-time",
      perks: "Early access & rewards",
      description:
        "Shape our platform's future while building a vibrant community. Perfect for social media enthusiasts.",
      badges: ["Community", "Influence", "Rewards"],
      requirements: [
        "Active social media presence",
        "Understanding of online communities",
        "10+ hours weekly commitment",
        "Passion for innovation",
      ],
      benefits: [
        "Platform credits",
        "Early feature access",
        "Direct influence on product",
        "Community leader status",
      ],
    },
    {
      id: 4,
      type: "Internship",
      title: "UI/UX Design Intern",
      commitment: "Full-time Intern",
      duration: "3-6 months",
      description:
        "Learn and grow while designing the future of social interaction. Opportunity for full-time role.",
      badges: ["Learning", "Portfolio", "Growth"],
      requirements: [
        "Basic design skills",
        "Understanding of UX principles",
        "Eagerness to learn",
        "Available full-time",
      ],
      benefits: [
        "Mentorship",
        "Portfolio development",
        "Full-time potential",
        "Skill development",
      ],
    },
  ];

  const OpportunityCard = ({ role }) => (
    <div
      onClick={() => setSelectedRole(role)}
      className=" group cursor-pointer rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-orange-500/20 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 mb-2">
              {role.type}
            </span>
            <h3 className="text-xl font-semibold mb-1">{role.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {role.commitment} {role.duration && `· ${role.duration}`}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-orange-500 transform group-hover:translate-x-1 transition-transform" />
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {role.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {role.badges.map((badge, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const DetailModal = ({ role }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 mb-2">
                {role.type}
              </span>
              <h2 className="text-2xl font-bold mb-1">{role.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {role.commitment} {role.duration && `· ${role.duration}`}
              </p>
            </div>
            <button
              onClick={() => setSelectedRole(null)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Target className="w-5 h-5 text-orange-500 mr-2" />
              Requirements
            </h3>
            <ul className="space-y-2">
              {role.requirements.map((req, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Trophy className="w-5 h-5 text-orange-500 mr-2" />
              What You'll Gain
            </h3>
            <ul className="space-y-2">
              {role.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium px-6 py-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center justify-center space-x-2">
            <Send className="w-5 h-5" />
            <span>Apply Now</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className=" min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className=" -mt-24 pt-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 animate-gradient-x"></div>
        <div className="max-w-6xl mx-auto px-6 py-24 relative">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-900/80 rounded-full px-4 py-2 mb-6">
              <Rocket className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">
                Join Our Founding Journey
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Build the Future
              </span>
              <br />
              <span className="text-3xl md:text-5xl">From Day One</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join us at the ground floor. Shape the product, own your impact,
              and grow with us.
            </p>
          </div>
        </div>
      </div>

      {/* Why Join Section */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Join Early?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Be part of something big from the beginning. We're looking for
              passionate individuals who believe in our vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-orange-500/20">
              <Sparkles className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Equity Over Salary</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Join for the ownership. Early team members receive significant
                equity packages instead of initial salary.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-orange-500/20">
              <Lightbulb className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Shape The Product</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Direct influence on product decisions. Your voice matters in
                shaping our platform's future.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-orange-500/20">
              <Users className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Grow With Us</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start as an intern or beta tester, grow into leadership. We
                promote from within.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12">Open Opportunities</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((role) => (
            <OpportunityCard key={role.id} role={role} />
          ))}
        </div>
      </div>

      {/* Join the Beta Program */}
      <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-6">
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Beta Testing Program
                </span>
              </h2>
              <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
                Be among the first to shape our platform. Join our beta testing
                program and help define the future of online communities.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <Star className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Early Access</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Be the first to try new features
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <Users className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Direct Impact</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your feedback shapes the product
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <Trophy className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Growth Opportunity</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Potential for full-time roles
                    </p>
                  </div>
                </div>
              </div>

              <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium px-8 py-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300">
                Join Beta Program
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Shape the Future?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Whether you're joining as a founder, intern, or beta tester, you'll be
          part of something revolutionary from day one.
        </p>
        <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium px-8 py-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300">
          Explore Opportunities
        </button>
      </div>

      {selectedRole && <DetailModal role={selectedRole} />}
    </div>
  );
};

export default StartupCareersPage;
