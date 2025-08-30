"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Code, Eye } from "lucide-react"
import { MonacoEditor } from "./monaco-editor"
import { LivePreview } from "./live-preview"

interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
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
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages: string[]
  }
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    link?: string
  }>
  certifications: Array<{
    name: string
    issuer: string
    date: string
  }>
}

interface GeneratedCode {
  html: string
  css: string
  js: string
  jsx: string
}

export function PortfolioGeneratorWorkflow() {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeFile, setActiveFile] = useState<"html" | "css" | "js" | "jsx">("html")

  // Step 1: Upload PDF
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
    }
  }

  // Step 2: Parse Resume
  const parseResume = async () => {
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      console.log("🚀 Starting PDF upload and parsing...")

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ API Error Response:", errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()

      if (result.success) {
        setResumeData(result.data)
        setStep(2)

        console.log("✅ PDF PARSING COMPLETED SUCCESSFULLY!")
        console.log("================================================================================")
        console.log("📊 PARSED RESUME DATA OBJECT:")
        console.log("================================================================================")
        console.log(result.data)
        console.log("================================================================================")
        console.log("📋 PARSED DATA AS JSON:")
        console.log(JSON.stringify(result.data, null, 2))
        console.log("================================================================================")
        console.log("👤 PERSONAL INFORMATION:")
        console.table(result.data.personalInfo)
        console.log("📝 RESUME SECTIONS:")
        console.log("📋 EXPERIENCE:", result.data.experience?.length || 0, "entries")
        console.log("🎓 EDUCATION:", result.data.education?.length || 0, "entries")
        console.log("💼 SKILLS:", Object.keys(result.data.skills || {}).length, "categories")
        console.log("🚀 PROJECTS:", result.data.projects?.length || 0, "entries")
        console.log("🏆 CERTIFICATIONS:", result.data.certifications?.length || 0, "entries")
        console.log("================================================================================")
      } else {
        throw new Error(result.error || "Failed to parse resume")
      }
    } catch (error) {
      console.error("❌ Parse error:", error)
      alert("Failed to parse PDF: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Generate Portfolio
  const generatePortfolio = async () => {
    if (!resumeData) return

    setLoading(true)
    try {
      const response = await fetch("/api/generate-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          template: "Modern Professional",
        }),
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedCode(result.code)
        setStep(3)
      }
    } catch (error) {
      console.error("Generation error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (newCode: string) => {
    if (!generatedCode) return

    setGeneratedCode({
      ...generatedCode,
      [activeFile]: newCode,
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Step 1: Upload Resume */}
      {step >= 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Step 1: Upload Resume (PDF)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {file && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Selected: {file.name}</span>
                  <Button onClick={parseResume} disabled={loading}>
                    {loading ? "Parsing..." : "Parse Resume"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Show Parsed Data */}
      {step >= 2 && resumeData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Step 2: Parsed Resume Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Personal Information:</h3>
                <p>
                  <strong>Name:</strong> {resumeData.personalInfo.name}
                </p>
                <p>
                  <strong>Email:</strong> {resumeData.personalInfo.email}
                </p>
                <p>
                  <strong>Phone:</strong> {resumeData.personalInfo.phone}
                </p>
                <p>
                  <strong>Location:</strong> {resumeData.personalInfo.location}
                </p>
              </div>
              <Button onClick={generatePortfolio} disabled={loading}>
                {loading ? "Generating Portfolio..." : "Generate Portfolio Code"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Code Editor and Preview */}
      {step >= 3 && generatedCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Step 3: Edit Code & Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Code Editor */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  {(["html", "css", "js", "jsx"] as const).map((fileType) => (
                    <Button
                      key={fileType}
                      variant={activeFile === fileType ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFile(fileType)}
                    >
                      {fileType.toUpperCase()}
                    </Button>
                  ))}
                </div>

                <MonacoEditor
                  value={generatedCode[activeFile] || ""}
                  language={activeFile === "jsx" ? "typescript" : activeFile}
                  onChange={handleCodeChange}
                  height="500px"
                />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(generatedCode[activeFile] || "")}
                  >
                    Copy {activeFile.toUpperCase()}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([generatedCode[activeFile] || ""], { type: "text/plain" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `portfolio.${activeFile}`
                      a.click()
                    }}
                  >
                    Download {activeFile.toUpperCase()}
                  </Button>
                </div>
              </div>

              {/* Live Preview */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Live Preview
                </h3>
                <LivePreview html={generatedCode.html} css={generatedCode.css} js={generatedCode.js} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
