import React, { useState } from 'react';
import {
  Users,
  HeartHandshake,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  PhoneCall,
  Plus,
  Search,
  Filter,
  UserCheck,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAttendance } from '../context/AttendanceContext';
import { Perspective3DCard } from './Perspective3DCard';

interface MentoringSession {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string | number;
  batch: string;
  date: string;
  category: 'Attendance Deficiency' | 'Academic KT Guidance' | 'Placement & Internships' | 'Personal Well-being';
  discussionSummary: string;
  actionPlan: string;
  parentContacted: boolean;
  followUpDate: string;
  status: 'Resolved' | 'Under Observation' | 'Action Required';
}

const INITIAL_MENTORING_SESSIONS: MentoringSession[] = [
  {
    id: 'ment-1',
    studentId: 'stud-14',
    studentName: 'Prathamesh Kulkarni',
    rollNo: 14,
    batch: 'Batch S1',
    date: '2026-09-28',
    category: 'Attendance Deficiency',
    discussionSummary: 'Student reported health issues causing attendance to dip to 68%. Advised medical certificate submission to HOD.',
    actionPlan: 'Compulsory attendance in morning 09:15 theory lectures; extra tutorial slot assigned on Friday.',
    parentContacted: true,
    followUpDate: '2026-10-10',
    status: 'Action Required'
  },
  {
    id: 'ment-2',
    studentId: 'stud-07',
    studentName: 'Sneha More',
    rollNo: 7,
    batch: 'Batch S1',
    date: '2026-09-25',
    category: 'Placement & Internships',
    discussionSummary: 'Guidance on LeetCode dynamic programming and resume formatting for upcoming campus drives.',
    actionPlan: 'Completed 15 DP questions in study vault; scheduled mock technical interview.',
    parentContacted: false,
    followUpDate: '2026-10-15',
    status: 'Resolved'
  },
  {
    id: 'ment-3',
    studentId: 'stud-23',
    studentName: 'Saurabh Shinde',
    rollNo: 23,
    batch: 'Batch S1',
    date: '2026-09-22',
    category: 'Academic KT Guidance',
    discussionSummary: 'Struggling with Unit 2 Divide and Conquer recurrence solving for upcoming Unit Test 1.',
    actionPlan: 'Provided handwritten question bank solved problems from BCOE Study Vault.',
    parentContacted: false,
    followUpDate: '2026-10-05',
    status: 'Under Observation'
  }
];

