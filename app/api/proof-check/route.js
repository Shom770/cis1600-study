// Grades a proof sketch against the reference proofs with Gemini Flash via OpenRouter.
// The API key stays on the server: set OPENROUTER_API_KEY in .env.local.
import { NextResponse } from "next/server";
import { findProblem } from "../../../lib/pool";

const MODEL = process.env.OPENROUTER_MODEL || "google/gemini-3.8-flash";

const SYSTEM = `You are a teaching assistant for CIS 1600 (discrete mathematics). A student is practising proofs by writing only a rough line of reasoning, not a full proof. Judge whether their idea, if written out carefully, would lead to a correct proof.

Compare the sketch with the reference proofs, but accept any valid approach, including one that differs from the references. Do not penalise missing details, notation, or polish. Do penalise a wrong key idea, circular reasoning, an unjustified leap at the crux, or a strategy that cannot work.

Reply with JSON only, in this shape:
{"closeness": <integer 0-100>, "verdict": "on_track" | "partial" | "off_track", "right": "<one or two sentences on what is correct; empty string if nothing>", "missing": "<one or two sentences on the key gap or error; empty string if none>", "nudge": "<one sentence pointing toward the next step, without writing the whole proof>"}

Use "on_track" (closeness 75 or more) when the core idea is right and only routine details remain, "partial" (35 to 74) when it is pointed the right way but the crux is missing or shaky, and "off_track" (below 35) otherwise. Write plain text without LaTeX; use unicode symbols such as ≤ ≥ Σ.`;

export async function POST(req) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "No API key. Add OPENROUTER_API_KEY=... to .env.local in the project folder, then try again." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const q = findProblem(body?.id);
  const attempt = String(body?.attempt || "").slice(0, 4000).trim();
  if (!q) return NextResponse.json({ error: "Unknown problem." }, { status: 400 });
  if (attempt.length < 10) return NextResponse.json({ error: "Write at least a sentence of reasoning first." }, { status: 400 });

  const user = `PROBLEM:\n${q.prompt}\n\nREFERENCE PROOFS:\n${q.solutions.map((s, i) => `(${i + 1}) ${s.approach}:\n${s.text}`).join("\n\n")}\n\nSTUDENT'S LINE OF REASONING:\n${attempt}`;

  let res;
  try {
    res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: user },
        ],
      }),
    });
  } catch {
    return NextResponse.json({ error: "Couldn't reach OpenRouter. Check your connection and try again." }, { status: 502 });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = res.status === 401 ? "OpenRouter rejected the API key. Check OPENROUTER_API_KEY in .env.local." : `OpenRouter returned ${res.status}. ${text.slice(0, 200)}`;
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content || "";
  let out;
  try {
    out = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, ""));
  } catch {
    return NextResponse.json({ error: "The model's reply couldn't be read. Try again." }, { status: 502 });
  }
  const closeness = Math.max(0, Math.min(100, Math.round(Number(out.closeness) || 0)));
  const verdict = ["on_track", "partial", "off_track"].includes(out.verdict)
    ? out.verdict
    : closeness >= 75 ? "on_track" : closeness >= 35 ? "partial" : "off_track";
  return NextResponse.json({
    closeness,
    verdict,
    right: String(out.right || ""),
    missing: String(out.missing || ""),
    nudge: String(out.nudge || ""),
  });
}
