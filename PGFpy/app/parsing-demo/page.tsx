import { SimplePDFParser } from "@/components/simple-pdf-parser"

export default function ParsingDemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">PDF Parsing Demo</h1>
          <p className="text-muted-foreground">Upload a PDF to see the parsed data printed in the console</p>
        </div>
        <SimplePDFParser />
      </div>
    </div>
  )
}
