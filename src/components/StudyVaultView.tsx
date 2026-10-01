import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Download,
  FileText,
  FlaskConical,
  Award,
  Layers,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { INITIAL_STUDY_MATERIALS } from '../data/initialData';

export const StudyVaultView: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'All' | 'QuestionPaper' | 'LabManual' | 'Notes'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const types: ('All' | 'QuestionPaper' | 'LabManual' | 'Notes')[] = [
    'All',
    'QuestionPaper',
    'LabManual',
    'Notes'
  ];

  const filteredMaterials = INITIAL_STUDY_MATERIALS.filter(m => {
    if (selectedType !== 'All' && m.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.subjectCode.toLowerCase().includes(q) ||
        m.facultyAuthor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-slate-500 font-medium">
            <span className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">BCOE Central Library &amp; Academic Repository</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>Mumbai University Scheme</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <span>Study Vault: MU Question Papers &amp; Lab Manuals</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Download previous 5 years university question papers, verified experiment lab manuals, and faculty notes.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="rounded-2xl p-4 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedType === t
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {t === 'QuestionPaper' ? 'MU Question Papers' : t === 'LabManual' ? 'Lab Manuals' : t}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ML, CN, Algorithm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-slate-50 dark:bg-[#070c18] text-xs text-slate-900 dark:text-white outline-hidden focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Material Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map((mat) => (
          <motion.div
            key={mat.id}
            whileHover={{ y: -2 }}
            className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-mono text-[10px] font-bold uppercase tracking-wider">
                  {mat.type}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {mat.fileSize} · PDF
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                {mat.title}
              </h3>

              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 space-y-1 font-mono">
                <div>Subject: <strong className="text-slate-800 dark:text-slate-200 font-sans">{mat.subject} ({mat.subjectCode})</strong></div>
                <div>Curriculum: {mat.yearOrSemester}</div>
                <div>Faculty In-Charge: <strong className="text-cyan-600 dark:text-cyan-400 font-sans">{mat.facultyAuthor}</strong></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-indigo-950 flex items-center justify-between">
              <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Syllabus 2026
              </span>

              <button
                onClick={() => alert(`Starting download for: ${mat.title} (${mat.fileSize})`)}
                className="py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/25 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
