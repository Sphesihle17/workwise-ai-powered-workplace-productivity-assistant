import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  CalendarRange,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Clock,
  CheckCircle2,
  Flame,
  Zap,
  Brain,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkWise AI" },
      { name: "description", content: "Your AI-powered workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  {
    label: "Emails Generated",
    value: "248",
    trend: "+12%",
    icon: Mail,
    series: [12, 18, 14, 22, 19, 28, 31],
    tone: "from-primary/30 to-primary/0",
  },
  {
    label: "Meetings Summarized",
    value: "64",
    trend: "+8%",
    icon: FileText,
    series: [3, 5, 4, 7, 6, 8, 9],
    tone: "from-primary-glow/30 to-primary-glow/0",
  },
  {
    label: "Tasks Planned",
    value: "182",
    trend: "+24%",
    icon: CalendarRange,
    series: [8, 12, 10, 16, 14, 22, 26],
    tone: "from-success/30 to-success/0",
  },
  {
    label: "Research Queries",
    value: "97",
    trend: "+18%",
    icon: Search,
    series: [4, 6, 8, 7, 10, 12, 14],
    tone: "from-warning/30 to-warning/0",
  },
];

const actions = [
  { title: "Generate Email", description: "Craft polished workplace emails in seconds.", icon: Mail, to: "/email" },
  { title: "Summarize Notes", description: "Turn meeting notes into clear action items.", icon: FileText, to: "/summarizer" },
  { title: "Plan Productivity", description: "Daily, weekly & monthly AI plans.", icon: CalendarRange, to: "/planner" },
  { title: "Research Topic", description: "Summarize topics with key insights.", icon: Search, to: "/research" },
] as const;

const recentActivity = [
  { icon: Mail, title: "Generated follow-up email to client", meta: "Smart Email · 2m ago", tone: "text-primary" },
  { icon: FileText, title: "Summarized Q3 strategy meeting", meta: "Notes Summarizer · 24m ago", tone: "text-primary-glow" },
  { icon: CalendarRange, title: "Built weekly productivity plan", meta: "Planner · 1h ago", tone: "text-success" },
  { icon: Search, title: "Researched async-first team practices", meta: "Research · 3h ago", tone: "text-warning" },
  { icon: MessageSquare, title: "Chatted about 1:1 meeting agenda", meta: "AI Chat · yesterday", tone: "text-primary" },
];

const insights = [
  {
    icon: Brain,
    title: "Peak focus window",
    body: "You're most productive 9–11 AM. Block this for deep work.",
    accent: "from-primary/15 via-primary/5 to-transparent border-primary/30",
  },
  {
    icon: Flame,
    title: "3 overdue priorities",
    body: "Triage these before adding new tasks to avoid burnout.",
    accent: "from-warning/15 via-warning/5 to-transparent border-warning/30",
  },
  {
    icon: Zap,
    title: "Batch shallow work",
    body: "Group emails & approvals into a single 30-min block.",
    accent: "from-success/15 via-success/5 to-transparent border-success/30",
  },
];

const weeklyActivity = [
  { day: "Mon", value: 24 },
  { day: "Tue", value: 32 },
  { day: "Wed", value: 28 },
  { day: "Thu", value: 41 },
  { day: "Fri", value: 38 },
  { day: "Sat", value: 12 },
  { day: "Sun", value: 8 },
];

