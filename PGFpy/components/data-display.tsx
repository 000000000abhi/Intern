"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Briefcase, GraduationCap, Code, MapPin, Mail, Phone } from "lucide-react"
import type { ExtractedData } from "@/components/portfolio-context"

interface DataDisplayProps {
  data: ExtractedData
}

export function DataDisplay({ data }: DataDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contact Details</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{data.personalInfo.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{data.personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{data.personalInfo.phone}</span>
                </div>
                {data.personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{data.personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Online Presence</h4>
              <div className="space-y-2">
                {data.personalInfo.website && (
                  <div className="text-sm">
                    <span className="text-gray-500">Website: </span>
                    <span className="text-brand-600 dark:text-brand-400">{data.personalInfo.website}</span>
                  </div>
                )}
                {data.personalInfo.linkedin && (
                  <div className="text-sm">
                    <span className="text-gray-500">LinkedIn: </span>
                    <span className="text-brand-600 dark:text-brand-400">{data.personalInfo.linkedin}</span>
                  </div>
                )}
                {data.personalInfo.github && (
                  <div className="text-sm">
                    <span className="text-gray-500">GitHub: </span>
                    <span className="text-brand-600 dark:text-brand-400">{data.personalInfo.github}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      {data.professionalSummary && (
        <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Briefcase className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Professional Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.professionalSummary}</p>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {data.skills && (
        <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Code className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {data.skills.technical.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {data.skills.soft && data.skills.soft.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {data.skills.soft.map((skill, index) => (
                    <Badge key={index} variant="outline" className="border-gray-200 dark:border-navy-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Briefcase className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Experience ({data.experience.length} positions)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.experience.slice(0, 3).map((exp, index) => (
                <div key={index} className="border-l-2 border-brand-200 dark:border-brand-700 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">{exp.title}</h4>
                  <p className="text-brand-600 dark:text-brand-400">{exp.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{exp.duration}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{exp.description}</p>
                </div>
              ))}
              {data.experience.length > 3 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">+{data.experience.length - 3} more positions</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <Card className="border-0 shadow-lg bg-white dark:bg-navy-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <GraduationCap className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h4 className="font-medium text-gray-900 dark:text-white">{edu.degree}</h4>
                  <p className="text-brand-600 dark:text-brand-400">{edu.institution}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{edu.year}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
