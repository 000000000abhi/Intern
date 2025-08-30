"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Zap, Loader2 } from "lucide-react";
import { SimplePDFUploadZone } from "@/components/simple-pdf-upload-zone";
import { usePortfolio } from "@/components/portfolio-context";
import { useAuth } from "@/components/auth-provider";
import { AuthGuard } from "@/components/auth-guard";
import { DatabaseStatus } from "@/components/database-status";
import { useState } from "react";
import { usePythonPdfParser } from "@/hooks/use-python-pdf-parser";

export default function UploadPage() {
  const { parserState, processFile } = usePythonPdfParser();
  const { setGeneratedPortfolio } = usePortfolio();
  const { user } = useAuth();
  const router = useRouter();
  const [databaseStatus, setDatabaseStatus] = useState<"ready" | "missing" | "error">("ready");
  const [isGenerating, setIsGenerating] = useState(false);

  const canUpload = user && databaseStatus === "ready";

  const handleFileSelect = async (file: File) => {
    await processFile(file);
  };
  
  const handleGenerateAndRedirect = async () => {
      if (!parserState.structuredData) {
          alert("Error: No structured data available to generate a portfolio.");
          return;
      }
      setIsGenerating(true);
      try {
          const response = await fetch("/api/generate-portfolio-code", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ structuredData: parserState.structuredData }),
          });
          
          if (!response.ok) throw new Error("Failed to generate portfolio code.");

          const result = await response.json();
          if (result.success) {
              setGeneratedPortfolio(result.portfolio);
              router.push("/editor");
          } else {
              throw new Error(result.error || "An unknown error occurred.");
          }
      } catch (error) {
          alert(`Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
          setIsGenerating(false);
      }
  };

  const getProgress = () => {
      switch(parserState.stage) {
          case 'idle': return 0;
          case 'parsing': return 33;
          case 'structuring': return 66;
          case 'complete': return 100;
          default: return 0;
      }
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-white dark:bg-navy-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Portfolio Generator</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Upload your resume to get started.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <DatabaseStatus showFullCard={true} onStatusChange={setDatabaseStatus} />

            <div className="mt-8">
              <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Zap className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    Upload PDF to Parse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimplePDFUploadZone
                    onFileSelect={handleFileSelect}
                    processorState={{
                      isProcessing: parserState.isProcessing,
                      progress: getProgress(),
                      error: parserState.error,
                      stage: parserState.stage === 'parsing' ? 'extracting' : 'structuring',
                    }}
                    disabled={!canUpload || isGenerating}
                  />
                </CardContent>
              </Card>

              {parserState.stage === 'complete' && parserState.structuredData && (
                <Card className="mt-8 border-0 shadow-lg bg-white dark:bg-navy-900">
                    <CardHeader>
                        <CardTitle>AI Processing Complete</CardTitle>
                        <CardDescription>Your resume has been successfully parsed and structured. You can now generate your portfolio.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-sm bg-gray-100 dark:bg-navy-800 p-4 rounded-md max-h-60 overflow-auto">
                            {JSON.stringify(parserState.structuredData, null, 2)}
                        </pre>
                        <Button onClick={handleGenerateAndRedirect} className="mt-6 w-full bg-brand-500 hover:bg-brand-600 text-white" disabled={isGenerating}>
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating Code...
                                </>
                            ) : (
                                <>
                                    Generate Portfolio & Go to Editor
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}