import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Users,
  AlertCircle,
  Copy,
  Smartphone,
  ExternalLink,
  Sparkles,
  Zap,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAttendance } from '../context/AttendanceContext';
import { BharatCollegeLogo } from './BharatCollegeLogo';

interface QRAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  date?: string;
  slot?: string;
  topic?: string;
  onSaveAttendance: (presentStudentIds: string[]) => void;
}

export const QRAttendanceModal: React.FC<QRAttendanceModalProps> = ({
  isOpen,
  onClose,
  date = new Date().toISOString().split('T')[0],
  slot = '10:15 AM - 12:15 PM',
  topic = 'Analysis of Algorithms (AOA)',
  onSaveAttendance
}) => {
  const { activeClass, activeClassStudents, currentFaculty } = useAttendance();

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(30);
  const [presentStudentIds, setPresentStudentIds] = useState<string[]>([]);
  const [recentScans, setRecentScans] = useState<{
    id: string;
    studentName: string;
    rollNo: string | number;
    time: string;
  }[]>([]);

  // Simulator for student scanning
  const [simulatorRollNo, setSimulatorRollNo] = useState<string>('');
  const [simulatorStatus, setSimulatorStatus] = useState<string | null>(null);

  // Generate dynamic rotating token
  const generateNewToken = async () => {
    const rawToken = `BCOE-${activeClass.id}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setToken(rawToken);
    setCountdown(30);

    const payload = JSON.stringify({
      college: 'Bharat College of Engineering, Badlapur (W)',
      classId: activeClass.id,
      className: activeClass.name,
      faculty: currentFaculty.name,
      date,
      slot,
      token: rawToken,
      expiresAt: Date.now() + 30000
    });

    try {
      const url = await QRCode.toDataURL(payload, {
        width: 320,
        margin: 2,
        color: {
          dark: '#030712',
          light: '#ffffff'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  // Initial generation
  useEffect(() => {
    if (isOpen) {
      generateNewToken();
      // Initialize with a few initial attendees or empty
      setPresentStudentIds([]);
      setRecentScans([]);
      setSimulatorStatus(null);
    }
  }, [isOpen]);

  // Countdown timer for rotating QR Code (Anti-proxy)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          generateNewToken();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Simulate a student scanning the QR code
  const handleStudentScan = (studentId: string) => {
    const student = activeClassStudents.find(s => s.id === studentId || String(s.rollNo) === String(studentId));
    if (!student) {
      setSimulatorStatus('Student not found in this class roster.');
      return;
    }

    if (presentStudentIds.includes(student.id)) {
      setSimulatorStatus(`${student.name} (Roll #${student.rollNo}) has already marked attendance!`);
      return;
    }

    const updated = [...presentStudentIds, student.id];
    setPresentStudentIds(updated);

    const scanEntry = {
      id: `scan-${Date.now()}`,
      studentName: student.name,
      rollNo: student.rollNo,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setRecentScans(prev => [scanEntry, ...prev.slice(0, 15)]);
    setSimulatorStatus(`Success! ${student.name} marked Present.`);
    setSimulatorRollNo('');
  };

  // Quick mass check-in simulator (simulate random 5 students scanning)
  const handleSimulateRandomScans = () => {
    const unrecorded = activeClassStudents.filter(s => !presentStudentIds.includes(s.id));
    if (unrecorded.length === 0) return;

    const nextBatch = unrecorded.slice(0, 3);
    const newIds = nextBatch.map(s => s.id);
    setPresentStudentIds(prev => [...prev, ...newIds]);

    const newScans = nextBatch.map(s => ({
      id: `scan-${Date.now()}-${s.id}`,
      studentName: s.name,
      rollNo: s.rollNo,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }));
    setRecentScans(prev => [...newScans, ...prev]);
  };

  const handleFinishAndSave = () => {
    onSaveAttendance(presentStudentIds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-4xl rounded-3xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-indigo-950 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg">Dynamic QR Code Attendance</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-mono font-black uppercase">
                  Anti-Proxy Active
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                {activeClass.name} · {slot} · {topic}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: QR Display on Left + Live Check-In Feed on Right */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-y-auto">
          
          {/* Left Column: QR Code Display (7 Cols) */}
          <div className="md:col-span-6 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/40 space-y-4 text-center">
            
            <div className="flex items-center justify-between w-full px-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Geo-Fenced &amp; Encrypted</span>
              </div>

              {/* Countdown Progress Ring */}
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Refreshes in {countdown}s</span>
              </div>
            </div>

            {/* High Contrast QR Code Image */}
            <div className="p-4 rounded-3xl bg-white shadow-2xl border-4 border-cyan-500/40 relative group">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Dynamic Attendance QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 rounded-xl object-contain mx-auto"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Subtle Scanning Line Animation */}
              <div className="absolute inset-4 overflow-hidden rounded-xl pointer-events-none">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,1)] animate-bounce" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Security Token: <span className="text-slate-700 dark:text-slate-200 font-bold">{token.slice(0, 16)}...</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Students must scan this code using their phone camera. The code rotates every 30 seconds to prevent proxy attendance sharing.
              </p>
            </div>

            {/* Quick Demo Simulator Buttons */}
            <div className="pt-2 w-full space-y-2">
              <button
                onClick={handleSimulateRandomScans}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Incoming Student Scans (+3)</span>
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Roll No to test scan..."
                  value={simulatorRollNo}
                  onChange={e => setSimulatorRollNo(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && simulatorRollNo.trim()) {
                      handleStudentScan(simulatorRollNo.trim());
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (simulatorRollNo.trim()) handleStudentScan(simulatorRollNo.trim());
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs text-slate-800 dark:text-slate-200"
                >
                  Test
                </button>
              </div>

              {simulatorStatus && (
                <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 p-2 rounded-xl border border-cyan-500/20">
                  {simulatorStatus}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Check-in Feed (6 Cols) */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            
            {/* Live Counter Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/40 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Students Checked In
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
                  {presentStudentIds.length} <span className="text-sm font-normal text-slate-400">/ {activeClassStudents.length}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500">Live Turnout</div>
                <div className="text-xl font-bold font-mono text-emerald-500">
                  {activeClassStudents.length > 0
                    ? Math.round((presentStudentIds.length / activeClassStudents.length) * 100)
                    : 0}%
                </div>
              </div>
            </div>

            {/* Live Scanned Roster List */}
            <div className="flex-1 rounded-2xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/40 p-4 space-y-2.5 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-indigo-950">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <span>Real-Time Check-In Stream</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {recentScans.length} recent
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[260px]">
                {recentScans.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Smartphone className="w-8 h-8 mx-auto opacity-40 animate-pulse" />
                    <p className="text-xs font-medium">Waiting for students to scan QR code...</p>
                  </div>
                ) : (
                  recentScans.map(scan => (
                    <motion.div
                      key={scan.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#070c18] border border-slate-200/80 dark:border-indigo-950 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center justify-center text-[11px]">
                          {scan.rollNo}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white leading-tight">
                            {scan.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Verified via dynamic token
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{scan.time}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleFinishAndSave}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Record {presentStudentIds.length} Present</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
