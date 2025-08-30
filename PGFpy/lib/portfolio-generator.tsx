import { getTemplateById } from "./templates"

export interface GeneratedPortfolioCode {
  jsx: string
  css: string
  html: string
  metadata: {
    title: string
    description: string
    templateId: string
    generatedAt: string
  }
}

export interface PortfolioGenerationRequest {
  resumeData: {
    personalInfo: {
      name?: string
      email?: string
      phone?: string
      location?: string
      website?: string
      linkedin?: string
      github?: string
    }
    sections: {
      summary?: string
      experience?: string[]
      education?: string[]
      skills?: string[]
      projects?: string[]
      certifications?: string[]
    }
    rawText: string
  }
  templateId: string
}

class PortfolioGenerator {
  async generatePortfolio(request: PortfolioGenerationRequest): Promise<GeneratedPortfolioCode> {
    try {
      console.log("🤖 Starting server-side AI portfolio generation...")
      console.log("📋 Request data:", {
        templateId: request.templateId,
        personalInfoFields: Object.keys(request.resumeData.personalInfo).filter(
          (key) => request.resumeData.personalInfo[key as keyof typeof request.resumeData.personalInfo],
        ),
        sectionsAvailable: Object.keys(request.resumeData.sections).filter(
          (key) => request.resumeData.sections[key as keyof typeof request.resumeData.sections],
        ),
      })

      const response = await fetch("/api/generate-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          extractedData: request.resumeData,
          templateId: request.templateId,
        }),
      })

      if (!response.ok) {
        throw new Error("Server-side generation failed")
      }

      const result = await response.json()

      console.log("✅ Server-side AI generation completed")
      console.log("🎉 Portfolio generation successful!")

      return {
        jsx: result.portfolio.jsx || "",
        css: result.portfolio.css || "",
        html: result.portfolio.html || "",
        metadata: {
          title: `${request.resumeData.personalInfo.name || "Professional"} - Portfolio`,
          description: `Professional portfolio for ${request.resumeData.personalInfo.name || "a professional"}`,
          templateId: request.templateId,
          generatedAt: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error("❌ Server-side AI generation failed:", error)
      console.log("🔄 Falling back to template-based generation")

      const template = getTemplateById(request.templateId)
      if (!template) {
        throw new Error(`Template with ID ${request.templateId} not found`)
      }

      return this.generateFallbackPortfolio(request, template)
    }
  }

  private generateFallbackPortfolio(request: PortfolioGenerationRequest, template: any): GeneratedPortfolioCode {
    console.log("🔄 Generating fallback portfolio using template substitution")

    // Simple template substitution
    let jsx = template.jsx
    const css = template.css
    let html = template.html

    // Replace placeholder data with actual resume data
    const replacements = {
      "Your Name": request.resumeData.personalInfo.name || "Your Name",
      "Creative Name": request.resumeData.personalInfo.name || "Creative Name",
      "Professional Name": request.resumeData.personalInfo.name || "Professional Name",
      "Writer Name": request.resumeData.personalInfo.name || "Writer Name",
      "john@example.com": request.resumeData.personalInfo.email || "your.email@example.com",
      "Full Stack Developer": request.resumeData.sections.summary || "Professional",
      "Creative Designer & Artist": request.resumeData.sections.summary || "Creative Professional",
      "Business Professional": request.resumeData.sections.summary || "Business Professional",
      "Writer & Content Creator": request.resumeData.sections.summary || "Writer & Content Creator",
    }

    // Apply replacements
    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      jsx = jsx.replace(new RegExp(placeholder, "g"), replacement)
      html = html.replace(new RegExp(placeholder, "g"), replacement)
    })

    // Create complete HTML with embedded React component
    html = this.createCompleteHTML(jsx, css, request.resumeData.personalInfo.name || "Portfolio")

    return {
      jsx,
      css,
      html,
      metadata: {
        title: `${request.resumeData.personalInfo.name || "Professional"} - Portfolio`,
        description: `Professional portfolio for ${request.resumeData.personalInfo.name || "a professional"}`,
        templateId: request.templateId,
        generatedAt: new Date().toISOString(),
      },
    }
  }

  private createCompleteHTML(jsx: string, css: string, title: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        ${css}
    </style>
</head>
<body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel">
        ${jsx}
        
        // Sample data for preview
        const sampleData = {
            personalInfo: {
                name: "${title}",
                email: "contact@example.com",
                phone: "+1-555-123-4567",
                location: "City, State",
                linkedin: "https://linkedin.com/in/profile",
                github: "https://github.com/username"
            },
            sections: {
                summary: "Professional summary goes here",
                experience: ["Experience item 1", "Experience item 2"],
                education: ["Education item 1", "Education item 2"],
                skills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
                projects: ["Project 1", "Project 2"],
                certifications: ["Certification 1", "Certification 2"]
            }
        };
        
        // Render the component
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(ModernDeveloperPortfolio || CreativeDesignerPortfolio || ProfessionalBusinessPortfolio || MinimalistWriterPortfolio, { data: sampleData }));
    </script>
</body>
</html>`
  }
}

export const portfolioGenerator = new PortfolioGenerator()
