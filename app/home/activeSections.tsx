import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Users,
  Sparkles,
  ChevronDown,
  Zap,
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight,
  Swords,
  ThumbsUp,
  MessageCircle,
  Trophy,
  Shield,
  Star,
  Award,
  TrendingUp,
  UserCheck,
  Database,
  Activity,
  Search,
  Check,
  FileCheck,
  Code,
  Mic,
  Image,
  Send,
  Play,
  Pause,
  PieChart,
  Plus,
  Smile,
  Share,
  FileText,
  Timer,
  Link,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { router } from "next/client";

export const StartupLanding = () => {
  const router = useRouter();
  const features = [
    {
      icon: MessageSquare,
      title: "Smart Rooms",
      status: "live",
      description: "Experience real-time interactive discussions",
      highlights: [
        "Code syntax highlighting",
        "Rich link previews",
        "Instant polls",
        "Voice notes",
      ],
    },
    {
      icon: Users,
      title: "Community Hub",
      status: "development",
      description: "Connect and grow with like-minded individuals",
      highlights: [
        "Topic-based channels",
        "Expert verification",
        "Knowledge sharing",
        "Collaborative spaces",
      ],
    },
  ];

  return (
    <div className="-mt-24 pt-24 min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-12">
        <div className="text-center space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium">
            <Zap className="w-4 h-4" />
            Smart Rooms Now Live!
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Experience the Future of
            <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Online Communities
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join our revolutionary platform where discussions come alive through
            interactive features and real-time collaboration.
          </p>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => router.push("/rooms")}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
            >
              Try Smart Rooms Now
            </button>
            <button
              onClick={() => router.push("/community")}
              className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-gray-800 rounded-xl font-medium border border-gray-200 dark:border-gray-700 hover:border-orange-500/20 transition-all duration-300"
            >
              Explore Community Features
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8 ">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className=" relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Status Badge */}
              <div
                className={`absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                ${
                  feature.status === "live"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                }`}
              >
                {feature.status === "live" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Live Now
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    In Development
                  </>
                )}
              </div>

              <div className="flex flex-col h-full pt-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-3 text-white mb-6">
                  <feature.icon className="w-full h-full" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {feature.description}
                </p>

                {/* Highlights */}
                <div className="flex-grow">
                  <ul className="space-y-3">
                    {feature.highlights.map((highlight, hidx) => (
                      <li
                        key={hidx}
                        className="flex items-start gap-3 text-gray-600 dark:text-gray-300"
                      >
                        <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="mt-8">
                  <button
                    onClick={() => router.push("/community")}
                    className={`group flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300
                      ${
                        feature.status === "live"
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:shadow-orange-500/20"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                  >
                    {feature.status === "live" ? "Try Now" : "Coming Soon"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



export const SmartRoomsShowcase = () => {
  const features = [
    {
      icon: Code,
      title: "Code Collaboration",
      description:
        "Share code with automatic syntax highlighting and formatting. Perfect for technical discussions and code reviews.",
      highlights: [
        "Auto-language detection",
        "Syntax highlighting",
        "Code execution preview",
        "Version comparison",
      ],
    },
    {
      icon: Mic,
      title: "Voice Messages",
      description:
        "Express complex ideas quickly with voice notes. Great for detailed explanations and quick feedback.",
      highlights: [
        "Instant recording",
        "Waveform visualization",
        "Playback speed control",
        "Transcript generation",
      ],
    },
    {
      icon: PieChart,
      title: "Instant Polls",
      description:
        "Make quick decisions with real-time polling. Gather team feedback efficiently.",
      highlights: [
        "Multiple poll types",
        "Real-time results",
        "Anonymous voting",
        "Result analytics",
      ],
    },
    {
      icon: FileText,
      title: "Rich Content",
      description:
        "Share any type of content with rich previews. Keep all project resources in one place.",
      highlights: [
        "File previews",
        "Media galleries",
        "Document rendering",
        "Link enrichment",
      ],
    },
  ];

  const useCases = [
    {
      title: "Technical Teams",
      scenarios: [
        "Code reviews and pair programming",
        "Architecture discussions",
        "Debug session recordings",
        "API documentation sharing",
      ],
    },
    {
      title: "Product Teams",
      scenarios: [
        "Feature planning polls",
        "Design feedback sessions",
        "User research sharing",
        "Sprint planning meetings",
      ],
    },
    {
      title: "Remote Teams",
      scenarios: [
        "Asynchronous updates",
        "Knowledge sharing",
        "Team discussions",
        "Project coordination",
      ],
    },
  ];

  return (
    <div className=" max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
          <Zap className="w-4 h-4" />
          Now Available
        </div>
        <h2 className="text-4xl font-bold mb-6">
          Experience Next-Gen
          <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Team Communication
          </span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Smart Rooms combine the best of chat, code sharing, and collaboration
          tools into one seamless experience.
        </p>
      </div>

      {/* Core Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-2.5 text-white mb-6">
              <feature.icon className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {feature.description}
            </p>
            <ul className="space-y-3">
              {feature.highlights.map((highlight, hidx) => (
                <li
                  key={hidx}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Key Benefits */}
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 mb-16">
        <h3 className="text-2xl font-semibold mb-8 text-center">
          Why Teams Love Smart Rooms
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Timer,
              title: "Save Time",
              description:
                "Reduce meeting time by 40% with async voice messages and structured discussions",
            },
            {
              icon: Users,
              title: "Better Collaboration",
              description:
                "Keep everyone aligned with rich content sharing and instant feedback",
            },
            {
              icon: Link,
              title: "Stay Connected",
              description:
                "Bridge the gap between remote and office teams with seamless communication",
            },
          ].map((benefit, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 p-2.5 text-orange-600 dark:text-orange-400 mx-auto mb-4">
                <benefit.icon className="w-full h-full" />
              </div>
              <h4 className="font-semibold mb-2">{benefit.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="grid md:grid-cols-3 gap-8">
        {useCases.map((useCase, idx) => (
          <div
            key={idx}
            className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6"
          >
            <h4 className="font-semibold mb-4">{useCase.title}</h4>
            <ul className="space-y-3">
              {useCase.scenarios.map((scenario, sidx) => (
                <li
                  key={sidx}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  {scenario}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export const EnhancedCTA = () => {
  const router = useRouter();
  return (
    <section className="relative py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(249,115,22,0.1),transparent)]" />
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Join Early Adopters
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join the Future of
            <span className="pb-2 block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mt-2">
              Community Engagement
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Be part of the revolution in online communities. Create meaningful
            discussions, validate knowledge, and engage with passionate
            individuals.
          </p>
        </div>

        {/* Stats Grid */}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push("/rooms")}
            className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
    </section>
  );
};


//
//unused

export const BattleArenaFeature = () => {
  const [activeTeam, setActiveTeam] = useState("left");

  const vsComparisons = [
    {
      topic: "React vs Vue",
      leftTeam: [
        {
          user: "Sarah Chen",
          role: "Senior Dev",
          argument:
            "React's virtual DOM and one-way data flow make it more predictable and easier to debug in large applications.",
          votes: 234,
          verified: true,
        },
        {
          user: "Alex Kumar",
          role: "Tech Lead",
          argument:
            "The ecosystem and community support around React is unmatched, making it easier to find solutions and packages.",
          votes: 189,
          verified: true,
        },
      ],
      rightTeam: [
        {
          user: "Marie Dubois",
          role: "Frontend Expert",
          argument:
            "Vue's gentle learning curve and excellent documentation make it perfect for teams transitioning to modern frameworks.",
          votes: 156,
          verified: true,
        },
        {
          user: "James Wilson",
          role: "Solution Architect",
          argument:
            "Vue's two-way binding and built-in state management make it more efficient for rapid development.",
          votes: 142,
          verified: false,
        },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
          <Swords className="w-4 h-4" />
          Revolutionary Debates
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Battle Arena
          <span className="block text-lg font-normal text-gray-600 dark:text-gray-300 mt-2">
            Transform discussions into engaging battles with real-time stats
          </span>
        </h2>
      </div>

      {/* Battle Section */}
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        {/* Teams Toggle */}
        <div className="flex gap-4 mb-8">
          {["left", "right"].map((side) => (
            <button
              key={side}
              className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
                activeTeam === side
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveTeam(side)}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="font-medium">
                  {side === "left" ? "React Team" : "Vue Team"}
                </span>
                <div
                  className={`px-2 py-1 rounded-full text-sm ${
                    activeTeam === side
                      ? "bg-white/20"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  {side === "left" ? "65%" : "35%"}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* VS Display */}
        <div className="relative mb-8">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: activeTeam === "left" ? "65%" : "35%" }}
            />
          </div>
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center relative">
            <span className="text-white font-bold text-xl">VS</span>
          </div>
        </div>

        {/* Arguments List */}
        <div className="space-y-4">
          {vsComparisons[0][
            activeTeam === "left" ? "leftTeam" : "rightTeam"
            ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              {/* User Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold">
                    {item.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.user}</span>
                      {item.verified && (
                        <CheckCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.role}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{item.votes}</span>
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Argument */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.argument}
              </p>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
            Join the Debate
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const TrustSystemFeature = () => {
  const [trustScore, setTrustScore] = useState(0);

  // Animate trust score on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setTrustScore(98);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const validationSteps = [
    {
      icon: MessageSquare,
      title: "Share Insights",
      description:
        "Post valuable knowledge and recommendations in your area of expertise",
      status: "Expert in React & Node.js",
    },
    {
      icon: CheckCircle,
      title: "Receive Validation",
      description:
        "Community members verify your insights with concrete evidence",
      status: "156 validations this week",
    },
    {
      icon: TrendingUp,
      title: "Build Authority",
      description: "Earn recognition and become a trusted voice in your domain",
      status: "Top 5% in Tech category",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
          <Shield className="w-4 h-4" />
          Verified Knowledge
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Truth & Trust System
          <span className="block text-lg font-normal text-gray-600 dark:text-gray-300 mt-2">
            Build credibility through our unique validation scoring system
          </span>
        </h2>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Trust Score Display */}
          <div className="relative">
            <div className="max-w-sm mx-auto">
              {/* Circular Progress */}
              <div className="relative w-64 h-64 mx-auto mb-8">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#trust-gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${trustScore * 2.83}, 283`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient
                      id="trust-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                      {trustScore}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Trust Score
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Level Indicators */}
              <div className="flex justify-between items-center px-4">
                {["Beginner", "Active", "Trusted", "Expert"].map(
                  (level, idx) => (
                    <div
                      key={idx}
                      className={`text-xs ${idx <= 2 ? "text-orange-500" : "text-gray-400"}`}
                    >
                      {level}
                    </div>
                  ),
                )}
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-2">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
          </div>

          {/* Validation Steps */}
          <div className="space-y-8">
            {validationSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative pl-8 before:absolute before:left-3 before:top-8 before:bottom-0 before:w-px before:bg-orange-500/20 last:before:hidden"
              >
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white">
                  <step.icon className="w-3 h-3" />
                </div>
                <div className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {step.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    {step.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FactCheckFeature = () => {
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const verificationSteps = [
    {
      icon: Activity,
      label: "Scanning Sources",
      description: "AI-powered scanning of trusted databases",
    },
    {
      icon: Search,
      label: "Cross-Referencing",
      description: "Comparing against verified information",
    },
    {
      icon: Check,
      label: "Community Validation",
      description: "Expert review and verification",
    },
  ];

  // Simulate verification process
  useEffect(() => {
    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Update active step based on progress
        if (newProgress >= 66) setActiveStep(2);
        else if (newProgress >= 33) setActiveStep(1);
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const sourceTypes = [
    {
      icon: BookOpen,
      name: "Academic Sources",
      description: "Peer-reviewed papers and research",
      reliability: 95,
    },
    {
      icon: Users,
      name: "Expert Opinions",
      description: "Verified professional insights",
      reliability: 88,
    },
    {
      icon: FileCheck,
      name: "Official Records",
      description: "Government and institutional data",
      reliability: 92,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
          <Database className="w-4 h-4" />
          Real-Time Verification
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Fact-Check Engine
          <span className="block text-lg font-normal text-gray-600 dark:text-gray-300 mt-2">
            Community-driven fact verification with source credibility scoring
          </span>
        </h2>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8">
        {/* Verification Process */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6">Verification Process</h3>
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                style={{ width: `${verificationProgress}%` }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-3 relative gap-4">
              {verificationSteps.map((step, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-all duration-300 mb-8
                    ${
                      idx <= activeStep
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-medium mb-2">{step.label}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Source Types */}
        <div>
          <h3 className="text-xl font-semibold mb-6">
            Source Credibility System
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {sourceTypes.map((source, idx) => (
              <div
                key={idx}
                className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-2.5 text-white mb-4">
                  <source.icon className="w-full h-full" />
                </div>
                <h4 className="font-semibold mb-2">{source.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {source.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Reliability Score</span>
                    <span className="font-medium">{source.reliability}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                      style={{ width: `${source.reliability}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};