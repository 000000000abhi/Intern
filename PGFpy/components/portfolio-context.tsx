"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface ExtractedData {
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

interface PortfolioData extends ExtractedData {
  selectedTemplate?: string
  generatedPortfolio?: GeneratedPortfolio
  customizations?: {
    colors?: {
      primary: string
      secondary: string
    }
    layout?: string
    sections?: string[]
  }
}

interface PortfolioContextType {
  portfolioData: PortfolioData | null
  setPortfolioData: (data: PortfolioData | null) => void
  updatePortfolioData: (updates: Partial<PortfolioData>) => void
  extractedData: ExtractedData | null
  setExtractedData: (data: ExtractedData | null) => void
  generatedPortfolio: GeneratedPortfolio | null
  setGeneratedPortfolio: (portfolio: GeneratedPortfolio | null) => void
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [generatedPortfolio, setGeneratedPortfolio] = useState<GeneratedPortfolio | null>(null)

  const updatePortfolioData = (updates: Partial<PortfolioData>) => {
    setPortfolioData((prev) => (prev ? { ...prev, ...updates } : null))
  }

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        setPortfolioData,
        updatePortfolioData,
        extractedData,
        setExtractedData,
        generatedPortfolio,
        setGeneratedPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}
