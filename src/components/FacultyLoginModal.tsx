import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { BharatCollegeLogo } from './BharatCollegeLogo';
import { X, UserCheck, ShieldCheck, LogIn, KeyRound, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { Faculty } from '../types/attendance';
import { MANDATORY_FACULTY_PASSWORD } from '../data/initialData';

interface FacultyLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacultyLoginModal: React.FC<FacultyLoginModalProps> = ({ isOpen, onClose }) => {
  const { allFaculty, currentFaculty, setCurrentFaculty, verifyFacultyPassword } = useAttendance();

  const [selectedFaculty, setSelectedFaculty] = useState<Faculty>(currentFaculty);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (verifyFacultyPassword(passwordInput)) {
      setCurrentFaculty(selectedFaculty);
      setAuthSuccess(true);
      setTimeout(() => {
        setAuthSuccess(false);
        onClose();
      }, 700);
    } else {
      setAuthError(`Invalid Password! Required college password is: ${MANDATORY_FACULTY_PASSWORD}`);
    }
  };

  const handleQuickDemoLogin = (fac: Faculty) => {
    setSelectedFaculty(fac);
    setPasswordInput(MANDATORY_FACULTY_PASSWORD);
    setAuthError(null);
    setCurrentFaculty(fac);
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <BharatCollegeLogo size={40} />
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Bharat College Faculty Portal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Department Sign-In
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Faculty Quick Select Cards */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Select Faculty Account:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allFaculty.slice(0, 2).map((fac) => {
              const isSelected = selectedFaculty.id === fac.id;
              return (
                <motion.button
                  key={fac.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedFaculty(fac);
                    setAuthError(null);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/80 dark:bg-cyan-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {fac.abbreviation || 'FA'}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {fac.name}
                      </div>
                      <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold truncate">
                        {fac.designation.split('&')[0]}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-3.5 pt-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-500" />
                <span>Faculty Passkey / Password *</span>
              </label>
              <button
                type="button"
                onClick={() => setPasswordInput(MANDATORY_FACULTY_PASSWORD)}
                className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-bold hover:underline"
              >
                Auto-Fill Demo Passkey
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Enter <ZhWbFJ&Y@^BCOEP2026"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-cyan-500"
            />

            <div className="mt-1.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">
                Official Credential: <strong className="font-mono text-cyan-600 dark:text-cyan-400">{MANDATORY_FACULTY_PASSWORD}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(MANDATORY_FACULTY_PASSWORD);
                  setPasswordInput(MANDATORY_FACULTY_PASSWORD);
                }}
                className="text-slate-400 hover:text-cyan-500"
                title="Copy password"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Authentication Successful! Welcome, {selectedFaculty.name}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(selectedFaculty)}
              className="w-full sm:flex-1 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>1-Click Verified Login</span>
            </button>

            <button
              type="submit"
              className="w-full sm:flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/25 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Authenticate &amp; Sign In</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
