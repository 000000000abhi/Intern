import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { supabase } from "@/lib/supabase"; // ⬅️ add this import

export async function POST(request: NextRequest) {
  try {
    const { structuredData,userId } = await request.json();

    if (!structuredData) {
      return NextResponse.json({ error: "No structured data provided" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
    }

    console.log(`🤖 Generating final, high-style portfolio code...`);
    
    const { text: geminiResponse } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `You are a meticulous and detail-oriented web developer. Your primary and most critical task is to build a portfolio website that includes EVERY piece of data from the provided JSON object. Do not omit any details.
      
      **Resume Data:**
      ---
      ${JSON.stringify(structuredData, null, 2)}
      ---

      **--- MANDATORY INSTRUCTIONS ---**

      **1. DATA COMPLETENESS (ABSOLUTE PRIORITY):**
          * **Display Everything:** You MUST render every single field from the provided JSON that has a value. For example, if a \`linkedin\` URL is present, you MUST create a link for it. If there are 5 skills in the skills array, all 5 MUST be displayed.
          * **Iterate All Arrays:** For arrays like "experience", "education", and "projects", you MUST iterate through every single object in the array and render its content. There are no exceptions.
          * **Invent Missing Details:** If a key exists but its value is empty (e.g., \`professionalSummary: ""\`), you MUST creatively write professional-sounding placeholder content. For example, if the summary is missing, write a compelling one based on the user's most recent job title. Never leave a section blank.

      **2. STYLISH & MODERN DESIGN (SECONDARY PRIORITY):**
          * **Theme:** Create a clean, elegant, and professional design with excellent readability.
          * **CSS:** Use a modern color scheme, good typography (e.g., from Google Fonts), and layout techniques like Flexbox or Grid. Use CSS custom properties for colors.
          * **Visuals:** Use subtle \`box-shadow\` for depth on elements, \`border-radius\` for soft corners, and smooth \`transition\` effects for hover states on all links and buttons.
          * **Responsiveness:** The layout must be fully responsive.

      **3. TECHNICAL SPECIFICATIONS:**
          * **HTML:** Generate a complete HTML structure in the 'html' field. Use semantic tags. Include placeholders \`\` and \`\`.
          * **CSS:** Generate all CSS in the 'css' field.
          * **JavaScript:** Generate JavaScript for smooth scrolling and simple on-scroll animations in the 'js' field.

      **FINAL COMMAND:** Return ONLY a valid JSON object with the keys "html", "css", and "js". Your primary goal is data integrity. Verify that every piece of data from the input JSON is present in your generated HTML.
      `,
    });

    const jsonStart = geminiResponse.indexOf('{');
    const jsonEnd = geminiResponse.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Could not find a valid JSON object in the AI response for portfolio code.");
    }
    
    const jsonString = geminiResponse.substring(jsonStart, jsonEnd + 1);
    
    const generatedCode = JSON.parse(jsonString);
    console.log("✅ Successfully generated final portfolio code from Gemini.");
   if (userId) {
  // 1. Save structuredData into `portfolio_data`
  const { data: portfolioData, error: dataError } = await supabase
    .from("portfolio_data")
    .insert([{
      user_id: userId,
      personal_info: JSON.stringify(structuredData.personal_info || {}),
      experience: JSON.stringify(structuredData.experience || []),
      education: JSON.stringify(structuredData.education || []),
      skills: JSON.stringify(structuredData.skills || []),
      projects: JSON.stringify(structuredData.projects || []),
      certifications: JSON.stringify(structuredData.certifications || []),
      achievements: JSON.stringify(structuredData.achievements || []),
      languages: JSON.stringify(structuredData.languages || []),
      ai_enhanced: true,
    }])
    .select("id") // return the inserted row's id
    .single();

  if (dataError) {
    console.error("❌ Error saving structured portfolio_data:", dataError);
    throw dataError;
  }

  // 2. Save generated HTML/CSS/JS into `portfolios`, linked to portfolio_data
 // 2. Save generated HTML/CSS/JS into `portfolios`, linked to portfolio_data
const { data: portfolio, error: portfolioError } = await supabase
  .from("portfolios")
  .insert([{
    user_id: userId,
    portfolio_data_id: portfolioData.id,
    title: structuredData?.personal_info?.name ?? "Untitled Portfolio",
    slug: `${structuredData?.personal_info?.name?.toLowerCase().replace(/\s+/g, "-") ?? "portfolio"}-${Date.now()}`,

    // ✅ Safe defaults
    template_id: structuredData?.template_id ?? "default-template",
    html_content: generatedCode.html ?? "",
    css_content: generatedCode.css ?? "",
    js_content: generatedCode.js ?? "",
    metadata: structuredData?.metadata ?? {
      title: structuredData?.personal_info?.name ?? "My Portfolio",
      description: "Portfolio generated by AI",
      keywords: ["portfolio", "resume", "AI"],
    },
    customizations: structuredData?.customizations ?? {
      colors: { primary: "#000000", secondary: "#ffffff" },
      layout: "default",
      sections: ["about", "experience", "projects", "contact"],
    },

    is_published: false,
    view_count: 0,
  }])
  .select("id, slug, title")
  .single();

if (portfolioError) {
  console.error("❌ Error saving portfolio to Supabase:", portfolioError);
  throw portfolioError;
}

console.log("✅ Portfolio saved in Supabase:", portfolio);
   }

  

    
    return NextResponse.json({
      success: true,
      portfolio: generatedCode,
    });
  } catch (error) {
    console.error("❌ Error in /api/generate-portfolio-code:", error);
    console.log("💡 Falling back to mock portfolio code.");
    const fallbackPortfolio = {
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <title>My Portfolio</title>
              <style></style>
            </head>
            <body>
              <h1>Hello, World!</h1>
              <p>Could not generate portfolio. This is fallback content.</p>
              <script></script>
            </body>
          </html>`,
        css: `body { font-family: sans-serif; text-align: center; color: #333; }`,
        js: `console.log("Portfolio generation failed.");`
    };
    return NextResponse.json({ success: true, portfolio: fallbackPortfolio });
  }
}