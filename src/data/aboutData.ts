import type {
  Skill,
  TimelineItem,
  SocialLink,
  PersonalInfo,
} from "@/types/about";

export const personalInfo: PersonalInfo = {
  name: "Your Name",
  title: "Front-end Developer",
  bio: [
    "I'm a passionate front-end developer with over 5 years of experience building modern, scalable web applications. I specialize in Vue.js, React, and TypeScript, with a keen eye for design and user experience.",
    "My journey in web development started with a curiosity about how things work on the web, and it has evolved into a professional career focused on creating accessible, performant, and beautiful digital experiences.",
    "When I'm not coding, you can find me contributing to open-source projects, writing technical articles, or exploring the latest web technologies and design trends.",
  ],
  image: {
    alt: "Profile photo",
  },
  contact: {
    email: "davxgonzales@gmail.com",
    location: "San Francisco, CA",
  },
  availability: {
    status: "available",
    message: "Available for freelance projects",
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
    name: "React",
    level: 90,
    category: "frontend",
    color: "from-cyan-400 to-blue-500",
    icon: "M12 4.4c2.8 0 5.4.8 7.4 2.2-1.9-2.3-4.8-3.8-8-3.8-3.2 0-6.1 1.5-8 3.8 2-1.4 4.6-2.2 7.4-2.2m7.4 2.2c1.9 2.3 3 5.4 3 8.8s-1.1 6.5-3 8.8c1.9-2.3 3-5.4 3-8.8s-1.1-6.5-3-8.8M4.6 6.6c-1.9 2.3-3 5.4-3 8.8s1.1 6.5 3 8.8c-1.9-2.3-3-5.4-3-8.8s1.1-6.5 3-8.8m7.4 17.6c-2.8 0-5.4-.8-7.4-2.2 1.9 2.3 4.8 3.8 8 3.8 3.2 0 6.1-1.5 8-3.8-2 1.4-4.6 2.2-7.4 2.2",
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

  // Backend
  {
    name: "Node.js",
    level: 85,
    category: "backend",
    color: "from-lime-400 to-green-500",
    icon: "M12 2.5l9.5 5.5v11l-9.5 5.5-9.5-5.5v-11l9.5-5.5zm0 1.5L3.5 9v9l8.5 5 8.5-5V9l-8.5-5zm-2 13v-8h1.5v6.5h3.5v1.5H10z",
  },
  {
    name: "Express.js",
    level: 80,
    category: "backend",
    color: "from-gray-400 to-gray-600",
    icon: "M12 4L4 8v8l8 4 8-4V8l-8-4zm-4 7l2-1v4l-2-1v-2zm8 0l-2 1v-2l2-1v2z",
  },
  {
    name: "REST APIs",
    level: 88,
    category: "backend",
    color: "from-blue-400 to-purple-500",
    icon: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-2-11.5v7h1.5v-3h2c1.4 0 2.5-1.1 2.5-2.5S14.9 8.5 13.5 8.5H10zm1.5 1.5h2c.6 0 1 .4 1 1s-.4 1-1 1h-2v-2z",
  },
  {
    name: "GraphQL",
    level: 75,
    category: "backend",
    color: "from-pink-400 to-purple-500",
    icon: "M17.5 4l4 7-4 7h-8l-4-7 4-7h8z",
  },

  // Tools & Others
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
    icon: "M12 2L2 8v8l10 6 10-6V8l-10-6zm0 2.5l7.5 4.5v6l-7.5 4.5L4.5 15v-6L12 4.5z",
  },
  {
    name: "Webpack",
    level: 80,
    category: "tools",
    color: "from-blue-400 to-cyan-500",
    icon: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 2L5.5 8.5v7L12 19l6.5-3.5v-7L12 5z",
  },
  {
    name: "Jest & Vitest",
    level: 82,
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
    icon: "M12 2l10 5v10l-10 5-10-5V7l10-5zm0 2L4 8l8 4 8-4-8-4zm-8 7.5v6l7 3.5v-6l-7-3.5zm16 0l-7 3.5v6l7-3.5v-6z",
  },
  {
    name: "Figma",
    level: 88,
    category: "design",
    color: "from-purple-500 to-pink-500",
    icon: "M8 4c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4s-1.8 4-4 4H8V4zm0 8c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4v-4H8zm0 4c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4zm4-4h-4c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4v4z",
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
    level: 85,
    category: "design",
    color: "from-green-400 to-teal-500",
    icon: "M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2zm0 2C7.6 4 4 7.6 4 12s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-3 5h6v1.5h-1.5V17h-3v-4.5H9V11z",
  },
];

