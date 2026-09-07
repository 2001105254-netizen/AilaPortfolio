import React, { useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import {
  X, Upload, Image as ImageIcon, Link as LinkIcon, Plus, Trash2,
  Check, Edit3, User, Globe, Code, RotateCcw, Camera, ExternalLink
} from 'lucide-react';

interface PortfolioEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const PortfolioEditorModal: React.FC<PortfolioEditorModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const { profile, projects, socials, updateProfile, updateProject, addProject, deleteProject, updateSocialLink, resetToDefaults } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'socials' | 'code'>('profile');

  // Selected project to edit
  const [editingProjectId, setEditingProjectId] = useState<string | null>(projects[0]?.id || null);

  // New project state
  const [isAddingNewProject, setIsAddingNewProject] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Mobile',
    tags: ['Figma', 'Frontend Development'],
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    featured: true,
    githubUrl: '',
    liveUrl: '',
    highlights: ['Created custom design and mobile interface'],
    metrics: 'Personal Project',
    completionDate: '2024'
  });

  const [copiedCode, setCopiedCode] = useState(false);

  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const newProjectFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle uploading local photo for profile picture
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onShowToast('Image file size should be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateProfile({ avatarUrl: reader.result });
          onShowToast('Profile picture updated successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle uploading local image for a project
  const handleProjectImageUpload = (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        onShowToast('Image file size should be less than 8MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateProject(projectId, { imageUrl: reader.result });
          onShowToast('Project photo updated successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle uploading local image for new project
  const handleNewProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewProject(prev => ({ ...prev, imageUrl: reader.result }));
          onShowToast('Image loaded for new project!', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentProject = projects.find(p => p.id === editingProjectId);

  const handleSaveNewProject = () => {
    if (!newProject.title?.trim()) {
      onShowToast('Please enter a project title', 'error');
      return;
    }
    addProject({
      title: newProject.title || 'Untitled Project',
      shortDescription: newProject.shortDescription || 'Short overview of the project',
      fullDescription: newProject.fullDescription || 'Detailed project description.',
      category: (newProject.category as any) || 'Mobile',
      tags: newProject.tags || ['Design', 'Development'],
      imageUrl: newProject.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      featured: true,
      githubUrl: newProject.githubUrl || '',
      liveUrl: newProject.liveUrl || '',
      highlights: newProject.highlights || ['Designed and built project visuals'],
      metrics: newProject.metrics || 'Recent Work',
      completionDate: newProject.completionDate || '2024'
    });
    setIsAddingNewProject(false);
    onShowToast('New project added to portfolio!', 'success');
  };

  const generateExportCode = () => {
    return `// Updated Portfolio Data export
export const developerProfile = ${JSON.stringify(profile, null, 2)};

export const projectsData = ${JSON.stringify(projects, null, 2)};

export const socialLinks = ${JSON.stringify(socials, null, 2)};
`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateExportCode());
    setCopiedCode(true);
    onShowToast('Portfolio code copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Portfolio Content & Media Manager
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload your picture, update project images, and edit links in real time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/50 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" /> Profile & Picture
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Project Photos & Links ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab('socials')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'socials'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" /> Contact & Social Links
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4" /> Export Data Code
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: PROFILE & PICTURE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Photo Upload */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 shadow-md"
                  />
                  <button
                    onClick={() => profileFileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Change Profile Picture"
                  >
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium">Upload</span>
                  </button>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Profile Avatar / Picture
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload a photo from your computer or enter a direct image URL.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start pt-1">
                    <input
                      type="file"
                      ref={profileFileInputRef}
                      onChange={handleProfileImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => profileFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Local Photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct Avatar URL Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Or Paste Profile Picture URL:
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={profile.avatarUrl}
                    onChange={(e) => updateProfile({ avatarUrl: e.target.value })}
                    placeholder="https://example.com/my-picture.jpg"
                    className="w-full px-3 py-2 pl-9 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Profile Details Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Title / Role</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => updateProfile({ role: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile({ email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => updateProfile({ phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">About / Bio</label>
                <textarea
                  rows={4}
                  value={profile.about}
                  onChange={(e) => updateProfile({ about: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PROJECT PHOTOS & LINKS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Manage Project Photos & Live Links
                </span>
                <button
                  onClick={() => setIsAddingNewProject(!isAddingNewProject)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> {isAddingNewProject ? 'Cancel Adding' : 'Add New Project'}
                </button>
              </div>

              {/* Add New Project Form */}
              {isAddingNewProject && (
                <div className="p-4 rounded-xl border-2 border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-4">
                  <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                    Add New Project / Design Work
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-700 dark:text-slate-300">Project Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Procreate Animated Promo"
                        value={newProject.title}
                        onChange={(e) => setNewProject(p => ({ ...p, title: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-700 dark:text-slate-300">Category</label>
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject(p => ({ ...p, category: e.target.value as any }))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      >
                        <option value="Mobile">Mobile</option>
                        <option value="Frontend">Frontend / Design</option>
                        <option value="Full Stack">Full Stack</option>
                        <option value="Cloud & DevOps">Cloud</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Upload for New Project */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-700 dark:text-slate-300">Upload Project Image / Photo</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={newProjectFileInputRef}
                        onChange={handleNewProjectImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => newProjectFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-medium flex items-center gap-1.5 text-slate-800 dark:text-slate-200"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload File
                      </button>
                      <input
                        type="url"
                        placeholder="Or paste image URL"
                        value={newProject.imageUrl}
                        onChange={(e) => setNewProject(p => ({ ...p, imageUrl: e.target.value }))}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    {newProject.imageUrl && (
                      <img src={newProject.imageUrl} alt="Preview" className="mt-2 h-20 rounded-lg object-cover border" />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-700 dark:text-slate-300">Live URL / Drive / Behance</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newProject.liveUrl}
                        onChange={(e) => setNewProject(p => ({ ...p, liveUrl: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-slate-700 dark:text-slate-300">GitHub Link (optional)</label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject(p => ({ ...p, githubUrl: e.target.value }))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-700 dark:text-slate-300">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Brief overview of what was created..."
                      value={newProject.shortDescription}
                      onChange={(e) => setNewProject(p => ({ ...p, shortDescription: e.target.value, fullDescription: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <button
                    onClick={handleSaveNewProject}
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" /> Save New Project to Portfolio
                  </button>
                </div>
              )}

              {/* Existing Projects List Selector */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5 md:col-span-1 max-h-80 overflow-y-auto pr-1">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => setEditingProjectId(proj.id)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                        editingProjectId === proj.id
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-900 dark:text-indigo-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate font-medium">{proj.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{proj.category}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Form for Selected Project */}
                <div className="md:col-span-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                  {currentProject ? (
                    <>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          Editing: {currentProject.title}
                        </h4>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${currentProject.title}"?`)) {
                              deleteProject(currentProject.id);
                              onShowToast('Project deleted', 'info');
                            }
                          }}
                          className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>

                      {/* Photo Upload Section */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Project Screenshot / Artwork Photo:
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3 items-start">
                          <img
                            src={currentProject.imageUrl}
                            alt={currentProject.title}
                            className="w-full sm:w-32 h-20 rounded-lg object-cover border border-slate-300 dark:border-slate-700"
                          />
                          <div className="flex-1 space-y-2 w-full">
                            <input
                              type="file"
                              ref={projectFileInputRef}
                              onChange={(e) => handleProjectImageUpload(currentProject.id, e)}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              onClick={() => projectFileInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                            >
                              <Upload className="w-3.5 h-3.5" /> Upload New Photo File
                            </button>
                            
                            <div className="relative">
                              <input
                                type="url"
                                value={currentProject.imageUrl}
                                onChange={(e) => updateProject(currentProject.id, { imageUrl: e.target.value })}
                                placeholder="https://..."
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Project Links */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Live Demo / Drive / Behance URL
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={currentProject.liveUrl || ''}
                              onChange={(e) => updateProject(currentProject.id, { liveUrl: e.target.value })}
                              placeholder="https://..."
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                            GitHub Code Repository URL
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={currentProject.githubUrl || ''}
                              onChange={(e) => updateProject(currentProject.id, { githubUrl: e.target.value })}
                              placeholder="https://github.com/..."
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Project Descriptions & Details */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                        <input
                          type="text"
                          value={currentProject.title}
                          onChange={(e) => updateProject(currentProject.id, { title: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Short Description</label>
                        <textarea
                          rows={2}
                          value={currentProject.shortDescription}
                          onChange={(e) => updateProject(currentProject.id, { shortDescription: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">
                      Select a project from the left list to edit details & photos.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & SOCIAL LINKS */}
          {activeTab === 'socials' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Update your contact details, social profiles, and work portfolio links:
              </p>

              {socials.map((s) => (
                <div key={s.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {s.name}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500">URL / Link Target</label>
                      <input
                        type="text"
                        value={s.url}
                        onChange={(e) => updateSocialLink(s.id, e.target.value, s.handle)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Display Handle / Text</label>
                      <input
                        type="text"
                        value={s.handle}
                        onChange={(e) => updateSocialLink(s.id, s.url, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: EXPORT DATA CODE */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs">
                ✨ All changes made in this editor are automatically saved and synchronized to the live cloud server so that any laptop, mobile device, or visitor immediately sees your updated pictures and projects. You can also copy your raw data backup below:
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-[11px] font-mono max-h-64 overflow-y-auto whitespace-pre-wrap">
                  {generateExportCode()}
                </pre>
                <button
                  onClick={handleCopyCode}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied!' : 'Copy Data Code'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => {
              if (confirm('Reset all portfolio data back to defaults?')) {
                resetToDefaults();
                onShowToast('Portfolio reset to defaults!', 'info');
              }
            }}
            className="text-xs text-slate-500 hover:text-rose-500 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Defaults
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-indigo-500/20"
          >
            Done Editing
          </button>
        </div>

      </div>
    </div>
  );
};
