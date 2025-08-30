"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface CodeEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
  height?: string
}

export function CodeEditor({ language, value, onChange, height = "400px" }: CodeEditorProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="bg-white/90 dark:bg-navy-800/90 hover:bg-white dark:hover:bg-navy-800"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 font-mono text-sm bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 resize-none"
        style={{ height }}
        placeholder={`Enter your ${language.toUpperCase()} code here...`}
        spellCheck={false}
      />
    </div>
  )
}
