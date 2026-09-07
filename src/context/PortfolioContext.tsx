import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DeveloperProfile,
  Project,
  Service,
  SkillCategory,
  Experience,
  Education,
  Certification,
  SocialLink,
  AdminUser,
  ContactFormData
} from '../types';
import {
  developerProfile as initialProfile,
  projectsData as initialProjects,
  servicesData as initialServices,
  skillCategoriesData as initialSkills,
  experienceData as initialExperience,
  educationData as initialEducation,
  certificationsData as initialCertifications,
  socialLinks as initialSocials
} from '../data/portfolioData';
import { portfolioFetch } from '../lib/api';

interface PortfolioContextType {
  profile: DeveloperProfile;
  projects: Project[];
  services: Service[];
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  socials: SocialLink[];
  
  // Auth state
  isAdmin: boolean;
  adminUser: AdminUser | null;
  adminToken: string | null;
  isLoading: boolean;
  
  // Navigation / Route state
  currentRoute: string;
  navigateTo: (route: string) => void;
  
  // Auth Actions
  loginAdmin: (credentials: { email?: string; password?: string; passcode?: string }) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  
  // CMS Update Actions (All backed by server API with bearer token)
  updateProfile: (updated: Partial<DeveloperProfile>) => Promise<boolean>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<boolean>;
  addProject: (newProject: Omit<Project, 'id'>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  updateServices: (services: Service[]) => Promise<boolean>;
  updateSkills: (skills: SkillCategory[]) => Promise<boolean>;
  updateExperience: (experience: Experience[]) => Promise<boolean>;
  updateSocialLink: (id: string, url: string, handle?: string) => Promise<boolean>;
  uploadMedia: (dataUrl: string, filename?: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  resetToDefaults: () => Promise<boolean>;
  
  // Public contact submission
  submitContactForm: (data: ContactFormData) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const TOKEN_STORAGE_KEY = 'aila_portfolio_admin_token_v1';
const PROJECTS_STORAGE_KEY = 'aila_portfolio_projects_data_v1';
const PROFILE_STORAGE_KEY = 'aila_portfolio_profile_data_v1';

const readBrowserRoute = () => {
  if (typeof window === 'undefined') return '/';
  return window.location.hash.startsWith('#/admin') ? '/admin' : '/';
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Router state
  const [currentRoute, setCurrentRoute] = useState<string>(readBrowserRoute);

  const navigateTo = useCallback((route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      const nextHash = route.startsWith('/admin') ? '#/admin' : '';
      window.history.pushState({}, '', `${import.meta.env.BASE_URL}${nextHash}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(readBrowserRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Portfolio Data States with instant LocalStorage backup
  const [profile, setProfile] = useState<DeveloperProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) return parsed;
      }
    } catch {}
    return initialProfile;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialProjects;
  });

  const [services, setServices] = useState<Service[]>(initialServices);
  const [skills, setSkills] = useState<SkillCategory[]>(initialSkills);
  const [experience, setExperience] = useState<Experience[]>(initialExperience);
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [socials, setSocials] = useState<SocialLink[]>(initialSocials);

  // Helper to persist projects safely
  const saveProjectsToStorage = useCallback((items: Project[]) => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, []);

  // 1. Initial Load: Fetch shared portfolio data from server
  useEffect(() => {
    let isMounted = true;
    const fetchSharedPortfolio = async () => {
      try {
        const response = await portfolioFetch('/api/portfolio');
        if (response.ok) {
          const data = await response.json();
          if (isMounted && data.success) {
            if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
              setProjects(data.projects);
              saveProjectsToStorage(data.projects);
            }

            if (data.profile) setProfile(data.profile);

            if (data.services) setServices(data.services);
            if (data.skills) setSkills(data.skills);
            if (data.experience) setExperience(data.experience);
            if (data.education) setEducation(data.education);
            if (data.certifications) setCertifications(data.certifications);
            if (data.socials) setSocials(data.socials);
          }
        }
      } catch (err) {
        console.warn('Portfolio fetch error, using local/initial data:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSharedPortfolio();
    return () => { isMounted = false; };
  }, [saveProjectsToStorage]);

  // 2. Initial Auth Verification with server
  useEffect(() => {
    let isMounted = true;
    const verifyToken = async () => {
      const token = adminToken || localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) {
        setIsAdmin(false);
        setAdminUser(null);
        return;
      }

      try {
        const res = await portfolioFetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && data.authenticated) {
            setIsAdmin(true);
            setAdminUser(data.user);
            return;
          }
        }
        // If token invalid, remove it
        if (isMounted) {
          setIsAdmin(false);
          setAdminUser(null);
          setAdminToken(null);
          try { localStorage.removeItem(TOKEN_STORAGE_KEY); } catch {}
        }
      } catch (err) {
        console.warn('Auth verification network error:', err);
      }
    };

    verifyToken();
    return () => { isMounted = false; };
  }, [adminToken]);

  // Auth: Login Admin
  const loginAdmin = async (credentials: { email?: string; password?: string; passcode?: string }) => {
    try {
      const res = await portfolioFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        const seedResponse = await portfolioFetch('/api/admin/portfolio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`
          },
          body: JSON.stringify({ profile, projects, services, skills, experience, education, certifications, socials })
        });
        if (!seedResponse.ok) {
          const seedData = await seedResponse.json().catch(() => ({}));
          return { success: false, error: seedData.error || 'Supabase setup is incomplete. Run setup.sql first.' };
        }
        setAdminToken(data.token);
        setIsAdmin(true);
        setAdminUser(data.user);
        try { localStorage.setItem(TOKEN_STORAGE_KEY, data.token); } catch {}
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network connection failed' };
    }
  };

  // Auth: Logout Admin
  const logoutAdmin = async () => {
    const token = adminToken;
    try {
      if (token) {
        await portfolioFetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch {}
    setIsAdmin(false);
    setAdminUser(null);
    setAdminToken(null);
    try { localStorage.removeItem(TOKEN_STORAGE_KEY); } catch {}
    navigateTo('/');
  };

  // Generic helper for authorized server mutations
  const authorizedPost = async (endpoint: string, body: any) => {
    if (!adminToken) return false;
    try {
      const res = await portfolioFetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(body)
      });
      return res.ok;
    } catch (err) {
      console.warn(`Error posting to ${endpoint}:`, err);
      return false;
    }
  };

  // CMS: Update Profile
  const updateProfile = async (updated: Partial<DeveloperProfile>): Promise<boolean> => {
    const next = { ...profile, ...updated };
    setProfile(next);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    return await authorizedPost('/api/admin/portfolio', { profile: next });
  };

  // CMS: Update Project
  const updateProject = async (id: string, updated: Partial<Project>): Promise<boolean> => {
    const next = projects.map(p => (p.id === id ? { ...p, ...updated } : p));
    setProjects(next);
    saveProjectsToStorage(next);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
      const res = await portfolioFetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updated)
      });
      return res.ok;
    } catch (err) {
      console.warn('Error updating project on server:', err);
      return false;
    }
  };

  // CMS: Add Project
  const addProject = async (newProjectData: Omit<Project, 'id'>): Promise<boolean> => {
    const newId = 'proj-' + Date.now();
    const newProject: Project = {
      ...newProjectData,
      id: (newProjectData as any).id || newId,
      stars: newProjectData.stars || 0,
      completionDate: newProjectData.completionDate || new Date().getFullYear().toString()
    };

    const next = [newProject, ...projects];
    setProjects(next);
    saveProjectsToStorage(next);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
      const res = await portfolioFetch('/api/admin/projects', {
        method: 'POST',
        headers,
        body: JSON.stringify(newProject)
      });
      return res.ok;
    } catch (err) {
      console.warn('Error saving new project to server:', err);
      return false;
    }
  };

  // CMS: Delete Project
  const deleteProject = async (id: string): Promise<boolean> => {
    const next = projects.filter(p => p.id !== id);
    setProjects(next);
    saveProjectsToStorage(next);

    try {
      const headers: Record<string, string> = {};
      if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
      const res = await portfolioFetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers
      });
      return res.ok;
    } catch (err) {
      console.warn('Error deleting project from server:', err);
      return false;
    }
  };

  // CMS: Update Services
  const updateServices = async (newServices: Service[]): Promise<boolean> => {
    setServices(newServices);
    return await authorizedPost('/api/admin/portfolio', { services: newServices });
  };

  // CMS: Update Skills
  const updateSkills = async (newSkills: SkillCategory[]): Promise<boolean> => {
    setSkills(newSkills);
    return await authorizedPost('/api/admin/portfolio', { skills: newSkills });
  };

  // CMS: Update Experience
  const updateExperience = async (newExperience: Experience[]): Promise<boolean> => {
    setExperience(newExperience);
    return await authorizedPost('/api/admin/portfolio', { experience: newExperience });
  };

  // CMS: Update Social Link
  const updateSocialLink = async (id: string, url: string, handle?: string): Promise<boolean> => {
    const next = socials.map(s => (s.id === id ? { ...s, url, handle: handle || url } : s));
    setSocials(next);
    return await authorizedPost('/api/admin/portfolio', { socials: next });
  };

  // Media Upload
  const uploadMedia = async (dataUrl: string, filename?: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (!adminToken) return { success: false, error: 'Unauthorized: Admin authentication required' };
    try {
      const res = await portfolioFetch('/api/admin/media/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ dataUrl, filename })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, url: data.url };
      }
      return { success: false, error: data.error || 'Upload failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Upload error' };
    }
  };

  // Reset to Defaults
  const resetToDefaults = async (): Promise<boolean> => {
    try {
      localStorage.removeItem(PROJECTS_STORAGE_KEY);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch {}

    setProfile(initialProfile);
    setProjects(initialProjects);
    setServices(initialServices);
    setSkills(initialSkills);
    setExperience(initialExperience);
    setEducation(initialEducation);
    setCertifications(initialCertifications);
    setSocials(initialSocials);

    try {
      const headers: Record<string, string> = {};
      if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
      await portfolioFetch('/api/admin/reset', {
        method: 'POST',
        headers
      });
      return true;
    } catch {
      return true;
    }
  };

  // Public Contact Submission
  const submitContactForm = async (formData: ContactFormData): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await portfolioFetch('/api/portfolio/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to submit contact form' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        projects,
        services,
        skills,
        experience,
        education,
        certifications,
        socials,
        isAdmin,
        adminUser,
        adminToken,
        isLoading,
        currentRoute,
        navigateTo,
        loginAdmin,
        logoutAdmin,
        updateProfile,
        updateProject,
        addProject,
        deleteProject,
        updateServices,
        updateSkills,
        updateExperience,
        updateSocialLink,
        uploadMedia,
        resetToDefaults,
        submitContactForm
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
