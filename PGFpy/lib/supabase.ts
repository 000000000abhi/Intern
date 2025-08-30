import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  console.error("SUPABASE_URL:", supabaseUrl ? "Set" : "Missing")
  console.error("SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Missing")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Types for our database tables
export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier: "free" | "pro" | "enterprise"
  credits_remaining: number
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  filename: string
  file_size: number
  file_url?: string
  extracted_text: string
  pages_count: number
  processing_status: "processing" | "completed" | "failed"
  created_at: string
  updated_at: string
}

export interface PortfolioData {
  id: string
  user_id: string
  resume_id: string
  personal_info: {
    name: string
    email: string
    phone: string
    location?: string
    website?: string
    linkedin?: string
    github?: string
  }
  professional_summary?: string
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
    achievements: string[]
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
    gpa?: string
    honors?: string
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages?: string[]
    frameworks?: string[]
    tools?: string[]
  }
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    link?: string
    github?: string
  }>
  certifications: Array<{
    name: string
    issuer: string
    date: string
    credentialId?: string
  }>
  achievements?: string[]
  languages?: Array<{
    language: string
    proficiency: string
  }>
  ai_enhanced: boolean
  created_at: string
  updated_at: string
}

export interface Portfolio {
  id: string
  user_id: string
  portfolio_data_id: string
  title: string
  slug: string
  template_id: string
  html_content: string
  css_content?: string
  js_content?: string
  metadata: {
    title: string
    description: string
    keywords: string[]
  }
  customizations: {
    colors?: {
      primary: string
      secondary: string
    }
    layout?: string
    sections?: string[]
  }
  is_published: boolean
  view_count: number
  last_viewed_at?: string
  created_at: string
  updated_at: string
}
