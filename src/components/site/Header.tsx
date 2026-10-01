"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Mark, Wordmark } from "@/components/brand/Mark";
import { Arrow, CtaLink } from "@/components/site/CtaLink";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { nav, services } from "@/content/site";
import { cn } from "@/lib/utils";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

const navText = "text-[0.76rem] font-medium tracking-[0.14em] uppercase transition-colors duration-300";

function Underline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute bottom-0.5 left-0 h-px w-full origin-left bg-cobalt-lift transition-transform duration-500 ease-[var(--ease-expo-out)]",
        active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100 group-data-open/nav:scale-x-100"
      )}
    />
  );
}

/** The Services mega-dropdown: all six services plus a link to the index. */
function ServicesPanel() {
  return (
    <div className="grid w-[min(860px,calc(100vw-4rem))] grid-cols-[1fr_15rem]">
      <ul className="grid grid-cols-2 gap-px bg-line p-px">
        {services.map((s) => (
          <li key={s.slug} className="bg-navy-deep">
            <NavigationMenuLink asChild>
              <Link
                href={`/services/${s.slug}`}
                className="group/item flex h-full flex-col items-start gap-1.5 rounded-none p-5 transition-colors duration-300 hover:bg-navy-raised/70 focus-visible:bg-navy-raised/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cobalt-lift"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.65rem] tracking-[0.2em] text-periwinkle">{s.index}</span>
                  <span className="text-[0.95rem] font-semibold text-ink">{s.navTitle}</span>
                  {s.premium && <span className="font-mono text-[0.58rem] tracking-[0.2em] text-periwinkle/80 uppercase">Premium</span>}
                </span>
                <span className="pl-8 text-[0.82rem] leading-snug text-ink-muted">{s.short}</span>
              </Link>
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
      <div className="flex flex-col justify-between border-l border-line p-6">
        <div>
          <p className="eyebrow">Services</p>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Six disciplines across offense, defense and intelligence, scaled from Scout to Siege.
          </p>
        </div>
        <NavigationMenuLink asChild>
          <Link
            href="/services"
            className="group/cta mt-8 inline-flex items-center gap-2 rounded-none p-0 text-xs font-medium tracking-[0.14em] text-periwinkle uppercase hover:bg-transparent focus:bg-transparent"
          >
            <span className="relative">
              View all services
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-cobalt-lift transition-transform duration-500 group-hover/cta:scale-x-100" />
            </span>
            <Arrow />
          </Link>
        </NavigationMenuLink>
      </div>
    </div>
  );
}

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
        scrolled ? "border-b border-line bg-navy/75 backdrop-blur-md" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 md:h-[72px] md:px-10">
        <Link href="/" className="group/logo flex items-center gap-3" aria-label="Axrok, home">
          <Mark title={null} className="h-7 w-auto text-cobalt-lift transition-colors duration-500 group-hover/logo:text-periwinkle" />
          <Wordmark className="text-[0.82rem] text-ink" />
        </Link>

        <NavigationMenu aria-label="Primary" className="hidden lg:flex">
          <NavigationMenuList className="gap-7 xl:gap-9">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              if ("dropdown" in item && item.dropdown) {
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger
                      className={cn(
                        "group/nav relative h-auto rounded-none bg-transparent px-0 py-2 hover:bg-transparent focus:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent",
                        navText,
                        active ? "text-ink" : "text-ink-muted hover:text-ink data-open:text-ink"
                      )}
                    >
                      {item.label}
                      <Underline active={active} />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-0">
                      <ServicesPanel />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              }
              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild active={active}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group/nav relative block rounded-none px-0 py-2 hover:bg-transparent focus:bg-transparent data-active:bg-transparent",
                        navText,
                        active ? "text-ink" : "text-ink-muted hover:text-ink"
                      )}
                    >
                      {item.label}
                      <Underline active={active} />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          <CtaLink href="/contact" size="sm" className="hidden sm:inline-flex">
            Request an Assessment
          </CtaLink>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="relative flex size-10 items-center justify-center border border-line lg:hidden" aria-label="Open menu">
              <span aria-hidden className="flex w-4 flex-col gap-[5px]">
                <span className="h-px w-full bg-ink" />
                <span className="h-px w-2/3 bg-ink" />
              </span>
            </SheetTrigger>
            <SheetContent side="top" className="h-dvh overflow-y-auto border-none bg-navy-deep/95 px-6 pt-24 pb-10 backdrop-blur-xl" data-lenis-prevent>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav aria-label="Mobile" className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-line"
                  >
                    {"dropdown" in item && item.dropdown ? (
                      <Accordion type="single" collapsible>
                        <AccordionItem value="services" className="border-none">
                          <AccordionTrigger className="items-center py-5 hover:no-underline [&>svg]:text-periwinkle">
                            <span className="display text-3xl">{item.label}</span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-5">
                            <ul className="flex flex-col gap-1 border-l border-line pl-4">
                              {services.map((s) => (
                                <li key={s.slug}>
                                  <SheetClose asChild>
                                    <Link href={`/services/${s.slug}`} className="flex items-baseline gap-3 py-2 text-ink-muted hover:text-ink">
                                      <span className="font-mono text-[0.65rem] text-periwinkle">{s.index}</span>
                                      {s.navTitle}
                                    </Link>
                                  </SheetClose>
                                </li>
                              ))}
                              <li>
                                <SheetClose asChild>
                                  <Link href="/services" className="mt-2 inline-flex items-center gap-2 py-2 text-xs font-medium tracking-[0.14em] text-periwinkle uppercase">
                                    View all services <Arrow />
                                  </Link>
                                </SheetClose>
                              </li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
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
                    )}
                  </motion.div>
                ))}
              </nav>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="mt-10">
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
