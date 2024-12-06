import { login } from "./actions";
import { Mail, Lock, ArrowRight } from "lucide-react";
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

export default function LoginPage() {
  return (
    <div className="-m-24 min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md relative overflow-hidden border-0 shadow-2xl dark:shadow-orange-500/10">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 rounded-2xl animate-gradient-x"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-500/20 via-amber-500/10 to-transparent rounded-bl-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-transparent rounded-tr-full blur-2xl"></div>

        <div className="relative">
          <CardHeader className="space-y-1 pb-12 pt-8">
            {/* Enhanced Lock Icon Container */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-md opacity-50"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full p-0.5">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            <CardTitle className="text-3xl font-bold text-center mt-12 mb-2">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Welcome Back
              </div>
            </CardTitle>
            <p className="text-center text-muted-foreground text-base">
              Enter your credentials to access your account
            </p>
          </CardHeader>

          <CardContent className="pb-8 px-8">
            <form className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-foreground font-medium text-base">Email</Label>
                <div className="relative group">
                  {/* Input highlight effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-orange-500 transition-colors duration-300"
                      size={20}
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      required
                      className="pl-12 py-6 bg-background/50 backdrop-blur-sm border-muted focus:border-orange-500 ring-offset-background focus:ring-2 focus:ring-orange-500 transition-all duration-300 text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-foreground font-medium text-base">Password</Label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-orange-500 transition-colors duration-300"
                      size={20}
                    />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="pl-12 py-6 bg-background/50 backdrop-blur-sm border-muted focus:border-orange-500 ring-offset-background focus:ring-2 focus:ring-orange-500 transition-all duration-300 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <div className="pt-4 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur opacity-30 group-hover:opacity-40 transition-all duration-300"></div>
                <Button
                  className="relative w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 py-6 text-lg"
                  formAction={login}
                >
                  Sign In
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pb-8 pt-4">
            <p className="text-base text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-orange-500 hover:text-amber-500 transition-colors relative group"
              >
                Sign up
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}