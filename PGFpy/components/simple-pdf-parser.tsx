"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, AlertCircle } from "lucide-react"

interface ParsedData {
  filename: string
  size: number
  text: string
  textLength: number
  extractedInfo: {
    name?: string
    email?: string
    phone?: string
    skills?: string[]
    experience?: string[]
    education?: string[]
  }
}

export function SimplePDFParser() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Convert to string
    const pdfString = Array.from(uint8Array)
      .map((byte) => String.fromCharCode(byte))
      .join("")

    // Extract readable text
    const textMatches = pdfString.match(/[A-Za-z0-9\s@.,;:!?\-()]+/g) || []
    const extractedText = textMatches
      .filter((text) => text.length > 3 && /[A-Za-z]/.test(text))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()

    return extractedText
  }

  const parseBasicInfo = (text: string) => {
    const info: ParsedData["extractedInfo"] = {}

    // Extract name (first line or pattern)
    const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/) || text.match(/([A-Z][a-z]+ [A-Z][a-z]+)/)
    if (nameMatch) info.name = nameMatch[1]

    // Extract email
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)
    if (emailMatch) info.email = emailMatch[1]

    // Extract phone using simple string search
    const lines = text.split("\n")
    for (const line of lines) {
      const cleanLine = line.trim()
      // Look for lines with 10+ digits and reasonable length
      const digitCount = (cleanLine.match(/\d/g) || []).length
      if (digitCount >= 10 && digitCount <= 15 && cleanLine.length < 50) {
        // Extract phone-like content
        const phoneMatch = cleanLine.match(/[\d\s\-$$$$+.]{10,20}/)
        if (phoneMatch) {
          info.phone = phoneMatch[0].trim()
          break
        }
      }
    }

    // Extract skills (look for common skill keywords)
    const skillKeywords = [
      "JavaScript",
      "Python",
      "React",
      "Node.js",
      "HTML",
      "CSS",
      "SQL",
      "Java",
      "C++",
      "PHP",
      "Ruby",
      "Swift",
      "Kotlin",
      "TypeScript",
      "Vue",
      "Angular",
      "Docker",
      "AWS",
      "Git",
    ]
    const foundSkills = skillKeywords.filter((skill) => text.toLowerCase().includes(skill.toLowerCase()))
    if (foundSkills.length > 0) info.skills = foundSkills

    // Extract experience sections
    const experienceMatches = text.match(/(Software Engineer|Developer|Manager|Analyst|Designer|Consultant)[^.]*\./g)
    if (experienceMatches) info.experience = experienceMatches

    // Extract education
    const educationMatches = text.match(/(Bachelor|Master|PhD|University|College|Degree)[^.]*\./g)
    if (educationMatches) info.education = educationMatches

    return info
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file")
      return
    }

    setIsProcessing(true)
    setError(null)
    setParsedData(null)

    try {
      console.log("🔄 Starting PDF parsing...")
      console.log("📄 File details:", {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type,
      })

      // Extract text
      const extractedText = await extractTextFromPDF(file)

      console.log("📝 Raw extracted text (first 500 chars):")
      console.log(extractedText.substring(0, 500) + "...")

      // Parse basic info
      const extractedInfo = parseBasicInfo(extractedText)

      const parsedData: ParsedData = {
        filename: file.name,
        size: file.size,
        text: extractedText,
        textLength: extractedText.length,
        extractedInfo,
      }

      // Print the complete parsed data object
      console.log("================================================================================")
      console.log("📊 COMPLETE PARSED DATA OBJECT:")
      console.log("================================================================================")
      console.log(parsedData)
      console.log("================================================================================")
      console.log("📋 PARSED DATA AS JSON:")
      console.log(JSON.stringify(parsedData, null, 2))
      console.log("================================================================================")

      // Print extracted information in a table
      if (extractedInfo.name || extractedInfo.email || extractedInfo.phone) {
        console.log("👤 EXTRACTED PERSONAL INFO:")
        console.table({
          Name: extractedInfo.name || "Not found",
          Email: extractedInfo.email || "Not found",
          Phone: extractedInfo.phone || "Not found",
        })
      }

      if (extractedInfo.skills && extractedInfo.skills.length > 0) {
        console.log("🛠️ EXTRACTED SKILLS:")
        extractedInfo.skills.forEach((skill, index) => {
          console.log(`   ${index + 1}. ${skill}`)
        })
      }

      if (extractedInfo.experience && extractedInfo.experience.length > 0) {
        console.log("💼 EXTRACTED EXPERIENCE:")
        extractedInfo.experience.forEach((exp, index) => {
          console.log(`   ${index + 1}. ${exp}`)
        })
      }

      if (extractedInfo.education && extractedInfo.education.length > 0) {
        console.log("🎓 EXTRACTED EDUCATION:")
        extractedInfo.education.forEach((edu, index) => {
          console.log(`   ${index + 1}. ${edu}`)
        })
      }

      console.log("✅ PDF PARSING COMPLETED!")
      console.log("================================================================================")

      setParsedData(parsedData)
    } catch (error) {
      console.error("❌ PDF parsing error:", error)
      setError(error instanceof Error ? error.message : "Failed to parse PDF")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Simple PDF Parser with Console Logging
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Upload PDF Resume</h3>
          <p className="text-gray-600 mb-4">Select a PDF file to parse and extract data</p>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="hidden"
            id="pdf-upload"
          />

          <Button asChild disabled={isProcessing}>
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Choose PDF File"}
            </label>
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Results Display */}
        {parsedData && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Parsing Results</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">File Info</h4>
                <p>
                  <strong>Name:</strong> {parsedData.filename}
                </p>
                <p>
                  <strong>Size:</strong> {(parsedData.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p>
                  <strong>Text Length:</strong> {parsedData.textLength} characters
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Extracted Info</h4>
                <p>
                  <strong>Name:</strong> {parsedData.extractedInfo.name || "Not found"}
                </p>
                <p>
                  <strong>Email:</strong> {parsedData.extractedInfo.email || "Not found"}
                </p>
                <p>
                  <strong>Phone:</strong> {parsedData.extractedInfo.phone || "Not found"}
                </p>
              </div>
            </div>

            {parsedData.extractedInfo.skills && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Skills Found</h4>
                <div className="flex flex-wrap gap-2">
                  {parsedData.extractedInfo.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-2">Console Output</h4>
              <p className="text-sm text-green-700">
                ✅ Check your browser console (F12) to see the complete parsed data object with detailed logging!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
