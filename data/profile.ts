export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  shelf: "featured" | "more";
  sortOrder: number;
};

export type Section = {
  id: string;
  heading: string;
  body: string;
  sortOrder: number;
};

export const profile = {
  name: "Maya Chen",
  role: "Product designer & front-end developer",
  bio: "I design and build interfaces for small teams that care about craft. Currently exploring creative tools and data-rich dashboards.",
  email: "hello@mayachen.dev",
};

export const sections: Section[] = [
  {
    id: "about",
    heading: "About",
    body: "Eight years across agencies and startups, working end-to-end from research to production UI.",
    sortOrder: 0,
  },
  {
    id: "approach",
    heading: "Approach",
    body: "Prototype early, write the copy with the design, and ship in small loops with real users.",
    sortOrder: 1,
  },
];

export const projects: Project[] = [
  {
    id: "northstar",
    title: "Northstar Analytics",
    description: "A decision-focused analytics dashboard for product teams.",
    tags: ["dashboard", "react", "data-viz"],
    link: "https://example.com/northstar",
    shelf: "featured",
    sortOrder: 0,
  },
  {
    id: "inkwell",
    title: "Inkwell",
    description: "A distraction-free writing app with offline-first sync.",
    tags: ["writing", "offline", "pwa"],
    shelf: "featured",
    sortOrder: 1,
  },
  {
    id: "meridian",
    title: "Meridian Storefront",
    description: "Headless commerce front for a ceramics studio.",
    tags: ["commerce", "nextjs"],
    shelf: "more",
    sortOrder: 0,
  },
  {
    id: "fieldnotes",
    title: "Fieldnotes",
    description: "A mobile journal for birders with offline maps.",
    tags: ["mobile", "maps"],
    shelf: "more",
    sortOrder: 1,
  },
  {
    id: "papertrail",
    title: "Papertrail",
    description: "Expense tracking with receipt OCR for freelancers.",
    tags: ["finance", "ocr"],
    shelf: "more",
    sortOrder: 2,
  },
];
