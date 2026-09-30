"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Controller, useForm, type UseFormSetValue } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Arrow } from "@/components/site/CtaLink";
import { budgetOptions, serviceOptions, tiers } from "@/content/site";
import { contactSchema, type ContactData, type ContactInput } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const control =
  "h-12 rounded-none border-line bg-navy-deep/60 px-4 text-[0.95rem] text-ink placeholder:text-ink-dim/80 " +
  "transition-[border-color,background-color] duration-300 hover:border-periwinkle/35 " +
  "focus-visible:border-cobalt-lift focus-visible:ring-0 focus-visible:bg-navy-deep/80 " +
  "aria-invalid:border-destructive aria-invalid:ring-0";

const label = "text-[0.72rem] font-medium tracking-[0.16em] text-ink-muted uppercase";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Where enquiries go. Server builds use the /api/contact handler. Static builds (GitHub Pages)
 * have no server, so they need NEXT_PUBLIC_CONTACT_ENDPOINT, e.g. a hosted form service URL.
 * [PLACEHOLDER] set it in the Pages workflow once a provider is chosen.
 */
const CONTACT_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || (process.env.NEXT_PUBLIC_STATIC_EXPORT ? null : "/api/contact");

/** Reads ?service= and ?tier= so CTAs elsewhere can pre-fill the form. */
function Prefill({ setValue }: { setValue: UseFormSetValue<ContactInput> }) {
  const params = useSearchParams();
  useEffect(() => {
    // Defer a frame so the controlled fields have subscribed before we write to them.
    const id = requestAnimationFrame(() => {
      const service = params.get("service");
      if (service && serviceOptions.some((o) => o.value === service)) {
        setValue("service", service, { shouldDirty: true });
      }
      const tier = tiers.find((t) => t.key === params.get("tier"));
      if (tier) setValue("message", `We are interested in the ${tier.name} engagement. `, { shouldDirty: true });
    });
    return () => cancelAnimationFrame(id);
  }, [params, setValue]);
  return null;
}

