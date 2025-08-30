"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Upload, Edit3, Sparkles, Download, CheckCircle, Star, Users, Zap, Play } from "lucide-react"
import { DatabaseStatus } from "@/components/database-status"

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/upload")
  }

  const handleDemo = () => {
    // Store demo data and redirect to templates
    const demoData = {
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "+1 (555) 123-4567",
      title: "Full Stack Developer",
      experience: "4+ years",
      skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker"],
      education: "BS Computer Science - Stanford University",
      projects: 5,
      certifications: 3,
      summary: "Passionate full-stack developer with expertise in modern web technologies and cloud infrastructure.",
    }

    localStorage.setItem("demoPortfolioData", JSON.stringify(demoData))
    router.push("/templates?demo=true")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      {/* Database Status Banner */}
      {/* <div className="bg-gray-50 dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700">
        <div className="container mx-auto px-4 py-3">
          <DatabaseStatus showFullCard={false} />
        </div>
      </div> */}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-white to-blue-50/30 dark:from-navy-900/50 dark:via-navy-950 dark:to-navy-900/30" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-sm font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Portfolio Generation
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Transform Your Resume Into a
              <span className="block bg-gradient-to-r from-brand-600 to-blue-600 dark:from-brand-400 dark:to-blue-400 bg-clip-text text-transparent">
                Stunning Portfolio
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Upload your resume and let our AI create a professional, customizable portfolio in minutes. Choose from
              beautiful themes and deploy instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleDemo}
                className="px-8 py-3 text-lg font-semibold border-2 border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-navy-800 bg-transparent"
              >
                <Play className="mr-2 w-5 h-5" />
                Try Demo
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Deploy in seconds
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Four simple steps to create your professional portfolio
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Upload,
                title: "Upload Resume",
                description: "Simply drag and drop your PDF resume to get started",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Sparkles,
                title: "AI Enhancement",
                description: "Our GPT-4 AI enhances and optimizes your content",
                color: "from-brand-500 to-blue-500",
              },
              {
                icon: Edit3,
                title: "Customize",
                description: "Edit content and choose from beautiful themes",
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: Download,
                title: "Deploy",
                description: "Publish to web or download your portfolio instantly",
                color: "from-orange-500 to-red-500",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="relative group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-sm font-bold text-brand-600 dark:text-brand-400">
                  {index + 1}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-brand-500 to-blue-600 dark:from-brand-600 dark:to-blue-700">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            {[
              { icon: Users, number: "10K+", label: "Portfolios Created" },
              { icon: Star, number: "4.9/5", label: "User Rating" },
              { icon: Zap, number: "< 2min", label: "Average Creation Time" },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <stat.icon className="w-12 h-12 mb-4 opacity-90" />
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-navy-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Ready to Create Your Portfolio?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already created stunning portfolios with our AI-powered platform.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
          >
            Start Building Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