export const timeline: TimelineItem[] = [
  {
    id: 1,
    type: "experience",
    title: "Senior Front-end Developer",
    organization: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    period: {
      start: "Jan 2022",
      end: "Present",
    },
    description:
      "Leading front-end development for enterprise web applications serving 100k+ users. Architecting scalable solutions with Vue 3 and TypeScript.",
    highlights: [
      "Reduced bundle size by 40% through code splitting and optimization",
      "Implemented design system used across 15+ applications",
      "Mentored junior developers and conducted code reviews",
      "Improved app performance by 60% using lazy loading and caching strategies",
    ],
    tags: ["Vue 3", "TypeScript", "Tailwind CSS", "Performance"],
  },
  {
    id: 2,
    type: "experience",
    title: "Front-end Developer",
    organization: "Digital Solutions Co.",
    location: "Remote",
    period: {
      start: "Mar 2020",
      end: "Dec 2021",
    },
    description:
      "Developed responsive web applications and collaborated with cross-functional teams to deliver high-quality products.",
    highlights: [
      "Built 10+ client projects from concept to deployment",
      "Integrated RESTful APIs and GraphQL endpoints",
      "Implemented automated testing with Jest and Cypress",
      "Contributed to open-source component library",
    ],
    tags: ["React", "Node.js", "GraphQL", "Testing"],
  },
  {
    id: 3,
    type: "experience",
    title: "Junior Web Developer",
    organization: "Creative Agency LLC",
    location: "New York, NY",
    period: {
      start: "Jun 2019",
      end: "Feb 2020",
    },
    description:
      "Worked on client websites and marketing campaigns, focusing on responsive design and cross-browser compatibility.",
    highlights: [
      "Developed 15+ landing pages with high conversion rates",
      "Implemented A/B testing for optimization",
      "Collaborated with designers using Figma and Adobe XD",
    ],
    tags: ["HTML/CSS", "JavaScript", "WordPress", "SEO"],
  },
  {
    id: 4,
    type: "education",
    title: "Bachelor of Science in Computer Science",
    organization: "University of Technology",
    location: "Boston, MA",
    period: {
      start: "2015",
      end: "2019",
    },
    description:
      "Graduated with honors. Focused on software engineering, web technologies, and human-computer interaction.",
    highlights: [
      "GPA: 3.8/4.0",
      "Dean's List all semesters",
      "President of Web Development Club",
      "Senior project: Real-time collaboration platform",
    ],
    tags: ["Computer Science", "Web Development", "Algorithms"],
  },
  {
    id: 5,
    type: "achievement",
    title: "AWS Certified Developer",
    organization: "Amazon Web Services",
    period: {
      start: "2021",
      end: "2021",
    },
    description:
      "Achieved AWS Certified Developer - Associate certification, demonstrating expertise in developing and maintaining AWS-based applications.",
    tags: ["AWS", "Cloud", "Certification"],
  },
  {
    id: 6,
    type: "achievement",
    title: "Open Source Contributor",
    organization: "Vue.js Community",
    period: {
      start: "2020",
      end: "Present",
    },
    description:
      "Active contributor to Vue.js ecosystem with 50+ merged pull requests across various projects.",
    highlights: [
      "Contributed to Vue Router and Pinia documentation",
      "Maintained popular Vue component library (2k+ stars)",
      "Spoke at local Vue.js meetups",
    ],
    tags: ["Open Source", "Community", "Vue.js"],
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/yourusername",
    icon: "github",
    username: "@yourusername",
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/in/yourusername",
    icon: "linkedin",
    username: "yourusername",
    color: "hover:text-blue-600 dark:hover:text-blue-400",
  },
  {
    platform: "Twitter",
    url: "https://twitter.com/yourusername",
    icon: "twitter",
    username: "@yourusername",
    color: "hover:text-sky-500 dark:hover:text-sky-400",
  },
  {
    platform: "Email",
    url: "mailto:davxgonzales@gmail.com",
    icon: "email",
    color: "hover:text-red-500 dark:hover:text-red-400",
  },
  {
    platform: "CodePen",
    url: "https://codepen.io/yourusername",
    icon: "codepen",
    username: "@yourusername",
    color: "hover:text-green-600 dark:hover:text-green-400",
  },
];
