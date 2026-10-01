import React from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { BharatCollegeLogo } from './BharatCollegeLogo';
import {
  X,
  Printer,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Clock,
  BookOpen,
  Award,
  FlaskConical,
  Phone,
  Mail,
  User,
  GraduationCap,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';

interface StudentDetailModalProps {
  studentId: string | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ studentId, onClose }) => {
  const {
    activeClass,
    students,
    getStudentStats,
    activeClassRecords,
    currentFaculty,
    defaulterThreshold
  } = useAttendance();

  if (!studentId) return null;

  const stats = getStudentStats(studentId);
  const student = students.find(s => s.id === studentId);

  if (!student || !stats) return null;

  const sessionHistory = activeClassRecords
    .filter(rec => rec.sessionType === 'theory' || !rec.batch || rec.batch === 'All' || rec.batch === student.batch)
    .map(rec => {
      const isPresent = rec.presentStudentIds.includes(student.id);
      return {
        id: rec.id,
        date: rec.date,
        timeSlot: rec.timeSlot,
        topic: rec.topic,
        sessionType: rec.sessionType,
        batch: rec.batch,
        labName: rec.labName,
        isPresent
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // WhatsApp Alert Message
  const waPhone = (student.parentPhone || student.phone || '').replace(/[^0-9]/g, '');
  const waMessage = `BHARAT COLLEGE OF ENGINEERING, BADLAPUR (W)
Academic Attendance & Examination Performance Dossier
Student: ${student.name} (Roll No: ${student.rollNo}, PRN: ${student.prn})
Class: ${activeClass.name} - Batch ${student.batch}
Department: ${currentFaculty.department}

ATTENDANCE BREAKDOWN:
- Theory Attendance: ${stats.theoryPercentage}% (${stats.theoryAttended}/${stats.theoryTotal} sessions)
- Practical Lab Attendance: ${stats.practicalPercentage}% (${stats.practicalAttended}/${stats.practicalTotal} sessions)
- Overall Combined Rate: ${stats.percentage}%
- Exam Eligibility Status: ${stats.percentage >= defaulterThreshold ? 'CLEARED / ELIGIBLE' : 'DEBARRED (DEFAULTER - Below 75%)'}

EXAM EVALUATION RECORD:
- UT-1: ${stats.marks.ut1}/20 | UT-2: ${stats.marks.ut2}/20 | Avg IA: ${stats.marks.avgIA}/20
- Practical Exam: ${stats.marks.practicalExam}/25
- Final Theory: ${stats.marks.finalTheory}/80
- Total Score: ${stats.marks.totalOutOf125}/125 | Grade: ${stats.marks.grade} (${stats.marks.isPass ? 'PASS' : 'FAIL'})

Faculty In-Charge: ${currentFaculty.name} (BCOE Badlapur W)`;

  const waUrl = `https://wa.me/${waPhone.startsWith('91') ? waPhone : '91' + waPhone}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-md no-print-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
      >
        {/* Header (hidden in print) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <BharatCollegeLogo size={42} />
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                Individual Student Academic Dossier
              </h3>
              <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono font-bold">
                Student ID: {student.prn} • Roll #{student.rollNo} • Batch {student.batch}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Dossier</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Printable Official College Letterhead */}
          <div className="pb-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BharatCollegeLogo size={52} />
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  Bharat College of Engineering
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Department of Computer Science &amp; Engineering (Data Science)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Kanhor, Badlapur (W), Dist. Thane • Approved by AICTE &amp; Affiliated to University of Mumbai
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 dark:text-slate-400">
              <div>Academic Year: {activeClass.academicYear}</div>
              <div>Faculty Advisor: <strong>{currentFaculty.name}</strong></div>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="md:col-span-2 rounded-2xl p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-black text-lg">
                  #{student.rollNo}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {student.name}
                  </h4>
                  <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    PRN: {student.prn} • Lab Batch: {student.batch} • {activeClass.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Email</span>
                  <span className="font-medium truncate block">{student.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Phone</span>
                  <span className="font-medium">{student.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Parent / Guardian</span>
                  <span className="font-medium">{student.parentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Parent WhatsApp</span>
                  <span className="font-medium">{student.parentPhone}</span>
                </div>
              </div>
            </div>

            {/* Overall Attendance & Eligibility Badge */}
            <div className={`rounded-2xl p-4 border text-center flex flex-col items-center justify-center ${
              stats.percentage >= defaulterThreshold
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Combined Attendance
              </div>
              <div className={`text-4xl font-black ${
                stats.percentage >= defaulterThreshold ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {stats.percentage}%
              </div>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                stats.percentage >= defaulterThreshold
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {stats.percentage >= defaulterThreshold ? 'Exam Hall Ticket: Cleared' : 'Exam Debarred (Defaulter)'}
              </span>
            </div>

          </div>

          {/* Theory vs Practical Ratio Split as requested */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-cyan-500" />
              <span>Theory vs Practical / Lab Ratio Breakdown</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Theory Attendance</span>
                <div className="text-xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
                  {stats.theoryPercentage}%
                </div>
                <div className="text-[10px] text-slate-500">
                  {stats.theoryAttended} / {stats.theoryTotal} lectures
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">Practical Lab Attendance</span>
                <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">
                  {stats.practicalPercentage}%
                </div>
                <div className="text-[10px] text-slate-500">
                  {stats.practicalAttended} / {stats.practicalTotal} lab sessions
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Theory Shortage Recovery</span>
                <div className="text-base font-black text-slate-800 dark:text-slate-200 mt-1">
                  {stats.lecturesNeededFor75 === 0 ? 'Clear ✓' : `+${stats.lecturesNeededFor75} classes`}
                </div>
                <div className="text-[10px] text-slate-500">to cross 75%</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Lab Shortage Recovery</span>
                <div className="text-base font-black text-slate-800 dark:text-slate-200 mt-1">
                  {stats.labSessionsNeededFor75 === 0 ? 'Clear ✓' : `+${stats.labSessionsNeededFor75} labs`}
                </div>
                <div className="text-[10px] text-slate-500">for term-work clearance</div>
              </div>
            </div>
          </div>

          {/* Exam Marks & Academic Assessment Section */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-500" />
              <span>Internal Assessment &amp; Exam Performance (UT1, UT2, Practical, Final Theory)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Unit Test 1</span>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {stats.marks.ut1} <span className="text-[10px] font-normal text-slate-400">/ 20</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Unit Test 2</span>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {stats.marks.ut2} <span className="text-[10px] font-normal text-slate-400">/ 20</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800">
                <span className="text-[10px] uppercase font-bold text-cyan-700 dark:text-cyan-300">Avg IA Score</span>
                <div className="text-lg font-black text-cyan-600 dark:text-cyan-400 mt-0.5">
                  {stats.marks.avgIA} <span className="text-[10px] font-normal text-slate-400">/ 20</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">Practical Exam</span>
                <div className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">
                  {stats.marks.practicalExam} <span className="text-[10px] font-normal text-slate-400">/ 25</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Final Theory</span>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {stats.marks.finalTheory} <span className="text-[10px] font-normal text-slate-400">/ 80</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">Grade &amp; Result</span>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {stats.marks.grade} ({stats.marks.isPass ? 'PASS' : 'FAIL'})
                </div>
              </div>
            </div>
          </div>

          {/* Session Attendance Timeline */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-500" />
              <span>Logged Sessions Timeline ({sessionHistory.length} Sessions)</span>
            </h4>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                {sessionHistory.map((s, idx) => (
                  <div key={idx} className="p-2.5 px-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        s.sessionType === 'practical' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {s.sessionType === 'practical' ? `Lab: ${s.labName || s.batch}` : 'Theory'}
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {s.topic}
                      </span>
                      <span className="text-slate-400 text-[10px]">({s.date})</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase ${
                      s.isPresent
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {s.isPresent ? 'Present (P)' : 'Absent (A)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-6 text-center text-xs text-slate-500">
            <div>
              <div className="h-8 border-b border-slate-300 dark:border-slate-600 mb-1" />
              <div className="font-bold text-slate-800 dark:text-slate-200">Student Signature</div>
            </div>
            <div>
              <div className="h-8 border-b border-slate-300 dark:border-slate-600 mb-1" />
              <div className="font-bold text-slate-800 dark:text-slate-200">Faculty In-Charge</div>
              <div className="text-[10px]">{currentFaculty.name}</div>
            </div>
            <div>
              <div className="h-8 border-b border-slate-300 dark:border-slate-600 mb-1" />
              <div className="font-bold text-slate-800 dark:text-slate-200">Head of Department / Principal</div>
              <div className="text-[10px]">Dr. Ulhaskumar Gokhale (Principal)</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 no-print">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Academic Dossier to Parent WhatsApp</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
          >
            Close
          </button>
        </div>

      </motion.div>
    </div>
  );
};
