"use client"

import { useEffect, useRef } from "react"

interface PortfolioPreviewProps {
  htmlCode: string
}

export function PortfolioPreview({ htmlCode }: PortfolioPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current && htmlCode) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document

      if (doc) {
        doc.open()
        doc.write(htmlCode)
        doc.close()
      }
    }
  }, [htmlCode])

  return (
    <div className="w-full h-[600px] border border-gray-200 dark:border-navy-700 rounded-lg overflow-hidden bg-white">
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        title="Portfolio Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}
