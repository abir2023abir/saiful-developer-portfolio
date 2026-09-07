export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  stack: string[];
  /** Two-stop gradient used for the card panel when there is no screenshot. */
  tint: [string, string];
  /** Screenshot under /public/projects. Empty means fall back to the gradient. */
  image?: string;
  liveUrl?: string;
  repoUrl?: string;
  /** Long-form fields, shown on the case study page when filled. */
  problem?: string;
  approach?: string;
  result?: string;
  featured?: boolean;
};

export type Service = {
  n: string;
  title: string;
  body: string;
};

export type Stat = {
  label: string;
  value: string;
  body: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating: string;
};

export type SiteSettings = {
  name: string;
  role: string;
  email: string;
  location: string;
  tagline: string[];
  aboutHeading: string;
  aboutBody: string;
  github: string;
  linkedin: string;
  upwork: string;
  stack: string[];
};

export type Content = {
  site: SiteSettings;
  services: Service[];
  stats: Stat[];
  testimonial: Testimonial;
  projects: Project[];
};
