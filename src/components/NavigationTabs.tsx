import React, { useState, useRef } from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Users,
  Award,
  AlertTriangle,
  FileSpreadsheet,
  Sparkles,
  Utensils,
  Bell,
  BookOpen,
  Building2,
  BookMarked,
  CalendarDays,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Compass,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAttendance } from '../context/AttendanceContext';

export type TabType =
  | 'campus-hub'
  | '3d-campus'
  | 'canteen'
  | 'notices'
  | 'events'
  | 'study-vault'
  | 'dashboard'
  | 'prediction'
  | 'teaching-diary'
  | 'leave-proxy'
  | 'mentorship'
  | 'timetable'
  | 'mark-attendance'
  | 'students'
  | 'exams'
  | 'defaulters'
  | 'reports'
  | 'ai-insights';

interface NavigationTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

type TabCategory = 'all' | 'faculty' | 'campus';

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  const { defaultersList, activeClassTimeTable } = useAttendance();
  const [selectedCategory, setSelectedCategory] = useState<TabCategory>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tabs: {
    id: TabType;
    label: string;
    category: 'faculty' | 'campus';
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    // 3D Campus Experience
    {
      id: '3d-campus',
      label: '3D Campus View',
      category: 'campus',
      icon: <Boxes className="w-4 h-4 text-cyan-400 animate-pulse" />,
      badge: '3D WebGL',
      badgeColor: 'text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950 font-mono font-bold'
    },
    // Campus Hub
    {
      id: 'campus-hub',
      label: 'Campus Hub',
      category: 'campus',
      icon: <Building2 className="w-4 h-4 text-cyan-500" />,
      badge: 'BCOE',
      badgeColor: 'text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950 font-mono font-bold'
    },
    // Faculty ERP Dashboard
    {
      id: 'dashboard',
      label: 'Faculty ERP',
      category: 'faculty',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    // Attendance Prediction
    {
      id: 'prediction',
      label: 'Attendance Predictor',
      category: 'faculty',
      icon: <TrendingUp className="w-4 h-4 text-cyan-400" />,
      badge: 'ML Forecast',
      badgeColor: 'text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950 font-mono font-bold'
    },
    // Teaching Diary & Syllabus Progress
    {
      id: 'teaching-diary',
      label: 'Teaching Diary',
      category: 'faculty',
      icon: <BookMarked className="w-4 h-4 text-cyan-500" />,
      badge: 'MU Syllabus',
      badgeColor: 'text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950 font-mono font-bold'
    },
    // Leave & Proxy Substitution
    {
      id: 'leave-proxy',
      label: 'Leave & Proxy',
      category: 'faculty',
      icon: <CalendarDays className="w-4 h-4 text-indigo-500" />,
      badge: 'Peer Sub',
      badgeColor: 'text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 font-mono font-bold'
    },
    // Mentorship & Counseling
    {
      id: 'mentorship',
      label: 'Mentorship TGS',
      category: 'faculty',
      icon: <HeartHandshake className="w-4 h-4 text-emerald-500" />,
      badge: 'Batch S1',
      badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 font-mono font-bold'
    },
    // Fast Attendance Terminal
    {
      id: 'mark-attendance',
      label: 'Mark Attendance',
      category: 'faculty',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: 'Live Hotkeys',
      badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 font-mono'
    },
    // Timetable
    {
      id: 'timetable',
      label: 'Timetable',
      category: 'faculty',
      icon: <Calendar className="w-4 h-4" />,
      badge: activeClassTimeTable.length > 0 ? `${activeClassTimeTable.length}` : undefined,
      badgeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-100/80 dark:bg-cyan-950/80 font-mono'
    },
    // Student Roster
    {
      id: 'students',
      label: 'Student Roster',
      category: 'faculty',
      icon: <Users className="w-4 h-4" />
    },
    // Internal Assessment & Exams
    {
      id: 'exams',
      label: 'Exams & UT',
      category: 'faculty',
      icon: <Award className="w-4 h-4" />,
      badge: 'IA Scheme',
      badgeColor: 'text-purple-700 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-950/80 font-mono'
    },
    // Defaulters (<75%)
    {
      id: 'defaulters',
      label: 'Defaulters (<75%)',
      category: 'faculty',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: defaultersList.length > 0 ? defaultersList.length : undefined,
      badgeColor: 'text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/80 font-bold font-mono'
    },
    // Student Reports & Dossier
    {
      id: 'reports',
      label: 'Reports & Dossier',
      category: 'faculty',
      icon: <FileSpreadsheet className="w-4 h-4" />
    },
    // AI Advisory
    {
      id: 'ai-insights',
      label: 'AI Advisory',
      category: 'faculty',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />
    },
    // Canteen
    {
      id: 'canteen',
      label: 'Canteen & Tokens',
      category: 'campus',
      icon: <Utensils className="w-4 h-4 text-amber-500" />,
      badge: 'Hot Menu',
      badgeColor: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 font-mono font-bold'
    },
    // Official Notices
    {
      id: 'notices',
      label: 'Campus Notices',
      category: 'campus',
      icon: <Bell className="w-4 h-4 text-rose-500" />,
      badge: 'Circulars',
      badgeColor: 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 font-mono font-bold'
    },
    // Events & Clubs
    {
      id: 'events',
      label: 'Events & Fest',
      category: 'campus',
      icon: <Award className="w-4 h-4 text-purple-500" />
    },
    // Study Vault
    {
      id: 'study-vault',
      label: 'Study Vault',
      category: 'campus',
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      badge: 'MU Papers',
      badgeColor: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 font-mono font-bold'
    }
  ];

  const filteredTabs = tabs.filter(t => selectedCategory === 'all' || t.category === selectedCategory);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="border-b border-slate-200/80 dark:border-indigo-950/80 bg-white/90 dark:bg-[#070c18]/95 sticky top-16 sm:top-18 z-30 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2">
        
        {/* Top Category Filter Pills for Clean Navigation on Mobile / Tablet / Desktop */}
        <div className="flex items-center justify-between gap-2 pb-1.5 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All Ecosystem ({tabs.length})
            </button>
            <button
              onClick={() => setSelectedCategory('faculty')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'faculty'
                  ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/40 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Faculty ERP &amp; Academics ({tabs.filter(t => t.category === 'faculty').length})
            </button>
            <button
              onClick={() => setSelectedCategory('campus')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'campus'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Campus Life &amp; 3D ({tabs.filter(t => t.category === 'campus').length})
            </button>
          </div>

          {/* Quick scroll arrows for desktop / tablet */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all"
              title="Scroll Left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all"
              title="Scroll Right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Buttons Row */}
        <div className="relative">
          <nav
            ref={scrollContainerRef}
            className="flex space-x-1 sm:space-x-1.5 overflow-x-auto py-1 scrollbar-none scroll-smooth"
          >
            {filteredTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-cyan-700 dark:text-cyan-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTabIndicator"
                      className="absolute inset-0 bg-cyan-50/90 dark:bg-gradient-to-r dark:from-cyan-950/70 dark:to-indigo-950/70 rounded-xl border border-cyan-300 dark:border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    />
                  )}

                  {/* Active Underline Glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTabGlowLine"
                      className="absolute -bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                    <span className={isActive ? 'text-cyan-600 dark:text-cyan-400' : 'opacity-70'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${
                          tab.id === 'mark-attendance'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse'
                            : tab.badgeColor || ''
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
