import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { BharatCollegeLogo } from './BharatCollegeLogo';
import {
  KeyRound,
  ShieldCheck,
  LogIn,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Activity,
  Cpu,
  Terminal,
  Shield,
  Zap,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Faculty } from '../types/attendance';
import { MANDATORY_FACULTY_PASSWORD } from '../data/initialData';

export const FacultyLoginPage: React.FC = () => {
  const { allFaculty, login, verifyFacultyPassword, darkMode, toggleDarkMode } = useAttendance();

  const [selectedFaculty, setSelectedFaculty] = useState<Faculty>(allFaculty[0]);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (verifyFacultyPassword(passwordInput)) {
      setAuthSuccess(true);
      setTimeout(() => {
        login(selectedFaculty);
      }, 700);
    } else {
      setAuthError(`Invalid Password! Required college credentials: ${MANDATORY_FACULTY_PASSWORD}`);
    }
  };

  const handleQuickDemoLogin = (fac: Faculty) => {
    setSelectedFaculty(fac);
    setPasswordInput(MANDATORY_FACULTY_PASSWORD);
    setAuthError(null);
    setAuthSuccess(true);
    setTimeout(() => {
      login(fac);
    }, 600);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(MANDATORY_FACULTY_PASSWORD);
    setPasswordInput(MANDATORY_FACULTY_PASSWORD);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none tech-grid-pattern">
      
      {/* Dynamic Animated Ambient Glow Spheres */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-float-slow" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header with High-Tech System Status */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-indigo-950/60 bg-[#070c18]/80 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <BharatCollegeLogo size={46} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight uppercase text-white leading-none">
                Bharat College of Engineering
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 text-[10px] font-mono font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                SECURE PORTAL
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
              Kanhor, Badlapur (W) · AICTE Approved · DTE Code: 3436
            </span>
          </div>
        </div>

        {/* Right Controls: Live Node Status & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-indigo-900/40 text-[11px] font-mono text-slate-300">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>CLOUD ERP v4.2</span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              99.98% UP
            </span>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-indigo-900/40 transition-colors"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-cyan-300" />}
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl rounded-3xl bg-[#0b1329]/95 border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] p-6 sm:p-8 backdrop-blur-2xl space-y-6 relative overflow-hidden"
        >
          {/* Tech decorative top glowing line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-indigo-500" />
          
          {/* Official Emblem & Title Header */}
          <div className="text-center space-y-2 pb-3 border-b border-indigo-950/80">
            <div className="inline-flex justify-center mb-1 relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl" />
              <div className="relative">
                <BharatCollegeLogo size={74} animate={true} />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-cyan-300 text-[11px] font-mono font-semibold tracking-wider">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>FACULTY ACCESS CONTROL</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Faculty Authentication Terminal
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Department of Computer Science &amp; Engineering (Data Science) Academic ERP, Attendance &amp; Internal Assessment System
            </p>
          </div>

          {/* Faculty Profile Selection with Tech Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Faculty Account:</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/40">
                2 AUTHORIZED PROFILES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allFaculty.slice(0, 2).map((fac) => {
                const isSelected = selectedFaculty.id === fac.id;
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={fac.id}
                    type="button"
                    onClick={() => {
                      setSelectedFaculty(fac);
                      setAuthError(null);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'border-cyan-400 bg-gradient-to-br from-cyan-950/60 to-indigo-950/60 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                        : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-850/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {/* Active Corner Glow Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-mono text-cyan-300 font-bold bg-cyan-900/80 px-1.5 py-0.5 rounded border border-cyan-500/50">
                        <Check className="w-3 h-3 text-cyan-300" />
                        ACTIVE
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl font-mono font-extrabold text-sm flex items-center justify-center shrink-0 border transition-transform ${
                        isSelected
                          ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/30'
                          : 'bg-slate-800 text-cyan-400 border-slate-700'
                      }`}>
                        {fac.abbreviation || 'FA'}
                      </div>
                      <div className="truncate pr-8 sm:pr-0">
                        <div className="font-bold text-xs text-white truncate group-hover:text-cyan-200 transition-colors">
                          {fac.name}
                        </div>
                        <div className="text-[10px] text-cyan-400 font-mono font-medium truncate mt-0.5">
                          {fac.designation.split('&')[0]}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          EMP: {fac.id === 'fac-1' ? 'BCOE-CS-041' : 'BCOE-CS-058'}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Password Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>College Security Passkey *</span>
                </label>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono font-semibold flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40"
                >
                  {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey ? 'Applied!' : 'Auto-Fill Key'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={`Enter ${MANDATORY_FACULTY_PASSWORD}`}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  className="w-full pl-3.5 pr-10 py-3 rounded-xl border border-indigo-900/60 bg-[#070c18] text-white font-mono text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all placeholder:text-slate-600 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Credential Hint Box */}
              <div className="mt-2.5 p-3 rounded-xl bg-[#070c18]/90 border border-indigo-950 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-400 font-mono text-[11px]">
                    Passkey: <strong className="text-cyan-400 font-semibold">{MANDATORY_FACULTY_PASSWORD}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="text-slate-400 hover:text-cyan-400 p-1 transition-colors"
                  title="Copy password"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </motion.div>
            )}

            {/* Success Message with Loading Animation */}
            {authSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-700/80 text-xs text-emerald-300 font-semibold flex items-center gap-2.5 shadow-lg shadow-emerald-950/50"
              >
                <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin shrink-0" />
                <span>Authentication Verified! Loading {selectedFaculty.name}'s Academic Dashboard...</span>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleQuickDemoLogin(selectedFaculty)}
                className="w-full sm:flex-1 py-3 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/60 text-cyan-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-indigo-800/60 shadow-md"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>1-Click Verified Login</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Portal</span>
              </motion.button>
            </div>
          </form>

          {/* Security footnote */}
          <div className="pt-3 border-t border-indigo-950/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>University of Mumbai ERP Norms</span>
            <span className="text-cyan-500/70 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-BIT ENCRYPTION
            </span>
          </div>
        </motion.div>
      </main>

      {/* High-Tech Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-4 py-3.5 text-center text-xs text-slate-500 border-t border-indigo-950/60 bg-[#070c18]/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Bharat College of Engineering, Badlapur (W) · Academic Year 2025-26</span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          Dept of Computer Science &amp; Engineering (Data Science)
        </div>
      </footer>

    </div>
  );
};
