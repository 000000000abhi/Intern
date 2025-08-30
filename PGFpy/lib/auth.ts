import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export interface AuthUser extends User {
  profile?: {
    full_name?: string
    avatar_url?: string
    subscription_tier: "free" | "pro" | "enterprise"
    credits_remaining: number
  }
}

export class AuthService {
  private databaseReady: boolean | null = null

  private async checkDatabaseReady(): Promise<boolean> {
    if (this.databaseReady !== null) {
      return this.databaseReady
    }

    try {
      const { error } = await supabase.from("profiles").select("id").limit(1)
      this.databaseReady = !error || error.code !== "42P01"
      return this.databaseReady
    } catch (error) {
      console.warn("Database check failed:", error)
      this.databaseReady = false
      return false
    }
  }

  async signUp(email: string, password: string, fullName?: string) {
    try {
      console.log("Starting signup process for:", email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        console.error("Supabase auth signup error:", error)
        throw error
      }

      console.log("Auth signup successful:", data.user?.email)

      // Only try to create profile if database is ready
      const dbReady = await this.checkDatabaseReady()
      if (dbReady && data.user && data.user.email_confirmed_at) {
        console.log("User confirmed, ensuring profile exists...")
        await this.ensureProfile(data.user)
      } else if (data.user) {
        console.log("User created but database not ready or user not confirmed yet")
      }

      return data
    } catch (error) {
      console.error("SignUp error:", error)
      throw error
    }
  }

  async signIn(email: string, password: string) {
    try {
      console.log("Starting signin process for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("SignIn error:", error)
        throw error
      }

      console.log("SignIn successful:", data.user?.email)

      // Only ensure profile if database is ready
      const dbReady = await this.checkDatabaseReady()
      if (dbReady && data.user) {
        await this.ensureProfile(data.user)
      }

      return data
    } catch (error) {
      console.error("SignIn exception:", error)
      throw error
    }
  }

  private async ensureProfile(user: User) {
    try {
      const dbReady = await this.checkDatabaseReady()
      if (!dbReady) {
        console.log("Database not ready, skipping profile operations")
        return null
      }

      console.log("Checking if profile exists for user:", user.id)

      // Check if profile exists - use limit to handle potential duplicates
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("id", user.id)
        .limit(2) // Get up to 2 to detect duplicates

      if (error && error.code === "PGRST116") {
        // No profiles found, create one
        console.log("No profile found, creating...")
        return await this.createProfile(user.id, user.email!, user.user_metadata?.full_name)
      } else if (error) {
        console.error("Error checking profile:", error)
        return null
      }

      if (!profiles || profiles.length === 0) {
        // No profiles found, create one
        console.log("No profiles returned, creating...")
        return await this.createProfile(user.id, user.email!, user.user_metadata?.full_name)
      }

      if (profiles.length > 1) {
        console.warn(`Found ${profiles.length} profiles for user ${user.id}, cleaning up...`)
        await this.cleanupDuplicateProfiles(user.id, profiles)
      }

      console.log("Profile exists")
      return profiles[0]
    } catch (error) {
      console.error("EnsureProfile exception:", error)
      return null
    }
  }

  private async createProfile(userId: string, email: string, fullName?: string) {
    try {
      console.log("Creating profile for user:", userId)

      // First check if profile was created by another process
      const { data: existingProfiles } = await supabase.from("profiles").select("id").eq("id", userId).limit(1)

      if (existingProfiles && existingProfiles.length > 0) {
        console.log("Profile already exists, skipping creation")
        return existingProfiles[0]
      }

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: email,
          full_name: fullName || null,
          subscription_tier: "free",
          credits_remaining: 3,
        })
        .select()
        .single()

      if (error) {
        // Handle unique constraint violation (profile already exists)
        if (error.code === "23505") {
          console.log("Profile already exists (unique constraint), fetching existing profile")
          const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", userId).single()

          return existingProfile
        }

        console.error("Profile creation error details:", error)
        return null
      }

