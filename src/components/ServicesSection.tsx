import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Service } from '../types';
import {
  Palette,
  Sparkles,
  Code2,
  Smartphone,
  Layout,
  Film,
  Share2,
  ArrowRight,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesSectionProps {
  onSelectService?: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { services, navigateTo } = usePortfolio();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette':
        return <Palette className="w-6 h-6 text-indigo-500" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'Code2':
        return <Code2 className="w-6 h-6 text-sky-500" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-emerald-500" />;
      case 'Layout':
        return <Layout className="w-6 h-6 text-rose-500" />;
      case 'Film':
        return <Film className="w-6 h-6 text-purple-500" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-blue-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-indigo-500" />;
    }
  };

  const handleInquire = (service: Service) => {
    if (onSelectService) {
      onSelectService(service.title);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigateTo('/contact');
    }
  };

  return (
    <section id="services" className="py-20 sm:py-28 relative bg-slate-50/50 dark:bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Creative & Technical Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Services & Expertise
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
            Blending visual artistry and modern engineering to build brand identities, animated visuals, and functional web/mobile apps.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative flex flex-col justify-between p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300"
            >
              <div>
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xs">
                    {getServiceIcon(service.icon)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                  {service.description}
                </p>

                {/* Features Checklist */}
                {service.features && service.features.length > 0 && (
                  <div className="space-y-2.5 mb-6 pt-5 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Key Highlights:
                    </div>
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* Deliverables Badges */}
                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.deliverables.map((deliv, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {deliv}
                      </span>
                    ))}
                  </div>
                )}

                {/* Inquire CTA Button */}
                <button
                  onClick={() => handleInquire(service)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 dark:hover:bg-indigo-600 dark:hover:border-indigo-600 transition-all duration-200"
                >
                  <span>Inquire for {service.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
