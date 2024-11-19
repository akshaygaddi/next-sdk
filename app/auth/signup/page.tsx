import { signup } from "./actions"
import { Mail, Lock, ArrowRight, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-pink-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Sign Up
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="johndoe"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Button className="w-full" formAction={signup}>
                            Sign Up
                            <ArrowRight className="ml-2" size={18} />
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}