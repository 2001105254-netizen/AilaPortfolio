import React, { useState } from 'react';
import { ContactFormData } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { Send, Mail, Phone, MapPin, CheckCircle2, Clock, MessageSquare, AlertCircle, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactSectionProps {
  onShowToast: (text: string, type?: 'success' | 'info') => void;
  prefillSubject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onShowToast, prefillSubject }) => {
  const { profile: developerProfile, submitContactForm } = usePortfolio();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: prefillSubject ? `Inquiry for ${prefillSubject}` : '',
    message: '',
    urgency: 'medium',
    inquiryType: prefillSubject ? 'Freelance Project' : 'General',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const presets = [
    {
      title: 'Hiring / Tech Role',
      type: 'Hiring / Job' as const,
      subject: 'Developer & Designer Opportunities Discussion',
      message: `Hi ${developerProfile.name}, I saw your portfolio and would like to discuss an opportunity on our design and development team.`,
    },
    {
      title: 'Freelance Design or App Project',
      type: 'Freelance Project' as const,
      subject: 'Graphic Design / Mobile & Web Project',
      message: `Hi ${developerProfile.name}, we are looking for a skilled designer and frontend developer for a web interface project. Let us connect!`,
    },
    {
      title: 'General Inquiry',
      type: 'General' as const,
      subject: 'Portfolio Inquiry & Tech Collaboration',
      message: `Hi ${developerProfile.name}, I enjoyed viewing your portfolio and had a quick question about your design and frontend work.`,
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setFormData((prev) => ({
      ...prev,
      inquiryType: preset.type,
      subject: preset.subject,
      message: preset.message,
    }));
    setErrors({});
    onShowToast(`Applied template: ${preset.title}`, 'info');
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a message subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message body';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      onShowToast('Please fix the highlighted fields before submitting', 'info');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContactForm(formData);
      setIsSubmitting(false);

      if (result.success) {
        setIsSubmitted(true);
        onShowToast(result.message || 'Your message has been sent successfully!', 'success');
      } else {
        setServerError(result.error || 'Could not send message. Please try again or email directly.');
        onShowToast('Failed to send message. Please check the details.', 'info');
      }
    } catch {
      setIsSubmitting(false);
      setServerError('An unexpected error occurred. Please contact via email directly.');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`${label} copied to clipboard!`, 'success');
  };

  return (
    <section id="contact" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Let's Build Something Together
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
            Have a project in mind, need custom graphic design or UI/UX work, or want to discuss frontend opportunities? Reach out below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          
          {/* Contact Details Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact Information
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Feel free to email or call directly. I typically respond within 24 hours on business days.
              </p>

              <div className="space-y-4">
                {/* Email Item */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Direct Email</div>
                      <a href={`mailto:${developerProfile.email}`} className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate block">
                        {developerProfile.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(developerProfile.email, 'Email')}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                    title="Copy email"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Phone Item */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Mobile Phone</div>
                      <a href={`tel:${developerProfile.phone}`} className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                        {developerProfile.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(developerProfile.phone, 'Phone number')}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                    title="Copy phone number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Location Item */}
                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Location</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {developerProfile.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Template Presets */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Quick Message Starters:</span>
                </div>
                <div className="flex flex-col gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="text-left px-3.5 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                    Thank you for reaching out, {formData.name}. Your inquiry has been transmitted directly to my inbox and dashboard. I'll get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        message: '',
                        urgency: 'medium',
                        inquiryType: 'General',
                      });
                    }}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Send Another Message</span>
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Send a Direct Inquiry
                  </h3>

                  {serverError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Juan Dela Cruz"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          errors.name ? 'border-rose-500 ring-rose-500/20' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      />
                      {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="juan@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          errors.email ? 'border-rose-500 ring-rose-500/20' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      />
                      {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Inquiry Type & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Inquiry Nature
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      >
                        <option value="Hiring / Job">Hiring / Full-time Role</option>
                        <option value="Freelance Project">Freelance Design or App Project</option>
                        <option value="General">General Inquiry / Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Project Inquiry / Role Discussion"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                          errors.subject ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      />
                      {errors.subject && <p className="text-[11px] text-rose-500 mt-1">{errors.subject}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your project requirements, scope, timeline or question here..."
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                        errors.message ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                      }`}
                    />
                    {errors.message && <p className="text-[11px] text-rose-500 mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all active:scale-[0.99] min-h-[44px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Transmitting to Server...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
