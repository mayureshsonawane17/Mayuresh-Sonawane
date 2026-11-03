/**
 * Centralized Portfolio Configuration for Mayuresh Sonawane
 * Identity, Mask Collection, Socials, Credentials Architecture, and Public Initial State.
 * NO PHYSICAL LOCATION OR GPS COORDINATES DISPLAYED.
 */

export const personalInfo = {
  name: "Mayuresh Sonawane",
  monogram: "MS",
  title: "Creative Developer & Builder",
  heroHeadline: "I build things that bring ideas to life.",
  supportingDescription: "Exploring the intersection of technology, design and imagination through websites, games and interactive digital experiences.",
  systemEdition: "PORTFOLIO // 2026 EDITION",
  systemStatus: "SYS.STATUS // OPERATIONAL V3.0",
  statusBadge: "AVAILABLE FOR 2026 ENGAGEMENTS",
  manifesto: {
    sectionTag: "[01] A MESSAGE FROM ME",
    leadQuote: "Bridging the gap between creative curiosity and technical execution.",
    heading: "I engineer digital systems that refuse to be unremarkable.",
    paragraphs: [
      "Every project—whether it's an action-adventure game, a high-velocity web platform, or an interactive tool—is an opportunity to craft something with intention, tactile precision, and mechanical elegance.",
      "I don't believe in generic developer templates or sterilized digital interfaces. My focus is exploring how technology, motion, and design intersect to evoke genuine human curiosity and engagement.",
      "From crafting custom game systems in Godot to building responsive web architectures and open-source utilities, I build software that brings ideas to life."
    ],
    disciplines: [
      { id: "01", tag: "VELOCITY", title: "Sub-millisecond Frames & Fluid Interaction" },
      { id: "02", tag: "GAME SYSTEMS", title: "Gameplay Logic & State Engines" },
      { id: "03", tag: "WEB CRAFT", title: "Modern Responsive Web Platforms" },
    ],
  },
  portrait: {
    // Authenticated personal photographs of Mayuresh Sonawane
    src: "/assets/personal/portrait-front.jpg",
    profileSrc: "/assets/hero/about-profile.webp",
    alt: "Mayuresh Sonawane - Creative Developer & Builder",
    isPlaceholder: false,
    caption: "AUTHENTIC EDITORIAL PORTRAIT // MAYURESH SONAWANE",
  },
  signature: {
    caption: "AUTHENTIC HANDWRITTEN SCRIPT // MAYURESH SONAWANE",
    isPlaceholder: false,
    assetDark: "/assets/signature/mayuresh-signature-dark.webp",
    assetLight: "/assets/signature/mayuresh-signature-light.webp",
    assetVolt: "/assets/signature/mayuresh-signature-volt.webp",
  },
};

/**
 * The Spider-Man Mask Collection Showcase
 * Reinterprets the reference helmet gallery into Mayuresh's signature Spider-Man mask showcase.
 * Features Mayuresh's authentic physical red Spider-Man mask across multiple high-detail perspectives.
 */
export const maskCollection = {
  title: "THE MASK COLLECTION",
  subtitle: "Spider-Man Mask Editorial Showcase",
  tagline: "[04] // SIGNATURE VISUAL IDENTITY",
  description: "Mayuresh photographed on an open green valley expedition wearing the authentic Spider-Man cowl under dramatic overcast skies, capturing the raw intersection of imagination, code, and landscape.",
  statusBadge: "AUTHENTIC PHYSICAL ARTIFACT // OUTDOOR VANGUARD STUDY",
  masks: [
    {
      id: "MASK-03",
      name: "OUTDOOR VANGUARD // THE LONE EXPLORER",
      specEdition: "CINEMATIC EXPEDITION // OUTDOOR VANGUARD",
      material: "Weathered Field Ensemble & Crimson Cowl Weave",
      lenses: "Wide-Angle High-Contrast Micro-Mesh",
      description: "Mayuresh photographed on an open green valley expedition wearing the authentic Spider-Man cowl under dramatic overcast skies, capturing the raw intersection of imagination, code, and landscape.",
      image: "/assets/masks/spiderman-outdoor-field.webp",
      revealImage: "/assets/masks/spiderman-outdoor-field.webp",
      tags: ["OPEN HORIZON", "OUTDOOR VANGUARD", "CINEMATIC SCOPE", "AUTHENTIC COWL"],
      isPlaceholder: false,
    },
  ],
};

