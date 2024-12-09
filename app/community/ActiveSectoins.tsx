import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import {
  Target,
  Shield,
  Star,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  BookMarked,
  Share2,
  MessageCircle,
  Clock,
  Link,
  ChevronLeft, ChevronRight,
  ExternalLink,
  Users,
  ArrowRight,
  Globe,
  Zap, Award
} from "lucide-react";






export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      name: 'Battle Arena',
      icon: Zap,
      description: 'Engage in structured debates and see real-time consensus building',
      preview: 'vs-preview',
      color: 'from-blue-500 to-purple-500'
    },
    {
      name: 'Trust System',
      icon: Shield,
      description: 'Build credibility through community validation',
      preview: 'trust-preview',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Fact Check',
      icon: CheckCircle,
      description: 'Verify information through collective intelligence',
      preview: 'fact-preview',
      color: 'from-orange-500 to-amber-500'
    },
    {
      name: 'Expert Recognition',
      icon: Award,
      description: 'Earn reputation in your domain of expertise',
      preview: 'expert-preview',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { label: 'Active Communities', value: '10K+', icon: Users },
    { label: 'Global Reach', value: '150+', icon: Globe },
    { label: 'Daily Interactions', value: '1M+', icon: Zap },
    { label: 'User Rating', value: '4.9/5', icon: Star }
  ];

  return (
    <section className="-mt-24 pt-24 relative min-h-screen flex items-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1200/800')] opacity-5" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0">
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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-sm border border-orange-500/20">
              <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Coming Soon
              </span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Redefining Online
                </span>
                <br />
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Communities
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl">
                Experience a new era of online engagement with dynamic debates,
                verified insights, and meaningful connections.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="group relative px-8 py-4 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 transition-transform group-hover:scale-105" />
                <span className="relative text-white font-medium">Join Waitlist</span>
              </button>
              <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-orange-500/20 hover:bg-orange-500/10 transition-colors">
                <span className="font-medium">Learn More</span>
              </button>
            </div>

          </div>

          {/* Right Column - Interactive Preview */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            {/* Feature Cards */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-3xl" />
              <div className="relative p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-6">
                  Explore Features
                </div>
                <div className="space-y-4">
                  {features.map((feature, idx) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div
                        key={idx}
                        className={`group p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                          activeFeature === idx
                            ? 'bg-gradient-to-r ' + feature.color + ' text-white'
                            : 'bg-white/50 dark:bg-gray-900/50 hover:bg-white/80 dark:hover:bg-gray-800/80'
                        }`}
                        onMouseEnter={() => setActiveFeature(idx)}
                        onMouseLeave={() => setActiveFeature(null)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FeatureIcon className={`w-5 h-5 ${
                              activeFeature === idx ? 'text-white' : 'text-orange-500'
                            }`} />
                            <div>
                              <div className="font-medium">{feature.name}</div>
                              <div className={`text-sm ${
                                activeFeature === idx ? 'text-white/80' : 'text-gray-500'
                              }`}>
                                {feature.description}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className={`w-4 h-4 transition-transform ${
                            activeFeature === idx ? 'translate-x-1' : 'group-hover:translate-x-1'
                          }`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



export const TrustValidationSection = () => {
  const [trustScore, setTrustScore] = useState(7);
  const [validations, setValidations] = useState([
    { id: 1, content: "React Performance Tips", score: 8.5, validations: 234, category: "Development" },
    { id: 2, content: "UI/UX Best Practices", score: 9.2, validations: 567, category: "Design" },
    { id: 3, content: "API Security Guidelines", score: 7.8, validations: 189, category: "Security" }
  ]);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [showValidationTip, setShowValidationTip] = useState(true);

  const handleValidation = (id, increment) => {
    setValidations(prevValidations =>
      prevValidations.map(validation =>
        validation.id === id
          ? {
            ...validation,
            validations: validation.validations + (increment ? 1 : -1),
            score: Math.min(10, Math.max(0, validation.score + (increment ? 0.1 : -0.1)))
          }
          : validation
      )
    );
  };

  const CategoryBadge = ({ category }) => (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
      {category}
    </span>
  );

  const TrustScoreIndicator = ({ score }) => {
    const percentage = (score / 10) * 100;
    return (
      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <section className="border-orange-500 border-b-2 py-24 bg-white/30 dark:bg-gray-800/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Info */}
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Trust System
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Build Trust Through Validation
              </span>
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Our innovative trust system ensures quality through community validation.
              Share insights, validate others' contributions, and build your expertise score.
            </p>

            {/* Trust Score Demo */}
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Your Trust Score</span>
                <span className="text-2xl font-bold text-orange-500">{trustScore.toFixed(1)}/10</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {[...Array(10)].map((_, i) => (
                    <button
                      key={i}
                      className={`h-8 w-8 rounded-lg transition-all duration-300 ${
                        i < trustScore
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      onClick={() => setTrustScore(i + 1)}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click to simulate different trust scores
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "500K+", label: "Verified Users" },
                { value: "95%", label: "Accuracy Rate" },
                { value: "1M+", label: "Validations" },
                { value: "4.8/5", label: "Trust Score" }
              ].map((metric, idx) => (
                <div key={idx} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-orange-500 mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Interactive Demo */}
          <div className="relative">
            {showValidationTip && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm">
                Click the validation buttons to see the system in action!
                <button
                  className="ml-2 text-orange-400 hover:text-orange-300"
                  onClick={() => setShowValidationTip(false)}
                >
                  Got it
                </button>
              </div>
            )}

            <div className="space-y-4">
              {validations.map((validation) => (
                <div
                  key={validation.id}
                  className={`p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-300 ${
                    selectedInsight === validation.id ? 'ring-2 ring-orange-500' : ''
                  }`}
                  onClick={() => setSelectedInsight(validation.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium mb-2">{validation.content}</h3>
                      <CategoryBadge category={validation.category} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-500 mb-1">
                        {validation.score.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">Trust Score</div>
                    </div>
                  </div>

                  <TrustScoreIndicator score={validation.score} />

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {validation.validations} validations
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        onClick={() => handleValidation(validation.id, true)}
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        onClick={() => handleValidation(validation.id, false)}
                      >
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};




// micro learning
export const TipCard = ({ tip, onVote }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
      {/* Tip Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Image
              src="@/chatgpt-6.svg"
              width={500}
              height={500}
              alt="Picture of the author"
            />
            <div>
              <div className="font-medium">{tip.author}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {tip.timeAgo}
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600">
            {tip.category}
          </span>
        </div>
      </div>

      {/* Tip Content */}
      <div className="p-4">
        <h3 className="font-medium mb-2">{tip.title}</h3>
        <p className={`text-gray-600 dark:text-gray-300 ${!isExpanded ? 'line-clamp-2' : ''}`}>
          {tip.content}
        </p>
        {tip.content.length > 100 && (
          <button
            className="text-orange-500 text-sm mt-2 hover:text-orange-600"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Tip Media */}
      {tip.hasMedia && (
        <div className="px-4 pb-4">
          <div className="aspect-video rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <Image
              src="/profile.png"
              width={500}
              height={500}
              alt="Picture of the author"
            />
          </div>
        </div>
      )}

      {/* Tip Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1 text-sm hover:text-orange-500"
            onClick={() => onVote(tip.id, 'up')}
          >
            <ThumbsUp className={`w-4 h-4 ${tip.userVote === 'up' ? 'text-orange-500 fill-orange-500' : ''}`} />
            <span>{tip.upvotes}</span>
          </button>
          <button
            className="flex items-center gap-1 text-sm hover:text-orange-500"
            onClick={() => onVote(tip.id, 'down')}
          >
            <ThumbsDown className={`w-4 h-4 ${tip.userVote === 'down' ? 'text-orange-500 fill-orange-500' : ''}`} />
            <span>{tip.downvotes}</span>
          </button>
          <button className="flex items-center gap-1 text-sm hover:text-orange-500">
            <MessageCircle className="w-4 h-4" />
            <span>{tip.comments}</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="hover:text-orange-500 relative"
            onClick={() => setShowShareTooltip(!showShareTooltip)}
          >
            <Share2 className="w-4 h-4" />
            {showShareTooltip && (
              <div className="absolute bottom-full right-0 mb-2 p-2 bg-black text-white text-xs rounded">
                Share this tip
              </div>
            )}
          </button>
          <button
            className={`hover:text-orange-500 ${isSaved ? 'text-orange-500' : ''}`}
            onClick={() => setIsSaved(!isSaved)}
          >
            <BookMarked className={`w-4 h-4 ${isSaved ? 'fill-orange-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const MicroLearningSection = () => {
  const [tips, setTips] = useState([
    {
      id: 1,
      author: "Sarah Chen",
      timeAgo: "2h ago",
      category: "React",
      title: "Quick Tip: UseEffect Cleanup",
      content: "Always remember to clean up your useEffect hooks to prevent memory leaks. Return a cleanup function that removes event listeners, subscriptions, or timers.",
      upvotes: 234,
      downvotes: 12,
      comments: 45,
      hasMedia: true,
      userVote: null
    },
    {
      id: 2,
      author: "Michael Park",
      timeAgo: "5h ago",
      category: "UI/UX",
      title: "Microinteractions Matter",
      content: "Small animations and transitions can greatly improve user experience. Add subtle feedback to user actions like hover states and button clicks to make your interface feel more responsive and engaging.",
      upvotes: 189,
      downvotes: 8,
      comments: 32,
      hasMedia: false,
      userVote: null
    },
    {
      id: 3,
      author: "Lisa Johnson",
      timeAgo: "1d ago",
      category: "JavaScript",
      title: "Array Method Shorthand",
      content: "Use array destructuring to swap variables without a temporary variable: [a, b] = [b, a]. This clean syntax makes your code more readable and efficient.",
      upvotes: 421,
      downvotes: 15,
      comments: 67,
      hasMedia: true,
      userVote: null
    }
  ]);

  const handleVote = (tipId, voteType) => {
    setTips(prevTips =>
      prevTips.map(tip => {
        if (tip.id === tipId) {
          const oldVote = tip.userVote;
          const newVote = oldVote === voteType ? null : voteType;

          return {
            ...tip,
            upvotes: tip.upvotes + (
              voteType === 'up'
                ? (oldVote === 'up' ? -1 : 1)
                : (oldVote === 'up' ? -1 : 0)
            ),
            downvotes: tip.downvotes + (
              voteType === 'down'
                ? (oldVote === 'down' ? -1 : 1)
                : (oldVote === 'down' ? -1 : 0)
            ),
            userVote: newVote
          };
        }
        return tip;
      })
    );
  };

  return (
    <section className="py-24 bg-white/30 dark:bg-gray-800/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Info */}
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
              <Lightbulb className="w-4 h-4 mr-2" />
              Quick Learning
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Learn in Bite-sized Pieces
              </span>
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Share and discover quick, actionable insights from the community.
              Each tip is validated by experts and rated by learners like you.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "50K+", label: "Daily Tips" },
                { value: "92%", label: "Found Helpful" },
                { value: "15sec", label: "Avg. Length" },
                { value: "1M+", label: "Learners" }
              ].map((metric, idx) => (
                <div key={idx} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-orange-500 mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Tips Feed */}
          <div className="space-y-4">
            {tips.map(tip => (
              <TipCard
                key={tip.id}
                tip={tip}
                onVote={handleVote}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};









export const FactCheckDemo = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [userAction, setUserAction] = useState(null);
  const [showSources, setShowSources] = useState(false);
  const [activeEvidence, setActiveEvidence] = useState(null);
  const [verificationCount, setVerificationCount] = useState(127);

  const handleVerify = (type) => {
    setIsVerifying(true);
    setTimeout(() => {
      setUserAction(type);
      setVerificationCount(prev => type === 'verify' ? prev + 1 : prev);
      setIsVerifying(false);
    }, 1000);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-orange-50/50 to-amber-50/50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
            <Target className="w-4 h-4 mr-2" />
            Fact Check System Demo
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Real-time Fact Verification
            </span>
          </h2>

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience how our community verifies claims through evidence-based consensus.
          </p>
        </div>

        {/* Main Fact Card */}
        <div className="max-w-2xl mx-auto bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-white/20 shadow-xl">
          {/* Status Banner */}
          <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Posted 2 hours ago</span>
              </span>
              <span className="flex items-center gap-1 text-sm">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{verificationCount} verifications</span>
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600">
              Technology
            </span>
          </div>

          {/* Claim Content */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-6">
              {/*fact check*/}
              <svg width="2500" height="2500" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5"
                   className="h-10 w-10"
                   viewBox="-0.17090198558635983 0.482230148717937 41.14235318283891 40.0339509076386">
                <text x="-9999" y="-9999">ChatGPT</text>
                <path
                  d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18z"
                  fill="currentColor" />
              </svg>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  "ChatGPT helped researchers discover a new antibacterial molecule"
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  A recent study claims that AI language model ChatGPT assisted in identifying a novel antibacterial
                  compound effective against drug-resistant bacteria.
                </p>
              </div>
            </div>

            {/* Evidence Section */}
            <div className="space-y-4">
              <div className="font-medium text-gray-900 dark:text-gray-100">Supporting Evidence:</div>
              {[
                {
                  id: 1,
                  type: "research",
                  content: "Published in Nature Journal (Feb 2024): Study demonstrates AI-assisted discovery of new antibacterial molecule.",
                  link: "View Publication"
                },
                {
                  id: 2,
                  type: "data",
                  content: "MIT Laboratory tests confirm 89% effectiveness against resistant strains.",
                  link: "View Lab Results"
                },
                {
                  id: 3,
                  type: "expert",
                  content: "Verified by leading microbiologists from three independent institutions.",
                  link: "Expert Reviews"
                }
              ].map((evidence) => (
                <div
                  key={evidence.id}
                  className={`p-4 rounded-lg transition-colors ${
                    activeEvidence === evidence.id
                      ? "bg-orange-50 dark:bg-orange-900/20"
                      : "bg-gray-50 dark:bg-gray-900/50"
                  }`}
                  onMouseEnter={() => setActiveEvidence(evidence.id)}
                  onMouseLeave={() => setActiveEvidence(null)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <Shield className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                        {evidence.content}
                      </p>
                      <button className="text-orange-500 text-sm hover:text-orange-600 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {evidence.link}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    userAction === 'verify'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${isVerifying ? 'opacity-50 cursor-wait' : ''}`}
                  onClick={() => !isVerifying && handleVerify('verify')}
                  disabled={isVerifying}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify ({verificationCount})</span>
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    userAction === 'dispute'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${isVerifying ? 'opacity-50 cursor-wait' : ''}`}
                  onClick={() => !isVerifying && handleVerify('dispute')}
                  disabled={isVerifying}
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>Dispute (23)</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    5
                  </span>
                </button>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowSources(!showSources)}
                >
                  <Link className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showSources && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="text-sm font-medium mb-2">Source Links:</div>
                <div className="space-y-2">
                  <a href="#" className="text-orange-500 hover:text-orange-600 text-sm block">
                    Nature Journal Publication
                  </a>
                  <a href="#" className="text-orange-500 hover:text-orange-600 text-sm block">
                    MIT Laboratory Results
                  </a>
                  <a href="#" className="text-orange-500 hover:text-orange-600 text-sm block">
                    Expert Review Panel
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};




export const FinalSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Add your waitlist logic here
  };

  return (
    <div className="relative pt-24 overflow-hidden">
      {/* Background Elements */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-orange-50/50 dark:from-gray-900 dark:to-gray-800" />
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
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

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Main Content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Join the Revolution
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Be Part of the Next Generation
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of early adopters shaping the future of online communities.
            Get exclusive access and special perks when we launch.
          </p>

          {/* Waitlist Form */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-6 py-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-white font-medium hover:scale-105 transition-transform"
              >
                Join Waitlist
              </button>
            </form>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Shield,
              title: "Early Access",
              description: "Be among the first to experience our revolutionary platform"
            },
            {
              icon: Star,
              title: "Founding Member Benefits",
              description: "Exclusive features and rewards for our early supporters"
            },
            {
              icon: Users,
              title: "Community Impact",
              description: "Help shape the future of online discourse and engagement"
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform"
              >
                <Icon className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            );
          })}
        </div>


      </div>
      <div
        className="pb-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
        © 2024 Your Platform. All rights reserved.
      </div>


    </div>
  );
};

