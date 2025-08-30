"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { clear } from "console"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/auth/signin",
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    // Not logged in → redirect to signin
    if (requireAuth && !user) {
      console.log("🔒 No user found, redirecting to sign in")
      router.replace(redirectTo)
    }

    // Already logged in → prevent accessing /auth/*
    if (!requireAuth && user && pathname.startsWith("/auth")) {
      console.log("✅ Already signed in, redirecting to dashboard")
      router.replace("/dashboard")
    }
  }, [user, loading, requireAuth, redirectTo, router, pathname])

  if (loading || (requireAuth && !user)) {
    return (
      <div className="min-h-screen bg-white dark:bg-navy-950 flex items-center justify-center">
        <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-brand-600" />
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
