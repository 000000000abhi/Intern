"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Database, ExternalLink, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { authService } from "@/lib/auth"

interface DatabaseStatusProps {
  showFullCard?: boolean
  onStatusChange?: (status: "ready" | "missing" | "error") => void
}

export function DatabaseStatus({ showFullCard = false, onStatusChange }: DatabaseStatusProps) {
  const [status, setStatus] = useState<"checking" | "ready" | "missing" | "error">("checking")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      setStatus("checking")
      setError(null)

      // Reset the auth service database status cache
      authService.resetDatabaseStatus()

      // Try to query the profiles table
      const { data, error } = await supabase.from("profiles").select("id").limit(1)

      if (error) {
        if (error.code === "42P01") {
          setStatus("missing")
          setError("Database tables not found. Please run the migration scripts.")
          onStatusChange?.("missing")
        } else {
          setStatus("error")
          setError(error.message)
          onStatusChange?.("error")
        }
      } else {
        setStatus("ready")
        onStatusChange?.("ready")
      }
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Unknown error")
      onStatusChange?.("error")
    }
  }

  if (status === "checking") {
    return (
      <Alert>
        <Database className="h-4 w-4 animate-pulse" />
        <AlertDescription>Checking database status...</AlertDescription>
      </Alert>
    )
  }

  if (status === "ready") {
    return (
      <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700 dark:text-green-300">
          Database is ready and all tables exist!
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "missing" && showFullCard) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-5 h-5" />
            Database Setup Required
          </CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            The database tables need to be created before you can use the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Setup Instructions:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to the SQL Editor</li>
                <li>
                  Run the migration script:{" "}
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">003-create-database-schema.sql</code>
                </li>
                <li>Click "Check Again" below to verify the setup</li>
              </ol>
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={checkDatabaseStatus}
              className="bg-transparent border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
              className="bg-transparent border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Supabase
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "missing") {
    return (
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          Database setup required. Please run the migration scripts.
          <Button
            variant="outline"
            size="sm"
            onClick={checkDatabaseStatus}
            className="ml-2 bg-transparent border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Check Again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-700 dark:text-red-300">
        Database error: {error}
        <Button
          variant="outline"
          size="sm"
          onClick={checkDatabaseStatus}
          className="ml-2 bg-transparent border-red-300 text-red-700 hover:bg-red-100"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}
