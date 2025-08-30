"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Palette, Code, Briefcase, User, Sparkles } from "lucide-react"
import { TemplateSelector } from "./template-selector"
import { usePortfolio } from "@/components/portfolio-context"

export default function TemplatesPage() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"
  const { setPortfolioData } = usePortfolio()
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    // Load demo data if this is a demo session
    if (isDemo) {
      const demoData = localStorage.getItem("demoPortfolioData")
      if (demoData) {
        setPortfolioData(JSON.parse(demoData))
      }
    }
  }, [isDemo, setPortfolioData])

  const templates = [
    {
      id: "modern-developer",
      name: "Modern Developer",
      category: "Developer",
      description: "Clean, modern design perfect for software developers and engineers",
      image: "/placeholder.svg?height=300&width=400&text=Modern+Developer+Template",
      rating: 4.9,
      downloads: 2847,
      tags: ["Dark Theme", "Minimalist", "Tech"],
      color: "from-slate-800 to-slate-900",
      featured: true,
    },
    {
      id: "creative-designer",
      name: "Creative Designer",
      category: "Designer",
      description: "Vibrant and creative layout showcasing design work beautifully",
      image: "/placeholder.svg?height=300&width=400&text=Creative+Designer+Template",
      rating: 4.8,
      downloads: 1923,
      tags: ["Colorful", "Creative", "Visual"],
      color: "from-purple-600 to-pink-600",
      featured: true,
    },
    {
      id: "professional-business",
      name: "Professional Business",
      category: "Business",
      description: "Corporate-friendly design for business professionals and consultants",
      image: "/placeholder.svg?height=300&width=400&text=Professional+Business+Template",
      rating: 4.7,
      downloads: 3156,
      tags: ["Professional", "Corporate", "Clean"],
      color: "from-blue-600 to-indigo-600",
      featured: false,
    },
    {
      id: "minimalist-writer",
      name: "Minimalist Writer",
      category: "Writer",
      description: "Simple, elegant design focusing on content and readability",
      image: "/placeholder.svg?height=300&width=400&text=Minimalist+Writer+Template",
      rating: 4.6,
      downloads: 1456,
      tags: ["Minimal", "Typography", "Clean"],
      color: "from-gray-100 to-gray-200",
      featured: false,
    },
    {
      id: "data-scientist",
      name: "Data Scientist",
      category: "Data",
      description: "Analytics-focused template with charts and data visualization",
      image: "/placeholder.svg?height=300&width=400&text=Data+Scientist+Template",
      rating: 4.8,
      downloads: 987,
      tags: ["Analytics", "Charts", "Technical"],
      color: "from-emerald-600 to-teal-600",
      featured: true,
    },
    {
      id: "marketing-pro",
      name: "Marketing Pro",
      category: "Marketing",
      description: "Dynamic design perfect for marketing professionals and agencies",
      image: "/placeholder.svg?height=300&width=400&text=Marketing+Pro+Template",
      rating: 4.5,
      downloads: 2134,
      tags: ["Dynamic", "Marketing", "Engaging"],
      color: "from-orange-500 to-red-500",
      featured: false,
    },
  ]

  const categories = [
    { name: "All", icon: Palette, count: templates.length },
    { name: "Developer", icon: Code, count: templates.filter((t) => t.category === "Developer").length },
    { name: "Designer", icon: Palette, count: templates.filter((t) => t.category === "Designer").length },
    { name: "Business", icon: Briefcase, count: templates.filter((t) => t.category === "Business").length },
    { name: "Writer", icon: User, count: templates.filter((t) => t.category === "Writer").length },
  ]

  const filteredTemplates =
    activeCategory === "All" ? templates : templates.filter((t) => t.category === activeCategory)

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          {isDemo && (
            <Badge className="mb-4 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Demo Mode - Using Sample Data
            </Badge>
          )}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Template</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select from our collection of professionally designed templates, each optimized for different industries and
            roles.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={activeCategory === category.name ? "default" : "outline"}
              onClick={() => setActiveCategory(category.name)}
              className={`flex items-center gap-2 ${
                activeCategory === category.name
                  ? "bg-brand-500 hover:bg-brand-600 text-white border-0"
                  : "bg-transparent border-gray-200 dark:border-navy-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800"
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
              <Badge variant="secondary" className="ml-1 text-xs bg-white/20 text-current border-0">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Templates */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {activeCategory === "All" ? "All Templates" : `${activeCategory} Templates`}
          </h2>
          <TemplateSelector templates={filteredTemplates} />
        </div>
      </div>
    </div>
  )
}
