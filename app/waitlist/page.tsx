"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Sparkles, Users, Zap, Shield, Send } from "lucide-react";

const features = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Vibrant Community",
    description:
      "Connect with like-minded individuals in our interactive spaces",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Real-time Engagement",
    description: "Experience dynamic discussions with our VS battle system",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Trust & Validation",
    description: "Contribute to a knowledge ecosystem built on credibility",
  },
];

const WaitlistPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    interest: "developer",
    customMessage: "",
    newsletterOptIn: true,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.from("waitlist").insert([
        {
          email: formData.email,
          full_name: formData.fullName,
          interest: formData.interest,
          custom_message: formData.customMessage,
          newsletter_opt_in: formData.newsletterOptIn,
        },
      ]);

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-xl w-full mx-4 text-center space-y-8">
          {/* Success Animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 blur-xl animate-pulse rounded-full" />
            <div className="relative bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-orange-500/20">
              <Sparkles className="h-12 w-12 text-orange-500 mx-auto animate-bounce" />
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Welcome to the Community!
            </h2>
            <p className="text-xl text-muted-foreground">
              You're now on the waitlist for upcoming features
            </p>
          </div>

          {/* Available Features Card */}
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-orange-500/20 space-y-4">
            <h3 className="font-semibold text-lg">Start Exploring Now!</h3>
            <p className="text-muted-foreground">
              While you wait for new features, check out our live rooms:
            </p>
            <div className="grid gap-4">
              <a
                href="/rooms"
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                <Users className="h-5 w-5" />
                Explore Rooms
              </a>
            </div>
          </div>

          {/* Next Steps */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-orange-500/20">
              <h4 className="font-medium mb-2">What's Next?</h4>
              <p className="text-sm text-muted-foreground">
                We'll notify you about early access to new features and
                community updates.
              </p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-orange-500/20">
              <h4 className="font-medium mb-2">Share with Friends</h4>
              <p className="text-sm text-muted-foreground">
                Invite your friends to join and build our community together.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="text-sm text-muted-foreground">
            <p>Follow us for updates:</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              {/* Add your social media links here */}
              <a
                href="#twitter"
                className="hover:text-orange-500 transition-colors"
              >
                Twitter
              </a>
              <a
                href="#discord"
                className="hover:text-orange-500 transition-colors"
              >
                Discord
              </a>
              <a
                href="#github"
                className="hover:text-orange-500 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12 items-center">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Join the Waitlist
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Be the first to experience our revolutionary community platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-orange-500/20 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-orange-500/20 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="text-sm font-medium">I am a</label>
                <select
                  value={formData.interest}
                  onChange={(e) =>
                    setFormData({ ...formData, interest: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-orange-500/20 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                >
                  <option value="developer">Developer</option>
                  <option value="creator">Creator</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  What excites you most about our platform? (Optional)
                </label>
                <textarea
                  value={formData.customMessage}
                  onChange={(e) =>
                    setFormData({ ...formData, customMessage: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-background border border-orange-500/20 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-colors"
                  placeholder="Share your thoughts..."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={formData.newsletterOptIn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newsletterOptIn: e.target.checked,
                    })
                  }
                  className="rounded border-orange-500/20 text-orange-500 focus:ring-orange-500/20"
                />
                <label
                  htmlFor="newsletter"
                  className="text-sm text-muted-foreground"
                >
                  Keep me updated about platform news and launches
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium px-8 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Join Waitlist
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right side - Features */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 blur-xl animate-pulse rounded-3xl" />
            <div className="relative bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-orange-500/20">
              <div className="grid gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="bg-orange-500/10 p-3 rounded-xl">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats or social proof */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: "1000+", label: "In Waitlist" },
              { value: "50+", label: "Communities" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-orange-500/20"
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;
