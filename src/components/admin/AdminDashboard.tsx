import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { portfolioFetch } from '../../lib/api';
import profileAvatar from '../../assets/aila-placeholder.svg';
import { Project, Service, SkillCategory, Experience } from '../../types';
import {
  LayoutDashboard,
  FolderKanban,
  User,
  Briefcase,
  Layers,
  Award,
  Inbox,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  RefreshCw,
  Eye,
  FileDown,
  Images,
  Image as ImageIcon,
  Star,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  onShowToast: (text: string, type?: 'success' | 'info') => void;
}

type AdminTab = 'projects' | 'profile' | 'services' | 'skills' | 'experience' | 'inquiries' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onShowToast }) => {
  const {
    profile,
    projects,
    services,
    skills,
    experience,
    adminUser,
    logoutAdmin,
    navigateTo,
    updateProfile,
    updateProject,
    addProject,
    deleteProject,
    updateServices,
    updateSkills,
    updateExperience,
    uploadMedia,
    resetToDefaults,
    adminToken
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState(profile);
  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  // Project Modal Editor State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Graphic Design',
    tags: [],
    imageUrl: '',
    gallery: [],
    liveUrl: '',
    githubUrl: '',
    highlights: [],
    metrics: '',
    completionDate: new Date().getFullYear().toString()
  });
  const [tagInput, setTagInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  // Contact Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);

  // Security Form State
  const [newPassword, setNewPassword] = useState('');
  const [newPin, setNewPin] = useState('');

  // Fetch contact inquiries when switching to inquiries tab
  const fetchInquiries = async () => {
    if (!adminToken) return;
    setIsLoadingInquiries(true);
    try {
      const res = await portfolioFetch('/api/admin/inquiries', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch {
      onShowToast('Could not load inquiries', 'info');
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inquiries') {
      fetchInquiries();
    }
  }, [activeTab]);

  const handleDeleteInquiry = async (id: string) => {
    if (!adminToken) return;
    try {
      const res = await portfolioFetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setInquiries(prev => prev.filter(i => i.id !== id));
        onShowToast('Inquiry removed', 'success');
      }
    } catch {
      onShowToast('Failed to delete inquiry', 'info');
    }
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await updateProfile(profileForm);
    setIsSaving(false);
    if (success) {
      onShowToast('Profile details updated and saved to server database!', 'success');
    } else {
      onShowToast('Failed to save profile changes', 'info');
    }
  };

  // Avatar Upload Handler
  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const res = await uploadMedia(base64, file.name);
      if (res.success && res.url) {
        setProfileForm(prev => ({ ...prev, avatarUrl: res.url! }));
        await updateProfile({ avatarUrl: res.url });
        onShowToast('Profile picture uploaded and saved!', 'success');
      } else {
        onShowToast('Upload failed: ' + (res.error || 'Server error'), 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  // Project Modal Openers
  const openNewProjectModal = () => {
    setEditingProject(null);
    const defaultImage = 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80';
    setProjectForm({
      title: '',
      shortDescription: '',
      fullDescription: '',
      category: 'Graphic Design',
      tags: ['Design', 'Vector'],
      imageUrl: defaultImage,
      gallery: [
        defaultImage,
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1200&q=80'
      ],
      liveUrl: '',
      githubUrl: '',
      highlights: ['Created custom design and visual layouts'],
      metrics: 'Design Project',
      completionDate: new Date().getFullYear().toString()
    });
    setNewPhotoUrl('');
    setTagInput('');
    setHighlightInput('');
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: Project) => {
    setEditingProject(proj);
    const existingGallery = (proj.gallery && proj.gallery.length > 0)
      ? [...proj.gallery]
      : (proj.imageUrl ? [proj.imageUrl] : []);

    setProjectForm({
      ...proj,
      gallery: existingGallery,
      imageUrl: proj.imageUrl || existingGallery[0] || ''
    });
    setNewPhotoUrl('');
    setTagInput('');
    setHighlightInput('');
    setIsProjectModalOpen(true);
  };

  // Upload multiple images at once
  const handleMultipleImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhotos(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const res = await uploadMedia(base64, file.name);
        if (res.success && res.url) {
          uploadedUrls.push(res.url);
        } else {
          uploadedUrls.push(base64);
        }
      } catch (err) {
        console.warn('Failed to process image file:', file.name, err);
      }
    }

    setIsUploadingPhotos(false);

    if (uploadedUrls.length > 0) {
      setProjectForm(prev => {
        const currentGallery = prev.gallery ? [...prev.gallery] : (prev.imageUrl ? [prev.imageUrl] : []);
        const nextGallery = [...currentGallery, ...uploadedUrls];
        return {
          ...prev,
          gallery: nextGallery,
          imageUrl: prev.imageUrl || nextGallery[0]
        };
      });
      onShowToast(`Added ${uploadedUrls.length} photo${uploadedUrls.length > 1 ? 's' : ''} to gallery!`, 'success');
    }
    e.target.value = '';
  };

  // Add photo by URL
  const handleAddPhotoUrl = () => {
    const trimmed = newPhotoUrl.trim();
    if (!trimmed) return;

    setProjectForm(prev => {
      const currentGallery = prev.gallery ? [...prev.gallery] : (prev.imageUrl ? [prev.imageUrl] : []);
      const nextGallery = [...currentGallery, trimmed];
      return {
        ...prev,
        gallery: nextGallery,
        imageUrl: prev.imageUrl || nextGallery[0]
      };
    });
    setNewPhotoUrl('');
    onShowToast('Photo added to gallery', 'success');
  };

  // Set photo at index as cover photo
  const handleSetCoverPhoto = (index: number) => {
    setProjectForm(prev => {
      const currentGallery = prev.gallery ? [...prev.gallery] : [];
      if (index < 0 || index >= currentGallery.length) return prev;
      const targetPhoto = currentGallery[index];
      const remaining = currentGallery.filter((_, i) => i !== index);
      const nextGallery = [targetPhoto, ...remaining];
      return {
        ...prev,
        gallery: nextGallery,
        imageUrl: targetPhoto
      };
    });
    onShowToast('Set as main cover photo!', 'success');
  };

  // Move photo left/right in gallery
  const handleMovePhoto = (index: number, direction: 'left' | 'right') => {
    setProjectForm(prev => {
      const currentGallery = prev.gallery ? [...prev.gallery] : [];
      const newIndex = direction === 'left' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= currentGallery.length) return prev;

      const item = currentGallery[index];
      currentGallery[index] = currentGallery[newIndex];
      currentGallery[newIndex] = item;

      return {
        ...prev,
        gallery: [...currentGallery],
        imageUrl: currentGallery[0]
      };
    });
  };

  // Remove photo from gallery
  const handleRemovePhoto = (index: number) => {
    setProjectForm(prev => {
      const currentGallery = prev.gallery ? [...prev.gallery] : [];
      const nextGallery = currentGallery.filter((_, i) => i !== index);
      const nextCover = nextGallery.length > 0 ? nextGallery[0] : '';
      return {
        ...prev,
        gallery: nextGallery,
        imageUrl: nextCover
      };
    });
    onShowToast('Photo removed from project', 'info');
  };

  // Project Save
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.shortDescription) {
      onShowToast('Title and short description are required', 'info');
      return;
    }

    const finalGallery = projectForm.gallery && projectForm.gallery.length > 0
      ? projectForm.gallery
      : (projectForm.imageUrl ? [projectForm.imageUrl] : []);

    const finalImageUrl = finalGallery[0] || projectForm.imageUrl || '';

    const payload: Partial<Project> = {
      ...projectForm,
      gallery: finalGallery,
      imageUrl: finalImageUrl
    };

    setIsSaving(true);
    if (editingProject) {
      const success = await updateProject(editingProject.id, payload);
      setIsSaving(false);
      if (success) {
        onShowToast('Project updated with all photos!', 'success');
        setIsProjectModalOpen(false);
      } else {
        onShowToast('Failed to update project', 'info');
      }
    } else {
      const success = await addProject(payload as Omit<Project, 'id'>);
      setIsSaving(false);
      if (success) {
        onShowToast('New project created with all photos!', 'success');
        setIsProjectModalOpen(false);
      } else {
        onShowToast('Failed to create project', 'info');
      }
    }
  };

  // Project Delete
  const handleDeleteProject = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      const success = await deleteProject(id);
      if (success) {
        onShowToast('Project deleted', 'success');
      } else {
        onShowToast('Failed to delete project', 'info');
      }
    }
  };

  // Security update
  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    try {
      const res = await portfolioFetch('/api/auth/change-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          newPassword: newPassword || undefined,
          newPin: newPin || undefined
        })
      });
      if (res.ok) {
        onShowToast('Admin credentials updated successfully!', 'success');
        setNewPassword('');
        setNewPin('');
      } else {
        onShowToast('Failed to update credentials', 'info');
      }
    } catch {
      onShowToast('Network error updating credentials', 'info');
    }
  };

  // Reset to original data
  const handleResetToDefaults = async () => {
    if (window.confirm('Warning: This will reset all portfolio data back to original defaults. Are you sure?')) {
      const ok = await resetToDefaults();
      if (ok) {
        onShowToast('Portfolio reset to original state', 'success');
      } else {
        onShowToast('Reset failed', 'info');
      }
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      profile,
      projects,
      services,
      skills,
      experience,
      exportedAt: new Date().toISOString()
    };
    const element = document.createElement('a');
    element.href = URL.createObjectURL(new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' }));
    element.download = `Portfolio_Backup_${Date.now()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast('Database backup exported!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            H
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Admin Control Center</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Server Verified
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Logged in as {adminUser?.email || 'portfolio owner'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigateTo('/')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors"
            title="Log out and revoke session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        
        {/* Navigation Sidebar */}
        <nav className="w-full md:w-60 shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap text-left ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap text-left ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Bio</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap text-left ${
              activeTab === 'services'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Services ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap text-left ${
              activeTab === 'skills'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Skills Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap text-left ${
              activeTab === 'experience'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Work & History</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap text-left ${
              activeTab === 'inquiries'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap text-left ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Security & Data</span>
          </button>
        </nav>

        {/* Tab Content Panel */}
        <main className="flex-1 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 overflow-hidden">
          
          {/* 1. PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Portfolio Projects</h2>
                  <p className="text-xs text-slate-400">Manage, edit, delete, and add new projects across all categories.</p>
                </div>
                <button
                  onClick={openNewProjectModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex gap-4 items-start">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400">
                          {proj.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditProjectModal(proj)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            title="Edit project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProjectToDelete({ id: proj.id, title: proj.title })}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-sm truncate mt-1">{proj.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{proj.shortDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. PROFILE & BIO TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Profile & Bio Information</h2>
                  <p className="text-xs text-slate-400">Update your public name, tagline, bio story, and avatar picture.</p>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>

              {/* Avatar Upload */}
              <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <img
                  src={profileForm.avatarUrl || profileAvatar}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Profile Photo</h4>
                  <p className="text-xs text-slate-400 mb-3">Upload a new headshot or photo file to display across the site.</p>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Picture</span>
                    <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Role</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Headline Tagline</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">About Narrative</label>
                <textarea
                  rows={4}
                  value={profileForm.about}
                  onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm"
                  />
                </div>
              </div>
            </form>
          )}

          {/* 3. SERVICES TAB */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Services Offered</h2>
                  <p className="text-xs text-slate-400">Manage client services, deliverable offerings, and feature lists.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((svc, idx) => (
                  <div key={svc.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{svc.title}</h4>
                      <span className="text-[10px] text-indigo-400 font-mono">#{idx + 1}</span>
                    </div>
                    <p className="text-xs text-slate-400">{svc.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {svc.deliverables?.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">Skills Matrix</h2>
                <p className="text-xs text-slate-400">View and fine-tune your core technical and creative skill proficiency percentages.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((cat) => (
                  <div key={cat.category} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <h3 className="font-bold text-sm text-indigo-400">{cat.category}</h3>
                    <div className="space-y-3">
                      {cat.skills.map((s) => (
                        <div key={s.name}>
                          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                            <span>{s.name}</span>
                            <span className="text-indigo-400">{s.level}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${s.level}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. WORK EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">Career Experience</h2>
                <p className="text-xs text-slate-400">Manage roles, clients, time periods, and accomplishments.</p>
              </div>

              <div className="space-y-4">
                {experience.map((e) => (
                  <div key={e.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-base">{e.role}</h4>
                        <p className="text-xs text-indigo-400 font-semibold">{e.company} • {e.location}</p>
                      </div>
                      <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-1 rounded-md">
                        {e.period}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{e.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. INQUIRIES TAB */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Contact Form Inquiries</h2>
                  <p className="text-xs text-slate-400">Messages and project proposals submitted by visitors.</p>
                </div>
                <button
                  onClick={fetchInquiries}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Refresh Inquiries"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingInquiries ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No inquiries received yet. When visitors send messages via the Contact section, they will appear here!
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-sm">{inq.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                              {inq.inquiryType}
                            </span>
                          </div>
                          <a href={`mailto:${inq.email}`} className="text-xs text-indigo-400 hover:underline">
                            {inq.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 font-mono">
                            {new Date(inq.date).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-slate-200">
                        Subject: {inq.subject}
                      </div>

                      <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                        {inq.message}
                      </p>

                      <a
                        href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:underline pt-1"
                      >
                        <span>Reply via Email</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 7. SETTINGS & SECURITY TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="pb-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">Security & Data Management</h2>
                <p className="text-xs text-slate-400">Manage credentials in Render, download backups, or reset portfolio content.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 max-w-md">
                <h3 className="text-sm font-bold text-white">Admin Credentials</h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  For security, change your admin email, password, or PIN in Render Environment settings. They are never stored in the portfolio files.
                </p>
              </div>

              {/* Backup & Reset actions */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Data Maintenance</h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleExportBackup}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <FileDown className="w-4 h-4 text-indigo-400" />
                    <span>Download JSON Backup</span>
                  </button>

                  <button
                    onClick={handleResetToDefaults}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-rose-400" />
                    <span>Reset Portfolio to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Project Add / Edit Modal Drawer */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 my-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g., Brand Identity or Website Redesign"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm"
                  >
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Video/Animation">Video/Animation</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Completion Year / Date</label>
                  <input
                    type="text"
                    value={projectForm.completionDate}
                    onChange={(e) => setProjectForm({ ...projectForm, completionDate: e.target.value })}
                    placeholder="2024"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Project Photos & Gallery Manager (3+ photos) */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Images className="w-4 h-4 text-indigo-400" />
                      <label className="text-xs font-bold text-white uppercase tracking-wider">
                        Project Showcase Photos & Gallery
                      </label>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {projectForm.gallery?.length || 0} photo{projectForm.gallery?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Add 3 or more photos (finished designs, mockups, variations) for clients to browse.
                    </p>
                  </div>

                  {/* Actions to Add Photos */}
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingPhotos ? 'Uploading...' : 'Upload 3+ Photos'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultipleImageFiles}
                        disabled={isUploadingPhotos}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Add Photo by URL */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddPhotoUrl();
                        }
                      }}
                      placeholder="Or paste an image URL (e.g. https://...)"
                      className="w-full pl-3 pr-2 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    disabled={!newPhotoUrl.trim()}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-semibold transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {/* Guidance Tip */}
                {(projectForm.gallery?.length || 0) < 3 ? (
                  <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>You have {projectForm.gallery?.length || 0} photo{projectForm.gallery?.length === 1 ? '' : 's'}. We recommend adding at least 3 photos so clients can view full design details!</span>
                  </div>
                ) : (
                  <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>Great presentation! You have {projectForm.gallery?.length} design photos ready for clients.</span>
                  </div>
                )}

                {/* Photos Grid with Reordering & Cover Badge */}
                {projectForm.gallery && projectForm.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                    {projectForm.gallery.map((photoUrl, idx) => {
                      const isCover = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`group relative rounded-xl overflow-hidden border bg-slate-900 transition-all ${
                            isCover ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                            <img
                              src={photoUrl}
                              alt={`Photo ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Badges */}
                            <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                              {isCover ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-600 text-[10px] font-bold text-white shadow">
                                  <Star className="w-2.5 h-2.5 fill-current" /> Cover
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-medium text-slate-300 border border-white/10">
                                  #{idx + 1}
                                </span>
                              )}
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600/90 text-white hover:bg-rose-500 transition-colors shadow opacity-90 hover:opacity-100"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Action Footer */}
                          <div className="p-1.5 bg-slate-950 flex items-center justify-between gap-1 text-[11px]">
                            {!isCover ? (
                              <button
                                type="button"
                                onClick={() => handleSetCoverPhoto(idx)}
                                className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors truncate"
                                title="Make this the primary cover photo"
                              >
                                Set Cover
                              </button>
                            ) : (
                              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
                                Main
                              </span>
                            )}

                            {/* Reorder Buttons */}
                            <div className="flex items-center gap-0.5 ml-auto">
                              <button
                                type="button"
                                onClick={() => handleMovePhoto(idx, 'left')}
                                disabled={idx === 0}
                                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent"
                                title="Move earlier"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMovePhoto(idx, 'right')}
                                disabled={idx === projectForm.gallery.length - 1}
                                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent"
                                title="Move later"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 font-medium">No photos attached yet</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Upload 3 or more photos or paste image links above</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description (for card)</label>
                <textarea
                  rows={2}
                  value={projectForm.shortDescription}
                  onChange={(e) => setProjectForm({ ...projectForm, shortDescription: e.target.value })}
                  placeholder="Summary of the project for the gallery card"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description (for modal)</label>
                <textarea
                  rows={4}
                  value={projectForm.fullDescription}
                  onChange={(e) => setProjectForm({ ...projectForm, fullDescription: e.target.value })}
                  placeholder="Comprehensive case study overview"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo / View URL</label>
                  <input
                    type="url"
                    value={projectForm.liveUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL (optional)</label>
                  <input
                    type="url"
                    value={projectForm.githubUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={projectForm.tags?.join(', ') || ''}
                  onChange={(e) => setProjectForm({
                    ...projectForm,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="Figma, React, Branding, Tailwind CSS"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingProject ? 'Update Project' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Dialog */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Project</h3>
                <p className="text-xs text-slate-400">Permanently remove from portfolio</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-white">"{projectToDelete.title}"</span>? All project details and media will be removed.
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const target = projectToDelete;
                  setProjectToDelete(null);
                  const success = await deleteProject(target.id);
                  if (success) {
                    onShowToast(`"${target.title}" was deleted`, 'success');
                  } else {
                    onShowToast('Could not delete project', 'info');
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
