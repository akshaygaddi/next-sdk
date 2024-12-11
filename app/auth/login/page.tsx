"use client";
import React, { useTransition, useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "./actions";
import Link from "next/link";

const LoginPage = () => {
  // Use useTransition for handling server action states
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    setError(null);

    // Use startTransition to handle server action
    startTransition(async () => {
      try {
        const result = await login(formData);
        if (result?.error) {
          setError(
            result.error === "Invalid login credentials"
              ? "Invalid email or password. Please try again."
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

      {/* Login Form Container */}
      <div className="w-full max-w-md">
        <div
          className={`relative backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl overflow-hidden border border-gray-200/20 dark:border-gray-700/20 transition-transform ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* Form Header */}
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Enter your credentials to access your account
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

          {/* Form Content */}
          <form className="px-8 pb-8 space-y-6" action={handleSubmit}>
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
                  placeholder="john@example.com"
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
                className="relative w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500
                         hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                         transform transition-all duration-200 flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="relative flex items-center gap-2">
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </div>
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                  Sign up
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

export default LoginPage;
