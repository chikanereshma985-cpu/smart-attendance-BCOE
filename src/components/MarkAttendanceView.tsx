import React, { useState, useEffect, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  Camera,
  Play,
  RotateCcw,
  CheckCheck,
  Search,
  LayoutGrid,
  List,
  Save,
  Check,
  FlaskConical,
  Users,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TimeTableSlot } from '../types/attendance';
import { QRAttendanceModal } from './QRAttendanceModal';

interface MarkAttendanceViewProps {
  onOpenRollCallModal: (
    initialPresentIds: string[],
    date: string,
    slot: string,
    topic: string,
    onComplete: (presentIds: string[]) => void
  ) => void;
  onOpenScannerModal: (
    onScanned: (presentRolls: (string | number)[], absentRolls: (string | number)[]) => void
  ) => void;
  prefillSlot?: TimeTableSlot | null;
  onClearPrefillSlot?: () => void;
}

export const MarkAttendanceView: React.FC<MarkAttendanceViewProps> = ({
  onOpenRollCallModal,
  onOpenScannerModal,
  prefillSlot,
  onClearPrefillSlot
}) => {
  const {
    activeClass,
    activeClassStudents,
    activeClassRecords,
    saveAttendanceRecord,
    currentFaculty
  } = useAttendance();

  // Form State
  const [sessionType, setSessionType] = useState<'theory' | 'practical'>('theory');
  const [selectedBatch, setSelectedBatch] = useState<'All' | 'T1' | 'T2' | 'T3' | 'S1' | 'S2' | 'S3'>('All');
  const [labName, setLabName] = useState<string>('ML LAB (VA)');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('11:15 AM - 12:15 PM');
  const [topic, setTopic] = useState<string>('');
  const [selectedExistingRecordId, setSelectedExistingRecordId] = useState<string>('');

  // Map of studentId -> boolean (true: Present, false: Absent)
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [isQRAttendanceOpen, setIsQRAttendanceOpen] = useState<boolean>(false);

  const handleApplyQRScannedStudents = (presentIds: string[]) => {
    setAttendanceMap(prev => {
      const neu = { ...prev };
      presentIds.forEach(id => {
        neu[id] = true;
      });
      return neu;
    });
    setSaveSuccessMessage(`QR Code verified! ${presentIds.length} students checked in.`);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  // Apply prefilled slot from timetable if clicked
  useEffect(() => {
    if (prefillSlot) {
      setSessionType(prefillSlot.type === 'practical' ? 'practical' : 'theory');
      if (prefillSlot.batch) {
        setSelectedBatch(prefillSlot.batch as any);
      }
      if (prefillSlot.labName) {
        setLabName(prefillSlot.labName);
      }
      setTimeSlot(prefillSlot.time);
      setTopic(`${prefillSlot.subjectName} (${prefillSlot.subjectAbbreviation})`);
      if (onClearPrefillSlot) onClearPrefillSlot();
    }
  }, [prefillSlot, onClearPrefillSlot]);

  // Filter students based on Batch when in Practical Mode!
  const eligibleStudents = useMemo(() => {
    if (sessionType === 'theory' || selectedBatch === 'All') {
      return activeClassStudents;
    }
    return activeClassStudents.filter(s => s.batch === selectedBatch);
  }, [activeClassStudents, sessionType, selectedBatch]);

  // Initialize or load existing record when date/record selection changes
  useEffect(() => {
    const existing = activeClassRecords.find(
      r => r.date === selectedDate && r.sessionType === sessionType && (sessionType === 'theory' || r.batch === selectedBatch)
    );
    if (existing) {
      setSelectedExistingRecordId(existing.id);
      setTimeSlot(existing.timeSlot);
      setTopic(existing.topic);
      if (existing.labName) setLabName(existing.labName);
      const neu: Record<string, boolean> = {};
      eligibleStudents.forEach(s => {
        neu[s.id] = existing.presentStudentIds.includes(s.id);
      });
      setAttendanceMap(neu);
    } else {
      setSelectedExistingRecordId('');
      const neu: Record<string, boolean> = {};
      eligibleStudents.forEach(s => {
        neu[s.id] = true; // Default present for fast marking
      });
      setAttendanceMap(neu);
    }
  }, [selectedDate, sessionType, selectedBatch, activeClass.id, eligibleStudents]);

  const setStudentStatus = (studentId: string, isPresent: boolean) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const markAll = (status: boolean) => {
    const neu: Record<string, boolean> = {};
    eligibleStudents.forEach(s => {
      neu[s.id] = status;
    });
    setAttendanceMap(neu);
  };

  const invertAll = () => {
    setAttendanceMap(prev => {
      const neu: Record<string, boolean> = {};
      eligibleStudents.forEach(s => {
        neu[s.id] = !prev[s.id];
      });
      return neu;
    });
  };

  // Filter students by search
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return eligibleStudents;
    const q = searchQuery.toLowerCase();
    return eligibleStudents.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        String(s.rollNo).includes(q) ||
        s.prn.toLowerCase().includes(q)
    );
  }, [eligibleStudents, searchQuery]);

  // Stats for this session
  const total = eligibleStudents.length;
  const presentCount = eligibleStudents.filter(s => attendanceMap[s.id]).length;
  const absentCount = total - presentCount;
  const currentRate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  // Handle Save
  const handleSave = () => {
    const presentStudentIds: string[] = [];
    const absentStudentIds: string[] = [];

    eligibleStudents.forEach(s => {
      if (attendanceMap[s.id]) {
        presentStudentIds.push(s.id);
      } else {
        absentStudentIds.push(s.id);
      }
    });

    saveAttendanceRecord({
      id: selectedExistingRecordId || undefined,
      classId: activeClass.id,
      sessionType,
      batch: sessionType === 'practical' ? selectedBatch : 'All',
      labName: sessionType === 'practical' ? labName : undefined,
      date: selectedDate,
      timeSlot: timeSlot || '11:15 AM - 12:15 PM',
      topic: topic.trim() || `${sessionType === 'practical' ? `Lab Practical (${selectedBatch})` : 'Theory Lecture'} - ${selectedDate}`,
      conductedByFacultyId: currentFaculty.id,
      facultyName: currentFaculty.name,
      presentStudentIds,
      absentStudentIds
    });

    setSaveSuccessMessage(
      `${sessionType === 'practical' ? `Lab Practical (${selectedBatch})` : 'Theory'} Attendance Saved! (${presentCount} Present, ${absentCount} Absent)`
    );
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4000);
  };

  const handleLaunchRollCall = () => {
    const currentPresentIds = eligibleStudents
      .filter(s => attendanceMap[s.id])
      .map(s => s.id);

    onOpenRollCallModal(
      currentPresentIds,
      selectedDate,
      timeSlot,
      topic,
      (newPresentIds) => {
        const neu: Record<string, boolean> = {};
        eligibleStudents.forEach(s => {
          neu[s.id] = newPresentIds.includes(s.id);
        });
        setAttendanceMap(neu);
      }
    );
  };

  const handleApplyAIScannedRolls = (
    presentRolls: (string | number)[],
    absentRolls: (string | number)[]
  ) => {
    const presentStrings = new Set(presentRolls.map(String));
    const absentStrings = new Set(absentRolls.map(String));

    setAttendanceMap(prev => {
      const neu = { ...prev };
      eligibleStudents.forEach(s => {
        const rollStr = String(s.rollNo);
        if (presentStrings.has(rollStr)) {
          neu[s.id] = true;
        } else if (absentStrings.has(rollStr)) {
          neu[s.id] = false;
        }
      });
      return neu;
    });

    setSaveSuccessMessage(
      `AI Vision applied to ${sessionType} session! Recognized ${presentRolls.length} present rolls.`
    );
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {saveSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 sm:right-8 z-50 p-4 rounded-2xl bg-cyan-600 text-white shadow-2xl flex items-center gap-3 border border-cyan-400 font-bold text-xs sm:text-sm"
          >
            <CheckCircle className="w-5 h-5 text-cyan-100 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Configuration Card */}
      <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
        
        {/* Theory vs Practical Ratio Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Mark Class Attendance</span>
              {selectedExistingRecordId && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                  Editing Logged Record
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bharat College of Engineering • Faculty: <strong>{currentFaculty.name}</strong>
            </p>
          </div>

          {/* Session Mode Selector: Theory vs Practical Lab */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setSessionType('theory')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                sessionType === 'theory'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Theory Lecture</span>
            </button>

            <button
              onClick={() => setSessionType('practical')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                sessionType === 'practical'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Practical / Lab Batch</span>
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
          
          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-500" />
              <span>Lecture Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-cyan-500 outline-hidden"
            />
          </div>

          {/* Practical Batch / Lab specific inputs */}
          {sessionType === 'practical' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-500" />
                  <span>Lab Batch</span>
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-purple-500 outline-hidden"
                >
                  <option value="T1">Batch T1 (Roll 1 - 8)</option>
                  <option value="T2">Batch T2 (Roll 9 - 16)</option>
                  <option value="T3">Batch T3 (Roll 17 - 20+)</option>
                  <option value="All">All Batches</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-purple-500" />
                  <span>Lab Facility</span>
                </label>
                <select
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-purple-500 outline-hidden"
                >
                  <option value="ML LAB (VA)">ML LAB (Prof. Vaibhav Achalkhamb)</option>
                  <option value="NLP LAB (VA)">NLP LAB (Prof. Vaibhav Achalkhamb)</option>
                  <option value="AI LAB (PT)">AI LAB (Prof. Payal Tidke)</option>
                  <option value="NETWORK LAB (GS)">NETWORK LAB (Prof. Gayatri Sonawane)</option>
                  <option value="LANG LAB (HAB)">LANG LAB (Prof. Hemangi Bhoir)</option>
                  <option value="CG LAB (VRP)">CG LAB (Prof. Vishwas Pudale)</option>
                </select>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-500" />
                <span>Lecture Time Slot</span>
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-cyan-500 outline-hidden"
              >
                <option value="10:15 AM - 11:15 AM">10:15 AM - 11:15 AM (Slot 1)</option>
                <option value="11:15 AM - 12:15 PM">11:15 AM - 12:15 PM (Slot 2)</option>
                <option value="12:45 PM - 01:45 PM">12:45 PM - 01:45 PM (Slot 3)</option>
                <option value="01:45 PM - 02:45 PM">01:45 PM - 02:45 PM (Slot 4)</option>
                <option value="02:45 PM - 04:45 PM">02:45 PM - 04:45 PM (Lab Slot)</option>
                <option value="04:45 PM - 05:45 PM">04:45 PM - 05:45 PM (Mentoring)</option>
              </select>
            </div>
          )}

          {/* Topic */}
          <div className={sessionType === 'practical' ? 'sm:col-span-1' : 'sm:col-span-2'}>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
              <span>Experiment / Lecture Topic</span>
            </label>
            <input
              type="text"
              placeholder={sessionType === 'practical' ? 'e.g. Lab Exp 2: Decision Trees' : 'e.g. Cap Theorem & Distributed Consensus'}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-cyan-500 outline-hidden"
            />
          </div>

        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-100 dark:border-indigo-950 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsQRAttendanceOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-600 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 border border-emerald-500/40 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live QR Attendance</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLaunchRollCall}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Fast Sequential Roll Call (P/A hotkeys)</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenScannerModal(handleApplyAIScannedRolls)}
              className="px-3.5 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold text-xs flex items-center gap-2 border border-purple-500/30 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)]"
            >
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              <span>Scan Paper Roll Sheet with AI Vision</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => markAll(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center gap-1.5 transition-all"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>All Present</span>
            </button>
            <button
              onClick={() => markAll(false)}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-600 dark:text-rose-300 flex items-center gap-1.5 transition-all"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>All Absent</span>
            </button>
            <button
              onClick={invertAll}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Invert</span>
            </button>
          </div>

        </div>

      </div>

      {/* Floating Sticky Live Attendance Counter with Tech Glow */}
      <div className="sticky top-28 z-20 rounded-2xl p-4 bg-white/95 dark:bg-[#0b1329]/95 backdrop-blur-xl border border-slate-200 dark:border-indigo-900/80 shadow-[0_0_30px_rgba(6,182,212,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Metric Counters */}
        <div className="flex items-center gap-3 text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <span>{sessionType === 'practical' ? `Batch ${selectedBatch}:` : 'Total Class:'}</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black">
              {total}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>Present:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-black shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              {presentCount}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
            <XCircle className="w-4 h-4" />
            <span>Absent:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30 font-black shadow-[0_0_10px_rgba(244,63,94,0.2)]">
              {absentCount}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 font-bold text-cyan-600 dark:text-cyan-400">
            <span>Rate:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-black shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              {currentRate}%
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-500" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-slate-50 dark:bg-[#070c18] text-xs text-slate-900 dark:text-white w-32 sm:w-44 outline-hidden focus:ring-1 focus:ring-cyan-400 font-mono"
            />
          </div>

          <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-slate-100 dark:bg-[#070c18]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs' : 'text-slate-400'}`}
              title="Card Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save {sessionType === 'practical' ? 'Lab Batch' : 'Theory'} Attendance</span>
          </motion.button>
        </div>
      </div>

      {/* Student List View */}
      {filteredStudents.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          No students found in {sessionType === 'practical' ? `Batch ${selectedBatch}` : 'Class'}.
        </div>
      ) : viewMode === 'grid' ? (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredStudents.map((student) => {
            const isPresent = !!attendanceMap[student.id];

            return (
              <motion.div
                key={student.id}
                layout
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className={`rounded-2xl p-4 border transition-colors ${
                  isPresent
                    ? 'bg-white dark:bg-slate-800/90 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                    : 'bg-rose-50/50 dark:bg-rose-950/25 border-rose-300 dark:border-rose-900/60 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 truncate">
                    <motion.div
                      animate={{ scale: isPresent ? [0.95, 1] : [1.05, 1] }}
                      transition={{ duration: 0.2 }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 font-mono ${
                        isPresent
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      #{student.rollNo}
                    </motion.div>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
                        {student.name}
                      </div>
                      <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">
                        {student.prn} · Batch {student.batch}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isPresent
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {isPresent ? 'Present' : 'Absent'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setStudentStatus(student.id, true)}
                    className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isPresent
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Present (P)</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setStudentStatus(student.id, false)}
                    className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      !isPresent
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-rose-600'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Absent (A)</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-750 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-16">Roll</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">PRN / ID</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Quick Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredStudents.map((student) => {
                  const isPresent = !!attendanceMap[student.id];

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/40">
                      <td className="py-3 px-4 font-black">#{student.rollNo}</td>
                      <td className="py-3 px-4 font-bold">{student.name}</td>
                      <td className="py-3 px-4 font-mono text-cyan-600">{student.prn}</td>
                      <td className="py-3 px-4 font-semibold">{student.batch}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          isPresent
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {isPresent ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                          <button
                            onClick={() => setStudentStatus(student.id, true)}
                            className={`px-3 py-1 font-bold ${isPresent ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-700 text-slate-600'}`}
                          >
                            P
                          </button>
                          <button
                            onClick={() => setStudentStatus(student.id, false)}
                            className={`px-3 py-1 font-bold border-l border-slate-200 dark:border-slate-700 ${!isPresent ? 'bg-rose-600 text-white' : 'bg-slate-50 dark:bg-slate-700 text-slate-600'}`}
                          >
                            A
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-cyan-600/30 transition-all hover:scale-[1.02]"
        >
          <Save className="w-5 h-5" />
          <span>Save &amp; Finalize {sessionType === 'practical' ? `Lab Practical (${selectedBatch})` : 'Theory'} Session</span>
        </button>
      </div>

      {/* Dynamic QR Code Attendance Modal */}
      <QRAttendanceModal
        isOpen={isQRAttendanceOpen}
        onClose={() => setIsQRAttendanceOpen(false)}
        date={selectedDate}
        slot={timeSlot}
        topic={topic || 'Academic Session'}
        onSaveAttendance={handleApplyQRScannedStudents}
      />

    </div>
  );
};
