import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import {
  Lightbulb,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  Brain,
  Coffee,
  Target,
} from "lucide-react";
import { toast } from "sonner";

import { FeatureShell } from "@/components/feature-shell";
import { AIResult } from "@/components/ai-result";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { productivityInsights } from "@/lib/ai/ai.functions";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "AI Productivity Insights — WorkWise AI" },
      {
        name: "description",
        content: "Smart AI-powered recommendations for productivity and time management.",
      },
    ],
  }),
  component: InsightsPage,
});

const STARTER_INSIGHTS = [
  {
    icon: Brain,
    title: "Peak focus window",
    body: "You appear most productive between 9 AM and 11 AM. Protect this block for deep work.",
    tone: "from-primary/15 to-primary/0 border-primary/30",
  },
  {
    icon: AlertTriangle,
    title: "Overdue priorities",
    body: "Multiple high-priority items are aging. Triage the top 2 before adding new work.",
    tone: "from-warning/15 to-warning/0 border-warning/30",
  },
  {
    icon: Coffee,
    title: "Break cadence",
    body: "Schedule short breaks every 90 minutes between deep work sessions to sustain focus.",
    tone: "from-success/15 to-success/0 border-success/30",
  },
  {
    icon: Target,
    title: "Weekly focus theme",
    body: "Group similar tasks into themed days to reduce context switching by ~30%.",
    tone: "from-accent to-accent/0 border-border",
  },
];

const SAMPLE = `This week I have:
- 12 client emails to respond to
- 3 overdue project tasks from last sprint
- A quarterly report due Friday
- Daily standups at 9:30am
- 2 deep-work coding sessions planned
I work best in mornings but keep getting pulled into afternoon meetings.`;

function InsightsPage() {
  const fn = useServerFn(productivityInsights);
  const [context, setContext] = useState("");
  const mutation = useMutation({
    mutationFn: (c: string) => fn({ data: { context: c } }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Analysis failed"),
  });

  return (
    <FeatureShell
      icon={Lightbulb}
      title="AI Productivity Insights"
      description="Get smart recommendations based on your work patterns, priorities, and habits."
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STARTER_INSIGHTS.map((insight) => (
          <Card
            key={insight.title}
            className={`group relative overflow-hidden border bg-gradient-to-br ${insight.tone} shadow-card transition-base hover:-translate-y-0.5 hover:shadow-elevated`}
          >
            <CardContent className="space-y-2 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/80 shadow-sm backdrop-blur">
                <insight.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{insight.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-border/60 bg-card/80 shadow-card backdrop-blur-sm">
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="context" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Describe your current workload & habits
            </Label>
            <Textarea
              id="context"
              placeholder={SAMPLE}
              rows={8}
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => {
                if (!context.trim()) return toast.error("Describe your workload first");
                mutation.mutate(context);
              }}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate Insights
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setContext(SAMPLE)}
              className="text-xs"
            >
              <Clock className="h-3.5 w-3.5" /> Use sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {mutation.isPending && (
        <Card className="border-dashed bg-card/40">
          <CardContent className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Reading your patterns and crafting recommendations...
          </CardContent>
        </Card>
      )}

      {mutation.data && (
        <AIResult title="Your Personalized Insights" content={mutation.data.content} />
      )}
    </FeatureShell>
  );
}
