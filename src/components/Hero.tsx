import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import profileAvatar from '../assets/aila-placeholder.svg';
import { ArrowRight, Mail, Github, Linkedin, Twitter, Sparkles, MapPin, CheckCircle2, Code, Layers, Zap, Palette } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onShowToast: (text: string, type?: 'success' | 'info') => void;
}

export const Hero: React.FC<HeroProps> = ({ onShowToast }) => {
  const { profile: developerProfile, socials: socialLinks } = usePortfolio();

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Github':
        return <Github className="w-4 h-4" />;
      case 'Linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'Twitter':
        return <Twitter className="w-4 h-4" />;
      case 'Mail':
        return <Mail className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(developerProfile.email);
    onShowToast('Email address copied to clipboard!', 'success');
  };

  return (
    <section id="about" className="pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden relative">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Hero Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{developerProfile.availability}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
              Hi, I'm{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500">
                {developerProfile.name}
              </span>
              .
              <br />
              <span className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-700 dark:text-slate-300">
                {developerProfile.role}
              </span>
            </h1>

            {/* Subtitle / Bio */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal">
              {developerProfile.tagline}
            </p>

            {/* Location & Email Details */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>{developerProfile.location}</span>
              </div>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
              <button
                onClick={copyEmailToClipboard}
                className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:underline"
                title="Click to copy email"
              >
                <Mail className="w-4 h-4 text-indigo-500" />
                <span>{developerProfile.email}</span>
              </button>
            </div>

            {/* Call To Actions */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto mb-10">
              <a
                href="#projects"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all active:scale-95 min-h-[44px]"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-indigo-500" />
                <span>Contact Me</span>
              </a>

              <a
                href="#services"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors min-h-[44px]"
              >
                <span>Services</span>
              </a>
            </div>

            {/* Social Icons Bar */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 w-full">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
                Connect:
              </span>
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
                  aria-label={social.name}
                  title={`${social.name} (${social.handle})`}
                >
                  {getSocialIcon(social.iconName)}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Profile Visual Card & Highlights */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col items-center lg:items-end"
          >
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-indigo-500/5">
              {/* Profile Image & Badge */}
              <div className="flex items-center gap-5 mb-6">
                <div className="relative shrink-0">
                  <img
                    src={developerProfile.avatarUrl || profileAvatar}
                    alt={developerProfile.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-md"
                    loading="eager"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {developerProfile.name}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                    Designer & Frontend Developer
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Graphic Design • UI/UX • Code
                  </p>
                </div>
              </div>

              {/* Quick Stat Counter Badges */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 font-extrabold text-xl sm:text-2xl">
                    <Zap className="w-4 h-4 inline" />
                    <span>{developerProfile.yearsExperience}+</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    Years Exp.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 font-extrabold text-xl sm:text-2xl">
                    <Layers className="w-4 h-4 inline" />
                    <span>{developerProfile.projectsCompleted}+</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    Works Done
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center justify-center gap-1 text-emerald-500 font-extrabold text-xl sm:text-2xl">
                    <CheckCircle2 className="w-4 h-4 inline" />
                    <span>100%</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    Dedication
                  </div>
                </div>
              </div>

              {/* Discipline Trio Badges */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Design</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>UI/UX</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                  <Code className="w-3.5 h-3.5" />
                  <span>Frontend</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
