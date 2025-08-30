import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

let pdfParse: any = null
try {
  pdfParse = require("pdf-parse")
  console.log("✅ pdf-parse loaded successfully")
} catch (error) {
  console.log("⚠️ pdf-parse not available, will use fallback:", error)
}

async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  if (pdfParse) {
    try {
      console.log("📄 Using pdf-parse for reliable text extraction...")

      const buffer = Buffer.from(arrayBuffer)
      const data = await pdfParse(buffer)

      console.log("📊 PDF Info - Pages:", data.numpages, "Text length:", data.text.length)

      const cleanedText = data.text
        .replace(/\s+/g, " ")
        .replace(/\n\s*\n/g, "\n")
        .trim()

      return cleanedText
    } catch (error) {
      console.error("❌ PDF parsing error:", error)
      console.log("💡 Falling back to basic text extraction...")
    }
  }

  return await basicTextExtraction(arrayBuffer)
}

async function basicTextExtraction(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log("📄 Using basic text extraction...")
    const uint8Array = new Uint8Array(arrayBuffer)
    let text = ""

    for (let i = 0; i < uint8Array.length - 1; i++) {
      const char = String.fromCharCode(uint8Array[i])
      if ((char >= " " && char <= "~") || char === "\n" || char === "\r" || char === "\t") {
        text += char
      }
    }

    const cleanedText = text
      .replace(/\s+/g, " ")
      .replace(/[^\w\s@.-]/g, " ")
      .trim()

    console.log("📊 Basic extraction - Text length:", cleanedText.length)
    return cleanedText
  } catch (error) {
    console.error("❌ Basic text extraction error:", error)
    return "Failed to extract text from PDF"
  }
}

