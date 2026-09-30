import { z } from "zod";
import { budgetOptions, serviceOptions } from "@/content/site";

const serviceValues = serviceOptions.map((o) => o.value) as [string, ...string[]];
const budgetValues = budgetOptions.map((o) => o.value) as [string, ...string[]];

/** Shared by the form (client) and the /api/contact handler (server). */
export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120, "That name is too long."),
  email: z.string().trim().min(1, "Please enter your work email.").pipe(z.email("Enter a valid email address.")),
  company: z.string().trim().min(2, "Please enter your company or project name.").max(160),
  service: z.enum(serviceValues, { error: "Choose the service that fits best, or 'Not sure yet'." }),
  message: z
    .string()
    .trim()
    .min(20, "A sentence or two helps us prepare. At least 20 characters, please.")
    .max(4000, "Please keep the message under 4,000 characters."),
  budget: z.union([z.enum(budgetValues), z.literal("")]).optional(),
  /** Honeypot. Humans never see or fill this; the handler drops filled submissions silently. */
  website: z.string().max(500).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
