// Single source for all site copy.
// Convention: strings the brief supplied verbatim are marked "brief".
// Everything else is drafted copy tagged [PLACEHOLDER] (search the repo for it).
// Strings that make a factual claim Axrok must confirm also render the tag visibly.
// Writing rule: no em dashes anywhere in copy.

export const brand = {
  name: "Axrok",
  legalName: "Axrok Infosec (SMC-Private) Limited", // brief
  tagline: "Precision Offense. Absolute Defense.", // brief
  positioning:
    "Axrok delivers offensive security, managed defense and cyber threat intelligence for organizations that cannot afford a breach.", // brief
  location: "Headquartered in Pakistan, serving clients globally.", // brief phrasing
  city: "Peshawar, Pakistan",
  siteUrl: "https://axrok.com", // [PLACEHOLDER] production domain
} as const;

export type ServiceKey = "pentest" | "soc" | "grc" | "cti" | "pqc";

export type Service = {
  key: ServiceKey;
  index: string;
  title: string;
  short: string;
  description: string;
  capabilities: string[];
  premium?: boolean;
};

export const services: Service[] = [
  {
    key: "pentest",
    index: "01",
    title: "Penetration Testing",
    // [PLACEHOLDER] short + description drafted; capability list is from the brief
    short: "Adversary-grade testing across applications, infrastructure and people.",
    description:
      "Our operators test the way real attackers work, then show you exactly how they got in and how to close every path. Findings arrive ranked by business impact, with remediation your engineers can act on.",
    capabilities: [
      "Web applications",
      "APIs",
      "Mobile apps",
      "Networks",
      "Cloud",
      "Social engineering",
      "Red teaming",
    ],
  },
  {
    key: "soc",
    index: "02",
    title: "Managed Security (SOC)",
    // [PLACEHOLDER] short + description drafted from the brief
    short: "Continuous monitoring and managed detection from a specialist bench.",
    description:
      "Continuous monitoring and managed detection, delivered through Axrok's specialist bench. Alerts are triaged and investigated by analysts who understand how intrusions unfold, so your team hears about what matters.",
    capabilities: ["Continuous monitoring", "Managed detection", "Specialist analyst bench"],
  },
  {
    key: "grc",
    index: "03",
    title: "GRC and Compliance",
    // [PLACEHOLDER] short + description drafted; frameworks are from the brief
    short: "Audit readiness for the frameworks your customers ask about.",
    description:
      "Readiness programs that turn frameworks into working controls. We map your gaps, prioritize remediation and prepare your team for the auditor, without burying you in paperwork.",
    capabilities: ["ISO 27001", "SOC 2", "PCI-DSS", "HIPAA"],
  },
  {
    key: "cti",
    index: "04",
    title: "Cyber Threat Intelligence and Investigations",
    // [PLACEHOLDER] short + description drafted; capability list is from the brief
    short: "Visibility beyond your perimeter, and answers about who is behind it.",
    description:
      "We watch for the campaigns, impersonations and leaks that target your organization, and investigate the people, infrastructure and threat actors behind them.",
    capabilities: [
      "Brand protection",
      "Phishing and impersonation monitoring",
      "Social media monitoring",
      "Dark web monitoring",
      "OSINT investigations: people, infrastructure, threat actors",
    ],
  },
  {
    key: "pqc",
    index: "05",
    title: "Post-Quantum Security",
    premium: true,
    // [PLACEHOLDER] short, description and capabilities drafted; confirm scope with the partner
    short: "Prepare today's cryptography for tomorrow's adversaries.",
    description:
      "Delivered with Axrok's post-quantum security partner. We inventory where your cryptography lives, assess quantum exposure and plan a migration that keeps sensitive data safe for its full lifetime.",
    capabilities: ["Cryptographic inventory", "Quantum-risk assessment", "Migration roadmap"],
  },
];

export const serviceOptions: { value: ServiceKey | "unsure"; label: string }[] = [
  { value: "pentest", label: "Penetration testing" },
  { value: "soc", label: "Managed security / SOC" },
  { value: "grc", label: "GRC and compliance" },
  { value: "cti", label: "Threat intelligence and investigations" },
  { value: "pqc", label: "Post-quantum security" },
  { value: "unsure", label: "Not sure yet" },
];

