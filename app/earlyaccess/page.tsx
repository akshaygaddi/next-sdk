"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Bug,
  MessageSquare,
  Zap,
  Users,
  Star,
  Gift,
  ThumbsUp,
  CheckCircle,
} from "lucide-react";

const BetaFeedbackPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    usability: "",
    features: "",
    improvements: "",
    rating: "3",
    bugReport: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const feedbackCategories = [
    {
      icon: MessageSquare,
      title: "User Experience",
      description: "Share your thoughts on platform usability and design",
    },
    {
      icon: Bug,
      title: "Bug Reports",
      description: "Help us identify and fix technical issues",
    },
    {
      icon: Star,
      title: "Feature Feedback",
      description: "Rate and review our current feature set",
    },
    {
      icon: Zap,
      title: "Suggestions",
      description: "Propose improvements and new features",
    },
  ];

  return (
    <div className="-mt-24 pt-24 min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-multiply animate-float"
            style={{
              background: `rgba(249, 115, 22, ${Math.random() * 0.2})`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * -20}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4 mr-2" />
            Beta Feedback
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Help Us Improve
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Your Experience
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your feedback is crucial in shaping our platform. Share your
            thoughts, report bugs, and suggest improvements to help us create
            the best possible experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Feedback Form */}
          <div className="order-2 lg:order-1">
            {!isSubmitted ? (
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-semibold mb-6">
                  Share Your Feedback
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      How would you rate the overall usability?
                    </label>
                    <textarea
                      name="usability"
                      value={formData.usability}
                      onChange={handleChange}
                      placeholder="What works well? What's confusing?"
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/40 h-24"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rate your experience
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    >
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Which features do you find most useful?
                    </label>
                    <textarea
                      name="features"
                      value={formData.features}
                      onChange={handleChange}
                      placeholder="Tell us about the features you love"
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/40 h-24"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Suggested improvements
                    </label>
                    <textarea
                      name="improvements"
                      value={formData.improvements}
                      onChange={handleChange}
                      placeholder="What features or improvements would you like to see?"
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/40 h-24"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Report any bugs or issues
                    </label>
                    <textarea
                      name="bugReport"
                      value={formData.bugReport}
                      onChange={handleChange}
                      placeholder="Please describe any technical issues you've encountered"
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/40 h-24"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white font-medium hover:scale-105 transition-transform"
                  >
                    Submit Feedback
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your feedback has been received and will help us improve the
                  platform. We appreciate your contribution to making our
                  service better.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="order-1 lg:order-2">
            {/* Why Your Feedback Matters */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
              <h2 className="text-2xl font-semibold mb-6">
                Why Your Feedback Matters
              </h2>
              <ul className="space-y-4">
                {[
                  "Helps us identify and fix issues quickly",
                  "Shapes the development of new features",
                  "Improves the user experience for everyone",
                  "Ensures we're meeting your needs",
                  "Guides our product roadmap",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <ThumbsUp className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feedback Categories Grid */}
            <div className="grid grid-cols-2 gap-4">
              {feedbackCategories.map((category, idx) => {
                const Icon = category.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform"
                  >
                    <Icon className="w-8 h-8 text-orange-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {category.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetaFeedbackPage;
