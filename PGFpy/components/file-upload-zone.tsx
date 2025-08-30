"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, Sparkles, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  isUploading: boolean
  progress: number
  error: string | null
  className?: string
}

export function FileUploadZone({ onFileSelect, isUploading, progress, error, className }: FileUploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const getProgressMessage = () => {
    if (progress < 20) return "Uploading file..."
    if (progress < 40) return "Extracting text..."
    if (progress < 60) return "Parsing information..."
    if (progress < 80) return "AI enhancement in progress..."
    if (progress < 95) return "Finalizing..."
    return "Complete!"
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer",
        isDragActive
          ? "border-brand-400 bg-brand-50 dark:bg-brand-950/20 dark:border-brand-500"
          : "border-gray-300 dark:border-navy-600 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-navy-800",
        error && "border-red-400 bg-red-50 dark:bg-red-950/20 dark:border-red-500",
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
              >
                Try Again
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {isDragActive ? "Drop your resume here" : "Drop your resume here"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Supports PDF files up to 10MB</p>
              <Button className="bg-brand-500 hover:bg-brand-600 text-white border-0">
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-brand-600 dark:text-brand-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processing your resume...</h3>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 dark:text-gray-300">{getProgressMessage()}</p>
        </div>
      )}
    </div>
  )
}
