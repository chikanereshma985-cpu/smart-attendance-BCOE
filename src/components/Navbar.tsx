import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { BharatCollegeLogo } from './BharatCollegeLogo';
import {
  Moon,
  Sun,
  Wifi,
  WifiOff,
  UserCheck,
  Plus,
  Download,
  Upload,
  RefreshCw,
  ChevronDown,
  Layers,
  School,
  Search,
  KeyRound,
  LogOut,
  QrCode,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StudentQRCheckInModal } from './StudentQRCheckInModal';

interface NavbarProps {
  onOpenAddClass: () => void;
  onOpenFacultyModal: () => void;
  onSelectStudentReport: (studentId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddClass,
  onOpenFacultyModal,
  onSelectStudentReport
}) => {
  const {
    currentFaculty,
    logout,
    classes,
    activeClass,
    setActiveClassId,
    activeClassStudents,
    darkMode,
    toggleDarkMode,
    isOnline,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetToInitialDemo
  } = useAttendance();

  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [systemMenuOpen, setSystemMenuOpen] = useState(false);
  const [studentCheckInOpen, setStudentCheckInOpen] = useState(false);

  // Global Student ID Quick Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const matchedStudents = searchQuery.trim()
    ? activeClassStudents.filter(
        s =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(s.rollNo).includes(searchQuery) ||
          s.prn.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDatabaseJSON(content);
        if (success) {
          alert('Database restored successfully from backup!');
        } else {
          alert('Invalid backup JSON file.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 dark:bg-[#070c18]/95 border-b border-slate-200 dark:border-indigo-950/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3">
          
          {/* Left: Official College Brand & Logo */}
          <div className="flex items-center gap-3">
            <BharatCollegeLogo size={46} animate={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  Bharat College of Engineering
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/80 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  SMART ATTENDANCE
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                Dept of Computer Science &amp; Engineering (Data Science)
              </p>
            </div>
          </div>

          {/* Center: Global Student ID Direct Search + Class Selector */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Global Student ID Quick Search */}
            <div className="relative">
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-slate-50 dark:bg-slate-900/90 px-3 py-1.5 focus-within:ring-2 focus-within:ring-cyan-400 focus-within:border-cyan-400 shadow-inner">
                <Search className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 mr-2" />
                <input
                  type="text"
                  placeholder="Student ID / Roll Jump..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="bg-transparent text-xs text-slate-900 dark:text-white outline-hidden w-44 font-mono placeholder:text-slate-400"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {searchFocused && matchedStudents.length > 0 && (
                <div className="absolute left-0 mt-1 w-68 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-900/80 shadow-2xl py-1.5 z-50 text-xs backdrop-blur-xl">
                  {matchedStudents.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSelectStudentReport(s.id);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-cyan-50 dark:hover:bg-indigo-950/50 flex items-center justify-between transition-colors"
                    >
                      <div className="truncate">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          #{s.rollNo} {s.name}
                        </div>
                        <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">
                          ID: {s.prn} • Batch {s.batch}
                        </div>
                      </div>
                      <span className="text-[10px] text-cyan-500 font-mono">View ➔</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Class Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setClassDropdownOpen(!classDropdownOpen);
                  setProfileDropdownOpen(false);
                  setSystemMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-slate-50 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                <div className="text-left max-w-[140px] truncate">
                  <div className="leading-tight truncate">{activeClass.name}</div>
                  <div className="text-[9px] text-cyan-600 dark:text-cyan-400 font-mono truncate">{activeClass.classRoom}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {classDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-900/80 shadow-2xl py-2 z-50 backdrop-blur-xl"
                  >
                    <div className="px-3.5 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                      <span>BCOE Academic Classes</span>
                      <button
                        onClick={() => {
                          setClassDropdownOpen(false);
                          onOpenAddClass();
                        }}
                        className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-bold text-[10px]"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {classes.map((cls) => {
                        const isSelected = cls.id === activeClass.id;
                        return (
                          <button
                            key={cls.id}
                            onClick={() => {
                              setActiveClassId(cls.id);
                              setClassDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-start gap-2.5 ${
                              isSelected
                                ? 'bg-cyan-50/80 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200 border-l-2 border-cyan-500'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <div className={`mt-0.5 p-1 rounded-md ${isSelected ? 'bg-cyan-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                              <School className="w-3 h-3" />
                            </div>
                            <div className="truncate flex-1">
                              <div className="font-bold text-xs truncate">
                                {cls.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                Room: {cls.classRoom} • Co-ord: {cls.coordinator}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Right Action Icons & Faculty Account */}
          <div className="flex items-center gap-2">
            
            {/* Online / Offline Status with Live Latency Monitor */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
              }`}
            >
              {isOnline ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>SYNCED · 14ms</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-500" />
                  <span>OFFLINE</span>
                </>
              )}
            </div>

            {/* Student QR Check-in Terminal Button */}
            <button
              onClick={() => setStudentCheckInOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Open Student QR Self Check-In Terminal"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Student Check-In</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Cloud Sync Backup Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setSystemMenuOpen(!systemMenuOpen);
                  setProfileDropdownOpen(false);
                  setClassDropdownOpen(false);
                }}
                title="Backup & Cloud Sync Options"
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {systemMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-50 text-xs"
                  >
                    <div className="px-3 py-1 font-bold text-slate-400 uppercase tracking-wider">
                      Storage &amp; Backup
                    </div>
                    <button
                      onClick={() => {
                        exportDatabaseJSON();
                        setSystemMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                    >
                      <Download className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="font-semibold">Export College Backup (JSON)</div>
                        <div className="text-[10px] text-slate-400">Save all attendance &amp; marks data</div>
                      </div>
                    </button>
                    <label className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer">
                      <Upload className="w-4 h-4 text-cyan-500" />
                      <div>
                        <div className="font-semibold">Restore Backup File</div>
                        <div className="text-[10px] text-slate-400">Load previous database snapshot</div>
                      </div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                    <button
                      onClick={() => {
                        if (confirm('Reset database to clean initial demo records?')) {
                          resetToInitialDemo();
                          setSystemMenuOpen(false);
                        }
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 dark:text-rose-400"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <div>
                        <div className="font-semibold">Reset Demo Database</div>
                        <div className="text-[10px] text-rose-400/80">Reload official Bharat College roster</div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Faculty Login & Profile Pill with Tech Glow */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setClassDropdownOpen(false);
                  setSystemMenuOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-full border border-cyan-400/40 dark:border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 hover:from-cyan-500/20 hover:to-indigo-500/20 transition-all text-xs shadow-[0_0_15px_rgba(6,182,212,0.1)] group"
              >
                <div className="text-left hidden sm:block">
                  <span className="font-bold text-slate-900 dark:text-white block leading-tight group-hover:text-cyan-400 transition-colors">
                    {currentFaculty.name}
                  </span>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-semibold block">
                    {currentFaculty.abbreviation || 'Faculty'} · {currentFaculty.employeeId}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-mono font-black text-xs uppercase shadow-md shadow-cyan-500/30 ring-1 ring-white/20">
                  {currentFaculty.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
                </div>
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/80 shadow-[0_0_40px_rgba(99,102,241,0.2)] p-4 z-50 backdrop-blur-2xl"
                  >
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-indigo-950">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-mono font-black text-sm shadow-lg shadow-cyan-500/30">
                        {currentFaculty.abbreviation || 'FC'}
                      </div>
                      <div className="truncate flex-1">
                        <div className="font-black text-slate-900 dark:text-white text-sm truncate">
                          {currentFaculty.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {currentFaculty.designation}
                        </div>
                        <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-bold truncate">
                          {currentFaculty.department}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1.5 text-xs">
                      <div className="px-2 py-1 text-slate-500 dark:text-slate-400 flex justify-between font-mono text-[11px]">
                        <span>Faculty ID:</span>
                        <span className="text-cyan-600 dark:text-cyan-300 font-bold">{currentFaculty.employeeId}</span>
                      </div>
                      <div className="px-2 py-1 text-slate-500 dark:text-slate-400 flex justify-between text-[11px]">
                        <span>Institution:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[150px]">Bharat College of Engg</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenFacultyModal();
                        }}
                        className="w-full mt-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-600/30"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Switch Faculty Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-900/80 dark:hover:bg-rose-950/40 text-slate-700 hover:text-rose-600 dark:text-slate-200 dark:hover:text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-indigo-950"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out to Faculty Login Page</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Sign Out to Faculty Login Page"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>

      {/* Student QR Check-In Terminal Modal */}
      <StudentQRCheckInModal
        isOpen={studentCheckInOpen}
        onClose={() => setStudentCheckInOpen(false)}
      />
    </header>
  );
};
