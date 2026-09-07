import React, { useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProjectGallery } from './components/ProjectGallery';
import { ServicesSection } from './components/ServicesSection';
import { ResumeSection } from './components/ResumeSection';
import { ContactSection } from './components/ContactSection';
import { SocialLinks } from './components/SocialLinks';
import { MobileQuickNav } from './components/MobileQuickNav';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';

function MainApp() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState<string | undefined>(undefined);
  const { isAdmin, currentRoute } = usePortfolio();

  const handleShowToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev.slice(-2), { id, text, type }]);
  }, []);

  const handleDismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSelectService = useCallback((serviceTitle: string) => {
    setSelectedServiceTitle(serviceTitle);
  }, []);

  // Route 1: Admin Routes (/admin)
  if (currentRoute.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        {isAdmin ? (
          <AdminDashboard onShowToast={handleShowToast} />
        ) : (
          <AdminLoginPage onShowToast={handleShowToast} />
        )}
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  // Route 2: Public Portfolio Site (/)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar onShowToast={handleShowToast} />

      {/* Main Content Flow */}
      <main id="main-content" className="relative z-10">
        {/* 1. Hero */}
        <Hero onShowToast={handleShowToast} />

        {/* 2. About Me Story & Highlights */}
        <AboutSection onShowToast={handleShowToast} />

        {/* 3. Featured Work & Project Gallery */}
        <ProjectGallery onShowToast={handleShowToast} />

        {/* 4. Services & Capabilities */}
        <ServicesSection onShowToast={handleShowToast} onSelectService={handleSelectService} />

        {/* 5. Experience Timeline & Resume Credentials */}
        <ResumeSection onShowToast={handleShowToast} />

        {/* 6. Contact & Inquiry Form */}
        <ContactSection onShowToast={handleShowToast} prefillSubject={selectedServiceTitle} />
      </main>

      {/* Footer & Social Profiles */}
      <SocialLinks onShowToast={handleShowToast} />

      {/* Mobile Sticky Quick Navigation */}
      <MobileQuickNav />

      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <MainApp />
      </PortfolioProvider>
    </ThemeProvider>
  );
}