export function ContactForm() {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control: formControl,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { fullName: "", email: "", company: "", service: undefined, message: "", budget: "", website: "" },
  });

  const onSubmit = async (data: ContactData) => {
    setStatus("submitting");
    setServerError(null);
    try {
      if (!CONTACT_ENDPOINT) {
        throw new Error(
          "This preview is not connected to email yet, so enquiries cannot be sent from it. Please try again on the live site."
        );
      }
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: Partial<Record<keyof ContactInput, string[]>>;
      };
      // Our handler returns { ok }; hosted form services may only signal success via status.
      if (!res.ok || json.ok === false) {
        for (const [name, msgs] of Object.entries(json.fields ?? {})) {
          if (msgs?.[0]) setError(name as keyof ContactInput, { message: msgs[0] });
        }
        throw new Error(json.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const fade = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } };

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            {...fade}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="border border-cobalt-lift/40 bg-navy-deep/70 p-8 backdrop-blur-md md:p-12"
            role="status"
            aria-live="polite"
          >
            <SuccessMark />
            <p className="eyebrow mt-8">Enquiry received</p>
            {/* Focus on mount: the panel only mounts after the form's exit animation. */}
            <h2 ref={(el) => el?.focus({ preventScroll: true })} tabIndex={-1} className="display mt-4 text-3xl outline-none md:text-4xl">
              Thank you. We will be in touch.
            </h2>
            <p className="mt-5 max-w-md text-ink-muted">
              A member of the founding team reads every enquiry personally and will reply to the email you
              provided. {/* [PLACEHOLDER] add a response-time commitment if Axrok wants to state one */}
            </p>
            <button
              type="button"
              onClick={() => {
                reset();
                setStatus("idle");
              }}
              className="group/cta mt-10 inline-flex items-center gap-2 text-sm font-medium tracking-[0.12em] text-periwinkle uppercase"
            >
              <span className="relative">
                Send another enquiry
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-cobalt-lift transition-transform duration-500 group-hover/cta:scale-x-100" />
              </span>
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            {...fade}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-describedby="privacy-note"
            className="border border-line bg-navy/55 p-6 backdrop-blur-md md:p-10"
          >
            <FieldGroup className="grid gap-6 md:grid-cols-2">
              <Field data-invalid={!!errors.fullName}>
                <FieldLabel htmlFor="fullName" className={label}>
                  Full name
                </FieldLabel>
                <Input
                  id="fullName"
                  autoComplete="name"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  className={control}
                  {...register("fullName")}
                />
                <FieldError id="fullName-error" errors={[errors.fullName]} />
              </Field>

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email" className={label}>
                  Work email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={control}
                  {...register("email")}
                />
                <FieldError id="email-error" errors={[errors.email]} />
              </Field>

              <Field data-invalid={!!errors.company}>
                <FieldLabel htmlFor="company" className={label}>
                  Company or project
                </FieldLabel>
                <Input
                  id="company"
                  autoComplete="organization"
                  aria-invalid={!!errors.company}
                  aria-describedby={errors.company ? "company-error" : undefined}
                  className={control}
                  {...register("company")}
                />
                <FieldError id="company-error" errors={[errors.company]} />
              </Field>

              <Field data-invalid={!!errors.service}>
                <FieldLabel htmlFor="service" className={label}>
                  Service
                </FieldLabel>
                <Controller
                  name="service"
                  control={formControl}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                      <SelectTrigger
                        id="service"
                        ref={field.ref}
                        onBlur={field.onBlur}
                        aria-invalid={!!errors.service}
                        aria-describedby={errors.service ? "service-error" : undefined}
                        className={cn(control, "w-full data-placeholder:text-ink-dim/80 data-[size=default]:h-12")}
                      >
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="rounded-none border border-line bg-navy-raised">
                        {serviceOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value} className="rounded-none py-2.5 pl-3 text-[0.92rem]">
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError id="service-error" errors={[errors.service]} />
              </Field>

              <Field data-invalid={!!errors.message} className="md:col-span-2">
                <FieldLabel htmlFor="message" className={label}>
                  What do you need protected?
                </FieldLabel>
                <Textarea
                  id="message"
                  rows={5}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  placeholder="Scope, timelines, anything we should know."
                  className={cn(control, "field-sizing-fixed min-h-36 py-3")}
                  {...register("message")}
                />
                <FieldError id="message-error" errors={[errors.message]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="budget" className={label}>
                  Budget range <span className="ml-1 tracking-normal text-ink-dim normal-case">(optional)</span>
                </FieldLabel>
                <Controller
                  name="budget"
                  control={formControl}
                  render={({ field }) => (
                    <Select value={field.value || ""} onValueChange={field.onChange} name={field.name}>
                      <SelectTrigger
                        id="budget"
                        ref={field.ref}
                        onBlur={field.onBlur}
                        className={cn(control, "w-full data-placeholder:text-ink-dim/80 data-[size=default]:h-12")}
                      >
                        <SelectValue placeholder="Prefer not to say" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="rounded-none border border-line bg-navy-raised">
                        {budgetOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value} className="rounded-none py-2.5 pl-3 text-[0.92rem]">
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              {/* Honeypot: hidden from people and assistive tech. */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Website</label>
                <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
              </div>
            </FieldGroup>

            {/* After the fields, so their subscriptions exist before prefill writes. */}
            <Suspense fallback={null}>
              <Prefill setValue={setValue} />
            </Suspense>

            <div className="mt-10 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
              <p id="privacy-note" className="max-w-sm text-sm text-ink-muted">
                Your details are used only to respond to this enquiry. We never share them or add you to a
                mailing list.
              </p>
              <button
                type="submit"
                disabled={status === "submitting"}
                className={cn(
                  "group/cta relative inline-flex shrink-0 items-center justify-center gap-3 border border-cobalt-lift/60 px-7 py-4",
                  "text-[0.8rem] font-medium tracking-[0.14em] text-ink uppercase",
                  "transition-[border-color,box-shadow] duration-500 hover:border-cobalt-lift hover:shadow-[inset_0_0_0_1px_var(--color-cobalt-lift)]",
                  "disabled:cursor-wait disabled:opacity-70"
                )}
              >
                <span className="relative">
                  {status === "submitting" ? "Sending" : "Start the Conversation"}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-cobalt-lift transition-transform duration-500 group-hover/cta:scale-x-100" />
                </span>
                {status === "submitting" ? <Spinner /> : <Arrow />}
              </button>
            </div>

            <AnimatePresence>
              {serverError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert"
                  className="mt-6 border-l-2 border-destructive pl-4 text-sm text-destructive"
                >
                  {serverError}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Spinner() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 animate-spin text-periwinkle motion-reduce:animate-none">
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M14 8a6 6 0 0 0-6-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** A drawn check inside a cut-corner frame, matching the mark's geometry. */
function SuccessMark() {
  const reduced = useReducedMotion();
  return (
    <svg aria-hidden viewBox="0 0 56 56" className="size-14">
      <motion.path
        d="M28 2 L54 28 L28 54 L2 28 Z"
        fill="none"
        stroke="var(--color-cobalt-lift)"
        strokeWidth="1.2"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M19 28.5 L25.5 35 L37.5 22"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
