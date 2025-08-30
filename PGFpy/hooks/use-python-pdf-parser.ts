"use client"

import { useState, useCallback } from "react";
import type { ExtractedData } from "@/components/portfolio-context";

// Corrected the IP address from 12.7.0.0.1 to 127.0.0.1
const PYTHON_PARSER_URL = "http://127.0.0.1:5342/api/parse-pdf";
const NEXT_API_URL = "/api/process-resume-text";

export interface ParserState {
  isProcessing: boolean;
  error: string | null;
  stage: 'idle' | 'parsing' | 'structuring' | 'complete';
  structuredData: ExtractedData | null;
}

export function usePythonPdfParser() {
  const [parserState, setParserState] = useState<ParserState>({
    isProcessing: false,
    error: null,
    stage: 'idle',
    structuredData: null,
  });

  const processFile = useCallback(async (file: File) => {
    setParserState({ isProcessing: true, error: null, stage: 'parsing', structuredData: null });

    try {
      // Step 1: Call Python backend to extract raw text
      const formData = new FormData();
      formData.append("file", file);

      const pythonResponse = await fetch(PYTHON_PARSER_URL, {
        method: "POST",
        body: formData,
      });

      if (!pythonResponse.ok) {
        const err = await pythonResponse.json();
        throw new Error(err.error || "Failed to connect to the Python parsing service.");
      }
      
      const pythonResult = await pythonResponse.json();
      if (!pythonResult.success) {
        throw new Error(pythonResult.error || "Python service failed to parse PDF.");
      }
      
      const extractedText = pythonResult.text;
      console.log("✅ Text extracted from Python service.");

      // Step 2: Call Next.js API to get structured data from Gemini
      setParserState(prev => ({ ...prev, stage: 'structuring' }));

      const nextApiResponse = await fetch(NEXT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      });

      if (!nextApiResponse.ok) {
        const err = await nextApiResponse.json();
        throw new Error(err.error || "Failed to process text with AI.");
      }

      const nextApiResult = await nextApiResponse.json();
      if (nextApiResult.success) {
        setParserState({
          isProcessing: false,
          error: null,
          stage: 'complete',
          structuredData: nextApiResult.data,
        });
      } else {
        throw new Error(nextApiResult.error || "An unknown AI error occurred.");
      }

    } catch (error) {
      console.error("❌ PDF processing pipeline error:", error);
      setParserState({
        isProcessing: false,
        error: error instanceof Error ? error.message : "An unknown error occurred.",
        stage: 'idle',
        structuredData: null,
      });
    }
  }, []);

  const resetParser = useCallback(() => {
    setParserState({
      isProcessing: false,
      error: null,
      stage: 'idle',
      structuredData: null,
    });
  }, []);

  return { parserState, processFile, resetParser };
}
