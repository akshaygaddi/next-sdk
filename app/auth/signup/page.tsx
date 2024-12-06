import { signup } from "./actions";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 rounded-2xl animate-gradient-x"></div>

        <div className="relative">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Create Account
              </div>
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Enter your details to start your journey
            </p>
          </CardHeader>

          <CardContent>
            <form className="space-y-4">
              {/* Username Input */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="johndoe"
                      required
                      className="pl-10 bg-background border-border focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="pl-10 bg-background border-border focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="pl-10 bg-background border-border focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-all duration-300"></div>
                <Button
                  className="relative w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium transition-all duration-300"
                  formAction={signup}
                >
                  Create Account
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-orange-500 hover:text-amber-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </div>

        {/* Decorative corner gradients */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-tr-full"></div>
      </Card>
    </div>
  );
}