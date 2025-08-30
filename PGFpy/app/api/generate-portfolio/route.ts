import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { resumeData, template } = await request.json()

    console.log("🎨 Generating Portfolio with data:", JSON.stringify(resumeData, null, 2))

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Create a professional portfolio website using the following resume data:

${JSON.stringify(resumeData, null, 2)}

Generate complete, production-ready code with these requirements:

1. **HTML**: Complete HTML5 structure with semantic elements
2. **CSS**: Modern CSS with Tailwind classes, responsive design, professional styling
3. **JavaScript**: Interactive features, smooth scrolling, animations

Template Style: ${template || "Modern Professional"}

Return the code in this exact JSON format:
{
  "html": "complete HTML code here",
  "css": "complete CSS code here", 
  "js": "complete JavaScript code here",
  "jsx": "complete React JSX component code here"
}

Requirements:
- Use the person's actual name, email, and information from the resume data
- Create sections for: Hero, About, Experience, Skills, Projects, Education, Contact
- Make it fully responsive and professional
- Include smooth animations and hover effects
- Use modern design principles
- Ensure all sections have real content from the resume data

Only return valid JSON, no other text.`,
    })

    const generatedCode = JSON.parse(text)

    console.log("✅ Generated Portfolio Code:", {
      htmlLength: generatedCode.html?.length || 0,
      cssLength: generatedCode.css?.length || 0,
      jsLength: generatedCode.js?.length || 0,
      jsxLength: generatedCode.jsx?.length || 0,
    })

    return NextResponse.json({
      success: true,
      code: generatedCode,
    })
  } catch (error) {
    console.error("❌ Generate Portfolio Error:", error)
    return NextResponse.json({ error: "Failed to generate portfolio" }, { status: 500 })
  }
}
