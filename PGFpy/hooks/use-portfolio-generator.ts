"use client"

import { useState, useCallback, useEffect } from "react"
import { aiService, type ExtractedPortfolioData, type GeneratedPortfolio } from "@/lib/ai-service"

export interface GenerationState {
  isGenerating: boolean
  progress: number
  isComplete: boolean
  error: string | null
  stage: "idle" | "generating" | "complete"
}

export function usePortfolioGenerator() {
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    isComplete: false,
    error: null,
    stage: "idle",
  })

  const [generatedPortfolio, setGeneratedPortfolio] = useState<GeneratedPortfolio | null>(null)

  const generatePortfolio = useCallback(
    async (extractedData: ExtractedPortfolioData, templateId: string, preferences?: any) => {
      setGenerationState({
        isGenerating: true,
        progress: 0,
        isComplete: false,
        error: null,
        stage: "generating",
      })

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setGenerationState((prev) => ({
            ...prev,
            progress: Math.min(prev.progress + 15, 85),
          }))
        }, 800)

        const portfolio = await aiService.generatePortfolio({
          extractedData,
          templateId,
          preferences,
        })

        clearInterval(progressInterval)
        setGeneratedPortfolio(portfolio)

        setGenerationState({
          isGenerating: false,
          progress: 100,
          isComplete: true,
          error: null,
          stage: "complete",
        })

        // Return the portfolio so it can be used immediately
        return portfolio
      } catch (error) {
        console.error("Portfolio generation error:", error)
        setGenerationState({
          isGenerating: false,
          progress: 0,
          isComplete: false,
          error: error instanceof Error ? error.message : "Failed to generate portfolio",
          stage: "idle",
        })
        throw error
      }
    },
    [],
  )

  const resetGeneration = useCallback(() => {
    setGenerationState({
      isGenerating: false,
      progress: 0,
      isComplete: false,
      error: null,
      stage: "idle",
    })
    setGeneratedPortfolio(null)
  }, [])

  // Return the generated portfolio when generation is complete
  useEffect(() => {
    if (generationState.isComplete && generatedPortfolio) {
      console.log("Generated Portfolio:", generatedPortfolio)
    }
  }, [generationState.isComplete, generatedPortfolio])

  return {
    generationState,
    generatedPortfolio,
    generatePortfolio,
    resetGeneration,
  }
}
