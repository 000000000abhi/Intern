import { supabase } from "./supabase"
import type { Resume, PortfolioData, Portfolio } from "./supabase"

export class DatabaseService {
  private async checkAuthentication() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error("Authentication check error:", error)
        throw new Error(`Authentication failed: ${error.message}`)
      }

      if (!user) {
        throw new Error("Not authenticated - please sign in first")
      }

      console.log("User authenticated:", user.email)
      return user
    } catch (error) {
      console.error("Authentication check exception:", error)
      throw error
    }
  }

  private async checkDatabaseReady() {
    try {
      const { error } = await supabase.from("profiles").select("id").limit(1)
      if (error && error.code === "42P01") {
        throw new Error("Database tables not found. Please run the migration scripts first.")
      }
      return true
    } catch (error) {
      console.error("Database readiness check failed:", error)
      throw error
    }
  }

  // Resume operations
  async saveResume(data: {
    filename: string
    file_size: number
    extracted_text: string
    pages_count: number
    file_url?: string
  }) {
    try {
      console.log("Starting saveResume operation...")

      // Check if database is ready
      await this.checkDatabaseReady()

      // Check authentication
      const user = await this.checkAuthentication()

      console.log("Attempting to save resume:", {
        filename: data.filename,
        file_size: data.file_size,
        pages_count: data.pages_count,
        text_length: data.extracted_text.length,
        user_id: user.id,
      })

      const resumeData = {
        user_id: user.id,
        filename: data.filename,
        file_size: data.file_size,
        extracted_text: data.extracted_text,
        pages_count: data.pages_count,
        file_url: data.file_url || null,
        processing_status: "completed" as const,
      }

      const { data: resume, error } = await supabase.from("resumes").insert(resumeData).select().single()

      if (error) {
        console.error("SaveResume database error:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        })

        // Provide more specific error messages
        if (error.code === "42P01") {
          throw new Error("Database tables not found. Please run the migration scripts.")
        } else if (error.code === "23503") {
          throw new Error("User profile not found. Please sign out and sign in again.")
        } else if (error.code === "42501") {
          throw new Error("Permission denied. Please check your database permissions.")
        } else {
          throw new Error(`Database error: ${error.message || "Unknown error"}`)
        }
      }

      if (!resume) {
        throw new Error("Resume was not saved - no data returned from database")
      }

      console.log("Resume saved successfully:", resume.id)
      return resume as Resume
    } catch (error) {
      console.error("SaveResume exception:", error)
      throw error
    }
  }

  async getResumes() {
    try {
      await this.checkDatabaseReady()
      const user = await this.checkAuthentication()

      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("GetResumes error:", error)
        throw new Error(`Failed to fetch resumes: ${error.message}`)
      }

      return data as Resume[]
    } catch (error) {
      console.error("GetResumes exception:", error)
      throw error
    }
  }

  async getResume(id: string) {
    try {
      await this.checkDatabaseReady()
      const user = await this.checkAuthentication()

      const { data, error } = await supabase.from("resumes").select("*").eq("id", id).eq("user_id", user.id).single()

      if (error) {
        console.error("GetResume error:", error)
        if (error.code === "PGRST116") {
          throw new Error("Resume not found")
        }
        throw new Error(`Failed to fetch resume: ${error.message}`)
      }

      return data as Resume
    } catch (error) {
      console.error("GetResume exception:", error)
      throw error
    }
  }

  // Portfolio data operations
  async savePortfolioData(data: {
    resume_id: string
    personal_info: any
    professional_summary?: string
    experience: any[]
    education: any[]
    skills: any
    projects: any[]
    certifications: any[]
    achievements?: any[]
    languages?: any[]
    ai_enhanced?: boolean
  }) {
    try {
      console.log("Starting savePortfolioData operation...")

      await this.checkDatabaseReady()
      const user = await this.checkAuthentication()

      console.log("Attempting to save portfolio data:", {
        resume_id: data.resume_id,
        user_id: user.id,
        has_personal_info: !!data.personal_info,
        experience_count: data.experience?.length || 0,
        skills_count: Object.keys(data.skills || {}).length,
      })

      const portfolioData = {
        user_id: user.id,
        resume_id: data.resume_id,
        personal_info: data.personal_info || {},
        professional_summary: data.professional_summary || null,
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || {},
        projects: data.projects || [],
        certifications: data.certifications || [],
        achievements: data.achievements || [],
        languages: data.languages || [],
        ai_enhanced: data.ai_enhanced || false,
      }

      const { data: savedData, error } = await supabase.from("portfolio_data").insert(portfolioData).select().single()

      if (error) {
        console.error("SavePortfolioData database error:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        })

        if (error.code === "23503") {
          throw new Error("Resume not found or access denied")
        } else {
          throw new Error(`Failed to save portfolio data: ${error.message}`)
        }
      }

      if (!savedData) {
        throw new Error("Portfolio data was not saved - no data returned from database")
      }

      console.log("Portfolio data saved successfully:", savedData.id)
      return savedData as PortfolioData
    } catch (error) {
      console.error("SavePortfolioData exception:", error)
      throw error
    }
  }

  async getPortfolioData(resumeId: string) {
    try {
      await this.checkDatabaseReady()
      const user = await this.checkAuthentication()

      const { data, error } = await supabase
        .from("portfolio_data")
        .select("*")
        .eq("resume_id", resumeId)
        .eq("user_id", user.id)
        .single()

      if (error) {
        console.error("GetPortfolioData error:", error)
        if (error.code === "PGRST116") {
          throw new Error("Portfolio data not found")
        }
        throw new Error(`Failed to fetch portfolio data: ${error.message}`)
      }

      return data as PortfolioData
    } catch (error) {
      console.error("GetPortfolioData exception:", error)
      throw error
    }
  }

  async updatePortfolioData(id: string, updates: Partial<PortfolioData>) {
    try {
      await this.checkDatabaseReady()
      const user = await this.checkAuthentication()

      const { data, error } = await supabase
        .from("portfolio_data")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) {
        console.error("UpdatePortfolioData error:", error)
        throw new Error(`Failed to update portfolio data: ${error.message}`)
      }

      return data as PortfolioData
    } catch (error) {
      console.error("UpdatePortfolioData exception:", error)
      throw error
    }
  }

  // Portfolio operations
  async savePortfolio(data: {
    portfolio_data_id: string
    title: string
    slug: string
    template_id: string
    html_content: string
    css_content?: string
    js_content?: string
    metadata: any
    customizations?: any
  }) {
    try {
      await this.checkDatabaseReady()
      const user = await this.checkAuthentication()

      const { data: portfolio, error } = await supabase
        .from("portfolios")
        .insert({
          user_id: user.id,
          ...data,
        })
        .select()
        .single()

      if (error) {
        console.error("SavePortfolio error:", error)
        throw new Error(`Failed to save portfolio: ${error.message}`)
      }

      console.log("Portfolio saved successfully:", portfolio.id)
      return portfolio as Portfolio
    } catch (error) {
      console.error("SavePortfolio exception:", error)
      throw error
    }
  }

  async getPortfolios() {
    try {
      await this.checkDatabaseReady()
      const user = await this.checkAuthentication()

      const { data, error } = await supabase
        .from("portfolios")
        .select(`
          *,
          portfolio_data:portfolio_data_id (
            personal_info
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("GetPortfolios error:", error)
        throw new Error(`Failed to fetch portfolios: ${error.message}`)
      }

      return data as (Portfolio & { portfolio_data: { personal_info: any } })[]
    } catch (error) {
      console.error("GetPortfolios exception:", error)
      throw error
    }
  }

  async getPortfolio(id: string) {
    try {
      await this.checkDatabaseReady()
      const user = await this.checkAuthentication()

      const { data, error } = await supabase
        .from("portfolios")
        .select(`
          *,
          portfolio_data:portfolio_data_id (*)
        `)
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

      if (error) {
        console.error("GetPortfolio error:", error)
        if (error.code === "PGRST116") {
          throw new Error("Portfolio not found")
        }
        throw new Error(`Failed to fetch portfolio: ${error.message}`)
      }

      return data as Portfolio & { portfolio_data: PortfolioData }
    } catch (error) {
      console.error("GetPortfolio exception:", error)
      throw error
    }
  }

  async getPublicPortfolio(slug: string) {
    try {
      await this.checkDatabaseReady()

      const { data, error } = await supabase
        .from("portfolios")
        .select(`
          *,
          portfolio_data:portfolio_data_id (*)
        `)
        .eq("slug", slug)
        .eq("is_published", true)
        .single()

      if (error) {
        console.error("GetPublicPortfolio error:", error)
        if (error.code === "PGRST116") {
          throw new Error("Portfolio not found")
        }
        throw new Error(`Failed to fetch portfolio: ${error.message}`)
      }

      // Increment view count
      await supabase
        .from("portfolios")
        .update({
          view_count: data.view_count + 1,
          last_viewed_at: new Date().toISOString(),
        })
        .eq("id", data.id)

      return data as Portfolio & { portfolio_data: PortfolioData }
    } catch (error) {
      console.error("GetPublicPortfolio exception:", error)
      throw error
    }
  }

  async updatePortfolio(id: string, updates: Partial<Portfolio>) {
    try {
      await this.checkDatabaseReady()
      const user = await this.checkAuthentication()

      const { data, error } = await supabase
        .from("portfolios")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) {
        console.error("UpdatePortfolio error:", error)
        throw new Error(`Failed to update portfolio: ${error.message}`)
      }

      return data as Portfolio
    } catch (error) {
      console.error("UpdatePortfolio exception:", error)
      throw error
    }
  }

  async deletePortfolio(id: string) {
    try {
      await this.checkDatabaseReady()
      const user = await this.checkAuthentication()

      const { error } = await supabase.from("portfolios").delete().eq("id", id).eq("user_id", user.id)

      if (error) {
        console.error("DeletePortfolio error:", error)
        throw new Error(`Failed to delete portfolio: ${error.message}`)
      }

      console.log("Portfolio deleted successfully")
    } catch (error) {
      console.error("DeletePortfolio exception:", error)
      throw error
    }
  }

  // User credits management
  async getUserCredits() {
    try {
      await this.checkDatabaseReady()
      const user = await this.checkAuthentication()

      const { data, error } = await supabase
        .from("profiles")
        .select("credits_remaining, subscription_tier")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("GetUserCredits error:", error)
        if (error.code === "PGRST116") {
          // Profile doesn't exist, return default values
          return { credits_remaining: 3, subscription_tier: "free" }
        }
        throw new Error(`Failed to fetch user credits: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error("GetUserCredits exception:", error)
      throw error
    }
  }

  async decrementCredits() {
    try {
      await this.checkDatabaseReady()
      const user = await this.checkAuthentication()

      // First get current credits
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("credits_remaining")
        .eq("id", user.id)
        .single()

      if (fetchError) {
        console.error("FetchCredits error:", fetchError)
        if (fetchError.code === "PGRST116") {
          throw new Error("User profile not found. Please sign out and sign in again.")
        }
        throw new Error(`Failed to fetch credits: ${fetchError.message}`)
      }

      if (profile.credits_remaining <= 0) {
        throw new Error("No credits remaining")
      }

      // Decrement credits
      const { data, error } = await supabase
        .from("profiles")
        .update({ credits_remaining: profile.credits_remaining - 1 })
        .eq("id", user.id)
        .select()
        .single()

      if (error) {
        console.error("DecrementCredits error:", error)
        throw new Error(`Failed to decrement credits: ${error.message}`)
      }

      console.log("Credits decremented successfully")
      return data
    } catch (error) {
      console.error("DecrementCredits exception:", error)
      throw error
    }
  }
}

export const databaseService = new DatabaseService()
