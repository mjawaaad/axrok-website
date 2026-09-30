import { contactSchema } from "@/lib/contact-schema";
import { budgetOptions, serviceOptions } from "@/content/site";

// Contact handler, the only conversion endpoint on the site.
//
// [PLACEHOLDER] Delivery: set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL
// (see .env.example) to send enquiries by email through Resend's REST API.
// Without them, enquiries are validated and logged to the server console only.
// To use a different provider, replace deliver() below.

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const labelFor = (list: readonly { value: string; label: string }[], v?: string) =>
  list.find((o) => o.value === v)?.label ?? "Not specified";

async function deliver(text: string, replyTo: string, subject: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    console.info("[contact] [PLACEHOLDER] no email provider configured. Enquiry received:\n" + text);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, text }),
  });
  if (!res.ok) throw new Error(`Email provider responded ${res.status}`);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const d = parsed.data;
  // Honeypot filled: accept silently so bots learn nothing.
  if (d.website) return Response.json({ ok: true });

  const text = [
    `Name: ${d.fullName}`,
    `Email: ${d.email}`,
    `Company / project: ${d.company}`,
    `Service: ${labelFor(serviceOptions, d.service)}`,
    `Budget: ${labelFor(budgetOptions, d.budget)}`,
    "",
    d.message,
  ].join("\n");

  try {
    await deliver(text, d.email, `New enquiry: ${labelFor(serviceOptions, d.service)} from ${d.company}`);
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return Response.json(
      { ok: false, error: "We could not send your message just now. Please try again shortly." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
