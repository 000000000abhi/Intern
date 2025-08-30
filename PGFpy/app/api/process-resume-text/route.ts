import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing GOOGLE_GENERATIVE_AI_API_KEY");
      throw new Error("API Key is missing");
    }
    
    console.log("🤖 Sending extracted text to Gemini API for structuring...");
    const { text: geminiResponse } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Parse the following resume text and return a structured JSON object. The JSON should contain keys like "personalInfo", "professionalSummary", "experience", "education", "skills", "projects", and "certifications".
      
      Resume text:
      ---
      ${text}
      ---
      
      Return only the JSON object, without any surrounding text or markdown formatting.`,
    });

    // **IMPROVED FIX:** Find the JSON object within the response string.
    const jsonStart = geminiResponse.indexOf('{');
    const jsonEnd = geminiResponse.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Could not find a valid JSON object in the AI response.");
    }
    
    const jsonString = geminiResponse.substring(jsonStart, jsonEnd + 1);

    const parsedData = JSON.parse(jsonString);
    console.log("✅ Successfully received and parsed response from Gemini.");

    return NextResponse.json({
      success: true,
      data: parsedData,
    });

  } catch (error) {
    console.error("❌ Error in /api/process-resume-text:", error);
    console.log("💡 Falling back to mock data due to API error.");
    const mockResumeData = {
        personalInfo: { name: "Alex Johnson (Mock Data)", email: "alex.johnson@example.com" },
        professionalSummary: "This is a mock response because the Gemini API failed. This allows you to continue testing the application flow without interruption.",
        experience: [{ title: "Senior Software Engineer", company: "Tech Solutions Inc." }],
        education: [{ degree: "Bachelor of Science in Computer Science", institution: "State University" }],
        skills: { technical: ["React", "Node.js", "TypeScript"] },
    };
    return NextResponse.json({ success: true, data: mockResumeData });
  }
}