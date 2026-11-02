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
    profileSrc: "/assets/personal/portrait-profile.jpg",
    alt: "Mayuresh Sonawane - Creative Developer & Builder",
    isPlaceholder: false,
    caption: "AUTHENTIC EDITORIAL PORTRAIT // MAYURESH SONAWANE",
  },
  signature: {
    caption: "ORIGINAL SCRIPT ARTWORK // PENDING PERSONAL SIGNATURE SPEC",
    isPlaceholder: true,
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
  description: "A dedicated cinematic artifact study of Mayuresh's actual physical Spider-Man mask. Documenting tactile crimson fabric weave, optical honeycomb eye mesh, and precision web geometry across multiple perspectives.",
  statusBadge: "AUTHENTIC PHYSICAL ARTIFACT // MULTI-PERSPECTIVE STUDY",
  masks: [
    {
      id: "MASK-01",
      name: "HEROIC WEAR // FULL VIEW",
      specEdition: "PRIMARY FIT // PERSPECTIVE 01",
      material: "Textured Crimson Stretch Fabric & Stitched Webbing",
      lenses: "High-Contrast Hexagonal Micro-Mesh Eye Contours",
      description: "Full cowl portrait wearing the authentic physical red Spider-Man mask, featuring ergonomic head form fitting, comic-accurate eye housings, and crimson contoured web relief.",
      image: "/assets/personal/mask-wearing.jpg",
      revealImage: "/assets/personal/mask-lens-detail.jpg",
      tags: ["AUTHENTIC MASK", "CRIMSON WEAVE", "HEROIC WEAR", "HEXAGONAL MESH"],
      isPlaceholder: false,
    },
    {
      id: "MASK-02",
      name: "SIDE PROFILE // LATERAL CONTOUR",
      specEdition: "AERODYNAMIC PROFILE // PERSPECTIVE 02",
      material: "Curved Ergonomic Shell & Poly-Cotton Elastic Blend",
      lenses: "Gloss Black Sculpted Bezel & White Perforated Optical Diffuser",
      description: "High-resolution lateral study of the physical mask highlighting the cranial curvature, aerodynamic jaw taper, and continuous surface web geometry.",
      image: "/assets/personal/mask-profile.jpg",
      revealImage: "/assets/personal/mask-macro.jpg",
      tags: ["PROFILE CURVATURE", "SCULPTED BEZEL", "LATERAL GEOMETRY", "CRANIAL TAPER"],
      isPlaceholder: false,
    },
    {
      id: "MASK-03",
      name: "OPTICAL LENS // MACRO WEAVE",
      specEdition: "MACRO SPECIFICATION // PERSPECTIVE 03",
      material: "Tactile Raised Web Print & Breathable Technical Knit",
      lenses: "Dual-Stage Optical Eye Mesh with Peripheral Occlusion",
      description: "Extreme macro examination showcasing the fine hexagonal honeycomb eye mesh, micro-porous ventilation, and tactile printed web relief.",
      image: "/assets/personal/mask-lens-detail.jpg",
      revealImage: "/assets/personal/mask-wearing.jpg",
      tags: ["HONEYCOMB MESH", "RAISED WEBBING", "OPTICAL DETAIL", "TACTILE KNIT"],
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
 * Authentic milestones with no invented dates, awards, or honors.
 */
export const journeyMilestones = [
  {
    id: "01",
    period: "FOUNDATIONAL PHASE",
    title: "THE FIRST LINE OF CODE",
    subtitle: "First Principles & Problem Solving",
    description: "Embarking on the engineering path: mastering computing fundamentals, algorithmic logic, and structural programming paradigms.",
    tags: ["COMPUTATIONAL LOGIC", "FIRST PRINCIPLES", "ALGORITHMS"],
    image: "https://images.unsplash.com/photo-1516116211227-bbc66e60b29c?q=80&w=800&auto=format&fit=crop",
    isPlaceholder: false,
  },
  {
    id: "02",
    period: "WEB & INTERFACE EXPLORATION",
    title: "BUILDING DIGITAL PRODUCTS",
    subtitle: "Front-End Systems & Interaction",
    description: "Developing practical web applications, mastering responsive layouts, state architecture, and tactile micro-interactions.",
    tags: ["WEB PLATFORMS", "INTERACTION DESIGN", "UI/UX ARCHITECTURE"],
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    isPlaceholder: false,
  },
  {
    id: "03",
    period: "GAME ARCHITECTURE",
    title: "ORIGIN: 2D ACTION-ADVENTURE",
    subtitle: "Game Systems & Narrative Mechanics",
    description: "Architecting game systems in Godot Engine: reset managers, boss state machines, combat mechanics, and loop-breaking narrative design.",
    tags: ["GODOT ENGINE 4.7", "GAMEPLAY ENGINEERING", "STATE SYSTEMS"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    isPlaceholder: false,
  },
  {
    id: "04",
    period: "COMMUNITY & OPEN SOURCE",
    title: "GOOD FIRST ISSUE FINDER",
    subtitle: "Developer Tooling for the Ecosystem",
    description: "Contributing to developer tooling: streamlining open-source discovery on GitHub and lowering entry barriers for new contributors.",
    tags: ["OPEN SOURCE", "DEVELOPER PRODUCTIVITY", "GITHUB ECOSYSTEM"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    isPlaceholder: false,
  },
  {
    id: "05",
    period: "[EDITABLE // UPCOMING MILESTONES]",
    title: "[HACKATHON / RECOGNITION PLACEHOLDER]",
    subtitle: "Competitions & Verified Honors",
    description: "Space reserved for verified hackathon wins, official recognitions, academic milestones, and production game launches as confirmed by Mayuresh.",
    tags: ["VERIFIED HONORS", "HACKATHONS", "MILESTONES"],
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
    isPlaceholder: true,
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
 * INITIAL PUBLIC PROJECTS: EMPTY BY SPECIFICATION
 * Non-negotiable requirement: Public project gallery starts empty.
 * Selected projects are managed and published exclusively through the Admin Dashboard.
 */
export const initialPublicProjects = [];
