"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Download } from "lucide-react"

interface CodeEditorWithFilesProps {
  files: {
    html: string
    css: string
    js: string
    jsx: string
  }
  parsedData: any
}

export function CodeEditorWithFiles({ files, parsedData }: CodeEditorWithFilesProps) {
  const [activeTab, setActiveTab] = useState("jsx")

  const copyToClipboard = (content: string, filename: string) => {
    navigator.clipboard.writeText(content)
    console.log(`Copied ${filename} to clipboard`)
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const fileExtensions = {
    html: "index.html",
    css: "styles.css",
    js: "script.js",
    jsx: "Portfolio.jsx",
  }

  return (
    <div className="space-y-6">
      {/* Parsed Data Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Parsed Resume Data
            <Badge variant="secondary">From GPT</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm overflow-auto max-h-60">{JSON.stringify(parsedData, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Code Files */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Portfolio Files</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="jsx">Portfolio.jsx</TabsTrigger>
              <TabsTrigger value="html">index.html</TabsTrigger>
              <TabsTrigger value="css">styles.css</TabsTrigger>
              <TabsTrigger value="js">script.js</TabsTrigger>
            </TabsList>

            {Object.entries(files).map(([fileType, content]) => (
              <TabsContent key={fileType} value={fileType} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{fileExtensions[fileType as keyof typeof fileExtensions]}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(content, fileExtensions[fileType as keyof typeof fileExtensions])}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(content, fileExtensions[fileType as keyof typeof fileExtensions])}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm">
                    <code>{content}</code>
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
