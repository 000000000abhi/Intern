import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Twitter, Github, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  const footerLinks = {
    Product: [
      { name: "Features", href: "/#features" },
      { name: "Templates", href: "/templates" },
      { name: "Pricing", href: "/#pricing" },
      { name: "Examples", href: "/#examples" },
    ],
    Company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    Resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Help Center", href: "/help" },
      { name: "API Reference", href: "/api" },
      { name: "Status", href: "/status" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  }

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://github.com/000000000abhi/" },
    { name: "GitHub", icon: Github, href: "https://github.com/000000000abhi/" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/abhijeet-ansal-9993a3275/" },
    { name: "Email", icon: Mail, href: "ak4492473@gmail.com" },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-200 dark:border-navy-700">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get the latest updates on new features, templates, and portfolio tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white dark:bg-navy-800 border-gray-300 dark:border-navy-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-brand-500 dark:focus:border-brand-400"
              />
              <Button className="bg-brand-500 hover:bg-brand-600 text-white whitespace-nowrap border-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">PortfolioAI</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-sm">
              Transform your resume into a stunning portfolio with the power of AI. Create, customize, and deploy in
              minutes.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg flex items-center justify-center hover:bg-brand-50 dark:hover:bg-navy-700 hover:border-brand-200 dark:hover:border-brand-600 transition-colors duration-200 group"
                >
                  <social.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-navy-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">© 2024 PortfolioAI. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Made with ❤️ by Abhijeet</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
