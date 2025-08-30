"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Sparkles, Eye, Download, Settings, Plus, MoreHorizontal, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  const portfolios = [
    {
      id: 1,
      name: "Software Developer Portfolio",
      status: "Published",
      theme: "Modern Dark",
      lastUpdated: "2 hours ago",
      views: 1247,
      progress: 100,
    },
    {
      id: 2,
      name: "UX Designer Portfolio",
      status: "Draft",
      theme: "Creative Light",
      lastUpdated: "1 day ago",
      views: 0,
      progress: 75,
    },
    {
      id: 3,
      name: "Data Scientist Portfolio",
      status: "Published",
      theme: "Professional Blue",
      lastUpdated: "3 days ago",
      views: 892,
      progress: 100,
    },
  ]

  const handleCreateNew = () => {
    router.push("/upload")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your AI-generated portfolios</p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-brand-500 hover:bg-brand-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 mt-4 md:mt-0 border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Portfolio
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Portfolios",
              value: "3",
              change: "+1 this month",
              icon: FileText,
              color: "from-blue-500 to-cyan-500",
            },
            {
              title: "Total Views",
              value: "2,139",
              change: "+12% from last month",
              icon: Eye,
              color: "from-emerald-500 to-teal-500",
            },
            {
              title: "Published",
              value: "2",
              change: "67% completion rate",
              icon: ExternalLink,
              color: "from-brand-500 to-blue-500",
            },
            {
              title: "AI Enhancements",
              value: "15",
              change: "Used this month",
              icon: Sparkles,
              color: "from-orange-500 to-red-500",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-navy-900 border-gray-200 dark:border-navy-700"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</CardTitle>
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 border-0 shadow-lg bg-white dark:bg-navy-900 border-gray-200 dark:border-navy-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Get started with creating your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/upload")}
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-brand-50 dark:hover:bg-navy-800 border-2 hover:border-brand-200 dark:hover:border-brand-700 bg-transparent border-gray-200 dark:border-navy-700"
              >
                <Upload className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                <span className="font-medium text-gray-900 dark:text-white">Upload Resume</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-brand-50 dark:hover:bg-navy-800 border-2 hover:border-brand-200 dark:hover:border-brand-700 bg-transparent border-gray-200 dark:border-navy-700"
              >
                <Sparkles className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                <span className="font-medium text-gray-900 dark:text-white">AI Enhancement</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/templates")}
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-brand-50 dark:hover:bg-navy-800 border-2 hover:border-brand-200 dark:hover:border-brand-700 bg-transparent border-gray-200 dark:border-navy-700"
              >
                <Settings className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                <span className="font-medium text-gray-900 dark:text-white">Browse Templates</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Portfolios List */}
        <Card className="border-0 shadow-lg bg-white dark:bg-navy-900 border-gray-200 dark:border-navy-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Your Portfolios</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Manage and edit your created portfolios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-navy-700 rounded-lg hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{portfolio.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge
                          variant={portfolio.status === "Published" ? "default" : "secondary"}
                          className={
                            portfolio.status === "Published"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }
                        >
                          {portfolio.status}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{portfolio.theme}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{portfolio.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{portfolio.views} views</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={portfolio.progress} className="w-16 h-2" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{portfolio.progress}%</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-navy-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700"
                      >
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700">
                          <Settings className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Live
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
