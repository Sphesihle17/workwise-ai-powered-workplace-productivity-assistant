import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Mail, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { FeatureShell } from "@/components/feature-shell";
import { AIResult } from "@/components/ai-result";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkWise AI" },
      { name: "description", content: "Generate professional workplace emails with AI." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<"formal" | "friendly" | "persuasive">("formal");
  const [audience, setAudience] = useState<"manager" | "client" | "coworker">("manager");

  const mutation = useMutation({
    mutationFn: (input: { topic: string; tone: typeof tone; audience: typeof audience }) =>
      fn({ data: input }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Generation failed"),
  });

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Describe what your email is about");
      return;
    }
    mutation.mutate({ topic, tone, audience });
  };

  return (
    <FeatureShell
      icon={Mail}
      title="Smart Email Generator"
      description="Draft professional workplace emails tailored to tone and audience."
    >
      <Card className="shadow-card">
        <CardContent className="space-y-5 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Audience</Label>
              <Select
                value={audience}
                onValueChange={(v) => setAudience(v as typeof audience)}
              >
                <SelectTrigger id="audience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="coworker">Coworker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">What's the email about?</Label>
            <Textarea
              id="topic"
              placeholder="e.g. Request a deadline extension for the Q3 marketing report..."
              rows={5}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={mutation.isPending}
            className="w-full sm:w-auto"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {mutation.data && <AIResult title="Generated Email" content={mutation.data.content} />}
    </FeatureShell>
  );
}
