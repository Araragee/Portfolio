import type {
  Skill,
  TimelineItem,
  SocialLink,
  PersonalInfo,
} from "@/types/about";

export const personalInfo: PersonalInfo = {
  name: "Davxeloper",
  title: "Front-end Developer",
  bio: [
    "I'm Dex — a front-end developer operating under the handle Davxeloper (Araragi). Currently building the CBMS Portal at the Philippine Statistics Authority's Central Office, where I lead the Vue 3 + TypeScript client that surfaces national survey data to analysts and policymakers.",
    "My path was the CS-student-turned-dev route: classroom fundamentals, then a long stretch of self-directed work — shipping side projects, breaking things on purpose, and following the rabbit hole from jQuery to Vue 3. A 3-month web-design / UI-UX internship at iPhitech in Clark, Pampanga turned into a full-time front-end role at PSA shortly after.",
    "I care about craftsmanship over cleverness, restraint over decoration, and building software that still makes sense to the next person who opens the file.",
  ],
  image: {
    alt: "Profile photo",
  },
  contact: {
    email: "davxgonzales@gmail.com",
    location: "Pasig City, Philippines",
  },
  availability: {
    status: "available",
    message: "Available for freelance and collaboration",
  },
};

export const skills: Skill[] = [
  // Frontend
  {
    name: "Vue.js",
    level: 95,
    category: "frontend",
    color: "from-green-400 to-emerald-500",
    icon: "M19.344 6.304l-7.344 12.72-7.344-12.72h-4.656l12 20.784 12-20.784z",
  },
  {
    name: "TypeScript",
    level: 92,
    category: "frontend",
    color: "from-blue-400 to-indigo-500",
    icon: "M3 3h18v18H3V3zm10 12.5c-.8.8-1.8 1.2-3 1.2s-2.2-.4-3-1.2v-2l1.5-1.5v2c.4.4.9.6 1.5.6s1.1-.2 1.5-.6V11l-3.5-2v-1.5L13 9.5v6zm5-5.5v1.5h-2.5v4.5H14v-4.5h-2.5V10H18z",
  },
  {
    name: "JavaScript (ES6+)",
    level: 95,
    category: "frontend",
    color: "from-yellow-400 to-orange-500",
    icon: "M3 3h18v18H3V3zm10.5 12.5c0 .8-.3 1.5-.8 2-.5.5-1.2.8-2 .8s-1.5-.3-2-.8v-2l1.5-1.5v2c.1.1.3.2.5.2s.4-.1.5-.2V11l-3.5-2v-1.5l5 2v6zm5-5.5v1.5h-2.5v4.5H14v-4.5h-2.5V10h6z",
  },
  {
    name: "React",
    level: 80,
    category: "frontend",
    color: "from-cyan-400 to-blue-500",
    icon: "M12 4.4c2.8 0 5.4.8 7.4 2.2-1.9-2.3-4.8-3.8-8-3.8-3.2 0-6.1 1.5-8 3.8 2-1.4 4.6-2.2 7.4-2.2m7.4 2.2c1.9 2.3 3 5.4 3 8.8s-1.1 6.5-3 8.8c1.9-2.3 3-5.4 3-8.8s-1.1-6.5-3-8.8M4.6 6.6c-1.9 2.3-3 5.4-3 8.8s1.1 6.5 3 8.8c-1.9-2.3-3-5.4-3-8.8s1.1-6.5 3-8.8m7.4 17.6c-2.8 0-5.4-.8-7.4-2.2 1.9 2.3 4.8 3.8 8 3.8 3.2 0 6.1-1.5 8-3.8-2 1.4-4.6 2.2-7.4 2.2",
  },
  {
    name: "HTML5 & CSS3",
    level: 98,
    category: "frontend",
    color: "from-orange-400 to-red-500",
    icon: "M3 3h18l-1.6 18L12 24l-7.4-3L3 3zm9 18l5-2 1-11H6.5l.5 4h9l-.5 5-3.5 1.5L8.5 15l-.5-4H6l1 7 5 2z",
  },
  {
    name: "Tailwind CSS",
    level: 95,
    category: "frontend",
    color: "from-teal-400 to-cyan-500",
    icon: "M12 6c-3.3 0-5.8 1.8-7.5 5.5 1.7-2.5 4.2-3.3 7.5-2.5 1.7.4 2.9 1.6 4.3 3.1C18.1 13.9 20.3 16 24 16c-3.3 0-5.8-1.8-7.5-5.5-1.7 2.5-4.2 3.3-7.5 2.5-1.7-.4-2.9-1.6-4.3-3.1C2.9 8.1.7 6 0 6c3.3 0 5.8 1.8 7.5 5.5 1.7-2.5 4.2-3.3 7.5-2.5 1.7.4 2.9 1.6 4.3 3.1C21.1 13.9 23.3 16 24 16",
  },
  {
    name: "Vuetify",
    level: 90,
    category: "frontend",
    color: "from-blue-400 to-indigo-500",
    icon: "M12 2L2 7l10 15 10-15-10-5zm0 3.5L18 8l-6 9-6-9 6-2.5z",
  },
  {
    name: "Pinia",
    level: 90,
    category: "frontend",
    color: "from-yellow-400 to-amber-500",
    icon: "M12 3a9 9 0 100 18 9 9 0 000-18zm0 2a7 7 0 110 14 7 7 0 010-14z",
  },

  // Data Viz
  {
    name: "ECharts",
    level: 85,
    category: "frontend",
    color: "from-rose-400 to-red-500",
    icon: "M3 20h18v1H3v-1zm2-6h3v5H5v-5zm5-4h3v9h-3v-9zm5-6h3v15h-3V4z",
  },
  {
    name: "D3.js",
    level: 75,
    category: "frontend",
    color: "from-orange-400 to-amber-500",
    icon: "M4 4h6c3 0 5 2 5 5s-2 5-5 5H4V4zm0 10h6c3 0 5 2 5 5s-2 5-5 5H4V14z",
  },

  // Backend
  {
    name: "Node.js",
    level: 80,
    category: "backend",
    color: "from-lime-400 to-green-500",
    icon: "M12 2.5l9.5 5.5v11l-9.5 5.5-9.5-5.5v-11l9.5-5.5z",
  },
  {
    name: "Laravel",
    level: 70,
    category: "backend",
    color: "from-red-400 to-orange-500",
    icon: "M12 2L2 7v10l10 5 10-5V7L12 2z",
  },
  {
    name: "REST APIs",
    level: 88,
    category: "backend",
    color: "from-blue-400 to-purple-500",
    icon: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z",
  },
  {
    name: "PostgreSQL",
    level: 72,
    category: "backend",
    color: "from-sky-400 to-blue-600",
    icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 3c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7z",
  },

  // Tools
  {
    name: "Git & GitHub",
    level: 92,
    category: "tools",
    color: "from-gray-700 to-gray-900",
    icon: "M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.1 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1.1A9.8 9.8 0 0112 6.8c.9 0 1.7.1 2.5.3 1.9-1.3 2.8-1.1 2.8-1.1.5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.3 6.8-5.1 6.8-9.5 0-5.5-4.5-10-10-10z",
  },
  {
    name: "Vite",
    level: 90,
    category: "tools",
    color: "from-purple-400 to-pink-500",
    icon: "M12 2L2 8v8l10 6 10-6V8l-10-6z",
  },
  {
    name: "Docker",
    level: 75,
    category: "tools",
    color: "from-sky-400 to-blue-500",
    icon: "M4 10h4v4H4v-4zm5 0h4v4H9v-4zm5 0h4v4h-4v-4zM9 5h4v4H9V5zm5 0h4v4h-4V5z",
  },
  {
    name: "Vitest",
    level: 78,
    category: "tools",
    color: "from-red-400 to-pink-500",
    icon: "M12 2L2 6l10 4 10-4-10-4zm0 6L3 11v6l9 5 9-5v-6l-9-3z",
  },

  // Design
  {
    name: "UI/UX Design",
    level: 85,
    category: "design",
    color: "from-purple-400 to-pink-500",
    icon: "M12 2l10 5v10l-10 5-10-5V7l10-5z",
  },
  {
    name: "Figma",
    level: 88,
    category: "design",
    color: "from-purple-500 to-pink-500",
    icon: "M8 4c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4s-1.8 4-4 4H8V4z",
  },
  {
    name: "Responsive Design",
    level: 95,
    category: "design",
    color: "from-indigo-400 to-purple-500",
    icon: "M4 4h16v16H4V4zm2 2v12h12V6H6zm3 3h6v6H9V9z",
  },
  {
    name: "Accessibility (WCAG)",
    level: 82,
    category: "design",
    color: "from-green-400 to-teal-500",
    icon: "M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z",
  },
];

