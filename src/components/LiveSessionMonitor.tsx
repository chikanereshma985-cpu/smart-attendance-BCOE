import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  Radio,
  Clock,
  FlaskConical,
  BookOpen,
  MapPin,
  Users,
  UserCheck,
  Play,
  ChevronRight,
  Eye,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveSessionMonitorProps {
  onStartLiveAttendance: (slotInfo: {
    sessionType: 'theory' | 'practical';
    batch: 'All' | 'T1' | 'T2' | 'T3';
    labName?: string;
    timeSlot: string;
    topic: string;
  }) => void;
  onSelectStudentReport: (studentId: string) => void;
}

export const LiveSessionMonitor: React.FC<LiveSessionMonitorProps> = ({
  onStartLiveAttendance,
  onSelectStudentReport
}) => {
  const {
    activeClass,
    activeClassStudents,
    currentFaculty
  } = useAttendance();

  // Simulated active period selector (defaults to current live afternoon lab block)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);

  const mockTimeSlots = [
    {
      id: 'slot-lab-afternoon',
      label: '02:45 PM - 04:45 PM (Afternoon Practical Lab Block)',
      time: '02:45 PM - 04:45 PM',
      day: 'WEDNESDAY',
      isLiveNow: true,
      type: 'practical',
      labs: [
        {
          labName: 'NLP LAB',
          room: 'ITI Building 2nd Floor',
          subject: 'Machine Learning Lab Exp 3 (ML PR)',
          faculty: 'Prof. Vaibhav Achalkhamb (VA)',
          batch: 'T1' as const,
          rolls: 'Roll 1 to 8',
          accentColor: 'from-cyan-600 to-blue-600'
        },
        {
          labName: 'NETWORK LAB',
          room: 'ITI Building 1st Floor',
          subject: 'Computer Networks Socket Lab (CN PR)',
          faculty: 'Prof. Gayatri Sonawane (GS)',
          batch: 'T2' as const,
          rolls: 'Roll 9 to 16',
          accentColor: 'from-indigo-600 to-purple-600'
        },
        {
          labName: 'AI LAB',
          room: 'ITI Building Ground Floor',
          subject: 'Agile Software Dev Lab (ASD PR)',
          faculty: 'Prof. Hemangi Bhoir (HAB)',
          batch: 'T3' as const,
          rolls: 'Roll 17 to 20+',
          accentColor: 'from-emerald-600 to-teal-600'
        }
      ]
    },
    {
      id: 'slot-theory-morning',
      label: '11:15 AM - 12:15 PM (Morning Theory Lecture)',
      time: '11:15 AM - 12:15 PM',
      day: 'TODAY',
      isLiveNow: false,
      type: 'theory',
      theoryLecture: {
        subject: 'Machine Learning - Supervised Classifiers & Trees (ML TH)',
        faculty: 'Prof. Swati Gaikwad (SG)',
        room: 'Classroom B105 (ITI BUILDING)',
        batch: 'All Students (Roll 1 - 20+)',
        attendeeCount: activeClassStudents.length
      }
    },
    {
      id: 'slot-theory-noon',
      label: '01:45 PM - 02:45 PM (Post-Lunch Lecture)',
      time: '01:45 PM - 02:45 PM',
      day: 'TODAY',
      isLiveNow: false,
      type: 'theory',
      theoryLecture: {
        subject: 'Agile Software Development & Sprint Planning (ASD TH)',
        faculty: 'Prof. Asha Gaikar (AG - HOD)',
        room: 'Classroom B105 (ITI BUILDING)',
        batch: 'All Students (Roll 1 - 20+)',
        attendeeCount: activeClassStudents.length
      }
    }
  ];

  const currentSlot = mockTimeSlots[selectedSlotIndex];

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 text-white border border-cyan-800/50 shadow-2xl space-y-5 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Real-time Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          
          {/* Animated Concentric Radar Pulse */}
          <div className="relative flex items-center justify-center w-7 h-7">
            <motion.span
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inline-flex h-6 w-6 rounded-full bg-emerald-400"
            />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 ring-2 ring-emerald-300/40" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wide text-emerald-400 uppercase flex items-center gap-1.5">
                <Radio className="w-4 h-4" />
                <span>Live Classroom &amp; Lab Monitor</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-xs text-cyan-300 font-mono">
                {currentSlot.day} {currentSlot.time}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Live student distribution for <strong>{activeClass.name}</strong>
            </p>
          </div>
        </div>

        {/* Time Slot Switcher with animated pill */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
          {mockTimeSlots.map((slot, idx) => {
            const isSelected = selectedSlotIndex === idx;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlotIndex(idx)}
                className={`relative px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeLiveSlotPill"
                    className="absolute inset-0 bg-cyan-400 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {slot.isLiveNow && <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />}
                  <span>{slot.type === 'practical' ? 'Labs (Live)' : slot.time.split(' ')[0]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {currentSlot.type === 'practical' && currentSlot.labs ? (
          
          /* Practical Mode: Split across multiple Lab Rooms */
          <motion.div
            key="practical-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-white">Concurrent Lab Blocks Currently Running:</span>
              </div>
              <span className="text-cyan-300 font-mono">
                {activeClassStudents.length} Students in 3 Labs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentSlot.labs.map((lab) => {
                const batchStudents = activeClassStudents.filter(s => s.batch === lab.batch);
                const isVaibhavLab = lab.faculty.includes('Vaibhav');

                return (
                  <motion.div
                    key={lab.batch}
                    whileHover={{ y: -3, transition: { duration: 0.15 } }}
                    className={`rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                      isVaibhavLab
                        ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-cyan-400/80 shadow-lg ring-1 ring-cyan-400/30'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      {/* Room & Batch Tag */}
                      <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                        <span className="font-mono font-bold text-cyan-300">
                          {lab.labName} · {lab.room.split(' ')[0]}
                        </span>
                        <span className="font-mono font-semibold text-purple-300">
                          Batch {lab.batch} ({batchStudents.length} stu)
                        </span>
                      </div>

                      {/* Subject */}
                      <h4 className="font-bold text-sm text-white leading-snug">
                        {lab.subject}
                      </h4>

                      {/* Faculty */}
                      <div className="mt-1.5 text-xs text-slate-300 flex items-center gap-1.5">
                        <span className="text-slate-400">Faculty:</span>
                        <strong className="text-cyan-300 font-semibold">{lab.faculty}</strong>
                      </div>

                      {/* Students inside right now preview */}
                      <div className="mt-3 pt-2.5 border-t border-white/10">
                        <div className="text-[10px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
                          <span>Occupants:</span>
                          <span className="text-cyan-400 font-mono font-semibold">{lab.rolls}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {batchStudents.slice(0, 5).map(s => (
                            <button
                              key={s.id}
                              onClick={() => onSelectStudentReport(s.id)}
                              className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-cyan-500/30 text-[10px] font-mono text-slate-200 transition-colors"
                              title={`Roll #${s.rollNo} ${s.name}`}
                            >
                              #{s.rollNo} {s.name.split(' ')[0]}
                            </button>
                          ))}
                          {batchStudents.length > 5 && (
                            <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                              +{batchStudents.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Launch Attendance for this Lab */}
                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          onStartLiveAttendance({
                            sessionType: 'practical',
                            batch: lab.batch,
                            labName: lab.labName,
                            timeSlot: currentSlot.time,
                            topic: lab.subject
                          })
                        }
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                          isVaibhavLab
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Take Roll Call for {lab.labName}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : currentSlot.theoryLecture ? (
          
          /* Theory Mode: Single Classroom Occupancy */
          <motion.div
            key="theory-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono font-bold text-emerald-300">
                  {currentSlot.theoryLecture.room}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="font-mono text-cyan-300">
                  All Students ({currentSlot.theoryLecture.attendeeCount})
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">
                {currentSlot.theoryLecture.subject}
              </h4>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <span>Faculty: <strong className="text-cyan-300 font-semibold">{currentSlot.theoryLecture.faculty}</strong></span>
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                onStartLiveAttendance({
                  sessionType: 'theory',
                  batch: 'All',
                  timeSlot: currentSlot.time,
                  topic: currentSlot.theoryLecture!.subject
                })
              }
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Take Live Theory Attendance</span>
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>

    </div>
  );
};