function fallbackParseResume(text: string) {
  console.log("🔄 Using fallback parser (no AI)...")

  const lines = text.split(/\n|\r\n/).filter((line) => line.trim().length > 0)

  let email = ""
  for (const line of lines) {
    if (line.includes("@") && line.includes(".")) {
      const words = line.split(/\s+/)
      for (const word of words) {
        if (word.includes("@") && word.includes(".") && word.length > 5) {
          email = word.replace(/[^\w@.-]/g, "")
          break
        }
      }
      if (email) break
    }
  }

  let phone = ""
  for (const line of lines) {
    const digits = line.replace(/\D/g, "")
    if (digits.length >= 10 && digits.length <= 15) {
      phone = line.trim()
      break
    }
  }

  let name = "Name not found"
  for (const line of lines.slice(0, 5)) {
    if (line.length > 3 && line.length < 50 && !line.includes("@") && line.replace(/\D/g, "").length < 4) {
      name = line.trim()
      break
    }
  }

  const skillKeywords = ["javascript", "python", "react", "node", "html", "css", "sql", "java", "c++", "git"]
  const foundSkills = skillKeywords.filter((skill) => text.toLowerCase().includes(skill))

  const experienceLines = lines.filter((line) => {
    const hasYear =
      line.includes("2020") ||
      line.includes("2021") ||
      line.includes("2022") ||
      line.includes("2023") ||
      line.includes("2024")
    const hasJobWords =
      line.toLowerCase().includes("engineer") ||
      line.toLowerCase().includes("developer") ||
      line.toLowerCase().includes("manager")
    return hasYear || hasJobWords
  })

  let linkedin = ""
  let github = ""
  for (const line of lines) {
    if (line.toLowerCase().includes("linkedin.com")) {
      linkedin = line.trim()
    }
    if (line.toLowerCase().includes("github.com")) {
      github = line.trim()
    }
  }

  const parsedData = {
    personalInfo: {
      name: name,
      email: email,
      phone: phone,
      location: "",
      website: "",
      linkedin: linkedin,
      github: github,
    },
    professionalSummary: "Extracted using fallback parser",
    experience: experienceLines.slice(0, 3).map((line) => ({
      title: "Position extracted from: " + line.substring(0, 50),
      company: "Company name not parsed",
      duration: "Duration not found",
      description: line,
      achievements: [],
    })),
    education: [],
    skills: {
      technical: foundSkills,
      soft: [],
      languages: ["English"],
    },
    projects: [],
    certifications: [],
  }

  return parsedData
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting PDF parsing...")

    let formData
    try {
      formData = await request.formData()
    } catch (error) {
      console.error("❌ Failed to parse form data:", error)
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
    }

    const file = formData.get("file") as File

    if (!file) {
      console.error("❌ No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("📄 File received:", file.name, "Size:", file.size, "Type:", file.type)

    if (file.type !== "application/pdf") {
      console.error("❌ Invalid file type:", file.type)
      return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 })
    }

    let arrayBuffer
    try {
      arrayBuffer = await file.arrayBuffer()
    } catch (error) {
      console.error("❌ Failed to read file:", error)
      return NextResponse.json({ error: "Failed to read PDF file" }, { status: 400 })
    }

    const extractedText = await extractTextFromPDF(arrayBuffer)

    console.log("📝 Extracted text length:", extractedText.length)
    console.log("📝 First 500 characters:", extractedText.substring(0, 500))

    if (!extractedText || extractedText.length < 10) {
      console.error("❌ Failed to extract meaningful text from PDF")
      return NextResponse.json(
        {
          error: "Could not extract text from PDF. Please ensure the PDF contains readable text.",
        },
        { status: 400 },
      )
    }

    let parsedData
    let usedFallback = false

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    if (!apiKey) {
      console.log("💡 No Gemini API key found, using fallback parser...")
      parsedData = fallbackParseResume(extractedText)
      usedFallback = true
    } else {
      try {
        console.log("🤖 Sending to Gemini Flash for parsing...")

        const { text } = await generateText({
          // CORRECTED: The google function only takes one argument
          model: google("gemini-1.5-flash"),
          prompt: `Parse this resume text and extract structured information. Return ONLY valid JSON with this exact structure:

{
  "personalInfo": {
    "name": "Full Name",
    "email": "email@example.com", 
    "phone": "phone number",
    "location": "city, state",
    "website": "",
    "linkedin": "",
    "github": ""
  },
  "professionalSummary": "brief summary",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name", 
      "duration": "2020-2023",
      "description": "Job description",
      "achievements": ["achievement 1"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "School Name",
      "year": "2020",
      "gpa": ""
    }
  ],
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"], 
    "languages": ["English"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["tech1", "tech2"],
      "link": ""
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "2023"
    }
  ]
}

Resume text:
${extractedText}

Return only the JSON object, no other text or formatting.`,
        })

        console.log("🤖 Gemini Flash Response received, length:", text.length)
        console.log("🤖 Gemini Flash Response preview:", text.substring(0, 200))

        const cleanedText = text
          .trim()
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "")
        parsedData = JSON.parse(cleanedText)
        console.log("✅ AI parsing successful!")
      } catch (aiError) {
        console.error("❌ AI Parsing failed:", aiError)
        console.log("💡 Falling back to non-AI parser...")
        parsedData = fallbackParseResume(extractedText)
        usedFallback = true
      }
    }

    console.log("================================================================================")
    console.log("📊 FINAL PARSED DATA OBJECT:")
    console.log("================================================================================")
    console.log("Parser used:", usedFallback ? "Fallback (No AI)" : "Gemini Flash AI")
    console.log("Personal Info:", parsedData.personalInfo)
    console.log("Experience count:", parsedData.experience?.length || 0)
    console.log("Education count:", parsedData.education?.length || 0)
    console.log("Skills:", parsedData.skills)
    console.log("Projects count:", parsedData.projects?.length || 0)
    console.log("Certifications count:", parsedData.certifications?.length || 0)
    console.log("================================================================================")
    console.log("📋 COMPLETE PARSED DATA AS JSON:")
    console.log(JSON.stringify(parsedData, null, 2))
    console.log("================================================================================")

    return NextResponse.json({
      success: true,
      data: parsedData,
      rawText: extractedText.substring(0, 1000),
      usedFallback: usedFallback,
    })
  } catch (error) {
    console.error("❌ Parse Resume Error:", error)
    console.error("❌ Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      {
        error: "Failed to parse resume: " + (error instanceof Error ? error.message : "Unknown error"),
        details: error instanceof Error ? error.stack : "No additional details",
      },
      { status: 500 },
    )
  }
}