/**
 * Confirmed Social Profiles
 */
export const socialLinks = {
  instagram: {
    id: "instagram",
    label: "Instagram",
    handle: "@mayureshkeepsdroppingstuff",
    url: "https://www.instagram.com/mayureshkeepsdroppingstuff/",
    active: true,
    description: "Visual experiments, creative explorations & updates.",
  },
  github: {
    id: "github",
    label: "GitHub",
    handle: "mayureshsonawane17",
    url: "https://github.com/mayureshsonawane17",
    active: true,
    description: "Open-source repositories, game systems & web applications.",
  },
  email: {
    id: "email",
    label: "Email",
    handle: "mayureshsonawane668@gmail.com",
    url: "mailto:mayureshsonawane668@gmail.com",
    active: true,
    description: "Direct inquiries, collaborations & engineering inquiries.",
  },
  linkedin: {
    id: "linkedin",
    label: "LinkedIn",
    handle: "Coming Soon",
    url: "", // Set profile URL here when supplied
    active: false, // Strictly suppressed until supplied
    description: "Professional background and network connection.",
  },
};

/**
 * Journey Documentary Milestones
 * Authentic milestones featuring Mayuresh Sonawane's genuine milestone photography.
 * NO PHYSICAL LOCATION OR GPS COORDINATES DISPLAYED.
 */
export const journeyMilestones = [
  {
    id: "01",
    period: "ORIGINS",
    title: "EARLY ROOTS & INQUISITIVE MIND",
    subtitle: "First Principles & Inherent Curiosity",
    description: "Early childhood foundations rooted in family, sibling bonds, and an innate curiosity about how machines, visual interfaces, and computational systems come together.",
    tags: ["EARLY ROOTS", "INQUISITIVE MIND", "FIRST PRINCIPLES"],
    image: "/assets/journey/journey-01-roots.webp",
    isPlaceholder: false,
  },
  {
    id: "02",
    period: "FOUNDATIONS",
    title: "FAMILY VALUES & CORE RESILIENCE",
    subtitle: "Empathy, Support & Quiet Determination",
    description: "Growing up supported by family, internalizing values of persistence, humility, and the quiet drive to build meaningful things that refuse to be unremarkable.",
    tags: ["CORE VALUES", "SUPPORT SYSTEM", "EMPATHY"],
    image: "/assets/journey/journey-02-foundations.webp",
    isPlaceholder: false,
  },
  {
    id: "03",
    period: "COLLEGE ERA",
    title: "CREATIVE SPIRIT & SOCIAL HORIZONS",
    subtitle: "Collaborative Energy & Expression",
    description: "Navigating engineering college, collaborating with peers, exploring culture, and discovering a passion for digital craftsmanship and frontend interaction.",
    tags: ["ENGINEERING", "CAMPUS EXPLORATION", "CREATIVE SPARK"],
    image: "/assets/journey/journey-03-college.webp",
    isPlaceholder: false,
  },
  {
    id: "04",
    period: "EXPEDITION",
    title: "URBAN HORIZONS & PERSONAL DIRECTION",
    subtitle: "Aesthetics, Street Style & Ambition",
    description: "Stepping onto rooftops and looking out at the city skyline with focused intent—channeling personal style, design aesthetics, and technical ambition into a distinct creative identity.",
    tags: ["URBAN VISTA", "PERSONAL IDENTITY", "AESTHETICS"],
    image: "/assets/journey/journey-04-horizons.webp",
    isPlaceholder: false,
  },
  {
    id: "05",
    period: "PRESENT // 2026",
    title: "THE LONE EXPLORER & UNCONVENTIONAL PATH",
    subtitle: "Bridging Imagination & Engineering",
    description: "Venturing into open landscapes and new mediums: action-adventure games in Godot, kinetic 3D web platforms, physical masks, and authentic cinematic digital storytelling.",
    tags: ["LONE EXPLORER", "CREATIVE DEVELOPER", "FUTURE HORIZON"],
    image: "/assets/journey/journey-05-creative.webp",
    isPlaceholder: false,
  },
];

