import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FlaskConical,
  BookOpen,
  ArrowRight,
  Filter,
  CheckCircle2,
  Printer,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { TimeTableSlot } from '../types/attendance';

interface TimeTableViewProps {
  onStartAttendanceFromSlot: (slot: TimeTableSlot) => void;
}

export const TimeTableView: React.FC<TimeTableViewProps> = ({ onStartAttendanceFromSlot }) => {
  const {
    activeClass,
    classes,
    setActiveClassId,
    activeClassTimeTable,
    currentFaculty
  } = useAttendance();

  const [selectedDay, setSelectedDay] = useState<'ALL' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI'>('ALL');
  const [facultyHighlight, setFacultyHighlight] = useState<string>('ALL');

  const days: ('MON' | 'TUE' | 'WED' | 'THU' | 'FRI')[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  const filteredSlots = activeClassTimeTable.filter(slot => {
    if (selectedDay !== 'ALL' && slot.day !== selectedDay) return false;
    if (facultyHighlight === 'VA') return slot.facultyAbbreviation === 'VA' || slot.facultyName.includes('Vaibhav');
    if (facultyHighlight === 'RJ') return slot.facultyAbbreviation === 'RJ' || slot.facultyName.includes('Rupali');
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500 font-medium">
            <span className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">Official Timetable w.e.f. 28/09/2026</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">Room {activeClass.classRoom || 'B105 (ITI BUILDING)'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            <span>Class Timetable &amp; Laboratory Schedule</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {activeClass.name} · Class Co-ordinator: {activeClass.coordinator || 'Prof. Asha Gaikar'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Class Switcher */}
          <select
            value={activeClass.id}
            onChange={(e) => setActiveClassId(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold shadow-xs"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Timetable</span>
          </motion.button>
        </div>
      </div>

      {/* Filter and Highlight Bar */}
      <div className="rounded-2xl p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Day Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedDay('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDay === 'ALL'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Full Week
          </button>
          {days.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDay === d
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Faculty Spotlight Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Spotlight Faculty:</span>
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-900 font-semibold">
            <button
              onClick={() => setFacultyHighlight('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all ${facultyHighlight === 'ALL' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}
            >
              All
            </button>
            <button
              onClick={() => setFacultyHighlight('VA')}
              className={`px-2.5 py-1 rounded-lg transition-all ${facultyHighlight === 'VA' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}
            >
              Prof. Vaibhav (VA)
            </button>
            <button
              onClick={() => setFacultyHighlight('RJ')}
              className={`px-2.5 py-1 rounded-lg transition-all ${facultyHighlight === 'RJ' ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}
            >
              Prof. Rupali (RJ)
            </button>
          </div>
        </div>

      </div>

      {/* Timetable Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.map((slot, idx) => {
          const isPractical = slot.type === 'practical';
          const isVaibhav = slot.facultyAbbreviation === 'VA' || slot.facultyName.includes('Vaibhav');
          const isRupali = slot.facultyAbbreviation === 'RJ' || slot.facultyName.includes('Rupali');

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`rounded-2xl p-4 sm:p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isVaibhav || isRupali
                  ? 'bg-gradient-to-br from-cyan-50/70 to-blue-50/50 dark:from-cyan-950/30 dark:to-blue-950/20 border-cyan-400 dark:border-cyan-700/80 shadow-md ring-1 ring-cyan-400/30'
                  : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-xs'
              }`}
            >
              {/* Day & Type Banner */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-black text-xs">
                      {slot.day}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isPractical
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {isPractical ? `Lab: ${slot.batch || 'Batch'}` : 'Theory'}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{slot.time}</span>
                  </span>
                </div>

                {/* Subject Name & Code */}
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">
                  {slot.subjectName}
                </h4>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  Code: {slot.subjectCode} • {slot.subjectAbbreviation}
                </div>

                {/* Faculty & Lab Location */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {slot.facultyName} ({slot.facultyAbbreviation})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                    {isPractical ? (
                      <>
                        <FlaskConical className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span>Lab: <strong className="text-slate-800 dark:text-slate-200">{slot.labName || slot.room}</strong></span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Room: <strong className="text-slate-800 dark:text-slate-200">{slot.room}</strong></span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button: Start Attendance for this Slot */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  onClick={() => onStartAttendanceFromSlot(slot)}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    isVaibhav || isRupali
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/25'
                      : 'bg-slate-100 hover:bg-cyan-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 hover:text-cyan-600'
                  }`}
                >
                  <span>Mark Attendance For This Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
