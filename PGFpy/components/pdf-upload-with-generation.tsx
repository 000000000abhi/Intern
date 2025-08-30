"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, AlertCircle, CheckCircle, Brain, Sparkles } from "lucide-react"
import { TemplateGallery } from "./template-gallery"
import type { PDFParserState } from "@/hooks/use-pdf-parser"

interface PDFUploadWithGenerationProps {
  onFileSelect: (file: File, templateId: string) => void
  parserState: PDFParserState
  selectedTemplate: string
  onTemplateChange: (templateId: string) => void
}

export function PDFUploadWithGeneration({
  onFileSelect,
  parserState,
  selectedTemplate,
  onTemplateChange,
}: PDFUploadWithGenerationProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file && selectedTemplate) {
        console.log("📁 File dropped:", file.name)
        console.log("🎨 Selected template:", selectedTemplate)
        onFileSelect(file, selectedTemplate)
      }
    },
    [onFileSelect, selectedTemplate],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: parserState.isProcessing,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  const getStageIcon = (stage: PDFParserState["stage"]) => {
    switch (stage) {
      case "parsing":
        return <FileText className="w-5 h-5 text-blue-600 animate-pulse" />
      case "structuring":
        return <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
      case "generating":
        return <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
      case "saving":
        return <CheckCircle className="w-5 h-5 text-green-600 animate-pulse" />
      case "complete":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <Upload className="w-5 h-5 text-gray-400" />
    }
  }

  const getStageDescription = (stage: PDFParserState["stage"]) => {
    switch (stage) {
      case "parsing":
        return "Extracting text and structure from PDF using PDF.js..."
      case "structuring":
        return "Organizing resume data into structured format..."
      case "generating":
        return "AI is generating your custom portfolio code..."
      case "saving":
        return "Saving generated portfolio to database..."
      case "complete":
        return "Portfolio generation completed successfully!"
      default:
        return "Ready to process your resume"
    }
  }

  return (
    <div className="space-y-8">
      {/* Template Selection */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Template</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Select a template style for your portfolio. You can preview each template before making your choice.
        </p>
        <TemplateGallery selectedTemplate={selectedTemplate} onTemplateSelect={onTemplateChange} />
      </div>

      {/* File Upload Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Upload Your Resume</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Upload your PDF resume and we'll use PDF.js to extract the content, then generate a custom portfolio using AI.
        </p>

        <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
          <CardContent className="p-6">
            {!parserState.isProcessing ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                  isDragActive || dragActive
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                    : selectedTemplate
                      ? "border-gray-300 dark:border-navy-600 hover:border-brand-400 hover:bg-gray-50 dark:hover:bg-navy-800"
                      : "border-gray-200 dark:border-navy-700 bg-gray-50 dark:bg-navy-800 cursor-not-allowed"
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedTemplate ? "Drop your PDF resume here" : "Select a template first"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {selectedTemplate
                        ? "or click to browse files"
                        : "Choose a template above before uploading your resume"}
                    </p>
                    {selectedTemplate && (
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Badge
                          variant="outline"
                          className="bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
                        >
                          Template: {selectedTemplate.replace("-", " ")}
                        </Badge>
                      </div>
                    )}
                    <div className="text-sm text-gray-500 dark:text-gray-400">Supports PDF files up to 10MB</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                  {getStageIcon(parserState.stage)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Processing Your Resume</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{getStageDescription(parserState.stage)}</p>
                  <Progress value={parserState.progress} className="w-full max-w-md mx-auto mb-4" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">{parserState.progress}% complete</div>
                </div>
                {parserState.file && (
                  <div className="bg-gray-50 dark:bg-navy-800 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">{parserState.file.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {(parserState.file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {parserState.error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div className="text-red-800 dark:text-red-200 font-medium">Processing Error</div>
                </div>
                <div className="text-red-700 dark:text-red-300 mt-1">{parserState.error}</div>
              </div>
            )}

            {parserState.isComplete && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div className="text-green-800 dark:text-green-200 font-medium">
                    Portfolio Generated Successfully!
                  </div>
                </div>
                <div className="text-green-700 dark:text-green-300 mt-1">
                  Your portfolio has been generated and is ready for preview and editing.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
