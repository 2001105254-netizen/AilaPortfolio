import {
  DeveloperProfile,
  Project,
  Experience,
  Education,
  SkillCategory,
  Certification,
  SocialLink,
  Service,
} from '../types';

export const developerProfile: DeveloperProfile = {
  name: 'Aila Marie B. Aleria',
  role: 'Graphic Designer | Frontend Developer | UI/UX Designer',
  tagline: 'Creating thoughtful brand visuals and intuitive digital experiences.',
  about: 'I am a multidisciplinary creative focused on graphic design, frontend development, and UI/UX design. This portfolio is a growing collection of my work, design process, and digital projects.',
  location: 'Philippines',
  availability: 'Available for Freelance & Creative Opportunities',
  email: 'aila.portfolio@example.com',
  phone: '',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://x.com',
  avatarUrl: '',
  yearsExperience: 0,
  projectsCompleted: 0,
  contributionsCount: 0,
};

export const socialLinks: SocialLink[] = [
  { id: 'email', name: 'Email', url: 'mailto:aila.portfolio@example.com', iconName: 'Mail', handle: 'Update in Admin' },
  { id: 'github', name: 'GitHub', url: 'https://github.com', iconName: 'Github', handle: 'Add GitHub profile' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com', iconName: 'Linkedin', handle: 'Add LinkedIn profile' },
];

export const servicesData: Service[] = [
  {
    id: 'service-graphic-design',
    title: 'Graphic Design',
    description: 'Creative visual design for digital and print materials, campaigns, and social content.',
    icon: 'Palette',
    features: ['Social media graphics', 'Marketing materials', 'Print-ready layouts'],
    deliverables: ['High-resolution assets', 'Web-ready graphics', 'Editable source files'],
  },
  {
    id: 'service-branding',
    title: 'Logo & Branding',
    description: 'Cohesive visual identities with logos, typography, color systems, and practical brand assets.',
    icon: 'Sparkles',
    features: ['Logo concepts', 'Color and typography systems', 'Brand presentation'],
    deliverables: ['Logo files', 'Brand guide', 'Social media kit'],
  },
  {
    id: 'service-frontend',
    title: 'Frontend Development',
    description: 'Responsive, accessible, and polished websites built from carefully designed interfaces.',
    icon: 'Code2',
    features: ['Responsive layouts', 'Reusable UI components', 'Modern web interactions'],
    deliverables: ['Production-ready frontend', 'Responsive implementation', 'Source code'],
  },
  {
    id: 'service-uiux',
    title: 'UI/UX Design',
    description: 'User-centered interfaces, wireframes, prototypes, and design systems for web and mobile products.',
    icon: 'Layout',
    features: ['User flows and wireframes', 'High-fidelity interfaces', 'Interactive prototypes'],
    deliverables: ['Figma design files', 'Clickable prototype', 'UI component library'],
  },
  {
    id: 'service-social-media',
    title: 'Social Media Design',
    description: 'Consistent and engaging visual content tailored for modern social platforms.',
    icon: 'Share2',
    features: ['Post and story layouts', 'Campaign visuals', 'Reusable templates'],
    deliverables: ['Platform-ready assets', 'Editable templates', 'Content design kit'],
  },
];

// Aila can add her real work from the protected Admin Dashboard.
export const projectsData: Project[] = [];

export const skillCategoriesData: SkillCategory[] = [
  {
    category: 'Design',
    skills: [
      { name: 'Graphic Design', level: 85, experienceYears: 'Portfolio skill', icon: 'Palette' },
      { name: 'UI/UX Design', level: 80, experienceYears: 'Portfolio skill', icon: 'Figma' },
      { name: 'Figma & Prototyping', level: 80, experienceYears: 'Portfolio skill', icon: 'Layout' },
      { name: 'Branding & Visual Identity', level: 80, experienceYears: 'Portfolio skill', icon: 'Award' },
    ],
  },
  {
    category: 'Frontend Development',
    skills: [
      { name: 'HTML & CSS', level: 85, experienceYears: 'Portfolio skill', icon: 'Code2' },
      { name: 'JavaScript', level: 75, experienceYears: 'Portfolio skill', icon: 'Terminal' },
      { name: 'React & TypeScript', level: 75, experienceYears: 'Portfolio skill', icon: 'Code2' },
      { name: 'Responsive Web Design', level: 85, experienceYears: 'Portfolio skill', icon: 'Layout' },
    ],
  },
];

// These start empty so no information from the original portfolio is shown.
export const experienceData: Experience[] = [];
export const educationData: Education[] = [];
export const certificationsData: Certification[] = [];
