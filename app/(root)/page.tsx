"use client";
import React, { useState, useEffect } from "react";
import { Star, Network } from "lucide-react";
import {
  EnhancedCTA,
  SmartRoomsShowcase,
  StartupLanding,
} from "@/app/home/activeSections";

// Feature Section Template Component
const FeatureSection = ({
                          badge,
                          icon: Icon,
                          title,
                          description,
                          metrics,
                          gradient = "from-orange-500 to-amber-500",
                          children,
                        }) => (
  <section className="py-24 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Feature Badge */}
      <div className="flex justify-center mb-8">
        <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-500 px-4 py-2 rounded-full flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {badge}
        </div>
      </div>

      {/* Gradient Headline */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span
            className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {title}
          </span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {description}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-2xl p-8 border border-white/20 mb-12">
        {children}
      </div>

      {/* Supporting Metrics */}
      <div className="grid grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="text-center p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl"
          >
            <div
              className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}
            >
              {metric.value}
            </div>
            <div className="text-sm text-gray-500">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Example of Fact-Check Engine Section

// Expert Networks Section
const ExpertNetworksSection = () => {
  const [activeExperts] = useState([
    {
      name: "Dr. Sarah Chen",
      field: "AI & ML",
      rating: 4.9,
      verifications: 1240,
    },
    {
      name: "Prof. Alex Kumar",
      field: "Web Development",
      rating: 4.8,
      verifications: 890,
    },
    {
      name: "Emma Wilson",
      field: "UX Design",
      rating: 4.7,
      verifications: 756,
    },
  ]);

  return (
    <FeatureSection
      badge="Expert Community"
      icon={Network}
      title="Expert Networks"
      description="Connect with verified experts and mentors in your field"
      metrics={[
        { value: "500+", label: "Verified Experts" },
        { value: "24/7", label: "Expert Availability" },
        { value: "4.8", label: "Satisfaction Rate" },
      ]}
    >
      <div className="space-y-6">
        {/* Expert Profiles */}
        {activeExperts.map((expert, idx) => (
          <div
            key={idx}
            className="p-6 bg-white/50 dark:bg-gray-700/50 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-500 font-semibold">
                    {expert.name[0]}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{expert.name}</h4>
                  <span className="text-sm text-gray-500">{expert.field}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="font-semibold">{expert.rating}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {expert.verifications} verifications
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm">
                Connect
              </button>
              <button className="px-4 py-2 bg-white/50 dark:bg-gray-700/50 rounded-lg text-sm">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </FeatureSection>
  );
};

const EnhancedLanding = () => {
  const [activeVS, setActiveVS] = useState(0);
  const [trustScore, setTrustScore] = useState(0);
  const [pollVotes, setPollVotes] = useState({ yes: 45, no: 55 });
  const [activeTeam, setActiveTeam] = useState("left");

  // VS System Demo Data
  const vsComparisons = [
    {
      left: "React",
      right: "Vue",
      leftVotes: 65,
      rightVotes: 35,
      leftTeam: [
        { user: "Sarah", argument: "Better ecosystem", votes: 234 },
        { user: "Mike", argument: "Industry standard", votes: 189 },
      ],
      rightTeam: [
        { user: "Alex", argument: "Easier learning curve", votes: 156 },
        { user: "Emma", argument: "Better performance", votes: 145 },
      ],
    },
  ];

  // Smart Room Messages
  const messages = [
    { user: "Sarah", text: "Check out this optimization:", type: "text" },
    {
      type: "code",
      content:
        "const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);",
    },
    { type: "validation", votes: 45, experts: 12 },
    { type: "poll", question: "Is this approach better?", votes: pollVotes },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTrustScore((prev) => (prev < 98 ? prev + 1 : 0));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <StartupLanding />

      {/* Smart Rooms */}
      <div className="border-y-2 border-orange-500">
        <SmartRoomsShowcase />
      </div>

      {/* CTA Section */}

      <EnhancedCTA />
    </div>
  );
};

export default EnhancedLanding;
