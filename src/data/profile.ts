// Single source of truth for the site's content. Edit here; the page re-renders from it.

export type Track = 'tech' | 'growth';

export const profile = {
  name: 'Lakshit Tyagi',
  role: 'AI MarTech',
  location: 'Delhi NCR, India',
  email: 'tyagilakshit6@gmail.com',
  resume: '/Lakshit-Tyagi-Resume.pdf',
  photo: '/profile.jpg',
  status: 'Open to internships & full-time roles',
  intro:
    'I sit where AI engineering meets audience growth. I build full-stack products and AI workflows — and I know how to script, launch and grow them with creators and content.',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lakshit-tyagi-3a5ba52a4/' },
    { label: 'GitHub', href: 'https://github.com/lucky-smash' },
    { label: 'YouTube', href: 'https://www.youtube.com/@LakshitPlay' },
    { label: 'LeetCode', href: 'https://leetcode.com/u/oIKSZf1UsV/' },
  ],
};

export const stats = [
  { value: '4', label: 'Internships — 2 tech, 2 growth' },
  { value: '10+', label: 'Figma designs shipped as production UI' },
  { value: '13K+', label: 'Views on content I helped plan & script' },
  { value: '4', label: 'Live products, deployed on Vercel' },
];

export const pillars = [
  {
    no: '01',
    title: 'Build',
    line: 'Full-stack products that ship.',
    items: ['React.js & Next.js', 'Node.js, Express, MongoDB', 'REST APIs & auth flows', 'Tailwind, Three.js, GSAP'],
  },
  {
    no: '02',
    title: 'Automate',
    line: 'AI wired into real workflows.',
    items: ['LLM apps & prompt engineering', 'RAG, embeddings, vector DBs', 'AI agents & semantic search', 'API-driven automation'],
  },
  {
    no: '03',
    title: 'Grow',
    line: 'Stories that find their audience.',
    items: ['Reels & Shorts scripting', 'Creator & influencer outreach', 'Campaign coordination', 'Content analytics'],
  },
];

export const projects = [
  {
    name: 'StackWise',
    kind: 'AI SaaS · Spend optimisation',
    summary:
      'Helps startups find redundant AI subscriptions and cut operating costs — with audit workflows, dashboard analytics, AI recommendations and a lead-capture funnel.',
    stack: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB'],
    href: 'https://stack-wise-hazel.vercel.app/',
    shot: '/work/stackwise.webp',
    martech: 'Product + funnel: the lead capture is built into the audit flow.',
  },
  {
    name: 'MealMind',
    kind: 'AI app · Nutrition planning',
    summary:
      'Generates personalised meal plans from preferences, budget and fitness goals, with budget-aware optimisation logic and AI-generated nutrition insights.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'LLM'],
    href: 'https://meal-mind-one.vercel.app/',
    shot: '/work/mealmind.webp',
    martech: 'Personalisation as the core experience, not an add-on.',
  },
  {
    name: 'Food Product Explorer',
    kind: 'Web app · Open data',
    summary:
      'A food discovery platform on the OpenFoodFacts REST API — search, filtering and product exploration with optimised rendering.',
    stack: ['React', 'Vite', 'REST API'],
    href: 'https://food-product-explorer-omega.vercel.app/',
    shot: '/work/food-explorer.webp',
    martech: 'Fast, filterable discovery over a large public dataset.',
  },
  {
    name: 'Elementum',
    kind: 'Marketing site · Design to code',
    summary:
      'A responsive modern website built from design concepts, with reusable components, clean architecture and a focus on frontend performance.',
    stack: ['React', 'Tailwind CSS'],
    href: 'https://elementum-flax.vercel.app/',
    shot: '/work/elementum.webp',
    martech: 'Brand-first landing experience, built to load fast.',
  },
];

