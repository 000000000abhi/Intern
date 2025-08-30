"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, User, Sparkles } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { AuthGuard } from "@/components/auth-guard"
import { DatabaseStatus } from "@/components/database-status"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    console.log("Attempting to sign up with:", email)

    try {
      await signUp(email, password, fullName)
      console.log("Sign up successful")
      setSuccess("Account created successfully! You can now sign in.")

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Sign up error:", error)
      let errorMessage = "Failed to create account"

      if (error instanceof Error) {
        if (error.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists"
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "Password should be at least 6 characters long"
        } else if (error.message.includes("Database tables not found")) {
          errorMessage = "Database setup required. Please run the migration scripts."
        } else {
          errorMessage = error.message
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-white dark:bg-navy-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">PortfolioAI</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create your account</h1>
            <p className="text-gray-600 dark:text-gray-300">Start building amazing portfolios with AI</p>
          </div>

          {/* Database Status Check */}
          <div className="mb-6">
            <DatabaseStatus />
          </div>

          {/* Sign Up Form */}
          <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Sign Up</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Create your account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                    <AlertDescription className="text-green-700 dark:text-green-300">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-10 border-gray-300 dark:border-navy-600 focus:border-brand-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 border-gray-300 dark:border-navy-600 focus:border-brand-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="pl-10 border-gray-300 dark:border-navy-600 focus:border-brand-500"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white border-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
