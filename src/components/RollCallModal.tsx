import React, { useState, useEffect, useCallback } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { X, Check, XCircle, ChevronLeft, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RollCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPresentIds: string[];
  date: string;
  slot: string;
  topic: string;
  onComplete: (presentIds: string[]) => void;
}

export const RollCallModal: React.FC<RollCallModalProps> = ({
  isOpen,
  onClose,
  initialPresentIds,
  date,
  slot,
  topic,
  onComplete
}) => {
  const { activeClassStudents, activeClass } = useAttendance();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      const map: Record<string, boolean> = {};
      activeClassStudents.forEach(s => {
        map[s.id] = initialPresentIds.includes(s.id);
      });
      setPresentMap(map);
      setCurrentIndex(0);
    }
  }, [isOpen, initialPresentIds, activeClassStudents]);

  const total = activeClassStudents.length;
  const currentStudent = activeClassStudents[currentIndex];

  const handleMark = useCallback((status: boolean) => {
    if (!currentStudent) return;
    setPresentMap(prev => ({
      ...prev,
      [currentStudent.id]: status
    }));

    if (currentIndex < total - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentStudent, currentIndex, total]);

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleMark(true);
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleMark(false);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleMark, currentIndex]);

  if (!isOpen || !currentStudent) return null;

  const isCurrentPresent = !!presentMap[currentStudent.id];
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  const handleFinish = () => {
    const presentIds = Object.keys(presentMap).filter(id => presentMap[id]);
    onComplete(presentIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-6 flex flex-col justify-between"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Fast Roll Call Session
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {activeClass.name} • {date}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Index */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Student {currentIndex + 1} of {total}</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Flashcard for current student */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStudent.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className={`p-6 rounded-3xl border-2 text-center space-y-3 transition-colors ${
              isCurrentPresent
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-700'
                : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-400 dark:border-rose-700'
            }`}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-600/30">
              #{currentStudent.rollNo}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentStudent.name}
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                PRN: {currentStudent.prn}
              </p>
            </div>

            <div className="pt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isCurrentPresent
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                Marked: {isCurrentPresent ? 'Present (P)' : 'Absent (A)'}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Big P / A Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleMark(false)}
            className="py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
          >
            <XCircle className="w-5 h-5" />
            <span>Absent [A]</span>
          </button>

          <button
            onClick={() => handleMark(true)}
            className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Check className="w-5 h-5" />
            <span>Present [P]</span>
          </button>
        </div>

        {/* Navigation & Shortcuts Hint */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1 font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="hidden sm:block text-[11px] text-slate-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px]">P</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px]">A</kbd> on keyboard
          </div>

          {currentIndex === total - 1 ? (
            <button
              onClick={handleFinish}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1 shadow-md shadow-indigo-600/20"
            >
              <CheckCircle2 className="w-4 h-4" /> Done
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(total - 1, prev + 1))}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1 font-medium"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
