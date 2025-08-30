"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, CheckCircle, Star, Smartphone, Monitor } from "lucide-react"
import { portfolioTemplates, type PortfolioTemplate } from "@/lib/templates"
import { MonacoEditor } from "./monaco-editor"

interface TemplateGalleryProps {
  selectedTemplate?: string
  onTemplateSelect: (templateId: string) => void
  showPreview?: boolean
}

export function TemplateGallery({ selectedTemplate, onTemplateSelect, showPreview = true }: TemplateGalleryProps) {
  const [previewTemplate, setPreviewTemplate] = useState<PortfolioTemplate | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  const handlePreview = (template: PortfolioTemplate) => {
    setPreviewTemplate(template)
  }

  const handleSelectTemplate = (templateId: string) => {
    onTemplateSelect(templateId)
  }

  // categories + featured
  const categories = [...new Set(portfolioTemplates.map((t) => t.category))]
  const featuredTemplates = portfolioTemplates.filter((t) => t.features?.includes("featured"))

  return (
    <div className="space-y-8">
      {/* Featured Templates */}
      {featuredTemplates.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Featured Templates</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={() => handleSelectTemplate(template.id)}
                onPreview={() => handlePreview(template)}
                showPreview={showPreview}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Templates by Category */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">All Templates</h3>
        <Tabs defaultValue={categories[0]} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-navy-800">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioTemplates
                  .filter((t) => t.category === category)
                  .map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate === template.id}
                      onSelect={() => handleSelectTemplate(template.id)}
                      onPreview={() => handlePreview(template)}
                      showPreview={showPreview}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Template Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-6xl h-[90vh] bg-white dark:bg-navy-900">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-900 dark:text-white">{previewTemplate?.name}</span>
                {previewTemplate?.category && (
                  <Badge variant="outline" className="text-xs">
                    {previewTemplate.category}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(previewMode === "desktop" ? "mobile" : "desktop")}
                  className="bg-transparent border-gray-200 dark:border-navy-700"
                >
                  {previewMode === "desktop" ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                  {previewMode === "desktop" ? "Mobile" : "Desktop"}
                </Button>
                {previewTemplate && (
                  <Button
                    onClick={() => handleSelectTemplate(previewTemplate.id)}
                    className="bg-brand-500 hover:bg-brand-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Select Template
                  </Button>
                )}
              </div>
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              {previewTemplate?.description}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="preview" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-navy-800">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="jsx">JSX Code</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>

            {/* Preview iframe */}
            <TabsContent value="preview" className="flex-1 mt-4">
              <div className="h-full border border-gray-200 dark:border-navy-700 rounded-lg overflow-hidden">
                <div className={`h-full ${previewMode === "mobile" ? "max-w-sm mx-auto" : ""}`}>
                  <iframe
                    src={
                      previewMode === "desktop" ? previewTemplate?.preview.desktop : previewTemplate?.preview.mobile
                    }
                    className="w-full h-full border-0"
                    title={`${previewTemplate?.name} Preview`}
                  />
                </div>
              </div>
            </TabsContent>

            {/* JSX */}
            <TabsContent value="jsx" className="flex-1 mt-4">
              <div className="h-full border border-gray-200 dark:border-navy-700 rounded-lg overflow-hidden">
                <MonacoEditor
                  value={previewTemplate?.code.jsx || ""}
                  language="javascript"
                  height="100%"
                  readOnly
                />
              </div>
            </TabsContent>

            {/* CSS */}
            <TabsContent value="css" className="flex-1 mt-4">
              <div className="h-full border border-gray-200 dark:border-navy-700 rounded-lg overflow-hidden">
                <MonacoEditor value={previewTemplate?.code.css || ""} language="css" height="100%" readOnly />
              </div>
            </TabsContent>

            {/* HTML */}
            <TabsContent value="html" className="flex-1 mt-4">
              <div className="h-full border border-gray-200 dark:border-navy-700 rounded-lg overflow-hidden">
                <MonacoEditor value={previewTemplate?.code.html || ""} language="html" height="100%" readOnly />
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface TemplateCardProps {
  template: PortfolioTemplate
  isSelected: boolean
  onSelect: () => void
  onPreview: () => void
  showPreview: boolean
}

function TemplateCard({ template, isSelected, onSelect, onPreview, showPreview }: TemplateCardProps) {
  return (
    <Card
      className={`group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer bg-white dark:bg-navy-900 ${
        isSelected
          ? "ring-2 ring-brand-500 dark:ring-brand-400 shadow-brand-200 dark:shadow-brand-900/20"
          : "border-gray-200 dark:border-navy-700"
      }`}
      onClick={onSelect}
    >
      <div className="relative">
        <img
          src={template.image || "/placeholder.svg"}
          alt={template.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {template.features?.includes("featured") && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-brand-500 text-white text-xs border-0">Featured</Badge>
          </div>
        )}
        {isSelected && (
          <div className="absolute top-3 right-3">
            <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
        {showPreview && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onPreview()
              }}
            >
              <Eye className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-gray-900 dark:text-white">{template.name}</CardTitle>
          <Badge
            variant="outline"
            className="text-xs border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-300"
          >
            {template.category}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs px-2 py-0 bg-gray-100 dark:bg-navy-800 text-gray-700 dark:text-gray-300"
            >
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="text-xs px-2 py-0 bg-gray-100 dark:bg-navy-800 text-gray-700 dark:text-gray-300"
            >
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
