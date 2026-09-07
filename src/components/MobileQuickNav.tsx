import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { User, Briefcase, Layers, FileText, Mail } from 'lucide-react';

export const MobileQuickNav: React.FC = () => {
  const { currentRoute } = usePortfolio();

  if (currentRoute.startsWith('/admin')) {
    return null;
  }

  const links = [
    { name: 'About', href: '#about', icon: User },
    { name: 'Work', href: '#projects', icon: Briefcase },
    { name: 'Services', href: '#services', icon: Layers },
    { name: 'Experience', href: '#experience', icon: FileText },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-1 shadow-xl flex items-center justify-around">
        {links.map((link) => {
          const IconComponent = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              className="flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl min-w-[44px] min-h-[44px] text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 transition-all"
            >
              <IconComponent className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-semibold">{link.name}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
};
