import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { BharatCollegeLogo } from './BharatCollegeLogo';
import {
  Sparkles,
  Clock,
  MapPin,
  Calendar,
  Utensils,
  Bus,
  FileText,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Calculator,
  ShieldCheck,
  Coffee,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Users,
  Building2,
  PhoneCall,
  Bell,
  Boxes
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType } from './NavigationTabs';
import { Perspective3DCard } from './Perspective3DCard';
import {
  INITIAL_CANTEEN_MENU,
  INITIAL_CAMPUS_NOTICES,
  INITIAL_BUS_SCHEDULE,
  INITIAL_CAMPUS_EVENTS
} from '../data/initialData';

interface CampusHubViewProps {
  setActiveTab: (tab: TabType) => void;
  onSelectStudentReport: (studentId: string) => void;
}

export const CampusHubView: React.FC<CampusHubViewProps> = ({
  setActiveTab,
  onSelectStudentReport
}) => {
  const {
    activeClass,
    activeClassStudents,
    activeClassTimeTable,
    activeDepartment,
    classSummary,
    defaultersList,
    currentFaculty
  } = useAttendance();

  // Bunk / Attendance Safety Calculator State
  const [calcTotalAttended, setCalcTotalAttended] = useState<number>(24);
  const [calcTotalConducted, setCalcTotalConducted] = useState<number>(30);
  const [calcTargetPercent, setCalcTargetPercent] = useState<number>(75);

  const calcCurrentPercent = calcTotalConducted > 0
    ? Math.round((calcTotalAttended / calcTotalConducted) * 100)
    : 0;

  // How many classes can be safely skipped or how many must be attended?
  const calculateSafety = () => {
    const targetFraction = calcTargetPercent / 100;
    if (calcCurrentPercent >= calcTargetPercent) {
      // Classes student can skip: (A - target * C) / target
      const maxBunks = Math.floor((calcTotalAttended - targetFraction * calcTotalConducted) / targetFraction);
      return {
        safe: true,
        count: Math.max(0, maxBunks),
        message: maxBunks > 0
          ? `You can safely miss ${maxBunks} more classes and still remain at ≥${calcTargetPercent}% attendance.`
          : `You are exactly on track! Don't miss the next class to maintain ${calcTargetPercent}%.`
      };
    } else {
      // Classes student must attend consecutively: (target * C - A) / (1 - target)
      const needed = Math.ceil((targetFraction * calcTotalConducted - calcTotalAttended) / (1 - targetFraction));
      return {
        safe: false,
        count: Math.max(1, needed),
        message: `You must attend the next ${needed} consecutive classes without missing any to reach ${calcTargetPercent}%.`
      };
    }
  };

  const safetyResult = calculateSafety();

  // Next bus info
  const nextBus = INITIAL_BUS_SCHEDULE[1] || INITIAL_BUS_SCHEDULE[0];

  // Quick canteen preview
  const featuredSnacks = INITIAL_CANTEEN_MENU.filter(item => item.popular).slice(0, 3);

  // Latest urgent notices
  const latestNotice = INITIAL_CAMPUS_NOTICES[0];

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Friendly Campus Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-cyan-950 text-white relative overflow-hidden border border-indigo-700/40 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <BharatCollegeLogo size={68} animate={true} />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[11px] tracking-wide uppercase">
                  Campus Connect 2026
                </span>
                <span className="text-xs text-cyan-200 font-mono">
                  Badlapur (West) · AICTE &amp; Mumbai University Affiliated
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Bharat College of Engineering
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Your smart academic and campus companion! Class timetable, live canteen menu, attendance tracker, and official campus updates all in one unified ecosystem.
              </p>
            </div>
          </div>

          {/* Quick Hub Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('3d-campus')}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-2 border border-cyan-500/40 backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer shadow-sm"
            >
              <Boxes className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>3D Campus Twin</span>
            </button>

            <button
              onClick={() => setActiveTab('canteen')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 border border-white/15 backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Utensils className="w-4 h-4 text-amber-300" />
              <span>Canteen Menu</span>
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 border border-white/15 backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Bell className="w-4 h-4 text-cyan-300" />
              <span>Notices &amp; Circulars</span>
            </button>

            <button
              onClick={() => setActiveTab('study-vault')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.03] cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Study Vault (MU Papers)</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Top Campus Grid: Happening Now / Next Class Radar + Bus Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Next Class Radar Card */}
        <Perspective3DCard depth={8}>
          <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-sm flex flex-col justify-between space-y-4 h-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-indigo-950">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  <span>Next Class Radar</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-mono font-bold animate-pulse">
                  TODAY LIVE
                </span>
              </div>

              <div className="mt-3.5 space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  02:45 PM - 04:45 PM (Afternoon Practical Lab)
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Machine Learning Lab (Exp 3: Decision Trees)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>NLP LAB · 2nd Floor, ITI Building</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Faculty: <strong>Prof. Vaibhav Achalkhamb (VA)</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('timetable')}
              className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Full Time Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Perspective3DCard>

        {/* Canteen Specials Quick Card */}
        <Perspective3DCard depth={8}>
          <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-sm flex flex-col justify-between space-y-4 h-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-indigo-950">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-amber-500" />
                  <span>BCOE Canteen Corner</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">
                  OPEN NOW · 8 AM - 6 PM
                </span>
              </div>

              <div className="mt-3 divide-y divide-slate-100 dark:divide-indigo-950/60 text-xs">
                {featuredSnacks.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.category} · Fresh in {item.prepTime}
                      </div>
                    </div>
                    <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                      ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('canteen')}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open Canteen Menu &amp; Tokens</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Perspective3DCard>

        {/* College Bus Route Status */}
        <Perspective3DCard depth={8}>
          <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-sm flex flex-col justify-between space-y-4 h-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-indigo-950">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Bus className="w-4 h-4 text-indigo-500" />
                  <span>Station Shuttle Bus</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold">
                  {nextBus.status}
                </span>
              </div>

              <div className="mt-3.5 space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070c18] border border-slate-200/80 dark:border-indigo-950 space-y-1">
                  <div className="flex justify-between font-mono font-bold text-slate-800 dark:text-white">
                    <span>{nextBus.departureTime}</span>
                    <span className="text-cyan-500">{nextBus.busNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {nextBus.fromLocation} ➔ {nextBus.toLocation}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-200/60 dark:border-indigo-950/60 flex items-center justify-between">
                    <span>Driver: {nextBus.driverName}</span>
                    <span className="text-cyan-600 dark:text-cyan-400">{nextBus.driverPhone}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Free shuttle for BCOE students with valid College ID card.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${nextBus.driverPhone}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Driver</span>
              </a>
            </div>
          </div>
        </Perspective3DCard>

      </div>

      {/* 3. Interactive College Student Feature: "Bunk / Attendance Safety Calculator" */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-white to-slate-50 dark:from-[#0b1329] dark:to-[#070c18] border border-slate-200 dark:border-indigo-900/60 shadow-lg space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-indigo-950">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>College Attendance &amp; Bunk Safety Calculator</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 font-bold">
                  BCOE Smart Tool
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Determine exactly how many lectures you can safely take off, or how many you must attend to beat the 75% cutoff.
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-2xl font-black font-mono ${calcCurrentPercent >= 75 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {calcCurrentPercent}%
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">
              Current Rate
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Lectures / Labs Attended
            </label>
            <input
              type="number"
              min="0"
              value={calcTotalAttended}
              onChange={(e) => setCalcTotalAttended(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-white dark:bg-[#070c18] text-slate-900 dark:text-white font-mono font-bold text-sm outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Total Lectures Conducted
            </label>
            <input
              type="number"
              min="1"
              value={calcTotalConducted}
              onChange={(e) => setCalcTotalConducted(Math.max(1, Number(e.target.value) || 1))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-white dark:bg-[#070c18] text-slate-900 dark:text-white font-mono font-bold text-sm outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              University Target Cutoff
            </label>
            <div className="flex gap-2">
              {[75, 80, 85].map((cutoff) => (
                <button
                  key={cutoff}
                  onClick={() => setCalcTargetPercent(cutoff)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    calcTargetPercent === cutoff
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cutoff}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Result Badge */}
        <div className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
          safetyResult.safe
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/80 text-rose-900 dark:text-rose-200'
        }`}>
          {safetyResult.safe ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <div className="font-extrabold text-sm">
              {safetyResult.safe
                ? `Safe Status: Attendance is above ${calcTargetPercent}%!`
                : `Action Required: Attendance is below ${calcTargetPercent}% cutoff!`}
            </div>
            <p className="text-xs opacity-90 leading-relaxed font-medium">
              {safetyResult.message}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 4. Latest Campus Notices & Upcoming Techfest Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Latest Notice Spotlight */}
        <div className="rounded-3xl p-6 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-indigo-950">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-500" />
              <span>Latest Official Circular</span>
            </h3>
            <button
              onClick={() => setActiveTab('notices')}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View All Notices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/60 dark:border-cyan-800/50 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-mono font-bold text-[10px]">
                URGENT EXAM NOTICE
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {latestNotice.date}
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {latestNotice.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {latestNotice.content}
            </p>
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-cyan-700 dark:text-cyan-300 font-mono font-medium">
                Issued by: {latestNotice.department}
              </span>
              <button
                onClick={() => alert(`Downloading ${latestNotice.fileAttachment}...`)}
                className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* TechnoBharat 2026 Event Spotlight */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-purple-950/80 via-[#0b1329] to-slate-950 border border-purple-800/40 text-white shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500 text-white font-black text-[10px] uppercase tracking-wider">
                  Upcoming Event
                </span>
                <span className="text-xs text-purple-300 font-mono">Oct 14, 2026</span>
              </div>
              <span className="text-xs font-mono text-amber-300 font-bold">₹1,00,000 Prizes</span>
            </div>

            <div className="mt-3.5 space-y-2">
              <h3 className="text-lg font-black text-white">
                TechnoBharat 2026: National Techfest &amp; Hackathon
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                24-Hour Code Sprint, AI &amp; Machine Learning Project Exhibition, and Robo-Race. Join 50+ college teams at BCOE Badlapur (W).
              </p>
              <div className="text-[11px] text-purple-300 font-mono">
                Coordinators: Prof. Vaibhav Achalkhamb &amp; Prof. Swati Gaikwad
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400 font-mono">
              142 teams already registered
            </span>
            <button
              onClick={() => setActiveTab('events')}
              className="py-2.5 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/25 transition-all"
            >
              <span>Explore &amp; Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 5. Direct Quick Link to Full Faculty Attendance & Academic Portal */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-800/60 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">
              Faculty Academic ERP &amp; Attendance Console
            </h3>
            <p className="text-xs text-slate-300">
              Logged in as <strong>{currentFaculty.name} ({currentFaculty.abbreviation})</strong> · Take roll call, record UT marks, audit 75% defaulters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('mark-attendance')}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02]"
          >
            <span>Mark Lecture Attendance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all"
          >
            <span>Full ERP Dashboard</span>
          </button>
        </div>
      </div>

    </div>
  );
};
