"use client";
import React, { useTransition, useState, useEffect } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  User,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signup } from "./actions";
import Link from "next/link";

const SignupPage = () => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await signup(formData);
        if (result?.error) {
          setError(
            result.error === "Email already registered"
              ? "This email is already registered. Please try signing in instead."
              : result.error,
          );
          setShake(true);
        }
      } catch (e) {
        // Only set error if it's not a redirect
        if (!e.toString().includes("NEXT_REDIRECT")) {
          setError("An unexpected error occurred. Please try again.");
          setShake(true);
        }
      }
    });
  };
// Add Google sign in handler
  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const result = await signInWithGoogle();
      if (result?.data?.url) {
        window.location.href = result.data.url;
      } else if (result?.error) {
        setError(result.error);
        setShake(true);
      }
    } catch (e) {
      if (!e.toString().includes("NEXT_REDIRECT")) {
        setError("An unexpected error occurred. Please try again.");
        setShake(true);
      }
    }
  };
  // Reset shake animation
  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.closest("form");
      if (form) form.requestSubmit();
    }
  };

  return (
    <div className="-mt-24 pt-24 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}rem`,
                height: `${Math.random() * 3 + 1}rem`,
                backgroundColor: "#f97316",
                borderRadius: "50%",
                filter: "blur(50px)",
                animation: `pulse ${Math.random() * 3 + 2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Signup Form Container */}
      <div className="w-full max-w-md">
        <div
          className={`relative backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl overflow-hidden border border-gray-200/20 dark:border-gray-700/20 transition-transform ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* Form Header */}
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Enter your details to start your journey
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="px-8 mb-4">
              <Alert
                variant="destructive"
                className="bg-destructive/10 border-none"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Google Sign In Button */}
          <div className="px-8 pb-4">
            <button
              type="button"
              disabled={isPending}
              onClick={handleGoogleSignIn}
              className="w-full h-10 bg-white dark:bg-white border border-gray-300
                 hover:bg-gray-50 dark:hover:bg-gray-50
                 text-gray-500 dark:text-gray-500
                 font-roboto font-medium text-base
                 rounded-md shadow-sm
                 flex items-center justify-center gap-3
                 transition-colors duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
                />
              </svg>
              <span className="text-gray-700">Sign up with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="px-8 pb-4 flex items-center justify-center">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Form Content */}
          <form className="px-8 pb-8 space-y-6" action={handleSubmit}>
            {/* Username Field */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-gray-700 dark:text-gray-300"
              >
                Username
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  disabled={isPending}
                  placeholder="enter your username"
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                           bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm
                           text-gray-900 dark:text-white placeholder-gray-400
                           focus:outline-none focus:border-orange-500 dark:focus:border-orange-500
                           transition duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300"
              >
                Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isPending}
                  placeholder="enter your email"
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                           bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm
                           text-gray-600 dark:text-white placeholder-gray-400
                           focus:outline-none focus:border-orange-500 dark:focus:border-orange-500
                           transition duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isPending}
                  placeholder="••••••••"
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-10 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                           bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm
                           text-gray-900 dark:text-white placeholder-gray-400
                           focus:outline-none focus:border-orange-500 dark:focus:border-orange-500
                           transition duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500
                         hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                         transform transition-all duration-200 flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-tr-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
