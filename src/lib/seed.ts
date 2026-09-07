import { seedProjects } from "./seed-projects";
import type { Content } from "./types";

/**
 * The shipped defaults. `content/site.json` is written from this on first run and
 * is what the admin panel edits from then on — this file is only ever the floor.
 */
export const seed: Content = {
  site: {
    name: "Saiful Islam",
    role: "Full Stack Web Developer",
    email: "saifultwilight20@gmail.com",
    location: "Dhaka, Bangladesh",
    tagline: [
      "I BUILD FULL-STACK WEB APPLICATIONS",
      "THAT ARE FAST, HONEST",
      "AND BUILT TO RUN IN PRODUCTION",
    ],
    aboutHeading: "My impact|through|full-stack|engineering",
    aboutBody:
      "I build the whole thing. The schema that will still make sense in a year, the API that enforces the rules, the auth that actually holds, and the interface people use every day. Most of what I ship is the unglamorous middle — the part that decides whether a product survives its second year.",
    // TODO: replace with your real profile URLs.
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    upwork: "https://www.upwork.com/",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "Laravel",
      "PostgreSQL",
      "Prisma",
      "Supabase",
      "Tailwind CSS",
      "Framer Motion",
      "React Native",
    ],
  },

  // TODO: both figures are placeholders. "10+" is the only one the work backs up.
  stats: [
    {
      label: "Projects shipped",
      value: "10+",
      body: "Applications built end to end — data model, API, auth and interface — not front-end mockups.",
    },
    {
      label: "On-time delivery",
      value: "100%",
      body: "Scoped in writing, delivered on the date agreed, with the trade-offs named up front.",
    },
  ],

  // TODO: placeholder. Replace with a real client's words or delete the section.
  testimonial: {
    quote:
      "Saiful took a vague brief and came back with a working system, not a slide deck. The parts we did not think to ask for were already handled.",
    name: "Add a real client",
    role: "Replace this quote",
    rating: "5.0/5",
  },

  services: [
    {
      n: "01",
      title: "Full-Stack Web Applications",
      body: "Dashboards, booking systems and internal tools built end to end — schema, API, auth and interface — on Next.js and Node.",
    },
    {
      n: "02",
      title: "E-Commerce Builds",
      body: "Storefronts with search, variants, a persistent bag and a real checkout, wired to local payment gateways like SSLCommerz, bKash and Nagad.",
    },
    {
      n: "03",
      title: "API & Database Design",
      body: "REST APIs, Prisma and Postgres schemas, migrations and seed data designed so the second year of the product is not a rewrite.",
    },
    {
      n: "04",
      title: "Authentication & Access Control",
      body: "JWT and session auth, role-based access enforced in middleware, server actions and at the database with Postgres row level security.",
    },
    {
      n: "05",
      title: "Realtime Features",
      body: "Live queues, order status and notifications over Socket.io or server-sent events — pushed, never polled.",
    },
    {
      n: "06",
      title: "Performance & Motion",
      body: "Measured scroll performance, image pipelines and interface motion that stays smooth on the mid-range phones your users actually own.",
    },
  ],

  projects: seedProjects,
};
