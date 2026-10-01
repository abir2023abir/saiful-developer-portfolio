import type { Project } from "./types";

/**
 * Every claim here is drawn from the project's own repository — its README,
 * its schema or its running interface. Nothing is invented for effect.
 */
export const seedProjects: Project[] = [
  {
    slug: "buildledger",
    title: "BuildLedger",
    category: "Construction ERP",
    year: "2026",
    summary:
      "A multi-site construction management system: material stock per site, vendor ledgers, client billing, partner capital accounts and site-wise profit and loss.",
    stack: ["Laravel 12", "MySQL", "Tailwind CSS", "Excel / PDF export"],
    tint: ["#f97316", "#7c2d12"],
    image: "/projects/buildledger.jpg",
    featured: true,
    problem:
      "Contracting businesses rarely lose money on the estimate. They lose it in the gap between what left the store, what the supervisor remembers, and what the accountant eventually books — three records that never quite agree.",
    approach:
      "One posting does all the work. Booking a supplier bill receives the material into that site's stock, adds to the vendor's outstanding and moves the site's profit, inside a single transaction, so the three records cannot drift apart.",
    result:
      "Every screen runs real queries against a seeded twelve-month book of business, with site-wise P&L, partner capital accounts and a reporting module that exports to Excel and PDF.",
  },
  {
    slug: "orbit",
    title: "Orbit",
    category: "SaaS Dashboard",
    year: "2026",
    summary:
      "A role-based team and project dashboard where admin, manager and member get genuinely different applications — enforced three times over.",
    stack: ["Next.js 15", "Supabase", "Postgres RLS", "shadcn/ui"],
    tint: ["#6366f1", "#1e1b4b"],
    image: "/projects/orbit.jpg",
    featured: true,
    problem:
      "Role-based dashboards usually filter in the interface. That means the data still travels to the browser, and one missed condition leaks every row of it.",
    approach:
      "Access is enforced at three independent layers: Next.js middleware, server components and server actions, and Postgres row level security. Any one of them failing still leaves two.",
    result:
      "Sign in as a member and /projects shows 8 rows. Sign in as admin and the same page shows 60. The query is byte-for-byte identical — Postgres returned different rows.",
  },
  {
    slug: "ayna-dermatology",
    title: "Ayna Dermatology",
    category: "Clinic Booking Platform",
    year: "2026",
    summary:
      "Appointment booking and clinic management for a dermatology practice in Dhaka — patient booking, consultant schedules and an admin console.",
    stack: ["Next.js 16", "Express", "JWT + scrypt", "SSE"],
    tint: ["#0ea5e9", "#0c4a6e"],
    image: "/projects/ayna-dermatology.jpg",
    problem:
      "A clinic's waiting room needs to know the queue as it actually is, not as it was when the page last loaded — and the two consultants the practice is built around each keep their own schedule.",
    approach:
      "The queue is pushed over server-sent events rather than polled, so a waiting room screen stays correct without hammering the API. Sessions are JWT with scrypt password hashing, and the data layer is a JSON document store with atomic writes behind a Prisma schema ready for Postgres.",
    result:
      "Patients book against real consultant availability, and the admin console runs the day from the other side of the same live feed.",
  },
  {
    slug: "shob",
    title: "Shob",
    category: "E-Commerce Storefront",
    year: "2026",
    summary:
      "An eight-category storefront with search, filtering, variant selection, a persistent bag and a three-step checkout carrying Bangladeshi payment options.",
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS"],
    tint: ["#10b981", "#064e3b"],
    image: "/projects/shob.jpg",
    featured: true,
    problem:
      "A storefront that leans on an image CDN inherits that CDN's latency, its outages and its bill — and a demo store with no photography budget usually ends up full of broken images.",
    approach:
      "Each of the forty products is photographed twice and self-hosted as 760px JPEGs, so there is no runtime dependency on an image CDN. The four gallery thumbnails are built from those two frames — each shown whole, then punched in on the part worth a second look, which is what a store with a two-shot budget actually ships.",
    result:
      "Products the admin panel invents after the shoot fall back to a drawn category shape rather than a broken image, and the measured scroll cost stayed inside its budget.",
  },
  {
    slug: "havenkey",
    title: "HavenKey",
    category: "Real Estate Marketplace",
    year: "2026",
    summary:
      "A luxury property marketplace with faceted search across sale, rent and commercial listings, agent accounts and saved properties.",
    stack: ["Next.js 14", "Prisma", "PostgreSQL", "NextAuth"],
    tint: ["#0f766e", "#042f2e"],
    image: "/projects/havenkey.jpg",
    problem:
      "Property search fails on the filters. Buyers arrive with a location, a type and a ceiling, and a listing site that cannot combine those three cheaply makes them scroll instead.",
    approach:
      "Listings are modelled in Prisma against Postgres with the filter fields indexed, so location, property type and price range compose into one query rather than a client-side pass over everything.",
    result:
      "A search bar that switches between buy, rent and commercial without a page reload, over authenticated accounts handled by NextAuth.",
  },
  {
    slug: "luxe-lights",
    title: "Luxe Lights",
    category: "Luxury Lighting Store",
    year: "2026",
    summary:
      "A premium lighting storefront — chandeliers, pendants and floor lamps — with accounts, orders and a local payment gateway behind it.",
    stack: ["Next.js 16", "Prisma", "NextAuth", "SSLCommerz"],
    tint: ["#eab308", "#422006"],
    image: "/projects/luxe-lights.jpg",
    problem:
      "At the luxury end of a category, the product photograph is the product. A layout built for dense grids of thumbnails actively works against it.",
    approach:
      "The storefront is built dark and wide, giving each fixture room to carry the page, with the catalogue, accounts and order history on Prisma and NextAuth underneath and SSLCommerz taking the payment.",
    result:
      "A catalogue that reads as a showroom rather than a spreadsheet, without giving up accounts, orders or a real checkout.",
  },
  {
    slug: "ecommerce-automation",
    title: "Commerce Automation",
    category: "Event-Driven Monorepo",
    year: "2026",
    summary:
      "An inventory synchronisation and automation tool — a Next.js operations dashboard over an Express REST API, built as a TypeScript monorepo.",
    stack: ["TypeScript monorepo", "Next.js 14", "Express", "Prisma"],
    tint: ["#f59e0b", "#78350f"],
    image: "/projects/ecommerce-automation.jpg",
    problem:
      "Stock drifts between channels the moment anything is sold, and the fixes are the same handful of rules typed out again by hand, every time, by whoever noticed first.",
    approach:
      "Those rules are made into first-class objects. The web dashboard and the Express API share types across a monorepo, Prisma owns the schema, and every automation run writes to an audit stream so a rule that misfires can be traced rather than guessed at.",
    result:
      "One console covering automations, products, orders and analytics, with low-stock and re-order rules that run themselves and say what they did.",
  },
  {
    slug: "medical-queue",
    title: "Live Queue",
    category: "Mobile + Backend",
    year: "2026",
    summary:
      "A hospital appointment app where patients book a doctor and watch their serial number move in real time, with a doctor and admin dashboard running the queue.",
    stack: ["React Native (Expo)", "Express", "Prisma", "Socket.io"],
    tint: ["#ef4444", "#450a0a"],
    image: "/projects/medical-queue.jpg",
    problem:
      "A serial number is only useful if it is current. Patients sit in a waiting room refreshing nothing, and the desk answers the same question all morning.",
    approach:
      "The queue is pushed over Socket.io to both sides at once — the patient's phone and the doctor's dashboard read the same live state — with Expo push notifications for the moment a patient's turn approaches.",
    result:
      "One hospital end to end: booking, live queue, doctor and admin dashboards. The schema already carries a Hospital table, so multi-tenant accounts can be added later without a rewrite.",
  },
  {
    slug: "english-capsules",
    title: "English Capsules",
    category: "Learning Platform",
    year: "2025",
    summary:
      "An LMS with a student dashboard, an instructor studio for building video courses, and a JWT-protected admin portal tracking enrolments and revenue.",
    stack: ["Next.js 14", "Firebase", "SSLCommerz", "Framer Motion"],
    tint: ["#a855f7", "#3b0764"],
    image: "/projects/english-capsules.jpg",
    problem:
      "A course platform has three different users — student, instructor, administrator — and collapsing them into one interface with hidden buttons is how enrolment and revenue data ends up somewhere it should not be.",
    approach:
      "Each role gets its own surface: progress tracking and certificates for students, a studio for building video modules for instructors, and an admin portal behind cryptographic JWT sessions in HTTP-only cookies.",
    result:
      "Courses, enrolments and revenue in one place, with SSLCommerz, bKash and Nagad wired for payment and mock fallbacks so the flow is testable without them.",
  },
  {
    slug: "red-panda",
    title: "Red Panda Imports",
    category: "Sneaker Storefront",
    year: "2026",
    summary:
      "A sneaker import storefront on the Next.js App Router — catalogue, product detail and a client-side bag, deployed continuously to Vercel from GitHub.",
    stack: ["Next.js 16", "TypeScript", "Zustand", "Vercel"],
    tint: ["#e8461c", "#450a0a"],
    image: "/projects/red-panda.jpg",
    problem:
      "Import and resale stock turns over fast, so the catalogue changes more often than the code does, and every change still has to reach production safely.",
    approach:
      "Built on the App Router with the bag in client state via Zustand, and wired to Vercel so a push to GitHub is the deploy — no manual step between the change and the live site.",
    result:
      "A storefront with drops, categories and product detail that ships continuously.",
  },
  {
    slug: "kangjing-shopy",
    title: "Kangjing Shopy",
    category: "Eyewear Store",
    year: "2026",
    summary:
      "Wenzhou Kangjing Shopy — sunglasses and optical frames with 3D try-on, lens upgrades, PayPal or bank transfer, and DHL delivery from the factory.",
    stack: ["Next.js", "Prisma", "three.js", "MediaPipe"],
    tint: ["#1d4ed8", "#0f172a"],
    image: "/projects/kangjing-shopy.jpg",
    problem:
      "An eyewear factory selling abroad cannot ask every buyer to guess the fit from a flat photo, and the order still has to carry a prescription, a courier, and a payment that works outside China.",
    approach:
      "The storefront that opens locally is the Next.js shop: frames, a browser try-on, PayPal or bank transfer, and DHL. The same shop also lives as a Laravel and Inertia app in Eye Web PHP.",
    result:
      "A catalogue that states the price, the bundle discount and the stock count on the homepage, with try-on, OEM and checkout behind it.",
  },
  {
    slug: "ionface",
    title: "IONFACE",
    category: "Eyewear Studio",
    year: "2026",
    summary:
      "A resale-ready eyewear studio: curated frames and a live camera fit that locks a pair onto the face in the browser.",
    stack: ["PHP", "Camera try-on", "On-device fitting"],
    tint: ["#a8845a", "#292524"],
    image: "/projects/ionface.jpg",
    problem:
      "Resale frames fail when the buyer cannot see the pair on their own face, and sending that camera image to a server is a privacy problem the studio does not need.",
    approach:
      "The fit runs in the browser. The homepage offers a live fit and a frame catalogue, and the page states that tracking stays on the device.",
    result:
      "Eight curated frames, a live-fit action, and a resale path, on one studio site.",
  },
  {
    slug: "aurora",
    title: "Aurora",
    category: "Skincare Landing",
    year: "2026",
    summary:
      "A Bengali skincare landing page for women and men. The order form hands the message to WhatsApp, and payment is manual bKash.",
    stack: ["Astro", "TypeScript", "WhatsApp", "bKash"],
    tint: ["#c2410c", "#44403c"],
    image: "/projects/aurora.jpg",
    problem:
      "A Facebook-ad landing page does not need accounts or a payment gateway. It needs one clear product, one order, and a message the owner can fulfil by hand.",
    approach:
      "The site is static. Product names, prices and the phone number live in one config file. Pressing order opens WhatsApp with the form already filled.",
    result:
      "A single page — serum, formula notes, and an order button — with no database and no checkout session.",
  },
  {
    slug: "nokshi",
    title: "NOKSHI",
    category: "Clothing Store",
    year: "2026",
    summary:
      "A Dhaka clothing shop for jamdani and khadi, with women, men and kids, a sale, cash on delivery and delivery across 64 districts.",
    stack: ["Laravel", "MySQL", "Alpine.js", "Tailwind CSS"],
    tint: ["#5b1848", "#c4a35a"],
    image: "/projects/nokshi.jpg",
    problem:
      "A seasonal clothing drop needs a homepage that can change with the collection, and a checkout that matches how Bangladesh actually pays and receives parcels.",
    approach:
      "Banners, catalogue and orders sit in MySQL behind a Laravel shop. The homepage hero is content, not a hardcoded campaign, and the promise on the page is delivery, a 7-day exchange and cash on delivery.",
    result:
      "The Eid edit opens as a full storefront: departments, a journal, English and Bengali, and a bag.",
  },
  {
    slug: "nippon-auto-export",
    title: "Nippon Auto Export",
    category: "Vehicle Export",
    year: "2026",
    summary:
      "A Japanese used-vehicle export site for importers in Australia and Bangladesh, with auction stock, an export process and a WhatsApp desk.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    tint: ["#ea580c", "#0f172a"],
    image: "/projects/nippon-auto-export.jpg",
    problem:
      "Importers do not buy from a brochure. They need the auction source, the grade, the vessel and a person to talk to before the unit is booked.",
    approach:
      "The public site is a Next.js inventory and process page. There is no payment gateway. Every enquiry goes to WhatsApp or email, and an admin panel edits the content.",
    result:
      "A homepage that leads with a featured export unit, the auction houses, and the path from Japan to the destination port.",
  },
  {
    slug: "sum-trading",
    title: "SUM Trading",
    category: "Vehicle Exporter",
    year: "2026",
    summary:
      "SUM. TRADING CO., LTD — new and used Japanese vehicles, machinery and parts, exported from Saitama to Australia, New Zealand and Bangladesh.",
    stack: ["HTML", "PHP", "Admin CMS"],
    tint: ["#eab308", "#0c1222"],
    image: "/projects/sum-trading.jpg",
    problem:
      "An export desk in Saitama needs a public face for stock and a private place to change that stock without a developer on every listing.",
    approach:
      "The public pages are a straight site — home, inventory, news, contact — with an admin portal over the same content.",
    result:
      "A homepage that names the office, the three export markets, and the road from Japan to the buyer.",
  },
  {
    slug: "opd-queue",
    title: "OPD Queue",
    category: "Hospital Queue",
    year: "2026",
    summary:
      "An outpatient desk for clinics in Bangladesh. Patients take a token with no account. Doctors call the next patient, and a waiting-room screen shows the live token.",
    stack: ["Laravel", "SQLite", "Tailwind CSS"],
    tint: ["#facc15", "#0a0a0a"],
    image: "/projects/opd-queue.jpg",
    problem:
      "A chamber queue breaks when the patient needs an account before they can hold a number, and the waiting room is looking at a whiteboard.",
    approach:
      "The token is a link. The chamber desk signs in, calls the next patient, and a TV route shows the current token. Wait time is patients still ahead times the doctor's average minutes.",
    result:
      "A hospital homepage listing today's chambers, each with book, live queue and TV display.",
  },
  {
    slug: "ff-diamond-shop",
    title: "FF Diamond Shop",
    category: "Top-up Store",
    year: "2026",
    summary:
      "A Free Fire diamond top-up page for Bangladesh: pick a pack, pay by bKash Send Money, and confirm with a WhatsApp screenshot.",
    stack: ["Next.js", "React", "bKash", "WhatsApp"],
    tint: ["#22d3ee", "#1e1b4b"],
    image: "/projects/ff-diamond-shop.jpg",
    problem:
      "A small top-up desk does not need a payment gateway. It needs the pack, the bKash number, and proof of payment in one place the seller already watches.",
    approach:
      "Packs and memberships are listed on one page. The buyer enters a UID, never a game password, pays by bKash, and sends the screenshot on WhatsApp.",
    result:
      "A storefront from 25 diamonds up to the large packs, with delivery stated in minutes and the payment steps on the homepage.",
  },
  {
    slug: "pizz-hoodies",
    title: "PIZZ Hoodies",
    category: "Apparel Landing",
    year: "2026",
    summary:
      "A dark landing page for limited hoodie pre-orders — one drop, the colour story, and a path into the collection.",
    stack: ["HTML", "Tailwind CSS"],
    tint: ["#a855f7", "#0a0a0a"],
    image: "/projects/pizz-hoodies.jpg",
    problem:
      "A limited clothing drop dies on a page that looks like a catalogue. The first screen has to be the garment.",
    approach:
      "One static page: the hoodie, the colour name, pre-order copy, and links into products, pricing and the concept.",
    result:
      "A homepage that reads as a drop, not a grid of thumbnails.",
  },
];
