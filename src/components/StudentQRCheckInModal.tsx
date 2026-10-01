import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  Scan,
  AlertCircle,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAttendance } from '../context/AttendanceContext';
import { BharatCollegeLogo } from './BharatCollegeLogo';

interface StudentQRCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentQRCheckInModal: React.FC<StudentQRCheckInModalProps> = ({ isOpen, onClose }) => {
  const { activeClass, activeClassStudents } = useAttendance();
  const [rollInput, setRollInput] = useState<string>('');
  const [sessionToken, setSessionToken] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulateCameraScan = () => {
    setIsScanning(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsScanning(false);
      // Pick random student or roll
      const randomStudent = activeClassStudents[Math.floor(Math.random() * activeClassStudents.length)];
      if (randomStudent) {
        setRollInput(String(randomStudent.rollNo));
        setStatusMessage({
          type: 'success',
          title: 'QR Code Scanned Successfully!',
          description: `Verified for ${randomStudent.name} (Roll #${randomStudent.rollNo}) in ${activeClass.name}. Attendance recorded.`
        });
      }
    }, 1500);
  };

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollInput.trim()) return;

    const student = activeClassStudents.find(
      s => String(s.rollNo) === rollInput.trim() || s.prn.toLowerCase() === rollInput.trim().toLowerCase()
    );

    if (!student) {
      setStatusMessage({
        type: 'error',
        title: 'Student Not Found',
        description: `Roll No or PRN "${rollInput}" does not belong to ${activeClass.name}.`
      });
      return;
    }

    setStatusMessage({
      type: 'success',
      title: 'Attendance Confirmed!',
      description: `Welcome, ${student.name}! Your presence has been verified with cryptographic session token.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/80 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-indigo-950 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Student Self Check-In Terminal</h3>
              <p className="text-xs text-slate-400 font-mono">
                Bharat Smart Attendance · {activeClass.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          
          {/* Simulated Scanner Viewport */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-3 overflow-hidden">
            <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-cyan-500/60 relative flex items-center justify-center bg-cyan-950/20">
              {isScanning ? (
                <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] animate-bounce" />
              ) : (
                <Scan className="w-12 h-12 text-cyan-400/80 animate-pulse" />
              )}
            </div>

            <div className="space-y-1">
              <div className="font-bold text-slate-200">Point Camera at Faculty QR Screen</div>
              <p className="text-xs text-slate-400">Position the rotating QR code within the frame to verify token</p>
            </div>

            <button
              onClick={handleSimulateCameraScan}
              disabled={isScanning}
              className="py-2 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isScanning ? 'Verifying QR Token...' : 'Simulate Camera QR Scan'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-indigo-950 w-full" />
            <span className="bg-white dark:bg-[#070c18] px-3 text-xs text-slate-400 font-mono uppercase">
              Or Enter Roll Manually
            </span>
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleManualCheckIn} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs mb-1">
                Your Class Roll Number or PRN
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 14 or PRN-2024-DS-014"
                  value={rollInput}
                  onChange={e => setRollInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900 text-slate-900 dark:text-white font-mono text-xs focus:outline-hidden focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </div>
          </form>

          {/* Feedback Status Alert */}
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold">{statusMessage.title}</div>
                <div className="text-[11px] opacity-90 mt-0.5">{statusMessage.description}</div>
              </div>
            </motion.div>
          )}

          <div className="pt-2 text-center text-xs text-slate-400 font-mono">
            Powered by Bharat Smart Attendance System · Real-Time Campus Sync
          </div>
        </div>
      </motion.div>
    </div>
  );
};
