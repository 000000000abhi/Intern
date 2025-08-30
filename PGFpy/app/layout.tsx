// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { PortfolioProvider } from "@/components/portfolio-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PortfolioAI - Transform Your Resume Into a Stunning Portfolio",
  description:
    "AI-powered portfolio generator that transforms your resume into a professional, customizable portfolio in minutes. Choose from beautiful themes and deploy instantly.",
  keywords: "portfolio generator, AI portfolio, resume to portfolio, professional portfolio, GPT portfolio",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <PortfolioProvider>
              <Navbar />
              <main className="pt-16">{children}</main>
              <Footer />
            </PortfolioProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