// [PLACEHOLDER] budget bands, confirm with Axrok's pricing
export const budgetOptions = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-15k", label: "$5,000 to $15,000" },
  { value: "15k-50k", label: "$15,000 to $50,000" },
  { value: "50k-plus", label: "$50,000 and above" },
  { value: "undecided", label: "Not decided yet" },
] as const;

export type TierKey = "scout" | "strike" | "siege";

// Tier names and audiences are from the brief; narratives are [PLACEHOLDER] drafts.
export const tiers: { key: TierKey; name: string; audience: string; narrative: string; cta: string }[] = [
  {
    key: "scout",
    name: "Scout",
    audience: "For startups and SMBs",
    narrative:
      "A focused engagement that establishes your security baseline without an enterprise budget. Scout pairs targeted testing with clear, prioritized fixes your team can ship in weeks, not quarters.",
    cta: "Discuss Scout",
  },
  {
    key: "strike",
    name: "Strike",
    audience: "For mid-market organizations",
    narrative:
      "A sustained program for growing organizations with more surface to defend. Strike combines recurring testing, monitoring and compliance readiness under one accountable partner.",
    cta: "Discuss Strike",
  },
  {
    key: "siege",
    name: "Siege",
    audience: "For the enterprise",
    narrative:
      "Full-spectrum adversary simulation and defense for complex environments. Siege brings red teaming, managed detection, threat intelligence and post-quantum readiness together at scale.",
    cta: "Discuss Siege",
  },
];

// Differentiators are from the brief; supporting lines are [PLACEHOLDER] drafts.
export const differentiators = [
  {
    title: "Founder-led delivery",
    body: "The people who built Axrok lead every engagement. You work with senior operators from scoping to the final report.",
  },
  {
    title: "Certified expertise",
    body: "A team certified at CEH, eCPPT and eWPTX level, testing with the discipline those credentials demand.",
  },
  {
    title: "Global reach",
    body: "Headquartered in Pakistan, serving clients globally, with engagements run across time zones.",
  },
  {
    title: "Post-quantum partner",
    body: "A dedicated post-quantum security partner, so your cryptography is ready before it needs to be.",
  },
];

// [PLACEHOLDER] industries list, confirm before launch
export const industries = [
  "Financial services",
  "SaaS",
  "Healthcare",
  "E-commerce",
  "Web3",
  "Logistics",
  "Education",
  "Media",
];

export const team = [
  {
    name: "Muhammad Jawad",
    role: "Founder and CEO",
    initials: "MJ",
    certifications: "[PLACEHOLDER] certifications", // confirm per person
  },
  {
    name: "Sayed Ahmad Mujtaba",
    role: "Co-founder and CTO",
    initials: "SM",
    certifications: "[PLACEHOLDER] certifications", // confirm per person
  },
];

export const about = {
  mission: "[PLACEHOLDER] Mission statement from the Axrok brand bible.",
  vision: "[PLACEHOLDER] Vision statement from the Axrok brand bible.",
  // [PLACEHOLDER] story paragraphs drafted from the brief's facts
  story: [
    "Axrok began in Peshawar as a bootstrapped practice with a simple conviction: organizations everywhere deserve offensive security delivered with discipline, not theater.",
    "We grew by doing the work ourselves, and we still do. Every engagement is led by a founder, scoped with care and reported in language your board and your engineers can both act on.",
  ],
  // [PLACEHOLDER] name story, confirm wording
  nameStory:
    "The name joins the axe, a tool of precision, with Amarok, the lone wolf of Inuit legend. The wolf became our mark.",
  partners:
    "Axrok works alongside a small bench of specialist partners, including our post-quantum security partner, [PLACEHOLDER] partner name, so every client gets depth without the overhead of a large firm.",
};

// [PLACEHOLDER] replace with Axrok's real profile URLs
export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/axrok" },
  { label: "X", href: "https://x.com/axrok" },
  { label: "GitHub", href: "https://github.com/axrok" },
];

export const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
