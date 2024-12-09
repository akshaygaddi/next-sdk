'use client'

import React, { useState } from 'react';
import {
  Sparkles, Bug, MessageSquare, Zap,
  Users, Star, Gift, ThumbsUp, CheckCircle
} from 'lucide-react';

const BetaTesterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    experience: '',
    interest: '',
    availability: 'medium'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const benefits = [
    {
      icon: Bug,
      title: 'Shape the Platform',
      description: 'Direct influence on feature development and platform direction'
    },
    {
      icon: Gift,
      title: 'Exclusive Rewards',
      description: 'Lifetime premium features and special beta tester badge'
    },
    {
      icon: Users,
      title: 'Early Community',
      description: 'Connect with other innovative early adopters'
    },
    {
      icon: Star,
      title: 'Priority Access',
      description: 'First access to all new features and updates'
    }
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
              animationDelay: `${Math.random() * -20}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
            <Bug className="w-4 h-4 mr-2" />
            Beta Testing Program
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Help Us Build the Future
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              of Online Communities
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            We're looking for passionate users to help test and shape our platform.
            Join our beta testing program and be part of something revolutionary.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Beta Tester Form */}
          <div className="order-2 lg:order-1">
            {!isSubmitted ? (
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-semibold mb-6">Apply to be a Beta Tester</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
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
                    <label className="block text-sm font-medium mb-2">Email</label>
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
                    <label className="block text-sm font-medium mb-2">What interests you most about our platform?</label>
                    <textarea
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/40 h-24"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Testing availability per week</label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                    >
                      <option value="low">1-2 hours</option>
                      <option value="medium">3-5 hours</option>
                      <option value="high">6+ hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Experience with similar platforms</label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/40 h-24"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white font-medium hover:scale-105 transition-transform"
                  >
                    Apply Now
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Application Received!</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Thanks for applying to be a beta tester. We'll review your application and get back to you soon.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="order-1 lg:order-2">
            {/* What We're Looking For */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
              <h2 className="text-2xl font-semibold mb-6">What We're Looking For</h2>
              <ul className="space-y-4">
                {[
                  "Passionate about online communities and social platforms",
                  "Detail-oriented with a keen eye for user experience",
                  "Willing to provide regular, constructive feedback",
                  "Excited to help shape the future of online engagement",
                  "Available for regular testing sessions and feedback rounds"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <ThumbsUp className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform"
                  >
                    <Icon className="w-8 h-8 text-orange-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{benefit.description}</p>
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

export default BetaTesterPage;
