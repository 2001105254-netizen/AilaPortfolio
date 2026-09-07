import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  User,
  Sparkles,
  Palette,
  Code2,
  Layers,
  GraduationCap,
  Award,
  CheckCircle2,
  Calendar,
  MapPin,
  Mail,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  const { profile, skills, education, certifications } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'skills' | 'education' | 'tools'>('skills');

  const creativeTools = [
    { name: 'Figma', role: 'UI/UX Design & Interactive Prototyping', category: 'UI/UX' },
    { name: 'Adobe Photoshop', role: 'Image Editing & Graphic Design', category: 'Design' },
    { name: 'Adobe Illustrator', role: 'Vector Art & Brand Design', category: 'Vector' },
    { name: 'Canva', role: 'Fast Visual Content & Layouts', category: 'Design' },
  ];

  const devTechStack = [
    { name: 'HTML5 & CSS3', role: 'Accessible, Responsive Web Interfaces', category: 'Frontend' },
    { name: 'JavaScript', role: 'Interactive Web Experiences', category: 'Frontend' },
    { name: 'React.js & TypeScript', role: 'Modern Responsive Web Apps', category: 'Frontend' },
    { name: 'Tailwind CSS', role: 'Rapid Responsive Styling', category: 'Styling' },
    { name: 'Git & GitHub', role: 'Version Control & Collaboration', category: 'Tools' },
    { name: 'Vite', role: 'Fast Frontend Development', category: 'Tools' }
  ];

  return (
    <section id="about-section" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-4">
            <User className="w-3.5 h-3.5" />
            <span>Graphic Designer • Frontend Developer • UI/UX Designer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            About Me & Skillset
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
            Combining visual creativity, user-centered thinking, and frontend development to build meaningful digital experiences.
          </p>
        </div>

        {/* Bento Grid: Story & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Main Story Card (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Turning ideas into polished visuals and intuitive digital products.
              </h3>
              
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                <p>
                  I'm <strong className="text-slate-900 dark:text-white font-semibold">{profile.name}</strong>, based in {profile.location}. My work focuses on graphic design, frontend development, and UI/UX design.
                </p>
                <p>
                  I enjoy shaping clear visual identities and designing interfaces that feel thoughtful, useful, and easy to navigate.
                </p>
                <p>
                  This portfolio will continue to grow as I add my latest creative work, frontend builds, and UI/UX case studies.
                </p>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{profile.yearsExperience}+ Years</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Creative Experience</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{profile.projectsCompleted}+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Completed Projects</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="text-2xl font-black text-emerald-500">Dual Edge</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Artistry + Engineering</div>
              </div>
            </div>
          </div>

          {/* Core Strengths Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-3xl p-8 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-5">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Creative Direction & Design</h4>
              <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed mb-4">
                Thoughtful visual identities, layouts, and graphics designed for clear communication across digital platforms.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-white/15 text-white">Figma</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/15 text-white">UI/UX</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/15 text-white">Illustrator</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/15 text-white">Photoshop</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex-1">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
                <Code2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Modern Frontend Development</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                Building responsive interfaces that translate design ideas into accessible and engaging web experiences.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">HTML & CSS</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">React & TypeScript</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">JavaScript</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Tailwind CSS</span>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Skills, Tools & Academic Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          {/* Tabs bar */}
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-5 mb-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'skills'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Proficiency Matrix
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'tools'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Software & Tech Stack
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'education'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Education & Certifications
            </button>
          </div>

          {/* Tab 1: Skills Matrix */}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skills.map((category) => (
                <div key={category.category} className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>{category.category}</span>
                  </h4>
                  <div className="space-y-3.5">
                    {category.skills.map((skill) => (
                      <div key={skill.name} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2">
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">{skill.name}</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{skill.level}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700/60 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Software & Tech Stack */}
          {activeTab === 'tools' && (
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Creative Software & Tools</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {creativeTools.map((tool) => (
                    <div key={tool.name} className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                      <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">{tool.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{tool.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Frontend Development Tools</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {devTechStack.map((tech) => (
                    <div key={tech.name} className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                      <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">{tech.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{tech.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Education & Certifications */}
          {activeTab === 'education' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Education */}
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-indigo-500" />
                  <span>Academic Journey</span>
                </h4>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{edu.degree}</div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                          {edu.period}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-3">{edu.institution} • {edu.location}</div>
                      {edu.honors && (
                        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                          {edu.honors}
                        </div>
                      )}
                      {edu.relevantCoursework && (
                        <div className="space-y-1 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                          <div className="text-[11px] font-bold uppercase text-slate-400">Core Coursework:</div>
                          {edu.relevantCoursework.map((course, i) => (
                            <div key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              <span>{course}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Certifications & Accreditations</span>
                </h4>
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">{cert.title}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                          Issuer: {cert.issuer} • Issued {cert.issueDate}
                        </div>
                        {cert.credentialId && (
                          <div className="text-[11px] font-mono text-slate-400">ID: {cert.credentialId}</div>
                        )}
                      </div>
                      {cert.verifyUrl && (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 transition-colors shrink-0"
                          title="Verify Credential"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
