import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Search, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { FeatureShell } from "@/components/feature-shell";
import { AIResult } from "@/components/ai-result";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { researchTopic } from "@/lib/ai/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkWise AI" },
      { name: "description", content: "Summarize topics with insights and recommendations." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const mutation = useMutation({
    mutationFn: (t: string) => fn({ data: { topic: t } }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Research failed"),
  });

  return (
    <FeatureShell
      icon={Search}
      title="AI Research Assistant"
      description="Get concise summaries, benefits, challenges, and recommendations on any topic."
    >
      <Card className="shadow-card">
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or article excerpt</Label>
            <Textarea
              id="topic"
              placeholder="e.g. Benefits of async-first team communication, or paste an article..."
              rows={8}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              if (!topic.trim()) return toast.error("Enter a topic to research");
              mutation.mutate(topic);
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Researching...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Research Topic
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      {mutation.data && <AIResult title="Research Brief" content={mutation.data.content} />}
    </FeatureShell>
  );
}
