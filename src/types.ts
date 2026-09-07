export type ThemeMode = 'light' | 'dark' | 'system';

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  iconName: string;
  handle: string;
}

export type ProjectCategory = 
  | 'All'
  | 'Graphic Design'
  | 'Web Development'
  | 'Mobile Development'
  | 'UI/UX'
  | 'Video/Animation'
  | 'Branding';

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ProjectCategory | string;
  tags: string[];
  imageUrl: string;
  gallery?: string[];
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  highlights: string[];
  metrics?: string;
  completionDate: string;
  stars?: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: 'Full-time' | 'Contract' | 'Lead' | 'Remote' | string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  honors?: string;
  relevantCoursework: string[];
}

export interface SkillItem {
  id?: string;
  name: string;
  level: number; // 0-100
  experienceYears: string;
  icon?: string;
}

export interface SkillCategory {
  category: string;
  skills: SkillItem[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features?: string[];
  deliverables?: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  verifyUrl?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  urgency?: 'low' | 'medium' | 'high';
  inquiryType: 'Hiring / Job' | 'Freelance Project' | 'Consulting' | 'General' | string;
}

export interface ContactInquiry extends ContactFormData {
  id: string;
  date: string;
  read?: boolean;
}

export interface DeveloperProfile {
  name: string;
  role: string;
  tagline: string;
  about: string;
  location: string;
  availability: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  twitter: string;
  avatarUrl: string;
  yearsExperience: number;
  projectsCompleted: number;
  contributionsCount: number;
}

export interface AdminUser {
  email: string;
  role: 'admin';
  name?: string;
}
