import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { TabType } from './NavigationTabs';
import { BharatCollegeLogo } from './BharatCollegeLogo';
import { LiveSessionMonitor } from './LiveSessionMonitor';
import { Interactive3DFacultyCanvas } from './Interactive3DFacultyCanvas';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BookOpen,
  PlusCircle,
  ChevronRight,
  FlaskConical,
  Award,
  Calendar,
  UserX,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Check,
  XCircle,
  Layers,
  Boxes,
  QrCode,
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardOverviewProps {
  setActiveTab: (tab: TabType) => void;
  onOpenAddStudent: () => void;
  onSelectStudentReport: (studentId: string) => void;
  onStartLiveAttendance: (slotInfo: {
    sessionType: 'theory' | 'practical';
    batch: 'All' | 'T1' | 'T2' | 'T3';
    labName?: string;
    timeSlot: string;
    topic: string;
  }) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  setActiveTab,
  onOpenAddStudent,
  onSelectStudentReport,
  onStartLiveAttendance
}) => {
  const {
    departments,
    activeDepartment,
    activeDepartmentId,
    setActiveDepartmentId,
    currentFaculty,
    activeClass,
    classSummary,
    defaultersList,
    activeClassRecords,
    defaulterThreshold
  } = useAttendance();

  const [show3DHologram, setShow3DHologram] = useState<boolean>(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' as const }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Department-Wise Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 pl-1">
          <Building2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Department:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1 text-xs">
          {departments.map((dept) => {
            const isSelected = dept.id === activeDepartmentId;
            return (
              <button
                key={dept.id}
                onClick={() => setActiveDepartmentId(dept.id)}
                className={`relative px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                  isSelected
                    ? 'text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeDeptPill"
                    className="absolute inset-0 bg-cyan-600 dark:bg-cyan-500 rounded-xl shadow-md shadow-cyan-600/25"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{dept.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. College Hero Banner (Clean & Editorial, Zero-Pill Discipline) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white shadow-2xl relative overflow-hidden border border-slate-800/80"
      >
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-cyan-500/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <BharatCollegeLogo size={64} animate={true} />
            <div className="space-y-1.5">
              {/* Clean unboxed metadata with subtle typographic separators */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-medium">
                <span className="text-cyan-300 font-semibold">{activeDepartment.name}</span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span>Room {activeClass.classRoom}</span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="text-rose-300 font-semibold">Strict 75% Cutoff</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {activeClass.name}
              </h1>

              <div className="text-slate-300 text-xs sm:text-sm flex flex-wrap items-center gap-2">
                <span className="text-slate-400">Head of Department:</span>
                <strong className="text-white font-semibold">{activeDepartment.hodName} ({activeDepartment.hodAbbreviation})</strong>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400">Instructor:</span>
                <strong className="text-cyan-300 font-semibold">{currentFaculty.name}</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('3d-campus')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 font-semibold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-sm border border-cyan-500/40 transition-colors shadow-sm cursor-pointer"
            >
              <Boxes className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>3D Campus Twin</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('timetable')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-sm border border-white/10 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-cyan-300" />
              <span>Timetable</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab('mark-attendance')}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Mark Attendance</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 2.5 Interactive 3D Faculty Core Hologram */}
      {show3DHologram && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl bg-[#070c18]"
        >
          <div className="px-4 py-2 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-950 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Boxes className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Three.js 3D Faculty Hologram &amp; Digital Twin (WebGL)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('3d-campus')}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline font-semibold"
              >
                Expand Full Screen 3D →
              </button>
              <button
                onClick={() => setShow3DHologram(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-1.5 py-0.5 rounded-md hover:bg-slate-800"
                title="Hide 3D View"
              >
                ✕
              </button>
            </div>
          </div>
          <Interactive3DFacultyCanvas variant="banner" />
        </motion.div>
      )}

      {/* 3. LIVE NOW: Real-Time Classroom & Lab Occupancy Monitor */}
      <LiveSessionMonitor
        onStartLiveAttendance={onStartLiveAttendance}
        onSelectStudentReport={onSelectStudentReport}
      />

      {/* 4. Strict Exam Clearance Bar (75% in Every Subject/Lab) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 text-white border border-indigo-900/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white">
                Semester Examination Hall Ticket Policy
              </span>
              <span className="text-[10px] text-rose-300 font-mono font-bold uppercase">
                [Mandatory University Rule]
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              Minimum <strong>75% attendance is required individually in each lecture subject and practical lab</strong>. Students with &lt;75% in any component will be debarred from writing exams.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-400/25">
            <div className="text-[11px] text-emerald-300 font-medium">Exam Eligible</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">{classSummary.examEligibleCount}</div>
            <div className="text-[10px] text-slate-400">All subjects &ge;75%</div>
          </div>

          <div
            onClick={() => setActiveTab('defaulters')}
            className="text-center px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-400/30 cursor-pointer hover:bg-rose-500/20 transition-all hover:scale-[1.02]"
          >
            <div className="text-[11px] text-rose-300 font-medium">Debarred</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-rose-400">{classSummary.examDebarredCount}</div>
            <div className="text-[10px] text-rose-300/80 font-bold">&lt;75% attendance</div>
          </div>
        </div>
      </motion.div>

      {/* 4.5 Advanced Modules Hub: QR Attendance, Excel/PDF Reports, Attendance Prediction */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => setActiveTab('prediction')}
          className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/30 hover:border-cyan-400/60 shadow-sm cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                <span>Attendance Predictor</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/30 text-cyan-300 font-mono font-bold">Forecast</span>
              </div>
              <p className="text-[11px] text-slate-400">Semester cutoff projection &amp; what-if simulation</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
        </div>

        <div
          onClick={() => setActiveTab('mark-attendance')}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 hover:border-emerald-400/60 shadow-sm cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                <span>QR Code Attendance</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/30 text-emerald-300 font-mono font-bold">Dynamic</span>
              </div>
              <p className="text-[11px] text-slate-400">30s rotating encrypted anti-proxy code</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>

        <div
          onClick={() => setActiveTab('reports')}
          className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30 hover:border-purple-400/60 shadow-sm cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                <span>Excel &amp; PDF Reports</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/30 text-purple-300 font-mono font-bold">Export</span>
              </div>
              <p className="text-[11px] text-slate-400">Official college letterhead PDF &amp; .xls</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
        </div>
      </div>

      {/* 5. 6 Key KPI Metric Cards with Tech Glowing Borders & Staggered Animations */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
      >
        
        {/* Card 1: Enrolled (Tech Cyan) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.15 } }}
          className="rounded-2xl p-4 bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-indigo-900/60 shadow-xs dark:shadow-[0_0_20px_rgba(6,182,212,0.08)] border-t-2 dark:border-t-cyan-400 flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Enrolled Students</span>
              <Users className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1">
              {classSummary.totalStudents}
            </div>
          </div>
          <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono font-medium pt-2 mt-2 border-t border-slate-100 dark:border-indigo-950">
            Batches T1, T2, T3
          </div>
        </motion.div>

        {/* Card 2: Total Sessions (Tech Indigo) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.15 } }}
          className="rounded-2xl p-4 bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-indigo-900/60 shadow-xs dark:shadow-[0_0_20px_rgba(99,102,241,0.08)] border-t-2 dark:border-t-indigo-500 flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Total Sessions</span>
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1">
              {classSummary.totalSessionsConducted}
            </div>
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 pt-2 mt-2 border-t border-slate-100 dark:border-indigo-950 font-mono">
            {classSummary.totalTheorySessions} Th · {classSummary.totalPracticalSessions} Lab
          </div>
        </motion.div>

        {/* Card 3: Combined Avg % (Tech Emerald) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.15 } }}
          className="rounded-2xl p-4 bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-indigo-900/60 shadow-xs dark:shadow-[0_0_20px_rgba(16,185,129,0.08)] border-t-2 dark:border-t-emerald-400 flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Combined Avg</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
              {classSummary.averagePercentage}%
            </div>
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-indigo-950 space-y-1">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${classSummary.averagePercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Overall Attendance</span>
          </div>
        </motion.div>

        {/* Card 4: Theory Lectures (Tech Sky) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.15 } }}
          className="rounded-2xl p-4 bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-indigo-900/60 shadow-xs dark:shadow-[0_0_20px_rgba(56,189,248,0.08)] border-t-2 dark:border-t-sky-400 flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-semibold text-sky-700 dark:text-sky-300 flex items-center justify-between">
              <span>Theory Lectures</span>
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-sky-600 dark:text-sky-300 mt-1">
              {classSummary.theoryAveragePercentage}%
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-indigo-950 space-y-1">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${classSummary.theoryAveragePercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className="bg-sky-400 h-full rounded-full"
              />
            </div>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono">
              {classSummary.totalTheorySessions} sessions
            </span>
          </div>
        </motion.div>

        {/* Card 5: Practical Labs (Tech Purple) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.15 } }}
          className="rounded-2xl p-4 bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-indigo-900/60 shadow-xs dark:shadow-[0_0_20px_rgba(168,85,247,0.08)] border-t-2 dark:border-t-purple-400 flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center justify-between">
              <span>Practical Labs</span>
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-purple-600 dark:text-purple-300 mt-1">
              {classSummary.practicalAveragePercentage}%
            </div>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-indigo-950 space-y-1">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${classSummary.practicalAveragePercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="bg-purple-500 h-full rounded-full"
              />
            </div>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">
              {classSummary.totalPracticalSessions} lab blocks
            </span>
          </div>
        </motion.div>

        {/* Card 6: Debarred Students (Tech Crimson) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.15 } }}
          onClick={() => setActiveTab('defaulters')}
          className="rounded-2xl p-4 bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-indigo-900/60 shadow-xs dark:shadow-[0_0_20px_rgba(244,63,94,0.12)] border-t-2 dark:border-t-rose-500 cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center justify-between">
              <span>Debarred</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 group-hover:animate-bounce" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-1">
              {classSummary.examDebarredCount}
            </div>
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-mono font-medium pt-2 mt-2 border-t border-slate-100 dark:border-indigo-950">
            &lt;75% in Theory/Lab ➔
          </div>
        </motion.div>

      </motion.div>

      {/* 6. Middle Section: Recent Logged Sessions & Rapid Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Logged Sessions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl p-5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Recent Attendance Logs
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lectures and laboratory experiments conducted
                </p>
              </div>
              <button
                onClick={() => setActiveTab('reports')}
                className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 transition-colors"
              >
                <span>View Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {activeClassRecords.slice(0, 5).map((rec) => {
                const isPractical = rec.sessionType === 'practical';
                const presentCount = rec.presentStudentIds.length;
                const total = classSummary.totalStudents || (presentCount + rec.absentStudentIds.length);
                const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

                return (
                  <motion.div
                    key={rec.id}
                    whileHover={{ x: 3, transition: { duration: 0.15 } }}
                    className="py-3 px-2 rounded-xl flex items-center justify-between gap-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                  >
                    <div className="space-y-1 truncate">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold uppercase ${
                          isPractical ? 'text-purple-600 dark:text-purple-400' : 'text-cyan-600 dark:text-cyan-400'
                        }`}>
                          {isPractical ? `[Lab: ${rec.labName || rec.batch}]` : '[Theory]'}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {rec.topic}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-2 font-mono">
                        <span>{rec.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{rec.timeSlot}</span>
                        <span aria-hidden="true">·</span>
                        <span>{rec.facultyName || currentFaculty.name}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                        {presentCount} Present
                      </div>
                      <div className={`text-[11px] font-bold font-mono tabular-nums ${rate >= defaulterThreshold ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                        {rate}%
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Feature Shortcuts & Debarred Spotlight */}
        <div className="space-y-4">
          
          <div className="rounded-2xl p-5 bg-gradient-to-br from-cyan-50/50 to-indigo-50/30 dark:from-slate-800 dark:to-slate-850 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Faculty Workflows
            </h3>

            <div className="space-y-2 text-xs">
              <motion.button
                whileHover={{ x: 3, transition: { duration: 0.15 } }}
                onClick={() => setActiveTab('timetable')}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600/60 font-semibold flex items-center justify-between transition-colors shadow-2xs group"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Class Timetable &amp; Labs</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ x: 3, transition: { duration: 0.15 } }}
                onClick={() => setActiveTab('exams')}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600/60 font-semibold flex items-center justify-between transition-colors shadow-2xs group"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>UT-1, UT-2 &amp; Exam Marks</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ x: 3, transition: { duration: 0.15 } }}
                onClick={() => setActiveTab('defaulters')}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600/60 font-semibold flex items-center justify-between transition-colors shadow-2xs group"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>Defaulter &amp; Debarment Letters</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ x: 3, transition: { duration: 0.15 } }}
                onClick={() => setActiveTab('ai-insights')}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600/60 font-semibold flex items-center justify-between transition-colors shadow-2xs group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Academic Advisory</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
              </motion.button>
            </div>
          </div>

          {/* Exam Debarred Spotlight */}
          <div className="rounded-2xl p-5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Not Allowed for Exams</span>
              </div>
              <button
                onClick={() => setActiveTab('defaulters')}
                className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                View ({defaultersList.length})
              </button>
            </div>

            <div className="space-y-2">
              {defaultersList.slice(0, 4).map(d => (
                <motion.div
                  key={d.student.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => onSelectStudentReport(d.student.id)}
                  className="p-2.5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/60 flex items-center justify-between gap-2 text-xs cursor-pointer hover:bg-rose-100/50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <div className="truncate">
                    <div className="font-bold truncate text-slate-900 dark:text-white">
                      #{d.student.rollNo} {d.student.name}
                    </div>
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 font-mono truncate">
                      {d.percentage}% attendance · {d.debarredReasons[0] || 'Shortage'}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 shrink-0">
                    DEBARRED
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
