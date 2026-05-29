import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import {
  CalendarRange,
  Loader2,
  Sparkles,
  Sun,
  CalendarDays,
  CalendarClock,
  Flag,
  Zap,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { FeatureShell } from "@/components/feature-shell";
import { AIResult } from "@/components/ai-result";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { planTasks } from "@/lib/ai/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Productivity Planner — WorkWise AI" },
      {
        name: "description",
        content: "AI-prioritized daily, weekly and monthly productivity plans.",
      },
    ],
  }),
  component: PlannerPage,
});

type Timeframe = "daily" | "weekly" | "monthly";

const TIMEFRAMES: {
  value: Timeframe;
  label: string;
  icon: typeof Sun;
  hint: string;
  placeholder: string;
}[] = [
  {
    value: "daily",
    label: "Daily",
    icon: Sun,
    hint: "Focused one-day plan with hour blocks.",
    placeholder: `- Reply to client emails\n- Prepare quarterly report\n- 1:1 with manager at 3pm\n- Review pull requests`,
  },
  {
    value: "weekly",
    label: "Weekly",
    icon: CalendarDays,
    hint: "5-day plan with day-by-day priorities.",
    placeholder: `- Ship marketing landing page\n- Interview 3 design candidates\n- Quarterly board prep\n- Catch up on team 1:1s\n- Personal: dentist Wed 4pm`,
  },
  {
    value: "monthly",
    label: "Monthly",
    icon: CalendarClock,
    hint: "Month roadmap with weekly themes.",
    placeholder: `- Launch Q3 marketing campaign\n- Hire 2 engineers\n- Migrate billing system\n- Run quarterly OKR review\n- Conference talk prep`,
  },
];

const PRIORITY_TIPS = [
  { icon: Flag, label: "Tag top 3 outcomes", tone: "text-destructive" },
  { icon: Zap, label: "Batch shallow tasks", tone: "text-warning" },
  { icon: TrendingUp, label: "Protect deep work", tone: "text-success" },
];

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [timeframe, setTimeframe] = useState<Timeframe>("daily");
  const [tasks, setTasks] = useState("");
  const mutation = useMutation({
    mutationFn: (input: { tasks: string; timeframe: Timeframe }) => fn({ data: input }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Planning failed"),
  });

  const current = TIMEFRAMES.find((t) => t.value === timeframe)!;

  return (
    <FeatureShell
      icon={CalendarRange}
      title="Productivity Planner"
      description="Turn your task list into a prioritized AI-generated plan for any timeframe."
    >
      <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as Timeframe)}>
        <TabsList className="grid w-full grid-cols-3 sm:w-auto">
          {TIMEFRAMES.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="gap-2">
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-3">
        {PRIORITY_TIPS.map((tip) => (
          <Card
            key={tip.label}
            className="border-border/60 bg-card/70 shadow-card backdrop-blur-sm transition-base hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <CardContent className="flex items-center gap-3 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <tip.icon className={`h-4 w-4 ${tip.tone}`} />
              </span>
              <span className="text-sm font-medium">{tip.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60 bg-card/80 shadow-card backdrop-blur-sm">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3">
            <current.icon className="mt-0.5 h-4 w-4 text-primary" />
            <div className="text-sm">
              <p className="font-semibold capitalize">{current.label} planning</p>
              <p className="text-xs text-muted-foreground">{current.hint}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tasks">Your tasks & commitments</Label>
            <Textarea
              id="tasks"
              placeholder={current.placeholder}
              rows={8}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              if (!tasks.trim()) return toast.error("Add a few tasks first");
              mutation.mutate({ tasks, timeframe });
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Planning...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate {current.label} Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {mutation.data && (
        <AIResult
          title={`Your ${current.label} Productivity Plan`}
          content={mutation.data.content}
        />
      )}
    </FeatureShell>
  );
}