export const timeline: TimelineItem[] = [
  {
    id: 1,
    type: "experience",
    title: "Front-end Developer",
    organization: "Philippine Statistics Authority — Central Office",
    location: "Quezon City, Philippines",
    period: {
      start: "2022",
      end: "Present",
    },
    description:
      "Lead front-end for the CBMS Portal — the analyst-facing surface for Community-Based Monitoring System data across the Philippines. Vue 3 + TypeScript + Tailwind, with Vuetify, ECharts, D3, and a Laravel service backing the data layer.",
    highlights: [
      "Owned the typed Pinia store architecture used across the portal",
      "Built reusable visualization composables (ECharts, D3, Observable Plot)",
      "Shipped virtualized data tables handling millions of survey rows",
      "Maintained stability across multiple CBMS round / schema changes",
    ],
    tags: ["Vue 3", "TypeScript", "Tailwind", "Vuetify", "ECharts", "Pinia"],
  },
  {
    id: 2,
    type: "experience",
    title: "Web Designer / UI-UX Junior Intern",
    organization: "iPhitech",
    location: "Clark, Pampanga, Philippines",
    period: {
      start: "2022",
      end: "2022",
    },
    description:
      "Three-month internship focused on web design, UI/UX, and front-end prototyping. Produced marketing pages and interface mockups that informed the production design system.",
    highlights: [
      "Designed responsive marketing pages end-to-end",
      "Translated Figma mockups into production HTML/CSS",
      "Collaborated with senior designers on UX reviews",
    ],
    tags: ["HTML/CSS", "Figma", "UI/UX", "Prototyping"],
  },
  {
    id: 3,
    type: "education",
    title: "Bachelor of Science in Computer Science",
    organization: "Tarlac State University",
    location: "Tarlac City, Philippines",
    period: {
      start: "2019",
      end: "Jul 2023",
    },
    description:
      "Computer Science degree at Tarlac State University. Graduated July 2023. Completed OJT at iPhitech (Clark, Pampanga) from March to May 2023 as part of the program.",
    tags: ["Computer Science", "Software Engineering"],
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/Araragi",
    icon: "github",
    username: "@Araragi",
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    platform: "Email",
    url: "mailto:davxgonzales@gmail.com",
    icon: "email",
    color: "hover:text-red-500 dark:hover:text-red-400",
  },
];
