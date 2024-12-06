'use client'

import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  MessageCircle,
  Users,
  Trophy,
  Star,
  ChevronRight,
  Zap,
  Shield,
  MessagesSquare,
  Video,
  FileCode,
  Globe,
  ThumbsUp,
  Target,
  Award,
  Gift,
  Rocket,

  Share2,
  PenTool,
  Crown,
  Flame, Radio
} from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';

const InteractiveComingSoon = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeRoom, setActiveRoom] = useState(0);

  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    setMousePosition({
      x: (clientX / window.innerWidth - 0.5) * 30,
      y: (clientY / window.innerHeight - 0.5) * 30
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // No auto-rotation, just state management
  const handleFeatureHover = (index) => {
    setActiveFeature(index);
  };

  const handleRoomHover = (index) => {
    setActiveRoom(index);
  };

  const communityFeatures = [
    {
      icon: <MessagesSquare />,
      title: "Interactive Discussions",
      description: "Engage in rich, multimedia conversations with real-time reactions and threaded replies",
      color: "text-blue-500"
    },
    {
      icon: <Trophy />,
      title: "Community Challenges",
      description: "Participate in weekly challenges, competitions, and collaborative projects",
      color: "text-yellow-500"
    },
    {
      icon: <Shield />,
      title: "Trust System",
      description: "Build reputation through verified contributions and community endorsements",
      color: "text-green-500"
    },
    {
      icon: <Target />,
      title: "Interest Matching",
      description: "Connect with like-minded members based on shared interests and goals",
      color: "text-purple-500"
    },
    {
      icon: <Award />,
      title: "Expert Recognition",
      description: "Earn badges and certifications for your expertise and contributions",
      color: "text-orange-500"
    },
    {
      icon: <Share2 />,
      title: "Knowledge Exchange",
      description: "Share resources, tutorials, and experiences in structured formats",
      color: "text-pink-500"
    }
  ];

  const roomTypes = [
    {
      icon: <Rocket />,
      title: "Innovation Hub",
      description: "Brainstorm and collaborate on new ideas with creative tools",
      features: ["Whiteboard", "Idea voting", "Resource sharing"],
      theme: "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
    },
    {
      icon: <Radio />,
      title: "Learning Arena",
      description: "Interactive sessions with screen sharing and live coding",
      features: ["Live streaming", "Code playground", "Q&A system"],
      theme: "bg-gradient-to-r from-green-500/10 to-blue-500/10"
    },
    {
      icon: <Crown />,
      title: "Expert Roundtable",
      description: "Focused discussions with industry experts and thought leaders",
      features: ["Verified experts", "Scheduled sessions", "Resource library"],
      theme: "bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
    },
    {
      icon: <Flame />,
      title: "Challenge Room",
      description: "Compete, learn, and grow with community challenges",
      features: ["Live leaderboard", "Peer review", "Achievement tracking"],
      theme: "bg-gradient-to-r from-red-500/10 to-yellow-500/10"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent text-accent-foreground">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Revolutionizing Online Communities</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-gradient-x">
              Community 2.0
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Join the next evolution of online communities where engagement meets innovation
          </p>
        </div>

        {/* Community Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {communityFeatures.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border transform transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-lg hover:bg-accent border-border bg-card"
              onMouseEnter={() => handleFeatureHover(index)}
              onMouseLeave={() => handleFeatureHover(null)}
              style={{
                transform: `perspective(1000px) rotateX(${(mousePosition.y / 100)}deg) rotateY(${(mousePosition.x / 100)}deg) ${
                  index === activeFeature ? 'scale(1.05)' : 'scale(1)'
                }`
              }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`${feature.color} transition-colors duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Smart Rooms Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Smart Rooms</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {roomTypes.map((room, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 transition-all duration-300 ${room.theme} hover:scale-105 hover:shadow-xl`}
                onMouseEnter={() => handleRoomHover(index)}
                onMouseLeave={() => handleRoomHover(null)}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-background">
                    {room.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
                    <p className="text-muted-foreground mb-4">{room.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature, fIndex) => (
                        <span
                          key={fIndex}
                          className="px-3 py-1 rounded-full bg-background text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waitlist Section */}
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-6">Be Part of the Revolution</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for early access"
                className="flex-1 px-4 py-3 rounded-lg border bg-card text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center"
              >
                Join <ChevronRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </form>

          {isSubmitted && (
            <Alert className="mt-4 bg-accent border-primary animate-in slide-in-from-bottom-2">
              <AlertDescription className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-primary" />
                Welcome to the future of community engagement!
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">5,000+</div>
            <div className="text-sm text-muted-foreground">Early Adopters</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">4</div>
            <div className="text-sm text-muted-foreground">Room Types</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">∞</div>
            <div className="text-sm text-muted-foreground">Possibilities</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveComingSoon;