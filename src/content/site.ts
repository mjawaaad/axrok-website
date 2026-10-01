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
  // [PLACEHOLDER] production domain. Preview deploys (GitHub Pages) override it via NEXT_PUBLIC_SITE_URL.
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://axrok.com").replace(/\/$/, ""),
} as const;

export type ServiceKey = "pentest" | "soc" | "grc" | "cti" | "pqc" | "space";

export type Service = {
  key: ServiceKey;
  slug: string;
  index: string;
  title: string;
  /** Shorter label for menus. */
  navTitle: string;
  short: string;
  description: string;
  capabilities: string[];
  premium?: boolean;
  detail: {
    intro: string;
    scope: { title: string; body: string }[];
    engagement: { title: string; body: string }[];
    audience: string[];
  };
};

// Titles and capability lists are from the brief; all other service copy is [PLACEHOLDER] draft.
export const services: Service[] = [
  {
    key: "pentest",
    slug: "penetration-testing",
    index: "01",
    title: "Penetration Testing",
    navTitle: "Penetration Testing",
    short: "Adversary-grade testing across applications, infrastructure and people.",
    description:
      "Our operators test the way real attackers work, then show you exactly how they got in and how to close every path.",
    capabilities: ["Web applications", "APIs", "Mobile apps", "Networks", "Cloud", "Social engineering", "Red teaming"],
    detail: {
      intro:
        "Scanners find the obvious. Our operators find the paths an attacker would actually take, chain them together and prove the impact, safely and within agreed rules of engagement.",
      scope: [
        { title: "Web applications", body: "Authentication, authorization and business-logic flaws that automated tools miss." },
        { title: "APIs", body: "REST and GraphQL endpoints tested for broken object-level authorization, injection and data exposure." },
        { title: "Mobile apps", body: "iOS and Android clients, local storage, transport security and the backends they call." },
        { title: "Networks", body: "External perimeter and internal segments, from exposed services to lateral movement." },
        { title: "Cloud", body: "AWS, Azure and Google Cloud configuration, identity and privilege escalation paths." },
        { title: "Social engineering", body: "Phishing, pretexting and physical-entry scenarios, agreed with you in advance." },
        { title: "Red teaming", body: "Objective-based, multi-vector campaigns that test detection and response as well as defenses." },
      ],
      engagement: [
        { title: "Scoping", body: "We agree targets, rules of engagement, test windows and what success looks like." },
        { title: "Reconnaissance", body: "We map your attack surface the way an outsider would see it." },
        { title: "Exploitation", body: "We attempt compromise, chain findings and demonstrate real impact without disrupting operations." },
        { title: "Reporting", body: "An executive summary for leadership and reproducible technical findings ranked by risk." },
        { title: "Remediation support", body: "A walkthrough with your engineers and a retest of the issues you fix." },
      ],
      audience: [
        "Teams shipping software to customers who expect it to be secure",
        "Organizations preparing for an audit, a funding round or an enterprise sale",
        "Security teams that want an independent, adversarial view of their defenses",
      ],
    },
  },
  {
    key: "soc",
    slug: "managed-security",
    index: "02",
    title: "Managed Security (SOC)",
    navTitle: "Managed Security (SOC)",
    short: "Continuous monitoring and managed detection from a specialist bench.",
    description:
      "Continuous monitoring and managed detection, delivered through Axrok's specialist bench. Alerts are triaged and investigated by analysts who understand how intrusions unfold.", // first sentence: brief
    capabilities: ["Continuous monitoring", "Managed detection", "Specialist analyst bench"],
    detail: {
      intro:
        "Most teams do not need more alerts. They need someone watching who knows which alerts matter. Axrok's specialist bench monitors your environment, investigates what looks wrong and escalates only what deserves your attention.",
      scope: [
        { title: "Continuous monitoring", body: "Endpoint, identity, cloud and network telemetry watched as one picture." },
        { title: "Managed detection", body: "Detections tuned to your environment, triaged by analysts rather than left to raw rules." },
        { title: "Investigation and escalation", body: "Suspicious activity is investigated and escalated with context and recommended next steps." },
        { title: "Detection engineering", body: "New detections written as your environment and the threat landscape change." },
        { title: "Reporting", body: "Regular reporting on what we saw, what we stopped and what to improve." },
      ],
      engagement: [
        { title: "Onboarding", body: "We connect your log sources and establish a baseline of normal activity." },
        { title: "Tuning", body: "We cut noise and build detections that fit how your business actually runs." },
        { title: "Operations", body: "Continuous monitoring, triage and escalation through the specialist bench." },
        { title: "Review", body: "Periodic reviews of findings, trends and recommended improvements." },
      ],
      audience: [
        "Organizations without an in-house security operations team",
        "Lean security teams that need coverage beyond business hours",
        "Companies whose customers or auditors ask for evidence of monitoring",
      ],
    },
  },
  {
    key: "grc",
    slug: "grc-compliance",
    index: "03",
    title: "GRC and Compliance",
    navTitle: "GRC and Compliance",
    short: "Audit readiness for the frameworks your customers ask about.",
    description:
      "Readiness programs that turn frameworks into working controls. We map your gaps, prioritize remediation and prepare your team for the auditor.",
    capabilities: ["ISO 27001", "SOC 2", "PCI-DSS", "HIPAA"],
    detail: {
      intro:
        "A certificate is only worth having if the controls behind it are real. We help you build a security program that passes the audit because it actually works, without burying your team in paperwork.",
      scope: [
        { title: "Gap assessment", body: "Where you stand today against ISO 27001, SOC 2, PCI-DSS or HIPAA." },
        { title: "Risk assessment", body: "A risk register and treatment plan grounded in how your business operates." },
        { title: "Policies and procedures", body: "Documentation written for your organization, not copied from a template." },
        { title: "Control implementation", body: "Hands-on support putting technical and organizational controls in place." },
        { title: "Audit readiness", body: "Evidence collection, internal review and preparation for the external auditor." },
      ],
      engagement: [
        { title: "Gap assessment", body: "We measure your current state against the target framework." },
        { title: "Roadmap", body: "A prioritized plan that sequences the work around your team's capacity." },
        { title: "Implementation", body: "We work alongside your team to close the gaps." },
        { title: "Audit readiness", body: "Evidence review and a dry run before the auditor arrives." },
      ],
      audience: [
        "Startups selling to enterprises that ask for SOC 2 or ISO 27001",
        "Payments businesses with PCI-DSS obligations",
        "Healthcare organizations and vendors handling protected health information",
      ],
    },
  },
  {
    key: "cti",
    slug: "threat-intelligence-investigations",
    index: "04",
    title: "Cyber Threat Intelligence and Investigations",
    navTitle: "Threat Intelligence and Investigations",
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
    detail: {
      intro:
        "Attacks are often prepared in plain sight: a lookalike domain registered, an executive impersonated, credentials offered for sale. We watch the places those signals appear and investigate what is behind them.",
      scope: [
        { title: "Brand protection", body: "Lookalike domains, fake apps and counterfeit listings that trade on your name." },
        { title: "Phishing and impersonation monitoring", body: "Campaigns and accounts impersonating your organization, staff or executives." },
        { title: "Social media monitoring", body: "Mentions, threats and impersonation across social platforms." },
        { title: "Dark web monitoring", body: "Leaked credentials, stolen data and access offered for sale." },
        { title: "OSINT investigations", body: "Open-source investigations into people, infrastructure and threat actors." },
      ],
      engagement: [
        { title: "Define", body: "We agree the brands, domains, people and keywords that matter to you." },
        { title: "Monitor", body: "Continuous collection across the open, social and dark web." },
        { title: "Investigate", body: "Analysts verify each signal and trace it to its source." },
        { title: "Act", body: "Clear reports, alerts and support with takedowns where they are warranted." },
      ],
      audience: [
        "Brands targeted by phishing, impersonation or counterfeit listings",
        "Executives and high-profile staff at risk of targeting",
        "Organizations that need a focused investigation into an actor or incident",
      ],
    },
  },
  {
    key: "pqc",
    slug: "post-quantum-security",
    index: "05",
    title: "Post-Quantum Security",
    navTitle: "Post-Quantum Security",
    premium: true,
    short: "Prepare today's cryptography for tomorrow's adversaries.",
    description:
      "Delivered with Axrok's post-quantum security partner. We inventory where your cryptography lives, assess quantum exposure and plan a migration that keeps sensitive data safe for its full lifetime.",
    capabilities: ["Cryptographic inventory", "Quantum-risk assessment", "Migration roadmap"],
    detail: {
      intro:
        "Data intercepted today can be stored and decrypted once quantum computers are capable enough. Delivered with Axrok's post-quantum security partner, this engagement finds where you are exposed and plans the move to post-quantum cryptography before it becomes urgent.",
      scope: [
        { title: "Cryptographic inventory", body: "Where cryptography is used across applications, infrastructure and vendors." },
        { title: "Quantum-risk assessment", body: "Which data and systems face 'harvest now, decrypt later' exposure, and how soon it matters." },
        { title: "Migration roadmap", body: "A sequenced plan toward NIST-standardized post-quantum algorithms." },
        { title: "Crypto-agility", body: "Architecture changes that make the next algorithm change routine rather than a project." },
      ],
      engagement: [
        { title: "Inventory", body: "We discover and catalogue cryptographic assets and dependencies." },
        { title: "Assess", body: "We rank exposure by data lifetime and business impact." },
        { title: "Plan", body: "A migration roadmap built with our post-quantum partner." },
        { title: "Transition support", body: "Guidance as your teams and vendors implement the plan." },
      ],
      audience: [
        "Organizations holding data that must stay confidential for many years",
        "Financial services, healthcare and government suppliers",
        "Teams planning a major infrastructure or platform refresh",
      ],
    },
  },
  {
    key: "space",
    slug: "space-satellite-security",
    index: "06",
    title: "Space and Satellite Security",
    navTitle: "Space and Satellite Security",
    short: "Security for ground stations, command links and the software that flies missions.",
    description:
      "Securing satellite ground stations, telemetry and command links, mission control software, and space-sector OT and IoT.", // brief
    capabilities: ["Satellite ground stations", "Telemetry and command links", "Mission control software", "Space-sector OT and IoT"],
    detail: {
      intro:
        "A satellite is only as secure as the systems that talk to it. We assess the ground segment, the links and the mission software with the care that safety-critical systems demand, working inside your operational constraints.",
      scope: [
        { title: "Satellite ground stations", body: "Networks, systems and physical security around the ground segment." },
        { title: "Telemetry and command links", body: "Authentication, encryption and replay protection on telemetry, tracking and command." },
        { title: "Mission control software", body: "Testing of the applications operators use to plan and fly missions." },
        { title: "Space-sector OT and IoT", body: "Operational technology and connected devices across facilities and payload operations." },
      ],
      engagement: [
        { title: "Scoping", body: "We map the mission architecture and agree safety constraints and test windows." },
        { title: "Assessment", body: "Non-disruptive testing of the ground segment, links and software." },
        { title: "Reporting", body: "Findings ranked by mission impact, with clear remediation guidance." },
        { title: "Roadmap", body: "A security plan aligned with your mission timeline." },
      ],
      audience: [
        "Satellite operators and new-space companies",
        "Ground segment and mission software providers",
        "Research and government programs with space assets",
      ],
    },
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

// Labels from the brief.
export const serviceOptions: { value: ServiceKey | "unsure"; label: string }[] = [
  { value: "pentest", label: "Penetration testing" },
  { value: "soc", label: "Managed security / SOC" },
  { value: "grc", label: "GRC and compliance" },
  { value: "cti", label: "Threat intelligence and investigations" },
  { value: "pqc", label: "Post-quantum security" },
  { value: "space", label: "Space and satellite security" },
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

// [PLACEHOLDER] product descriptions drafted from the brief's product names.
export const products = [
  {
    key: "cti-platform",
    name: "Cyber Threat Intelligence platform",
    body: "Collects and correlates indicators, threat actor activity and exposure signals into a single view, so analysts start every investigation with context instead of raw feeds.",
    powers: "Threat Intelligence and Investigations",
    slug: "threat-intelligence-investigations",
  },
  {
    key: "brand-protection",
    name: "Brand Protection platform",
    body: "Watches for lookalike domains, impersonating accounts and fake apps that use your name, and tracks each case from first detection to takedown.",
    powers: "Brand protection and impersonation monitoring",
    slug: "threat-intelligence-investigations",
  },
  {
    key: "dark-web",
    name: "Dark Web Monitoring tooling",
    body: "Monitors forums, marketplaces and paste sites for leaked credentials, stolen data and mentions of your organization, and flags what needs action.",
    powers: "Dark web monitoring",
    slug: "threat-intelligence-investigations",
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
export const industries = ["Financial services", "SaaS", "Healthcare", "E-commerce", "Web3", "Logistics", "Space", "Media"];

// Names and roles are from the brief.
export const team = [
  { name: "Zayan Abbas", role: "Managing Director", initials: "ZA", certifications: "[PLACEHOLDER] certifications" },
  { name: "Muhammad Jawad", role: "CEO", initials: "MJ", certifications: "[PLACEHOLDER] certifications" },
  { name: "Sayed Ahmad Mujtaba", role: "CTO", initials: "SM", certifications: "[PLACEHOLDER] certifications" },
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

/** Primary navigation. "services" renders as the Services dropdown. */
export const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services", dropdown: true },
  { href: "/products", label: "Products" },
  { href: "/labs", label: "Labs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** Every indexable route, for the sitemap. */
export const allRoutes = [
  "/",
  "/services",
  ...services.map((s) => `/services/${s.slug}`),
  "/products",
  "/labs",
  "/about",
  "/contact",
];