export const experience: {
  role: string;
  org: string;
  when: string;
  where: string;
  track: Track;
  link?: { label: string; href: string };
  points: string[];
}[] = [
  {
    role: 'AI / Automation Intern',
    org: 'Solution Bowl',
    when: 'Oct 2026 — Present',
    where: 'India',
    track: 'tech',
    points: [
      'Researching and prototyping AI automation — LLM apps, RAG, embeddings, vector databases and agents — for real business workflows.',
      'Building interactive portfolio and website experiences with Next.js, Tailwind CSS, Three.js and GSAP.',
      'Using 3D, motion and visual storytelling to communicate AI-driven services.',
    ],
  },
  {
    role: 'Social Media Intern',
    org: 'BLEP Pet Food',
    when: '2026 — Present',
    where: 'Delhi NCR',
    track: 'growth',
    link: { label: 'Instagram', href: 'https://instagram.com/blep.world' },
    points: [
      'Ran creator campaigns end to end: sourcing pet influencers, negotiating barter deals, briefs, approvals, publishing and tracking.',
      'Wrote Instagram Reel concepts and scripts aligned with brand positioning; iterated on hooks using view and engagement data.',
      'Represented the brand at the India International Pet Trade Fair (IIPTF).',
    ],
  },
  {
    role: 'Content & Social Media Intern',
    org: 'Skillsnap Learning',
    when: 'May 2026 — Present',
    where: 'On-site',
    track: 'growth',
    points: [
      'Co-created educational short-form content for Instagram and YouTube that generated 13K+ views.',
      'Handled ideation, research, scripting and recording support; researched AI and web-dev trends for content planning.',
      'Ran content trackers, publishing workflows and reporting with startup leadership.',
    ],
  },
  {
    role: 'Full Stack Intern',
    org: 'Websitele',
    when: 'Jan 2026 — Present',
    where: 'Remote',
    track: 'tech',
    points: [
      'Converted 10+ Figma designs into responsive, pixel-accurate interfaces with React, Next.js and Tailwind CSS.',
      'Integrated REST APIs with loading states, error boundaries, auth workflows and CRUD operations.',
      'Built reusable components and onboarding flows for production use.',
    ],
  },
];

// The hero's spill, oldest first: each milestone is a sticker that pours out of the bowl into its slot.
export const journey: {
  when: string;
  emoji: string;
  title: string;
  org: string;
  hook: string;
  tone: 'paper' | 'lime' | 'pink' | 'orange' | 'lilac' | 'ink';
  href?: string;
}[] = [
  { when: '2023', emoji: '🎓', title: 'started b.tech cse', org: 'KR Mangalam University', hook: 'where the code era began', tone: 'paper' },
  { when: 'Jan 2026', emoji: '💻', title: 'full stack intern', org: 'Websitele', hook: '10+ Figma files → real UI', tone: 'lime' },
  { when: 'May 2026', emoji: '🎬', title: 'content intern', org: 'Skillsnap Learning', hook: '13K+ views on reels I helped script', tone: 'pink' },
  { when: '2026', emoji: '🐾', title: 'social media intern', org: 'BLEP Pet Food', hook: 'pet creators, barter deals, IIPTF', tone: 'orange' },
  { when: 'Oct 2026', emoji: '🤖', title: 'ai / automation intern', org: 'Solution Bowl', hook: 'LLMs, RAG & agents in real workflows', tone: 'lilac' },
  { when: 'next', emoji: '✨', title: 'your team?', org: 'open to internships & full-time', hook: "let's build + grow something →", tone: 'ink', href: '#contact' },
];

export const skills = [
  { group: 'AI Engineering', items: ['LLMs', 'RAG', 'Prompt Engineering', 'Embeddings', 'Vector Databases', 'Semantic Search', 'AI Agents', 'AI Automation'] },
  { group: 'Frontend', items: ['React.js', 'Next.js', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Responsive Design'] },
  { group: 'Backend', items: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Authentication'] },
  { group: 'Growth & Content', items: ['Content Strategy', 'Creator Marketing', 'Influencer Outreach', 'Scriptwriting', 'Video Editing', 'Social Analytics'] },
  { group: 'Tools', items: ['Git & GitHub', 'Vercel', 'Postman', 'Figma', 'Notion', 'Canva', 'CapCut', 'OBS Studio'] },
];

export const education = {
  school: 'KR Mangalam University',
  degree: 'B.Tech, Computer Science & Engineering',
  when: '2023 — 2027',
  where: 'Delhi NCR',
};

export const ticker = [
  'Next.js', 'LLMs', 'Creator campaigns', 'RAG', 'Reels scripting', 'Node.js', 'AI agents',
  'Influencer outreach', 'MongoDB', 'Prompt engineering', 'Content analytics', 'Three.js', 'Automation',
];
