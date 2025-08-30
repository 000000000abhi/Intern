"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Code, Download, Save, ArrowLeft, Copy, Check } from "lucide-react"
import { usePortfolio } from "@/components/portfolio-context"
import { MonacoEditor } from "@/components/monaco-editor"
import { PortfolioPreview } from "@/components/portfolio-preview"

export default function EditorPage() {
  const { generatedPortfolio } = usePortfolio()
  const [activeTab, setActiveTab] = useState("preview")
  const [htmlCode, setHtmlCode] = useState("")
  const [cssCode, setCssCode] = useState("")
  const [jsCode, setJsCode] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!generatedPortfolio) {
      router.push("/upload"); // Go to start if no data
      return;
    }
    setHtmlCode(generatedPortfolio.html || "");
    setCssCode(generatedPortfolio.css || "");
    setJsCode(generatedPortfolio.js || "");
  }, [generatedPortfolio, router]);

  const handleCopyCode = async (codeType: 'html' | 'css' | 'js') => {
    let codeToCopy = '';
    if (codeType === 'html') codeToCopy = htmlCode;
    if (codeType === 'css') codeToCopy = cssCode;
    if (codeType === 'js') codeToCopy = jsCode;
    
    await navigator.clipboard.writeText(codeToCopy);
    setCopied(codeType);
    setTimeout(() => setCopied(null), 2000);
  };

  const createFullHtmlForPreview = () => {
      if(!htmlCode) return "";
      return htmlCode
        .replace('', `<style>${cssCode}</style>`)
        .replace('', `<script>${jsCode}<\/script>`);
  }

  const handleDownload = () => {
    const blob = new Blob([createFullHtmlForPreview()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!generatedPortfolio) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      <div className="border-b border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
              <Button variant="ghost" size="sm" onClick={() => router.push("/templates")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
              </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-navy-800">
            <TabsTrigger value="preview"><Eye className="w-4 h-4 mr-2" />Preview</TabsTrigger>
            <TabsTrigger value="html"><Code className="w-4 h-4 mr-2" />HTML</TabsTrigger>
            <TabsTrigger value="css"><Code className="w-4 h-4 mr-2" />CSS</TabsTrigger>
            <TabsTrigger value="js"><Code className="w-4 h-4 mr-2" />JavaScript</TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <Card className="border-0 shadow-lg bg-white dark:bg-navy-900 h-[75vh]">
                <PortfolioPreview htmlCode={createFullHtmlForPreview()} />
            </Card>
          </TabsContent>

          <TabsContent value="html">
            <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>HTML</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => handleCopyCode('html')}>
                            {copied === 'html' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied === 'html' ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <MonacoEditor language="html" value={htmlCode} onChange={setHtmlCode} height="60vh" />
                </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="css">
             <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>CSS</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => handleCopyCode('css')}>
                            {copied === 'css' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied === 'css' ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <MonacoEditor language="css" value={cssCode} onChange={setCssCode} height="60vh" />
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="js">
             <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>JavaScript</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => handleCopyCode('js')}>
                            {copied === 'js' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied === 'js' ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <MonacoEditor language="javascript" value={jsCode} onChange={setJsCode} height="60vh" />
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}