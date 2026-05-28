import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { FeatureShell } from "@/components/feature-shell";
import { AIResult } from "@/components/ai-result";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNotes } from "@/lib/ai/ai.functions";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkWise AI" },
      { name: "description", content: "Summarize meeting notes into action items and deadlines." },
    ],
  }),
  component: SummarizerPage,
});

function SummarizerPage() {
  const fn = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const mutation = useMutation({
    mutationFn: (notes: string) => fn({ data: { notes } }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Summarization failed"),
  });

  return (
    <FeatureShell
      icon={FileText}
      title="Meeting Notes Summarizer"
      description="Extract summary, action items, and deadlines from raw meeting notes."
    >
      <Card className="shadow-card">
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Paste your meeting notes</Label>
            <Textarea
              id="notes"
              placeholder="Paste raw meeting notes, transcripts, or bullet points here..."
              rows={10}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              if (!notes.trim()) return toast.error("Paste your notes first");
              mutation.mutate(notes);
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Summarize Notes
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      {mutation.data && <AIResult title="Summary" content={mutation.data.content} />}
    </FeatureShell>
  );
}
