// app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase, Profile, Resume, Portfolio } from "@/lib/supabase"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Optional: loading skeleton for better UX
function DashboardSkeleton() {
  return (
    <div className="p-6 grid gap-6 lg:grid-cols-2 animate-pulse">
      <Card className="h-40" />
      <Card className="h-40" />
      <Card className="h-60 lg:col-span-2" />
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)

  // ---------- Fetch data ----------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error("Auth error:", userError)
        setLoading(false)
        return
      }

      const userId = user.id

      try {
        // Run all queries in parallel
        const [profileRes, resumesRes, portfoliosRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", userId).single(),
          supabase
            .from("resumes")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
          supabase
            .from("portfolios")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
        ])

        // Profile
        if (profileRes.data) {
          setProfile(profileRes.data as Profile)
        }

        // Resumes
        if (resumesRes.data) {
          setResumes(
            resumesRes.data.map((r: any): Resume => ({
              id: r.id,
              user_id: r.user_id ?? userId,
              filename: r.filename,
              file_size: r.file_size,
              file_url: r.file_url ?? "",
              extracted_text: r.extracted_text ?? "",
              pages_count: r.pages_count ?? 0,
              processing_status: r.processing_status ?? "completed",
              created_at: r.created_at,
              updated_at: r.updated_at ?? r.created_at,
            }))
          )
        }

        // Portfolios
        if (portfoliosRes.data) {
          setPortfolios(
            portfoliosRes.data.map((p: any): Portfolio => ({
              id: p.id,
              user_id: p.user_id ?? userId,
              portfolio_data_id: p.portfolio_data_id ?? "",
              title: p.title ?? "Untitled Portfolio",
              slug: p.slug ?? "",
              template_id: p.template_id ?? "",
              html_content: p.html_content ?? "",
              css_content: p.css_content ?? "",
              js_content: p.js_content ?? "",
              metadata: p.metadata ?? { title: "", description: "", keywords: [] },
              customizations: p.customizations ?? {},
              is_published: !!p.is_published,
              view_count: p.view_count ?? 0,
              last_viewed_at: p.last_viewed_at ?? null,
              created_at: p.created_at,
              updated_at: p.updated_at ?? p.created_at,
            }))
          )
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ---------- Button handlers ----------
  const handleUploadResume = () => router.push("/upload")
  const handleCreatePortfolio = () => router.push("/upload")
  const handleViewPortfolio = (p: Portfolio) =>
    router.push(p.is_published && p.slug ? `/p/${p.slug}` : `/portfolios/${p.id}`)
  const handleEditPortfolio = (p: Portfolio) =>
    router.push(`/portfolios/${p.id}/edit`)
  const handleDownloadResume = (r: Resume) => r.file_url && window.open(r.file_url, "_blank")

  // ---------- UI ----------
  if (loading) return <DashboardSkeleton />
  if (!profile) return <div className="p-6">Please sign in to view your dashboard.</div>

  const creditsPct = Math.min(100, Math.max(0, (profile.credits_remaining / 100) * 100))

  return (
    <div className="p-6 grid gap-6 lg:grid-cols-2">
      {/* Profile */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>👤 {profile.full_name || profile.email}</CardTitle>
          <CardDescription>User Profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><span className="font-medium">Email:</span> {profile.email}</p>
          <p>
            <span className="font-medium">Subscription:</span>{" "}
            <Badge variant={profile.subscription_tier === "pro" ? "default" : "secondary"}>
              {profile.subscription_tier}
            </Badge>
          </p>
          <div>
            <div className="mb-1 font-medium">Credits Remaining</div>
            <Progress value={creditsPct} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {profile.credits_remaining} / 100
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumes */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>📄 Resumes</CardTitle>
            <CardDescription>Your uploaded resumes</CardDescription>
          </div>
          <Button onClick={handleUploadResume} size="sm">Upload New</Button>
        </CardHeader>
        <CardContent>
          {resumes.length === 0 ? (
            <div className="text-sm text-muted-foreground">No resumes uploaded yet.</div>
          ) : (
            <ScrollArea className="h-64 pr-2">
              <ul className="space-y-2">
                {resumes.map((r) => (
                  <li key={r.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{r.filename}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        r.processing_status === "completed"
                          ? "default"
                          : r.processing_status === "failed"
                          ? "destructive"
                          : "secondary"
                      }>
                        {r.processing_status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDownloadResume(r)}>
                            Download original
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleUploadResume}>
                            Replace / Re-upload
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Portfolios */}
      <Card className="shadow-md lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>🌐 Portfolios</CardTitle>
            <CardDescription>Your created portfolios</CardDescription>
          </div>
          <Button onClick={handleCreatePortfolio} size="sm">Create New</Button>
        </CardHeader>
        <CardContent>
          {portfolios.length === 0 ? (
            <div className="text-sm text-muted-foreground">No portfolios created yet.</div>
          ) : (
            <ScrollArea className="h-80 pr-2">
              <ul className="grid md:grid-cols-2 gap-4">
                {portfolios.map((p) => (
                  <Card key={p.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg truncate">{p.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Slug: {p.slug || "—"}
                        </p>
                      </div>
                      <Badge variant={p.is_published ? "default" : "secondary"}>
                        {p.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">Views: {p.view_count}</div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewPortfolio(p)}>
                        {p.is_published ? "View" : "Preview"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditPortfolio(p)}>
                        Edit
                      </Button>
                      <Button variant="default" size="sm" asChild disabled={!p.is_published || !p.slug}>
                        <Link href={p.is_published && p.slug ? `/p/${p.slug}` : "#"}>Open</Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </ul>
            </ScrollArea>
          )}
          <Button className="mt-4 w-full" onClick={handleCreatePortfolio}>
            Create New Portfolio
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