      console.log("Profile created successfully:", data)
      return data
    } catch (error) {
      console.error("Profile creation exception:", error)
      return null
    }
  }

  async signOut() {
    try {
      console.log("Starting signout process")

      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("SignOut error:", error)
        throw error
      }
      console.log("SignOut successful")
    } catch (error) {
      console.error("SignOut exception:", error)
      throw error
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // First check if we have a session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("GetSession error:", sessionError)
        return null
      }

      if (!session || !session.user) {
        console.log("No active session found")
        return null
      }

      console.log("Active session found for:", session.user.email)

      // Get user from session
      const user = session.user

      // Check if database is ready before trying to fetch profile
      const dbReady = await this.checkDatabaseReady()
      if (!dbReady) {
        console.log("Database not ready, returning user without profile")
        return user as AuthUser
      }

      // Try to get profile data - use limit(1) and handle multiple results
      try {
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .limit(1)

        if (profileError) {
          console.error("Profile fetch error:", profileError)

          // If profile doesn't exist, try to create it
          if (profileError.code === "PGRST116") {
            console.log("Profile not found, attempting to create...")
            const newProfile = await this.createProfile(user.id, user.email!, user.user_metadata?.full_name)

            return {
              ...user,
              profile: newProfile,
            } as AuthUser
          }

          // Return user without profile for other errors
          return user as AuthUser
        }

        // Handle multiple or no profiles
        if (!profiles || profiles.length === 0) {
          console.log("No profile found, attempting to create...")
          const newProfile = await this.createProfile(user.id, user.email!, user.user_metadata?.full_name)

          return {
            ...user,
            profile: newProfile,
          } as AuthUser
        }

        if (profiles.length > 1) {
          console.warn(`Multiple profiles found for user ${user.id}, using the first one`)
          // Optionally clean up duplicates here
          await this.cleanupDuplicateProfiles(user.id, profiles)
        }

        const profile = profiles[0]

        return {
          ...user,
          profile,
        } as AuthUser
      } catch (profileException) {
        console.error("Profile operation exception:", profileException)
        // Return user without profile if profile operations fail
        return user as AuthUser
      }
    } catch (error) {
      console.error("Get current user exception:", error)
      return null
    }
  }

  async updateProfile(updates: { full_name?: string; avatar_url?: string }) {
    try {
      const dbReady = await this.checkDatabaseReady()
      if (!dbReady) {
        throw new Error("Database tables not found. Please run the migration scripts.")
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) throw new Error("Not authenticated")

      const { error } = await supabase.from("profiles").update(updates).eq("id", session.user.id)

      if (error) {
        console.error("UpdateProfile error:", error)
        throw error
      }

      console.log("Profile updated successfully")
    } catch (error) {
      console.error("UpdateProfile exception:", error)
      throw error
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        console.error("ResetPassword error:", error)
        throw error
      }

      console.log("Password reset email sent")
    } catch (error) {
      console.error("ResetPassword exception:", error)
      throw error
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email || "No user")

      if (event === "SIGNED_IN" && session?.user) {
        // Only ensure profile if database is ready
        const dbReady = await this.checkDatabaseReady()
        if (dbReady) {
          await this.ensureProfile(session.user)
        }
      }

      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }

  // Public method to reset database status check
  resetDatabaseStatus() {
    this.databaseReady = null
  }

  private async cleanupDuplicateProfiles(userId: string, profiles: any[]) {
    try {
      if (profiles.length <= 1) return

      console.log(`Cleaning up ${profiles.length - 1} duplicate profiles for user ${userId}`)

      // Keep the most recent profile and delete the rest
      const sortedProfiles = profiles.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )

      const profileToKeep = sortedProfiles[0]
      const profilesToDelete = sortedProfiles.slice(1)

      for (const profile of profilesToDelete) {
        const { error } = await supabase.from("profiles").delete().eq("id", profile.id)

        if (error) {
          console.error(`Failed to delete duplicate profile ${profile.id}:`, error)
        } else {
          console.log(`Deleted duplicate profile ${profile.id}`)
        }
      }

      console.log(`Kept profile ${profileToKeep.id} as the primary profile`)
    } catch (error) {
      console.error("Error cleaning up duplicate profiles:", error)
    }
  }
}

export const authService = new AuthService()
