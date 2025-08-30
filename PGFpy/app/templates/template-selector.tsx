"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Star, CheckCircle, Sparkles } from "lucide-react"
import { usePortfolio } from "@/components/portfolio-context"

interface Template {
  id: string
  name: string
  category: string
  description: string
  image: string
  rating: number
  downloads: number
  tags: string[]
  color: string
  featured: boolean
}

interface TemplateSelectorProps {
  templates: Template[]
}

export function TemplateSelector({ templates }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const { extractedData, updatePortfolioData } = usePortfolio()
  const router = useRouter()

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    updatePortfolioData({ selectedTemplate: templateId })
  }

  const handleGeneratePortfolio = () => {
    if (selectedTemplate && extractedData) {
      // Navigate to the generation progress page
      router.push(`/generation?template=${selectedTemplate}`)
    } else {
        alert("Please make sure you have uploaded a resume before generating.")
        router.push("/upload")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer bg-white dark:bg-navy-900 ${
              selectedTemplate === template.id
                ? "ring-2 ring-brand-500 dark:ring-brand-400 shadow-brand-200 dark:shadow-brand-900/20"
                : "border-gray-200 dark:border-navy-700"
            }`}
            onClick={() => handleSelectTemplate(template.id)}
          >
            <div className="relative">
              <img
                src={template.image || "/placeholder.svg"}
                alt={template.name}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {template.featured && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-brand-500 text-white text-xs border-0">Featured</Badge>
                </div>
              )}
              {selectedTemplate === template.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-gray-900 dark:text-white">{template.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{template.rating}</span>
                </div>
              </div>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                {template.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="border-0 shadow-2xl bg-white dark:bg-navy-900 border-gray-200 dark:border-navy-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">Template Selected</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {templates.find((t) => t.id === selectedTemplate)?.name}
                  </p>
                </div>
                <Button
                  onClick={handleGeneratePortfolio}
                  disabled={!extractedData}
                  className="bg-brand-500 hover:bg-brand-600 text-white border-0"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
