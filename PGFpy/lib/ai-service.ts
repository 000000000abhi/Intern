export interface ExtractedPortfolioData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location?: string
    website?: string
    linkedin?: string
    github?: string
  }
  professionalSummary: string
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
}

// Update the type alias to match
export type ExtractedData = ExtractedPortfolioData

export interface PortfolioGenerationRequest {
  extractedData: ExtractedPortfolioData
  templateId: string
  preferences?: {
    colorScheme?: string
    layout?: string
    sections?: string[]
  }
}

export interface GeneratedPortfolio {
  html: string
  css: string
  js?: string
  metadata: {
    title: string
    description: string
    keywords: string[]
  }
}

class AIService {
  async parseResumeViaAPI(file: File): Promise<ExtractedPortfolioData> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/parse-resume", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to parse resume")
    }

    const result = await response.json()
    return result.data
  }

  async generatePortfolioViaAPI(
    extractedData: ExtractedPortfolioData,
    templateId: string,
  ): Promise<GeneratedPortfolio> {
    const response = await fetch("/api/generate-portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        extractedData,
        templateId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to generate portfolio")
    }

    const result = await response.json()
    return result.portfolio
  }
}

export const aiService = new AIService()
