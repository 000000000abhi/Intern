"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, Sparkles, User, LogOut, Settings, Code } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useAuth } from "./auth-provider"
import { usePortfolio } from "./portfolio-context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { setExtractedData } = usePortfolio()
  const router = useRouter()

  const navigation = [
    { name: "Features", href: "/#features" },
    { name: "Templates", href: "/templates" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Generate", href: "/upload" },
    { name: "Examples", href: "/#examples" },
  ]

  const handleGetStarted = () => {
    if (user) router.push("/upload")
    else router.push("/auth/signin")
  }

  const handleDemo = () => {
    const demoData = { /* ... your demo JSON ... */ }
    setExtractedData(null)
    router.push("/templates")
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/") // redirect home
    } catch (err) {
      console.error("Sign out error:", err)
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-navy-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-navy-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">PortfolioAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400 font-medium transition-colors duration-200 relative group">
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" onClick={handleDemo} className="text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-navy-800">
              <Code className="w-4 h-4 mr-2" />
              Try Demo
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-brand-50 dark:hover:bg-navy-800">
                    <User className="w-4 h-4" />
                    {user.profile?.full_name || user.email?.split("@")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-700">
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/upload")}>
                    <Code className="w-4 h-4 mr-2" />
                    Generate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-navy-800">
                    Sign In
                  </Button>
                </Link>
                <Button onClick={handleGetStarted} className="bg-brand-500 hover:bg-brand-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="hover:bg-brand-50 dark:hover:bg-navy-800">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white dark:bg-navy-900 border-gray-200 dark:border-navy-700">
              <div className="flex flex-col space-y-6 mt-8">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} className="text-lg font-medium text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400 transition-colors duration-200" onClick={() => setIsOpen(false)}>
                    {item.name}
                  </Link>
                ))}

                <div className="pt-6 border-t border-gray-200 dark:border-navy-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Button variant="outline" onClick={handleDemo} className="w-full border-brand-200 text-brand-600 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-400 dark:hover:bg-navy-800">
                    <Code className="w-4 h-4 mr-2" />
                    Try Demo
                  </Button>

                  {user ? (
                    <>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Signed in as {user.profile?.full_name || user.email}
                      </div>
                      <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full">
                        Dashboard
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/upload")} className="w-full">
                        Generate Portfolio
                      </Button>
                      <Button variant="outline" onClick={handleSignOut} className="w-full">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/signin" className="w-full">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Button onClick={handleGetStarted} className="w-full bg-brand-500 hover:bg-brand-600 text-white">
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
