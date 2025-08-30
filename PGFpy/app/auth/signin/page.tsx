"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Sparkles } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { AuthGuard } from "@/components/auth-guard"
import { DatabaseStatus } from "@/components/database-status"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("Attempting to sign in with:", email)

    try {
      await signIn(email, password)
      console.log("Sign in successful, redirecting to dashboard")
      router.push("/dashboard")
    } catch (error) {
      console.error("Sign in error:", error)
      let errorMessage = "Failed to sign in"

      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password"
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email and confirm your account"
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
            <p className="text-gray-600 dark:text-gray-300">Sign in to your account to continue</p>
          </div>

          {/* Database Status Check */}
          <div className="mb-6">
            <DatabaseStatus />
          </div>

          {/* Sign In Form */}
          <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Sign In</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

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
                      placeholder="Enter your password"
                      className="pl-10 border-gray-300 dark:border-navy-600 focus:border-brand-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white border-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>

              {/* Debug info in development */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-navy-800 rounded text-xs">
                  <p className="text-gray-600 dark:text-gray-400">
                    Debug: Supabase URL configured: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Yes" : "No"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