export const FacultyMentorshipView: React.FC = () => {
  const { currentFaculty, activeClassStudents } = useAttendance();
  const [sessions, setSessions] = useState<MentoringSession[]>(INITIAL_MENTORING_SESSIONS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddSessionModal, setShowAddSessionModal] = useState<boolean>(false);

  // Form State
  const [formStudent, setFormStudent] = useState<string>('Prathamesh Kulkarni');
  const [formCategory, setFormCategory] = useState<MentoringSession['category']>('Attendance Deficiency');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formDiscussion, setFormDiscussion] = useState<string>('');
  const [formActionPlan, setFormActionPlan] = useState<string>('');
  const [formParentContacted, setFormParentContacted] = useState<boolean>(false);
  const [formFollowUp, setFormFollowUp] = useState<string>('2026-10-15');

  // Filtered Sessions
  const filteredSessions = sessions.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.rollNo).includes(searchQuery) ||
      s.discussionSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDiscussion.trim()) return;

    const studentObj = activeClassStudents.find(st => st.name === formStudent) || activeClassStudents[0];

    const newSession: MentoringSession = {
      id: `ment-${Date.now()}`,
      studentId: studentObj ? studentObj.id : 'stud-new',
      studentName: studentObj ? studentObj.name : formStudent,
      rollNo: studentObj ? studentObj.rollNo : '12',
      batch: studentObj?.batch || 'Batch S1',
      date: formDate,
      category: formCategory,
      discussionSummary: formDiscussion,
      actionPlan: formActionPlan || 'Follow up scheduled.',
      parentContacted: formParentContacted,
      followUpDate: formFollowUp,
      status: 'Under Observation'
    };

    setSessions([newSession, ...sessions]);
    setShowAddSessionModal(false);
    setFormDiscussion('');
    setFormActionPlan('');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold uppercase tracking-wider">
                Teacher-Guardian System (TGS)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Assigned Mentee Cohort: Batch S1 (Roll Nos: 01 to 25)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <HeartHandshake className="w-8 h-8 text-cyan-400" />
              Faculty Mentorship &amp; Counseling Hub
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Mentor: <strong>{currentFaculty.name}</strong>. Provide holistic academic counseling, monitor KT recovery, mentor placement readiness, and document parent-teacher interactions.
            </p>
          </div>

          <button
            onClick={() => setShowAddSessionModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record Counseling Session</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Mentees</span>
              <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white font-mono">
              25 <span className="text-xs text-slate-400 font-normal">Students (Batch S1)</span>
            </div>
            <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              All student profiles indexed
            </div>
          </div>
        </Perspective3DCard>

        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sessions Logged</span>
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {sessions.length}
            </div>
            <div className="mt-1 text-xs text-slate-500">1-on-1 personalized guidance</div>
          </div>
        </Perspective3DCard>

        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Under Action Plan</span>
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {sessions.filter(s => s.status === 'Action Required').length}
            </div>
            <div className="mt-1 text-xs text-slate-500">Scheduled for follow-up review</div>
          </div>
        </Perspective3DCard>
      </div>

      {/* 3. Counseling Log Board */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-950 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-500" />
              Mentoring &amp; Student Guidance Log
            </h2>
            <p className="text-xs text-slate-500">
              Confidential teacher-guardian counseling interactions and action plans
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              <option value="Attendance Deficiency">Attendance Deficiency</option>
              <option value="Academic KT Guidance">Academic KT Guidance</option>
              <option value="Placement & Internships">Placement &amp; Internships</option>
              <option value="Personal Well-being">Personal Well-being</option>
            </select>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          {filteredSessions.map(session => (
            <div
              key={session.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/40 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-black font-mono flex items-center justify-center text-sm">
                    {session.rollNo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {session.studentName}
                      </h4>
                      <span className="text-xs text-slate-500 font-mono">({session.batch})</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Date: {session.date}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                    {session.category}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                      session.status === 'Resolved'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : session.status === 'Action Required'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
              </div>

              {/* Discussion & Action */}
              <div className="p-3 rounded-xl bg-white dark:bg-[#070c18] border border-slate-200/80 dark:border-indigo-950 text-xs space-y-1.5">
                <div>
                  <strong className="text-slate-700 dark:text-slate-300">Discussion Summary: </strong>
                  <span className="text-slate-600 dark:text-slate-400">{session.discussionSummary}</span>
                </div>
                <div>
                  <strong className="text-cyan-600 dark:text-cyan-400">Action Plan: </strong>
                  <span className="text-slate-700 dark:text-slate-300">{session.actionPlan}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <PhoneCall className={`w-3.5 h-3.5 ${session.parentContacted ? 'text-emerald-500' : 'text-slate-400'}`} />
                  Parent Contacted: <strong>{session.parentContacted ? 'Yes (Telephonic Discussion)' : 'Not Required'}</strong>
                </span>

                <span className="font-mono">
                  Scheduled Follow-up: <strong className="text-slate-800 dark:text-slate-200">{session.followUpDate}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Add Mentoring Log Modal */}
      <AnimatePresence>
        {showAddSessionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-indigo-950">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Record Mentoring Session</h3>
                    <p className="text-xs text-slate-500">Document 1-on-1 counseling &amp; academic recovery advice</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddSessionModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveSession} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Mentee Student</label>
                    <select
                      value={formStudent}
                      onChange={e => setFormStudent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                    >
                      {activeClassStudents.slice(0, 25).map(s => (
                        <option key={s.id} value={s.name}>Roll #{s.rollNo} - {s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Counseling Category</label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                    >
                      <option value="Attendance Deficiency">Attendance Deficiency (&lt;75%)</option>
                      <option value="Academic KT Guidance">Academic KT Guidance</option>
                      <option value="Placement & Internships">Placement &amp; Internships</option>
                      <option value="Personal Well-being">Personal Well-being</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Session Date</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Follow-up Review Date</label>
                    <input
                      type="date"
                      value={formFollowUp}
                      onChange={e => setFormFollowUp(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Discussion Summary &amp; Observations
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe issues discussed and student's perspective..."
                    value={formDiscussion}
                    onChange={e => setFormDiscussion(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Action Plan &amp; Agreed Deliverables
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Must attend 10 consecutive lectures; submit lab assignment 3 by Friday."
                    value={formActionPlan}
                    onChange={e => setFormActionPlan(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="parentContact"
                    checked={formParentContacted}
                    onChange={e => setFormParentContacted(e.target.checked)}
                    className="rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <label htmlFor="parentContact" className="text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                    Parent contacted via phone regarding this counseling session
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-indigo-950">
                  <button
                    type="button"
                    onClick={() => setShowAddSessionModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Mentoring Log</span>
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
