import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { TabType } from './NavigationTabs';
import { Campus3DCanvas } from './Campus3DCanvas';
import { BharatCollegeLogo } from './BharatCollegeLogo';
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  FileCheck,
  Send,
  Plus,
  AlertTriangle,
  Award,
  ChevronRight,
  ShieldCheck,
  Activity,
  ArrowRight,
  Sparkles,
  UserCheck,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  INITIAL_SYLLABUS_DATA,
  INITIAL_FACULTY_LEAVES,
  INITIAL_MENTORSHIP_LOGS
} from '../data/initialData';
import { SyllabusPlan, FacultyLeaveProxy, MentorshipNote } from '../types/attendance';

interface FacultyEcosystemViewProps {
  setActiveTab: (tab: TabType) => void;
  onSelectStudentReport: (studentId: string) => void;
}

export const FacultyEcosystemView: React.FC<FacultyEcosystemViewProps> = ({
  setActiveTab,
  onSelectStudentReport
}) => {
  const {
    currentFaculty,
    activeClass,
    activeDepartment,
    classSummary,
    defaultersList,
    activeClassStudents
  } = useAttendance();

  // State for Faculty Ecosystem
  const [syllabusList, setSyllabusList] = useState<SyllabusPlan[]>(INITIAL_SYLLABUS_DATA);
  const [leavesList, setLeavesList] = useState<FacultyLeaveProxy[]>(INITIAL_FACULTY_LEAVES);
  const [mentorshipList, setMentorshipList] = useState<MentorshipNote[]>(INITIAL_MENTORSHIP_LOGS);

  // Leave application form state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [newLeaveType, setNewLeaveType] = useState<'Casual Leave (CL)' | 'Duty Leave (DL)' | 'Medical Leave (ML)'>('Casual Leave (CL)');
  const [newStartDate, setNewStartDate] = useState('2026-10-15');
  const [newEndDate, setNewEndDate] = useState('2026-10-15');
  const [newReason, setNewReason] = useState('');
  const [newProxy, setNewProxy] = useState('Prof. Swati Gaikwad');
  const [newSlot, setNewSlot] = useState('Wed 02:45 PM NLP Lab (Batch T1)');
  const [leaveSuccessToast, setLeaveSuccessToast] = useState<string | null>(null);

  // Mentorship entry state
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [mentorStudentId, setMentorStudentId] = useState(activeClassStudents[0]?.id || '');
  const [mentorCategory, setMentorCategory] = useState<'Attendance Shortage (<75%)' | 'Exam Performance' | 'Personal Mentoring'>('Attendance Shortage (<75%)');
  const [mentorAction, setMentorAction] = useState('');

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const created: FacultyLeaveProxy = {
      id: `leave-${Date.now()}`,
      facultyId: currentFaculty.id,
      facultyName: currentFaculty.name,
      leaveType: newLeaveType,
      startDate: newStartDate,
      endDate: newEndDate,
      reason: newReason || 'Academic development assignment',
      proxyFacultyName: newProxy,
      affectedSlot: newSlot,
      status: 'Approved by HOD'
    };

    setLeavesList([created, ...leavesList]);
    setIsLeaveModalOpen(false);
    setNewReason('');
    setLeaveSuccessToast('Leave and proxy faculty arrangement approved by HOD.');
    setTimeout(() => setLeaveSuccessToast(null), 3500);
  };

  const handleAddMentorship = (e: React.FormEvent) => {
    e.preventDefault();
    const student = activeClassStudents.find(s => s.id === mentorStudentId) || activeClassStudents[0];
    if (!student) return;

    const created: MentorshipNote = {
      id: `ment-${Date.now()}`,
      studentId: student.id,
      studentRollNo: student.rollNo,
      studentName: student.name,
      date: new Date().toISOString().split('T')[0],
      facultyMentor: currentFaculty.name,
      category: mentorCategory,
      actionPoints: mentorAction || 'Counseling completed and academic remediation assigned.',
      followUpRequired: true
    };

    setMentorshipList([created, ...mentorshipList]);
    setIsMentorModalOpen(false);
    setMentorAction('');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Toast Alert */}
      {leaveSuccessToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{leaveSuccessToast}</span>
        </div>
      )}

      {/* 1. Top Section: 3D Campus Digital Twin & Faculty Workload Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left 7 Cols: 3D Interactive Academic Core & Command Banner */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#0c1222] via-[#0d182f] to-[#0a1e36] border border-cyan-500/30 text-white shadow-[0_0_35px_rgba(6,182,212,0.12)] flex flex-col justify-between relative overflow-hidden">
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-indigo-950/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px] font-mono uppercase tracking-wider">
                  Faculty Ecosystem Core
                </span>
                <span className="text-xs text-cyan-300 font-mono">
                  Academic Session 2025-26
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Faculty Governance &amp; Workload Hub
              </h1>
              <p className="text-xs text-slate-300">
                Department of {activeDepartment.name} · BCOE Badlapur (W)
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-400">
                3D TWIN ONLINE
              </span>
            </div>
          </div>

          {/* Interactive 3D Canvas */}
          <div className="relative my-2 w-full flex items-center justify-center">
            <Campus3DCanvas height={230} interactive={true} />
            <div className="absolute bottom-1 right-2 pointer-events-none text-[10px] font-mono text-cyan-400/80 bg-slate-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
              Interactive 3D · Drag to Rotate
            </div>
          </div>

          {/* Bottom KPI strip */}
          <div className="pt-3 border-t border-indigo-950/80 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 font-mono">Workload</div>
              <div className="text-base font-black font-mono text-cyan-400">18 Hrs/Wk</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 font-mono">Assigned Mentees</div>
              <div className="text-base font-black font-mono text-indigo-400">{activeClassStudents.length} Students</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 font-mono">Curriculum Pacing</div>
              <div className="text-base font-black font-mono text-emerald-400">76% Covered</div>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Active Faculty Profile & Quick Actions */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-indigo-950">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white font-mono font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/30 ring-2 ring-white/20">
                {currentFaculty.abbreviation || 'FC'}
              </div>
              <div className="truncate flex-1">
                <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                  Designated Faculty In-Charge
                </span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white truncate">
                  {currentFaculty.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentFaculty.designation}
                </p>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  ID: {currentFaculty.employeeId} · Room: Cabin B204 (ITI Bldg)
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070c18] border border-slate-100 dark:border-indigo-950 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Active Course Target:</span>
                <strong className="text-slate-900 dark:text-white font-bold">{activeClass.name}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070c18] border border-slate-100 dark:border-indigo-950 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">University Attendance Rule:</span>
                <span className="font-mono font-bold text-rose-500">Min 75% Cutoff</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070c18] border border-slate-100 dark:border-indigo-950 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Debarred Students:</span>
                <span className="font-mono font-bold text-rose-500">{defaultersList.length} Students Debarred</span>
              </div>
            </div>
          </div>

          {/* Quick Faculty Operation Buttons */}
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('mark-attendance')}
              className="py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/25 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab('exams')}
              className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/25 transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Grade UT Marks</span>
            </button>
          </div>
        </div>

      </div>

      {/* 2. Syllabus & Lesson Plan Tracker (Units 1 to 6) */}
      <div className="rounded-3xl p-6 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-indigo-950">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-500" />
              <span>Syllabus &amp; Lesson Plan Progression Tracker</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curriculum pacing adherence as per University of Mumbai Semester VI Scheme.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-mono font-bold">
            All 4 Courses Audited
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {syllabusList.map((plan) => {
            const percent = Math.round((plan.conductedLectures / plan.totalPlannedLectures) * 100);

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -3 }}
                className="rounded-2xl p-4.5 bg-slate-50 dark:bg-[#070c18] border border-slate-200/80 dark:border-indigo-950/80 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                      Code: {plan.subjectCode}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      plan.status === 'Ahead of Schedule'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        : plan.status === 'On Track'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {plan.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                    {plan.subjectName}
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {plan.facultyName}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono font-semibold">
                      <span className="text-slate-500">Progress:</span>
                      <span className="text-cyan-600 dark:text-cyan-400">{percent}% ({plan.conductedLectures}/{plan.totalPlannedLectures} L)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-cyan-500 to-indigo-600 h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-indigo-950 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Units: {plan.completedUnits}/{plan.totalUnits} Units</span>
                  <span>Updated: {plan.lastUpdatedDate}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. Leave Application & Proxy Management + Mentorship Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Leave & Proxy Management */}
        <div className="rounded-3xl p-6 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-indigo-950">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-500" />
                <span>Leave Application &amp; Proxy Arrangements</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official duty/casual leave with automated proxy coverage for lectures.
              </p>
            </div>

            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apply Leave</span>
            </button>
          </div>

          <div className="space-y-3">
            {leavesList.map((leave) => (
              <div
                key={leave.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070c18] border border-slate-100 dark:border-indigo-950 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono font-bold text-[10px]">
                      {leave.leaveType}
                    </span>
                    <strong className="text-slate-900 dark:text-white font-bold">{leave.facultyName}</strong>
                  </div>
                  <span className="text-emerald-500 font-mono font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {leave.status}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300">
                  {leave.reason}
                </p>

                <div className="pt-2 border-t border-slate-200/60 dark:border-indigo-950 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Slot Covered: <strong className="text-cyan-500">{leave.affectedSlot}</strong></span>
                  <span>Proxy Teacher: <strong className="text-indigo-400">{leave.proxyFacultyName}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Mentorship & Academic Counseling Log */}
        <div className="rounded-3xl p-6 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-indigo-950">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Student Mentorship &amp; Counseling Log</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official intervention records for attendance shortage and academic guidance.
              </p>
            </div>

            <button
              onClick={() => setIsMentorModalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Counseling</span>
            </button>
          </div>

          <div className="space-y-3">
            {mentorshipList.map((ment) => (
              <div
                key={ment.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070c18] border border-slate-100 dark:border-indigo-950 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      Roll #{ment.studentRollNo}
                    </span>
                    <strong className="text-slate-900 dark:text-white font-bold">
                      {ment.studentName}
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                    {ment.category}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300">
                  {ment.actionPoints}
                </p>

                <div className="pt-2 border-t border-slate-200/60 dark:border-indigo-950 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Mentor: {ment.facultyMentor}</span>
                  <span className="text-slate-500">Date: {ment.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Leave Modal */}
      <AnimatePresence>
        {isLeaveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-indigo-950">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Apply for Faculty Leave &amp; Assign Proxy
                </h3>
                <button onClick={() => setIsLeaveModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Leave Category</label>
                  <select
                    value={newLeaveType}
                    onChange={(e) => setNewLeaveType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-indigo-900 bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                    <option value="Duty Leave (DL)">Duty Leave (DL) - Conference/Workshop</option>
                    <option value="Medical Leave (ML)">Medical Leave (ML)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Start Date</label>
                    <input
                      type="date"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-indigo-900 bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">End Date</label>
                    <input
                      type="date"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-indigo-900 bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Affected Timetable Slot</label>
                  <input
                    type="text"
                    placeholder="e.g. Wed 02:45 PM NLP Lab (Batch T1)"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-indigo-900 bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Designated Proxy Faculty</label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. Swati Gaikwad / Prof. Deepali Joshi"
                    value={newProxy}
                    onChange={(e) => setNewProxy(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-indigo-900 bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason for Leave</label>
                  <textarea
                    rows={2}
                    placeholder="Provide brief academic or personal justification..."
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-indigo-900 bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLeaveModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                  >
                    Submit Leave Application
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mentorship Modal */}
      <AnimatePresence>
        {isMentorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-indigo-950">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Record Student Mentorship Session
                </h3>
                <button onClick={() => setIsMentorModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMentorship} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Mentee</label>
                  <select
                    value={mentorStudentId}
                    onChange={(e) => setMentorStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-indigo-900 bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-bold"
                  >
                    {activeClassStudents.map(s => (
                      <option key={s.id} value={s.id}>
                        Roll #{s.rollNo} - {s.name} ({s.prn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Counseling Type</label>
                  <select
                    value={mentorCategory}
                    onChange={(e) => setMentorCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-indigo-900 bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Attendance Shortage (<75%)">Attendance Shortage (&lt;75% Cutoff)</option>
                    <option value="Exam Performance">Exam &amp; Unit Test Performance</option>
                    <option value="Personal Mentoring">Career &amp; Personal Mentoring</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Discussion &amp; Action Plan</label>
                  <textarea
                    rows={3}
                    placeholder="Enter notes on student reasons, parent communication, and improvement roadmap..."
                    value={mentorAction}
                    onChange={(e) => setMentorAction(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-indigo-900 bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMentorModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                  >
                    Save Mentorship Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
