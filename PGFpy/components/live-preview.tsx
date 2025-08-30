"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink } from "lucide-react"

interface LivePreviewProps {
  htmlCode: string
  cssCode?: string
  jsxCode?: string
}

export function LivePreview({ htmlCode, cssCode = "", jsxCode = "" }: LivePreviewProps) {
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const viewportSizes = {
    desktop: { width: "100%", height: "100%" },
    tablet: { width: "768px", height: "1024px" },
    mobile: { width: "375px", height: "667px" },
  }

  const updatePreview = () => {
    if (!iframeRef.current) return

    const iframe = iframeRef.current
    const doc = iframe.contentDocument || iframe.contentWindow?.document

    if (!doc) return

    // Create the complete HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portfolio Preview</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>
          ${cssCode}
          
          /* Additional base styles */
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        
        <script type="text/babel">
          // Sample data for preview
          const sampleData = {
            personalInfo: {
              name: "John Developer",
              email: "john@example.com",
              phone: "+1 (555) 123-4567",
              location: "San Francisco, CA",
              website: "https://johndeveloper.com",
              linkedin: "https://linkedin.com/in/johndeveloper",
              github: "https://github.com/johndeveloper"
            },
            sections: {
              summary: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies.",
              experience: [
                "Senior Software Engineer at TechCorp (2021-Present)\\n• Led development of microservices architecture serving 1M+ users\\n• Implemented CI/CD pipelines reducing deployment time by 60%\\n• Mentored junior developers and conducted code reviews",
                "Full Stack Developer at StartupXYZ (2019-2021)\\n• Built responsive web applications using React and Node.js\\n• Designed and implemented RESTful APIs\\n• Collaborated with design team to improve user experience"
              ],
              education: [
                "Bachelor of Science in Computer Science\\nUniversity of California, Berkeley (2015-2019)\\nGPA: 3.8/4.0"
              ],
              skills: [
                "JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "MongoDB", "Git"
              ],
              projects: [
                "E-commerce Platform\\n• Built full-stack e-commerce solution with React and Node.js\\n• Integrated payment processing and inventory management\\n• Deployed on AWS with auto-scaling capabilities",
                "Task Management App\\n• Developed collaborative task management application\\n• Real-time updates using WebSocket connections\\n• Mobile-responsive design with offline capabilities"
              ],
              certifications: [
                "AWS Certified Solutions Architect",
                "Google Cloud Professional Developer",
                "Certified Kubernetes Administrator"
              ]
            }
          };
          
          ${jsxCode || htmlCode}
          
          // If JSX code is provided, render the React component
          if (typeof ModernDeveloperPortfolio !== 'undefined') {
            ReactDOM.render(React.createElement(ModernDeveloperPortfolio, { data: sampleData }), document.getElementById('root'));
          } else if (typeof CreativeDesignerPortfolio !== 'undefined') {
            ReactDOM.render(React.createElement(CreativeDesignerPortfolio, { data: sampleData }), document.getElementById('root'));
          } else if (typeof ProfessionalBusinessPortfolio !== 'undefined') {
            ReactDOM.render(React.createElement(ProfessionalBusinessPortfolio, { data: sampleData }), document.getElementById('root'));
          } else if (typeof MinimalistWriterPortfolio !== 'undefined') {
            ReactDOM.render(React.createElement(MinimalistWriterPortfolio, { data: sampleData }), document.getElementById('root'));
          } else {
            // Fallback: render HTML directly
            document.getElementById('root').innerHTML = \`${htmlCode.replace(/`/g, "\\`")}\`;
          }
        </script>
      </body>
      </html>
    `

    doc.open()
    doc.write(fullHtml)
    doc.close()
  }

  useEffect(() => {
    const timer = setTimeout(updatePreview, 100)
    return () => clearTimeout(timer)
  }, [htmlCode, cssCode, jsxCode])

  const handleRefresh = () => {
    setIsRefreshing(true)
    updatePreview()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const handleOpenInNewWindow = () => {
    const newWindow = window.open("", "_blank", "width=1200,height=800")
    if (newWindow) {
      newWindow.document.write(htmlCode)
      newWindow.document.close()
    }
  }

  return (
    <Card className="h-full border-0 shadow-lg bg-white dark:bg-navy-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Live Preview</CardTitle>
          <div className="flex items-center gap-2">
            {/* Viewport Size Controls */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-navy-800 rounded-lg p-1">
              <Button
                variant={viewportSize === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize("desktop")}
                className="h-8 w-8 p-0"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={viewportSize === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize("tablet")}
                className="h-8 w-8 p-0"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={viewportSize === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewportSize("mobile")}
                className="h-8 w-8 p-0"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-transparent border-gray-200 dark:border-navy-700"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewWindow}
              className="bg-transparent border-gray-200 dark:border-navy-700"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-80px)]">
        <div className="h-full bg-gray-50 dark:bg-navy-950 flex items-center justify-center">
          <div
            className="bg-white shadow-lg transition-all duration-300 overflow-hidden"
            style={{
              width: viewportSizes[viewportSize].width,
              height: viewportSizes[viewportSize].height,
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: viewportSize !== "desktop" ? "12px" : "0",
            }}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Portfolio Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
