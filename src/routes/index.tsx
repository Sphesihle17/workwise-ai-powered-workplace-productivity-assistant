import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  { label: "Emails Generated", value: "248", trend: "+12%", icon: Mail },
  { label: "Meetings Summarized", value: "64", trend: "+8%", icon: FileText },
  { label: "Tasks Planned", value: "182", trend: "+24%", icon: ListChecks },
  { label: "Research Queries", value: "97", trend: "+18%", icon: Search },
];

const actions = [
  {
    title: "Generate Email",
    description: "Craft polished workplace emails in seconds.",
    icon: Mail,
    to: "/email",
  },
  {
    title: "Summarize Notes",
    description: "Turn meeting notes into clear action items.",
    icon: FileText,
    to: "/summarizer",
  },
  {
    title: "Plan Tasks",
    description: "Get an AI-prioritized daily schedule.",
    icon: ListChecks,
    to: "/planner",
  },
  {
    title: "Research Topic",
    description: "Summarize topics with key insights.",
    icon: Search,
    to: "/research",
  },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <section className="overflow-hidden rounded-2xl border border-border bg-gradient-primary p-8 text-primary-foreground shadow-elevated">
        <div className="flex items-center gap-2 text-sm font-medium opacity-90">
          <Sparkles className="h-4 w-4" />
          WorkWise AI
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Welcome to WorkWise AI
        </h1>
        <p className="mt-2 max-w-xl text-sm opacity-90 md:text-base">
          Automate repetitive workplace tasks with AI. Write better emails, summarize meetings,
          plan your day, and research topics — all in one workspace.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild variant="secondary" size="sm">
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
            <Link to="/email">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card transition-base hover:shadow-elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription className="text-xs font-medium">{s.label}</CardDescription>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{s.value}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3 w-3" />
                <span>{s.trend} this month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {actions.map((a) => (
            <Link
              key={a.title}
              to={a.to}
              className="group rounded-xl border border-border bg-card p-5 shadow-card transition-base hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-base group-hover:bg-gradient-primary group-hover:text-primary-foreground">
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
