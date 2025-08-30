"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authService, type AuthUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    // Get initial user
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (mounted) setUser(currentUser)
      } catch (error) {
        console.error("Auth initialization error:", error)
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (user) => {
      if (mounted) {
        setUser(user)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      await authService.signIn(email, password)
      // user state will be updated via onAuthStateChange
    } catch (error) {
      console.error("SignIn error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true)
    try {
      await authService.signUp(email, password, fullName)
    } catch (error) {
      console.error("SignUp error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setUser(null)       // 🚀 clear user immediately
      setLoading(false)   // stop buffering
      await authService.signOut()
      router.replace("/") // 🚀 redirect to landing page
    } catch (error) {
      console.error("SignOut error:", error)
    }
  }

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    try {
      await authService.updateProfile(updates)
      const user = await authService.getCurrentUser()
      setUser(user)
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,   // ✅ now fixed
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
