import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callAI(system: string, user: string): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace settings.");
    throw new Error(`AI request failed (${res.status}): ${t.slice(0, 200)}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      topic: z.string().min(1).max(2000),
      tone: z.enum(["formal", "friendly", "persuasive"]),
      audience: z.enum(["manager", "client", "coworker"]),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are a professional workplace email writer. Write concise, polished emails.
Requirements:
- Use a ${data.tone} tone
- Audience: ${data.audience}
- Keep it short and clear
- Include subject line, greeting, body, sign-off
- Use simple professional language`;
    const content = await callAI(system, `Write an email about: ${data.topic}`);
    return { content };
  });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(1).max(10000) }))
  .handler(async ({ data }) => {
    const system = `You are a professional workplace assistant. Summarize meeting notes concisely.
Format with clear short sections and bullet points:
**Summary**
**Action Items**
**Deadlines**
Keep it concise, professional, no fluff.`;
    const content = await callAI(system, data.notes);
    return { content };
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tasks: z.string().min(1).max(4000),
      timeframe: z.enum(["daily", "weekly", "monthly"]).default("daily"),
    }),
  )
  .handler(async ({ data }) => {
    const tf = data.timeframe;
    const scope =
      tf === "daily"
        ? "a single focused workday"
        : tf === "weekly"
          ? "a balanced 5-day work week with day-by-day breakdown"
          : "a full month with weekly themes and milestones";

    const scheduleSection =
      tf === "daily"
        ? "**Suggested Schedule** (hour-by-hour blocks)"
        : tf === "weekly"
          ? "**Weekly Schedule** (Monday → Friday breakdown)"
          : "**Monthly Roadmap** (Week 1 → Week 4 themes & milestones)";

    const system = `You are a workplace productivity assistant. Build a clear ${tf} plan for ${scope}.
Format with short bullet sections (use markdown headings):
**High Priority**
**Medium Priority**
${scheduleSection}
**3 Productivity Tips**
Use simple professional language. Be concise and actionable.`;
    const content = await callAI(system, `Tasks:\n${data.tasks}`);
    return { content };
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(z.object({ topic: z.string().min(1).max(2000) }))
  .handler(async ({ data }) => {
    const system = `You are a professional research assistant. Summarize topics concisely.
Format with short bullet sections:
**Brief Summary**
**Key Benefits**
**Challenges**
**Recommendations**
Use simple workplace language, avoid jargon.`;
    const content = await callAI(system, data.topic);
    return { content };
  });

export const productivityInsights = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      context: z.string().min(1).max(4000),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are an AI productivity coach analyzing a professional's work patterns.
Provide sharp, specific, and actionable insights. Format with markdown headings:
**Productivity Patterns**
- 2-3 observations about when/how this person works best
**Smart Recommendations**
- 3-4 specific, actionable suggestions
**Risk Areas**
- Overdue items, bottlenecks, or burnout signals to watch
**Time Management Habits**
- 3 concrete habits to adopt this week
Keep each bullet under 20 words. Be encouraging but honest.`;
    const content = await callAI(system, data.context);
    return { content };
  });

export const chatMessage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      messages: z
        .array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string().min(1).max(8000),
          }),
        )
        .min(1)
        .max(40),
    }),
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY is not configured");

    const res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `You are WorkWise AI, a professional workplace productivity assistant.
Respond clearly and concisely with practical, easy-to-understand advice.
Use professional but simple language. Avoid long explanations. Focus on the user's request.`,
          },
          ...data.messages,
        ],
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted.");
      throw new Error(`AI request failed (${res.status}): ${t.slice(0, 200)}`);
    }
    const json = await res.json();
    return { content: json.choices?.[0]?.message?.content ?? "" };
  });
