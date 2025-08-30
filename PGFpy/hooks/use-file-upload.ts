"use client"

import { useState, useCallback } from "react"

export interface UploadState {
  isUploading: boolean
  progress: number
  isComplete: boolean
  error: string | null
  file: File | null
}

export interface ExtractedData {
  name: string
  email: string
  phone: string
  title: string
  experience: string
  skills: string[]
  education: string
  projects: number
  certifications: number
  summary?: string
}

export function useFileUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    isComplete: false,
    error: null,
    file: null,
  })

  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)

  const uploadFile = useCallback(async (file: File) => {
    if (!file || file.type !== "application/pdf") {
      setUploadState((prev) => ({ ...prev, error: "Please select a valid PDF file" }))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setUploadState((prev) => ({ ...prev, error: "File size must be less than 10MB" }))
      return
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      isComplete: false,
      error: null,
      file,
    })

    // Simulate upload and processing with realistic timing
    const steps = [
      { progress: 15, message: "Uploading file...", delay: 500 },
      { progress: 35, message: "Extracting text...", delay: 800 },
      { progress: 55, message: "Parsing information...", delay: 1000 },
      { progress: 75, message: "AI enhancement...", delay: 1200 },
      { progress: 90, message: "Finalizing...", delay: 600 },
      { progress: 100, message: "Complete!", delay: 300 },
    ]

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay))
      setUploadState((prev) => ({ ...prev, progress: step.progress }))
    }

    // Simulate extracted data based on filename or random selection
    const mockDataOptions = [
      {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1 (555) 123-4567",
        title: "Senior Software Engineer",
        experience: "5+ years",
        skills: ["React", "Node.js", "Python", "AWS", "Docker", "TypeScript", "GraphQL"],
        education: "BS Computer Science - MIT",
        projects: 3,
        certifications: 2,
        summary:
          "Experienced software engineer with a passion for building scalable web applications and leading development teams.",
      },
      {
        name: "Sarah Wilson",
        email: "sarah.wilson@email.com",
        phone: "+1 (555) 987-6543",
        title: "UX/UI Designer",
        experience: "3+ years",
        skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "HTML/CSS"],
        education: "BA Design - RISD",
        projects: 4,
        certifications: 1,
        summary:
          "Creative UX/UI designer focused on creating intuitive and beautiful user experiences for web and mobile applications.",
      },
    ]

    const randomData = mockDataOptions[Math.floor(Math.random() * mockDataOptions.length)]

    setExtractedData(randomData)
    setUploadState((prev) => ({
      ...prev,
      isUploading: false,
      isComplete: true,
    }))
  }, [])

  const resetUpload = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      isComplete: false,
      error: null,
      file: null,
    })
    setExtractedData(null)
  }, [])

  return {
    uploadState,
    extractedData,
    uploadFile,
    resetUpload,
  }
}
