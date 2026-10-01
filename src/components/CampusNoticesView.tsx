import React, { useState } from 'react';
import {
  Bell,
  Search,
  FileText,
  Download,
  AlertTriangle,
  Calendar,
  Building,
  ExternalLink,
  Tag,
  CheckCircle,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { INITIAL_CAMPUS_NOTICES } from '../data/initialData';

export const CampusNoticesView: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<'All' | 'Exam' | 'Placement' | 'Academic' | 'Event'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: ('All' | 'Exam' | 'Placement' | 'Academic' | 'Event')[] = [
    'All',
    'Exam',
    'Placement',
    'Academic',
    'Event'
  ];

  const filteredNotices = INITIAL_CAMPUS_NOTICES.filter(not => {
    if (selectedCat !== 'All' && not.category !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        not.title.toLowerCase().includes(q) ||
        (not.titleMr && not.titleMr.includes(q)) ||
        not.content.toLowerCase().includes(q) ||
        not.department.toLowerCase().includes(q)
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
            <span className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">Official Administration &amp; University Cell</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>Academic Year 2025-26</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <Bell className="w-6 h-6" />
            </div>
            <span>Campus Digital Notice Board &amp; Circulars</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Mumbai University circulars, exam schedules, campus placement drives, and academic announcements.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl p-4 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circular or exam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-slate-50 dark:bg-[#070c18] text-xs text-slate-900 dark:text-white outline-hidden focus:ring-1 focus:ring-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <motion.div
            key={notice.id}
            whileHover={{ y: -2 }}
            className={`rounded-3xl p-5 sm:p-6 border transition-all space-y-3 relative overflow-hidden ${
              notice.isUrgent
                ? 'bg-gradient-to-br from-rose-50/60 via-white to-white dark:from-rose-950/20 dark:via-[#0b1329] dark:to-[#0b1329] border-rose-300 dark:border-rose-900/60 shadow-sm'
                : 'bg-white dark:bg-[#0b1329] border-slate-200 dark:border-indigo-900/60 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-indigo-950/60">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase tracking-wider ${
                  notice.category === 'Exam'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                    : notice.category === 'Placement'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800'
                }`}>
                  {notice.category}
                </span>

                {notice.isUrgent && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[9px] font-black uppercase tracking-wider animate-pulse">
                    MANDATORY
                  </span>
                )}

                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {notice.department}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                <span>Published: {notice.date}</span>
              </div>
            </div>

            {/* Title & Content */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {notice.title}
              </h3>
              {notice.titleMr && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {notice.titleMr}
                </p>
              )}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                {notice.content}
              </p>
            </div>

            {/* Footer & PDF Download */}
            {notice.fileAttachment && (
              <div className="pt-3 border-t border-slate-100 dark:border-indigo-950/60 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Attachment: {notice.fileAttachment}</span>
                </span>

                <button
                  onClick={() => alert(`Downloading official circular: ${notice.fileAttachment}`)}
                  className="py-1.5 px-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 font-bold text-xs flex items-center gap-1.5 border border-cyan-200 dark:border-cyan-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

    </div>
  );
};
