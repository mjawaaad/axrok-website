"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Mark, Wordmark } from "@/components/brand/Mark";
import { CtaLink } from "@/components/site/CtaLink";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { nav } from "@/content/site";
import { cn } from "@/lib/utils";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ease-[var(--ease-expo-out)]",
        scrolled ? "border-b border-line bg-navy/70 backdrop-blur-md" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 md:h-[72px] md:px-10">
        <Link href="/" className="group/logo flex items-center gap-3" aria-label="Axrok, home">
          <Mark title={null} className="h-7 w-auto text-cobalt-lift transition-colors duration-500 group-hover/logo:text-periwinkle" />
          <Wordmark className="text-[0.82rem] text-ink" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group/nav relative py-2 text-[0.78rem] font-medium tracking-[0.14em] uppercase transition-colors duration-300",
                  active ? "text-ink" : "text-ink-muted hover:text-ink"
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-0.5 left-0 h-px w-full origin-left bg-cobalt-lift transition-transform duration-500 ease-[var(--ease-expo-out)]",
                    active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <CtaLink href="/contact" size="sm" className="hidden sm:inline-flex">
            Request an Assessment
          </CtaLink>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="relative flex size-10 items-center justify-center border border-line md:hidden"
              aria-label="Open menu"
            >
              <span aria-hidden className="flex w-4 flex-col gap-[5px]">
                <span className="h-px w-full bg-ink" />
                <span className="h-px w-2/3 bg-ink" />
              </span>
            </SheetTrigger>
            <SheetContent
              side="top"
              className="h-dvh border-none bg-navy-deep/95 px-6 pt-24 pb-10 backdrop-blur-xl"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav aria-label="Mobile" className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i + 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-line"
                  >
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        aria-current={isActive(pathname, item.href) ? "page" : undefined}
                        className="flex items-baseline justify-between py-5"
                      >
                        <span className="display text-3xl">{item.label}</span>
                        <span className="eyebrow">0{i + 1}</span>
                      </Link>
                    </SheetClose>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mt-10"
              >
                <SheetClose asChild>
                  <CtaLink href="/contact">Request an Assessment</CtaLink>
                </SheetClose>
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