/**
 * Editable Credentials Architecture (Part 4)
 * Only displays confirmed information; placeholders unpublished until provided.
 */
export const credentialsData = {
  education: [
    {
      institution: "[INSTITUTION // EDITABLE]",
      degree: "[DEGREE / FIELD OF STUDY]",
      period: "[PERIOD]",
      status: "PUBLISHED_PENDING_CONFIRMATION",
      isPlaceholder: true,
    },
  ],
  skills: [
    { category: "LANGUAGES", items: ["JavaScript", "TypeScript", "GDScript", "HTML5", "CSS3", "C++"] },
    { category: "FRAMEWORKS & ENGINES", items: ["React", "Godot Engine 4.7", "Vite", "Tailwind CSS", "Node.js"] },
    { category: "CREATIVE & MOTION", items: ["Three.js", "GLSL Shaders", "GSAP", "ScrollTrigger", "Lenis"] },
  ],
  certifications: [], // Empty until supplied
  experience: [], // Empty until supplied
};

/**
 * Curated Project Presets / Templates
 * Authentic project configurations featuring Mayuresh's reference photographs and real projects.
 * Available in Admin Dashboard for one-click publishing when ready.
 */
export const curatedProjectTemplates = [
  {
    id: "PROJ-01",
    title: "ORIGIN: 2D ACTION-ADVENTURE",
    category: "Game Architecture & State Systems",
    primaryImage: "/assets/projects/project-origin-cover.webp",
    description: "An atmospheric 2D action-adventure crafted in Godot Engine 4.7 exploring loop-breaking mechanics, boss state machines, and precision combat flow.",
    tags: ["GODOT ENGINE 4.7", "GDScript", "COMBAT LOGIC", "STATE ENGINES"],
    githubUrl: "https://github.com/mayureshsonawane17/origin-game",
    liveUrl: "",
    status: "In-Development",
  },
  {
    id: "PROJ-02",
    title: "JAI BALAJI YATRA",
    category: "Travel & Pilgrimage Web Platform",
    primaryImage: "/assets/projects/project-jai-balaji-cover.webp",
    description: "A full-stack pilgrimage booking and spiritual itinerary system designed to assist families in planning, lodging, and navigating sacred routes across India.",
    tags: ["REACT", "TAILWIND CSS", "NODE.JS", "EXPEDITION LOGISTICS"],
    githubUrl: "https://github.com/mayureshsonawane17/jai-balaji-yatra",
    liveUrl: "https://jaibalajiyatra.com",
    status: "Completed",
  },
  {
    id: "PROJ-03",
    title: "KICKS: KINETIC STREETWEAR",
    category: "Interactive 3D E-Commerce Experience",
    primaryImage: "/assets/projects/project-kicks-cover.webp",
    description: "An experimental high-velocity streetwear lookbook featuring kinetic typography, 3D product previews, and sub-millisecond interaction pacing.",
    tags: ["THREE.JS", "WEBGL", "REACT", "GSAP MOTION"],
    githubUrl: "https://github.com/mayureshsonawane17/kicks-kinetic",
    liveUrl: "",
    status: "Concept",
  },
  {
    id: "PROJ-04",
    title: "GOOD FIRST ISSUE FINDER",
    category: "Developer Tooling & Ecosystem Utility",
    primaryImage: "/assets/projects/project-devtools-cover.webp",
    description: "An automated GitHub explorer that aggregates and filters accessible open-source issues for aspiring developers, lowering the onboarding barrier to OSS.",
    tags: ["TYPESCRIPT", "GITHUB REST API", "OPEN SOURCE", "DEV TOOLING"],
    githubUrl: "https://github.com/mayureshsonawane17/good-first-issue-finder",
    liveUrl: "",
    status: "Completed",
  },
];

/**
 * INITIAL PUBLIC PROJECTS: EMPTY BY SPECIFICATION
 * Non-negotiable requirement: Public project gallery starts empty.
 * Selected projects are managed and published exclusively through the Admin Dashboard.
 */
export const initialPublicProjects = [];
