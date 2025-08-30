"use client"

export type PortfolioTemplate = TemplateConfig

export interface TemplateConfig {
  id: string
  name: string
  description: string
  category: string
  preview: string
  features: string[]
  jsx: string
  css: string
  html: string
}

export const portfolioTemplates: TemplateConfig[] = [
  {
    id: "modern-developer",
    name: "Modern Developer",
    description: "Clean, professional design perfect for software developers and engineers",
    category: "Developer",
    preview: "/placeholder.svg?height=400&width=600&text=Modern+Developer+Template",
    features: ["Dark/Light Mode", "Responsive Design", "Project Showcase", "Skills Grid"],
    jsx: `import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

const ModernDeveloperPortfolio = ({ data }) => {
  const { personalInfo, sections } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {personalInfo.name || 'John Developer'}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {sections.summary || 'Full Stack Developer passionate about creating exceptional digital experiences'}
            </p>
            <div className="flex flex-wrap gap-4">
              {personalInfo.email && (
                <Button variant="default" size="sm" asChild>
                  <a href={\`mailto:\${personalInfo.email}\`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </a>
                </Button>
              )}
              {personalInfo.github && (
                <Button variant="outline" size="sm" asChild>
                  <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              )}
              {personalInfo.linkedin && (
                <Button variant="outline" size="sm" asChild>
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Skills */}
      {sections.skills && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8">Skills & Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {sections.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience */}
      {sections.experience && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8">Experience</h2>
            <div className="space-y-6">
              {sections.experience.map((exp, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground leading-relaxed">{exp}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {sections.projects && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8">Featured Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.projects.map((project, index) => (
                <Card key={index} className="group hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center">
                      <div className="text-muted-foreground">Project Preview</div>
                    </div>
                    <CardTitle className="text-lg">Project {\`#\${index + 1}\`}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{project}</CardDescription>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 {personalInfo.name || 'John Developer'}. All rights reserved.
            </p>
            <div className="flex gap-4">
              {personalInfo.github && (
                <a href={personalInfo.github} className="text-muted-foreground hover:text-foreground">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} className="text-muted-foreground hover:text-foreground">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {personalInfo.email && (
                <a href={\`mailto:\${personalInfo.email}\`} className="text-muted-foreground hover:text-foreground">
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernDeveloperPortfolio;`,
    css: `/* Modern Developer Portfolio Styles */
.container {
  max-width: 1200px;
}

.group:hover .group-hover\\:shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Developer Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</body>
</html>`,
  },
  {
    id: "creative-designer",
    name: "Creative Designer",
    description: "Elegant, visual-focused design for creative professionals and designers",
    category: "Creative",
    preview: "/placeholder.svg?height=400&width=600&text=Creative+Designer+Template",
    features: ["Visual Portfolio", "Image Gallery", "Creative Layout", "Responsive Grid"],
    jsx: `import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Instagram, Dribbble, Mail, ExternalLink, Palette } from 'lucide-react';

const CreativeDesignerPortfolio = ({ data }) => {
  const { personalInfo, sections } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-8 flex items-center justify-center">
              <Palette className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              {personalInfo.name || 'Creative Designer'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {sections.summary || 'Passionate designer creating beautiful and functional experiences through thoughtful design and creative problem-solving.'}
            </p>
            <div className="flex justify-center gap-4">
              {personalInfo.email && (
                <Button size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Get in Touch
                </Button>
              )}
              <Button variant="outline" size="lg">
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Skills */}
      {sections.skills && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Creative Skills</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A diverse toolkit for bringing creative visions to life
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.skills.map((skill, index) => (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-sm"></div>
                    </div>
                    <h3 className="font-semibold">{skill}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Grid */}
      {sections.projects && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Work</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A selection of projects that showcase creativity and attention to detail
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.projects.map((project, index) => (
                <Card key={index} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-20">🎨</div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Creative Project {\`#\${index + 1}\`}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project}</p>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Project
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience */}
      {sections.experience && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
              <div className="space-y-8">
                {sections.experience.map((exp, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-muted">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground leading-relaxed">{exp}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Let's Create Together</h2>
            <p className="text-muted-foreground mb-8">
              Ready to bring your creative vision to life? Let's discuss your next project.
            </p>
            <div className="flex justify-center gap-4">
              {personalInfo.email && (
                <Button size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Start a Project
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Dribbble className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreativeDesignerPortfolio;`,
    css: `/* Creative Designer Portfolio Styles */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-\\[4\\/3\\] {
  aspect-ratio: 4 / 3;
}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Designer Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</body>
</html>`,
  },
  {
    id: "professional-business",
    name: "Professional Business",
    description: "Clean, corporate design for business professionals and consultants",
    category: "Business",
    preview: "/placeholder.svg?height=400&width=600&text=Professional+Business+Template",
    features: ["Corporate Design", "Professional Layout", "Contact Forms", "Service Sections"],
    jsx: `import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Linkedin, Mail, Phone, MapPin, Briefcase, Award } from 'lucide-react';

const ProfessionalBusinessPortfolio = ({ data }) => {
  const { personalInfo, sections } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {personalInfo.name || 'Professional Name'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {sections.summary || 'Business Professional & Consultant'}
              </p>
            </div>
            <div className="flex gap-3">
              {personalInfo.email && (
                <Button>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              )}
              {personalInfo.linkedin && (
                <Button variant="outline">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contact Info Bar */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {personalInfo.location}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {sections.summary && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {sections.summary}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Core Competencies */}
      {sections.skills && (
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-center">Core Competencies</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sections.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {sections.experience && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-center">Professional Experience</h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {sections.experience.map((exp, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Position {\`#\${index + 1}\`}</CardTitle>
                        <CardDescription>Professional Role</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{exp}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education & Certifications */}
      {sections.education && (
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-center">Education & Certifications</h2>
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {sections.education.map((edu, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-background">
                        <Award className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <p className="text-muted-foreground">{edu}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Ready to discuss your next business challenge? Let's connect and explore how we can achieve your goals.
            </p>
            <div className="flex justify-center gap-4">
              {personalInfo.email && (
                <Button size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Schedule Consultation
                </Button>
              )}
              {personalInfo.linkedin && (
                <Button variant="outline" size="lg">
                  <Linkedin className="w-4 h-4 mr-2" />
                  Connect on LinkedIn
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 {personalInfo.name || 'Professional Name'}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProfessionalBusinessPortfolio;`,
    css: `/* Professional Business Portfolio Styles */
.container {
  max-width: 1200px;
}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Business Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</body>
</html>`,
  },
  {
    id: "minimalist-writer",
    name: "Minimalist Writer",
    description: "Clean, typography-focused design for writers and content creators",
    category: "Creative",
    preview: "/placeholder.svg?height=400&width=600&text=Minimalist+Writer+Template",
    features: ["Typography Focus", "Reading Experience", "Blog Layout", "Minimal Design"],
    jsx: `import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, PenTool, Mail, ExternalLink, Quote } from 'lucide-react';

const MinimalistWriterPortfolio = ({ data }) => {
  const { personalInfo, sections } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <PenTool className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-light tracking-tight mb-4">
              {personalInfo.name || 'Writer Name'}
            </h1>
            <p className="text-xl text-muted-foreground font-light mb-8">
              {sections.summary || 'Writer & Content Creator'}
            </p>
            <Separator className="w-24 mx-auto mb-8" />
            <div className="flex justify-center gap-6 text-sm">
              {personalInfo.email && (
                <a href={\`mailto:\${personalInfo.email}\`} 
                   className="text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-current">
                  {personalInfo.email}
                </a>
              )}
              {personalInfo.website && (
                <a href={personalInfo.website} 
                   className="text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-current">
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* About */}
      {sections.summary && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="prose prose-lg max-w-none">
              <div className="flex items-center gap-3 mb-8">
                <Quote className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-light m-0">About</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg font-light first-letter:text-4xl first-letter:font-normal first-letter:mr-1 first-letter:float-left first-letter:leading-none">
                {sections.summary}
              </p>
            </div>
          </div>
        </section>
      )}

      <Separator className="my-12" />

      {/* Writing Experience */}
      {sections.experience && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-3 mb-12">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-light">Experience</h2>
            </div>
            <div className="space-y-12">
              {sections.experience.map((exp, index) => (
                <article key={index} className="relative pl-8 border-l border-muted">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 bg-primary rounded-full"></div>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed font-light m-0">
                      {exp}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Separator className="my-12" />

      {/* Published Work */}
      {sections.projects && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-12 justify-center">
              <PenTool className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-light">Published Work</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {sections.projects.map((project, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-2">Work {\`#\${index + 1}\`}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {project}
                    </p>
                    <Button variant="ghost" size="sm" className="p-0 h-auto font-light">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Separator className="my-12" />

      {/* Writing Skills */}
      {sections.skills && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <PenTool className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-light">Expertise</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {sections.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="font-light">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-light mb-4">Let's Connect</h2>
          <p className="text-muted-foreground mb-8 font-light">
            Interested in collaborating or have a story to tell? I'd love to hear from you.
          </p>
          {personalInfo.email && (
            <Button size="lg" className="font-light">
              <Mail className="w-4 h-4 mr-2" />
              Get in Touch
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Separator className="mb-8" />
          <p className="text-sm text-muted-foreground font-light">
            © 2024 {personalInfo.name || 'Writer Name'}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MinimalistWriterPortfolio;`,
    css: `/* Minimalist Writer Portfolio Styles */
.prose {
  color: inherit;
}

.prose p {
  margin-bottom: 1.25em;
}

.first-letter\\:text-4xl::first-letter {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.first-letter\\:font-normal::first-letter {
  font-weight: 400;
}

.first-letter\\:mr-1::first-letter {
  margin-right: 0.25rem;
}

.first-letter\\:float-left::first-letter {
  float: left;
}

.first-letter\\:leading-none::first-letter {
  line-height: 1;
}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minimalist Writer Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</body>
</html>`,
  },
]

export function getTemplateById(id: string): TemplateConfig | undefined {
  return portfolioTemplates.find((template) => template.id === id)
}

export function getTemplatesByCategory(category: string): TemplateConfig[] {
  return portfolioTemplates.filter((template) => template.category === category)
}

export const templateCategories = ["Developer", "Creative", "Business"]
