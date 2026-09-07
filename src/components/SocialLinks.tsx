import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Github, Linkedin, Twitter, Mail, Globe, ArrowUp, Code2, Lock } from 'lucide-react';

interface SocialLinksProps {
  onShowToast: (text: string, type?: 'success' | 'info') => void;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ onShowToast }) => {
  const { profile: developerProfile, socials: socialLinks, navigateTo, isAdmin } = usePortfolio();

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
        return <Globe className="w-4 h-4" />;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onShowToast('Scrolled to top of page', 'info');
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-100 dark:border-slate-900">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                {developerProfile.name}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              {developerProfile.tagline}
            </p>
            <p className="text-xs text-slate-400">
              {developerProfile.location} • {developerProfile.email}
            </p>
          </div>

          {/* Quick Nav Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About Me
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Featured Projects
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Services & Capabilities
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Career Experience
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact Form
                </a>
              </li>
            </ul>
          </div>

          {/* Social Profiles Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Connect Directly
            </h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all text-xs font-semibold"
                >
                  {getSocialIcon(social.iconName)}
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Portal Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} {developerProfile.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

            {/* Discreet Admin Portal Link */}
            <button
              onClick={() => navigateTo('/admin')}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>{isAdmin ? 'Admin Dashboard' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
