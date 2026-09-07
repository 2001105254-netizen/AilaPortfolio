import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, GraduationCap, Award, Download, CheckCircle2, ChevronRight, FileText, Calendar, MapPin, Printer } from 'lucide-react';
import { motion } from 'motion/react';

interface ResumeSectionProps {
  onShowToast: (text: string, type?: 'success' | 'info') => void;
}

type TabType = 'experience' | 'skills' | 'education' | 'fullResume';

export const ResumeSection: React.FC<ResumeSectionProps> = ({ onShowToast }) => {
  const { experience, education, skills, certifications, profile } = usePortfolio();
  const [activeTab, setActiveTab] = useState<TabType>('experience');

  const handlePrint = () => {
    window.print();
    onShowToast('Opened print preview for resume', 'info');
  };

  const handleDownload = () => {
    onShowToast('Resume text generated and downloaded!', 'success');
    const element = document.createElement('a');
    const file = new Blob([
      `===================================================\n${profile.name.toUpperCase()} - ${profile.role}\n===================================================\nEmail: ${profile.email} | Phone: ${profile.phone}\nLocation: ${profile.location}\n\nPROFESSIONAL SUMMARY:\n${profile.about}\n\nWORK EXPERIENCE:\n` +
      experience.map(e => `• ${e.role} @ ${e.company} (${e.period})\n  ${e.description}\n  Responsibilities & Accomplishments:\n  ${e.achievements.map(a => `  - ${a}`).join('\n')}\n  Technologies: ${e.technologies.join(', ')}\n`).join('\n') +
      `\nEDUCATION:\n` +
      education.map(ed => `• ${ed.degree} - ${ed.institution} (${ed.period})`).join('\n') +
      `\n\nCERTIFICATIONS:\n` +
      certifications.map(c => `• ${c.title} (${c.issuer}, ${c.issueDate})`).join('\n')
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${profile.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section id="experience" className="py-20 sm:py-28 relative">
      <div id="resume" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career History & Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Experience & Credentials
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
            A comprehensive record of freelance client projects, development roles, academic focus, and verified credentials.
          </p>
        </div>

        {/* Tab Controls & Print / Download Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
                activeTab === 'experience'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Experience ({experience.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
                activeTab === 'education'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Education & Certs</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
                activeTab === 'skills'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Skills Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('fullResume')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
                activeTab === 'fullResume'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Full Resume View</span>
            </button>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              title="Print resume preview"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CV</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Experience Timeline / Cards */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            {experience.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-2">
                      {item.type || 'Experience'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {item.role}
                    </h3>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {item.company} • {item.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-center">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.period}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                  {item.description}
                </p>

                {/* Achievements Bullet List */}
                <div className="space-y-2 mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Deliverables & Responsibilities:
                  </div>
                  {item.achievements.map((ach, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tab 2: Education & Certifications */}
        {activeTab === 'education' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
                <span>Degrees & Academics</span>
              </h3>
              {education.map((edu) => (
                <div key={edu.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{edu.degree}</h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                      {edu.period}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">{edu.institution} • {edu.location}</div>
                  {edu.honors && (
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">{edu.honors}</div>
                  )}
                  {edu.relevantCoursework && (
                    <div className="space-y-1 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[11px] font-bold uppercase text-slate-400">Coursework:</div>
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

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Certifications</span>
              </h3>
              {certifications.map((cert) => (
                <div key={cert.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{cert.title}</h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {cert.issuer} • Issued {cert.issueDate}
                  </div>
                  {cert.credentialId && (
                    <div className="text-[11px] font-mono text-slate-400">ID: {cert.credentialId}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Skills Matrix */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((category) => (
              <div key={category.category} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{category.category}</h3>
                <div className="space-y-3">
                  {category.skills.map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        <span>{s.name}</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{s.level}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${s.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Full Printable Resume Card */}
        {activeTab === 'fullResume' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-4xl mx-auto">
            {/* Header */}
            <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-6 mb-8">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{profile.name}</h1>
              <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">{profile.role}</p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span>{profile.email}</span>
                <span>•</span>
                <span>{profile.phone}</span>
                <span>•</span>
                <span>{profile.location}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1 mb-2">Professional Summary</h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{profile.about}</p>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1 mb-4">Work Experience</h3>
              <div className="space-y-5">
                {experience.map((e) => (
                  <div key={e.id}>
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{e.role}</h4>
                      <span className="text-xs text-slate-500">{e.period}</span>
                    </div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">{e.company}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{e.description}</p>
                    <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      {e.achievements.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1 mb-3">Education & Credentials</h3>
              {education.map((ed) => (
                <div key={ed.id} className="text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white">{ed.degree}</span> — {ed.institution} ({ed.period})
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