function Sparkline({ data, tone }: { data: number[]; tone: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={42}>
      <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`grad-${tone}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.5} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke="currentColor"
          strokeWidth={1.75}
          fill={`url(#grad-${tone})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function Dashboard() {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);
  const today = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    [],
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-primary p-8 text-primary-foreground shadow-elevated md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay bg-gradient-mesh" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            WorkWise AI · {today}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {greeting}. Let's make today productive.
          </h1>
          <p className="mt-3 max-w-xl text-sm opacity-90 md:text-base">
            Automate repetitive workplace tasks with AI. Write better emails, summarize meetings,
            plan your day, and get smart productivity insights — all in one workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild variant="secondary" size="sm" className="shadow-card">
              <Link to="/chat">
                <MessageSquare className="h-4 w-4" /> Chat with WorkWise
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/planner">
                Plan my day <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/insights">
                <Lightbulb className="h-4 w-4" /> View insights
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Focus score", value: "82%", icon: Brain },
              { label: "Tasks this week", value: "24 / 31", icon: CheckCircle2 },
              { label: "Time saved", value: "5h 40m", icon: Clock },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
              >
                <div className="flex items-center justify-between text-xs opacity-80">
                  <span>{m.label}</span>
                  <m.icon className="h-3.5 w-3.5" />
                </div>
                <div className="mt-1.5 text-xl font-bold">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats with sparklines */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="group relative overflow-hidden border-border/60 bg-card/80 shadow-card backdrop-blur-sm transition-base hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.tone} opacity-60`}
            />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription className="text-xs font-medium">{s.label}</CardDescription>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 shadow-sm">
                <s.icon className="h-4 w-4 text-primary" />
              </span>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold tracking-tight">{s.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3 w-3" />
                <span>{s.trend} this month</span>
              </div>
              <div className="mt-3 -mx-1 text-primary">
                <Sparkline data={s.series} tone={s.label.replace(/\s/g, "")} />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Activity chart + AI insights */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 bg-card/80 shadow-card backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Weekly AI activity</CardTitle>
              <CardDescription>Actions across all tools, last 7 days</CardDescription>
            </div>
            <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
              +18% vs last week
            </span>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyActivity} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.22 290)" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="oklch(0.78 0.15 190)" stopOpacity={0.65} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                />
                <RTooltip
                  cursor={{ fill: "oklch(0.62 0.22 290 / 0.08)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 shadow-card backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-primary" /> Productivity goal
            </CardTitle>
            <CardDescription>Weekly focus target</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Deep work hours</span>
                <span className="text-muted-foreground">14 / 20h</span>
              </div>
              <Progress value={70} className="mt-2 h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Tasks completed</span>
                <span className="text-muted-foreground">24 / 31</span>
              </div>
              <Progress value={77} className="mt-2 h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Meetings reviewed</span>
                <span className="text-muted-foreground">8 / 10</span>
              </div>
              <Progress value={80} className="mt-2 h-2" />
            </div>
            <Button asChild variant="ghost" size="sm" className="w-full justify-between">
              <Link to="/insights">
                See full insights <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* AI Insights cards */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">AI Productivity Insights</h2>
          <Link
            to="/insights"
            className="text-xs font-medium text-primary transition-base hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {insights.map((i) => (
            <Card
              key={i.title}
              className={`group relative overflow-hidden border bg-gradient-to-br ${i.accent} shadow-card transition-base hover:-translate-y-0.5 hover:shadow-elevated`}
            >
              <CardContent className="space-y-2 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/80 shadow-sm backdrop-blur">
                  <i.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">{i.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{i.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick actions + Recent activity */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Quick actions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {actions.map((a) => (
              <Link
                key={a.title}
                to={a.to}
                className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/80 p-5 shadow-card backdrop-blur-sm transition-base hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 opacity-0 transition-opacity group-hover:from-primary/10 group-hover:opacity-100" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-base group-hover:bg-gradient-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{a.title}</h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-base group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Recent activity</h2>
          <Card className="border-border/60 bg-card/80 shadow-card backdrop-blur-sm">
            <CardContent className="divide-y divide-border p-0">
              {recentActivity.map((a, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 transition-base hover:bg-accent/40"
                >
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent ${a.tone}`}>
                    <a.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.meta}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="rounded-xl border border-warning/30 bg-warning/10 p-4">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Responsible AI:</span> AI-generated content may require
          human review before professional use. Always verify important information.
        </p>
      </section>
    </div>
  );
}
