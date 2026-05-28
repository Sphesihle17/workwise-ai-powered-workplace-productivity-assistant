import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { ListChecks, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { FeatureShell } from "@/components/feature-shell";
import { AIResult } from "@/components/ai-result";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planTasks } from "@/lib/ai/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkWise AI" },
      { name: "description", content: "AI-prioritized daily task plan." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const mutation = useMutation({
    mutationFn: (t: string) => fn({ data: { tasks: t } }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Planning failed"),
  });

  return (
    <FeatureShell
      icon={ListChecks}
      title="AI Task Planner"
      description="Drop your to-do list and get a prioritized daily plan with productivity tips."
    >
      <Card className="shadow-card">
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="tasks">Your tasks for today</Label>
            <Textarea
              id="tasks"
              placeholder={`- Reply to client emails\n- Prepare quarterly report\n- 1:1 with manager at 3pm\n- Review pull requests`}
              rows={8}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              if (!tasks.trim()) return toast.error("Add a few tasks first");
              mutation.mutate(tasks);
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Planning...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Plan My Day
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      {mutation.data && <AIResult title="Your Daily Plan" content={mutation.data.content} />}
    </FeatureShell>
  );
}
