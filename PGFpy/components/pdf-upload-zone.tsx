"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, Sparkles, AlertCircle, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PDFUploadState } from "@/hooks/use-pdf-upload"

interface PDFUploadZoneProps {
  onFileSelect: (file: File) => void
  uploadState: PDFUploadState
  disabled?: boolean
  className?: string
}

export function PDFUploadZone({ onFileSelect, uploadState, disabled = false, className }: PDFUploadZoneProps) {
  const { isUploading, progress, error, stage } = uploadState

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && !disabled) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect, disabled],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading || disabled,
  })

  const getProgressMessage = () => {
    switch (stage) {
      case "parsing":
        return "Parsing PDF document..."
      case "extracting":
        return "OpenAI is extracting portfolio data..."
      case "complete":
        return "Processing complete!"
      default:
        return "Processing..."
    }
  }

  const getProgressIcon = () => {
    switch (stage) {
      case "parsing":
        return <FileText className="w-8 h-8 text-brand-600 dark:text-brand-400 animate-pulse" />
      case "extracting":
        return <Brain className="w-8 h-8 text-brand-600 dark:text-brand-400 animate-pulse" />
      case "complete":
        return <Sparkles className="w-8 h-8 text-green-600 animate-pulse" />
      default:
        return <Sparkles className="w-8 h-8 text-brand-600 dark:text-brand-400 animate-pulse" />
    }
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
        !isUploading && !disabled && "cursor-pointer",
        isDragActive && !disabled
          ? "border-brand-400 bg-brand-50 dark:bg-brand-950/20 dark:border-brand-500"
          : "border-gray-300 dark:border-navy-600 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-navy-800",
        error && "border-red-400 bg-red-50 dark:bg-red-950/20 dark:border-red-500",
        isUploading && "border-brand-400 bg-brand-50 dark:bg-brand-950/20",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <input {...getInputProps()} />

      {!isUploading ? (
        <>
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
            {error ? (
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            ) : (
              <FileText className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            )}
          </div>

          {error ? (
            <>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Upload Error</h3>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button
                variant="outline"
                className="bg-transparent border-red-200 dark:border-red-700 text-red-600 dark:text-red-400"
                disabled={disabled}
              >
                Try Again
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {isDragActive ? "Drop your resume here" : "Upload your PDF resume"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                OpenAI will parse and extract your information automatically
              </p>
              <Button className="bg-brand-500 hover:bg-brand-600 text-white border-0" disabled={disabled}>
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Supports PDF files up to 10MB</p>
            </>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
            {getProgressIcon()}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{getProgressMessage()}</h3>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {stage === "parsing" && "Reading PDF content..."}
            {stage === "extracting" && "OpenAI is analyzing your resume..."}
            {stage === "complete" && "Ready to create your portfolio!"}
          </p>
        </div>
      )}
    </div>
  )
}
