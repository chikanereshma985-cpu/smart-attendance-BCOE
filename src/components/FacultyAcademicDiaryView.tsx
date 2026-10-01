import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  Sparkles,
  BarChart3,
  Layers,
  Award,
  ChevronRight,
  BookMarked,
  Presentation,
  Terminal,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAttendance } from '../context/AttendanceContext';
import { Perspective3DCard } from './Perspective3DCard';

interface TeachingLogEntry {
  id: string;
  date: string;
  classId: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  lectureNo: number;
  unitNo: number;
  topicCovered: string;
  pedagogy: 'Chalk & Board' | 'PPT Presentation' | 'Lab Simulation' | 'Live Coding Walkthrough' | 'Case Study';
  studentsPresent: number;
  totalStudents: number;
  assignmentGiven: string;
  remarks: string;
}

const INITIAL_TEACHING_LOGS: TeachingLogEntry[] = [
  {
    id: 'log-1',
    date: '2026-09-29',
    classId: 'class-se-cs-ds',
    className: 'SE (CSE - Data Science)',
    subjectCode: '2163111',
    subjectName: 'Analysis of Algorithms (AOA)',
    lectureNo: 24,
    unitNo: 4,
    topicCovered: 'Dynamic Programming: 0/1 Knapsack Problem with Recurrence Matrix',
    pedagogy: 'Chalk & Board',
    studentsPresent: 58,
    totalStudents: 67,
    assignmentGiven: 'Exercise 4.2: Implement Memoization for Rod Cutting',
    remarks: 'Active class participation. Numerical problems solved on board.'
  },
  {
    id: 'log-2',
    date: '2026-09-28',
    classId: 'class-se-cs-ds',
    className: 'SE (CSE - Data Science)',
    subjectCode: '2163113',
    subjectName: 'AOA Lab (Batch S1)',
    lectureNo: 8,
    unitNo: 3,
    topicCovered: 'Greedy Technique: Dijkstra Shortest Path Algorithm Implementation in Python',
    pedagogy: 'Live Coding Walkthrough',
    studentsPresent: 22,
    totalStudents: 23,
    assignmentGiven: 'Submit code execution report with 5 custom graph test-cases',
    remarks: 'Batch S1 completed code verification in Network Lab.'
  },
  {
    id: 'log-3',
    date: '2026-09-27',
    classId: 'class-te-cs-ds',
    className: 'TE (CSE - Data Science)',
    subjectCode: '2164101',
    subjectName: 'Machine Learning (ML)',
    lectureNo: 31,
    unitNo: 5,
    topicCovered: 'Support Vector Machines: Kernel Trick & Hyperplane Optimization',
    pedagogy: 'PPT Presentation',
    studentsPresent: 60,
    totalStudents: 69,
    assignmentGiven: 'Compare Linear vs RBF Kernel on Non-linear Dataset',
    remarks: 'Covered Mumbai University previous year question (Dec 2024).'
  },
  {
    id: 'log-4',
    date: '2026-09-26',
    classId: 'class-se-cs-ds',
    className: 'SE (CSE - Data Science)',
    subjectCode: '2163111',
    subjectName: 'Analysis of Algorithms (AOA)',
    lectureNo: 23,
    unitNo: 3,
    topicCovered: 'Greedy Method: Huffman Coding Tree Construction and Bit Stream encoding',
    pedagogy: 'Chalk & Board',
    studentsPresent: 62,
    totalStudents: 67,
    assignmentGiven: 'Encode string "BHARAT_COLLEGE_ENGINEERING" using Huffman table',
    remarks: 'Numerical demonstration on blackboard.'
  },
  {
    id: 'log-5',
    date: '2026-09-25',
    classId: 'class-be-cs-ds',
    className: 'BE (CSE - Data Science)',
    subjectCode: '2165001',
    subjectName: 'Natural Language Processing (NLP)',
    lectureNo: 28,
    unitNo: 4,
    topicCovered: 'Sequence Modeling: RNN vs LSTM Gate Architectures & Exploding Gradients',
    pedagogy: 'Lab Simulation',
    studentsPresent: 55,
    totalStudents: 62,
    assignmentGiven: 'TensorFlow Colab Notebook: Train character-level RNN',
    remarks: 'Practical demo in Project Lab 3.'
  }
];

interface SyllabusUnitProgress {
  unitNo: number;
  title: string;
  plannedHours: number;
  completedHours: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  keyTopics: string;
}

const SYLLABUS_UNITS: SyllabusUnitProgress[] = [
  {
    unitNo: 1,
    title: 'Introduction to Algorithm Analysis & Asymptotic Notations',
    plannedHours: 8,
    completedHours: 8,
    status: 'Completed',
    keyTopics: 'Big-O, Omega, Theta, Master Theorem, Recurrence Relations'
  },
  {
    unitNo: 2,
    title: 'Divide and Conquer Strategies',
    plannedHours: 10,
    completedHours: 10,
    status: 'Completed',
    keyTopics: 'Merge Sort, Quick Sort, Strassen Matrix Multiplication, Convex Hull'
  },
  {
    unitNo: 3,
    title: 'Greedy Approach & Spanning Trees',
    plannedHours: 10,
    completedHours: 10,
    status: 'Completed',
    keyTopics: 'Fractional Knapsack, Prim & Kruskal MST, Huffman Coding'
  },
  {
    unitNo: 4,
    title: 'Dynamic Programming & Memoization',
    plannedHours: 12,
    completedHours: 9,
    status: 'In Progress',
    keyTopics: '0/1 Knapsack, All-Pairs Shortest Path (Floyd-Warshall), Matrix Chain'
  },
  {
    unitNo: 5,
    title: 'Backtracking & Branch and Bound',
    plannedHours: 8,
    completedHours: 2,
    status: 'In Progress',
    keyTopics: 'N-Queens, Graph Coloring, Hamiltonian Cycle, TSP'
  },
  {
    unitNo: 6,
    title: 'NP-Completeness & String Matching Algorithms',
    plannedHours: 6,
    completedHours: 0,
    status: 'Upcoming',
    keyTopics: 'P vs NP, Cook-Levin Theorem, KMP Algorithm, Rabin-Karp'
  }
];

export const FacultyAcademicDiaryView: React.FC = () => {
  const { currentFaculty, activeClass, activeClassStudents } = useAttendance();
  const [logs, setLogs] = useState<TeachingLogEntry[]>(INITIAL_TEACHING_LOGS);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddLogModal, setShowAddLogModal] = useState<boolean>(false);

  // New Log Form State
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formSubject, setFormSubject] = useState<string>('Analysis of Algorithms (AOA)');
  const [formLectureNo, setFormLectureNo] = useState<number>(25);
  const [formUnitNo, setFormUnitNo] = useState<number>(4);
  const [formTopic, setFormTopic] = useState<string>('');
  const [formPedagogy, setFormPedagogy] = useState<TeachingLogEntry['pedagogy']>('Chalk & Board');
  const [formPresent, setFormPresent] = useState<number>(60);
  const [formAssignment, setFormAssignment] = useState<string>('');
  const [formRemarks, setFormRemarks] = useState<string>('');

  // Stats calculation
  const totalPlannedHours = SYLLABUS_UNITS.reduce((acc, u) => acc + u.plannedHours, 0);
  const totalCompletedHours = SYLLABUS_UNITS.reduce((acc, u) => acc + u.completedHours, 0);
  const syllabusPercentage = Math.round((totalCompletedHours / totalPlannedHours) * 100);

  const filteredLogs = logs.filter(log => {
    const matchesSubject = selectedSubject === 'All' || log.subjectName.includes(selectedSubject);
    const matchesSearch =
      log.topicCovered.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.pedagogy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim()) return;

    const newEntry: TeachingLogEntry = {
      id: `log-${Date.now()}`,
      date: formDate,
      classId: activeClass.id,
      className: activeClass.name,
      subjectCode: activeClass.code,
      subjectName: formSubject,
      lectureNo: Number(formLectureNo),
      unitNo: Number(formUnitNo),
      topicCovered: formTopic,
      pedagogy: formPedagogy,
      studentsPresent: Number(formPresent),
      totalStudents: activeClassStudents.length || 67,
      assignmentGiven: formAssignment || 'Review key textbook theorems',
      remarks: formRemarks || 'Class conducted smoothly.'
    };

    setLogs([newEntry, ...logs]);
    setShowAddLogModal(false);
    setFormTopic('');
    setFormAssignment('');
    setFormRemarks('');
  };

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Lecture No',
      'Subject',
      'Unit No',
      'Topic Covered',
      'Pedagogy',
      'Students Present',
      'Total Enrolled',
      'Assignment',
      'Faculty Remarks'
    ];
    const rows = logs.map(l => [
      l.date,
      l.lectureNo,
      `"${l.subjectName}"`,
      l.unitNo,
      `"${l.topicCovered}"`,
      `"${l.pedagogy}"`,
      l.studentsPresent,
      l.totalStudents,
      `"${l.assignmentGiven}"`,
      `"${l.remarks}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Faculty_Academic_Teaching_Diary_${currentFaculty.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Header Banner & Action Bar */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold uppercase tracking-wider">
                Mumbai University Syllabus Tracker
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Academic Year 2025-26 · Odd Semester
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <BookMarked className="w-8 h-8 text-cyan-400" />
              Faculty Academic Teaching Diary
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Official instructional log book for {currentFaculty.name} ({currentFaculty.designation}). Track daily lectures conducted, pedagogical delivery modes, and unit-wise syllabus coverage compliance.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddLogModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log New Lecture</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Diary CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Syllabus Coverage & KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Lectures Card */}
        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Lectures Taken</span>
              <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white font-mono">
              {logs.length + 22}
            </div>
            <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>On track with semester target</span>
            </div>
          </div>
        </Perspective3DCard>

        {/* Syllabus Completion % */}
        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Syllabus Covered</span>
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
              {syllabusPercentage}%
            </div>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${syllabusPercentage}%` }}
              />
            </div>
          </div>
        </Perspective3DCard>

        {/* Units Completed */}
        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Units Completed</span>
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white font-mono">
              3 <span className="text-sm text-slate-400 font-normal">/ 6 Units</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Unit 4 (DP) currently 75% complete
            </div>
          </div>
        </Perspective3DCard>

        {/* Avg Attendance During Lectures */}
        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Lecture Attendance</span>
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              88.6%
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Exceeds 75% mandatory threshold
            </div>
          </div>
        </Perspective3DCard>
      </div>

      {/* 3. Unit-wise Syllabus Scheme Progress (University of Mumbai) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-950 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-indigo-950">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Mumbai University Syllabus Progression (AOA - 2163111)
            </h2>
            <p className="text-xs text-slate-500">
              Prescribed course curriculum hours vs actual delivered instructional hours
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
            Total Target: 54 Hours
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SYLLABUS_UNITS.map(unit => {
            const pct = Math.round((unit.completedHours / unit.plannedHours) * 100);
            return (
              <div
                key={unit.unitNo}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 text-xs font-bold font-mono">
                    Unit {unit.unitNo}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      unit.status === 'Completed'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : unit.status === 'In Progress'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {unit.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 line-clamp-1">
                    {unit.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {unit.keyTopics}
                  </p>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>{unit.completedHours} / {unit.plannedHours} Hrs</span>
                    <span className="font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct === 100 ? 'bg-emerald-500' : pct > 0 ? 'bg-cyan-500' : 'bg-transparent'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Daily Teaching Log Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-950 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-cyan-500" />
              Instructional Lecture Delivery Register
            </h2>
            <p className="text-xs text-slate-500">
              Chronological log of academic periods, teaching methodologies, and topics covered
            </p>
          </div>

          {/* Filter and Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics, pedagogy..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
            >
              <option value="All">All Subjects</option>
              <option value="Analysis of Algorithms">AOA</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Natural Language Processing">NLP</option>
            </select>
          </div>
        </div>

        {/* Desktop / Tablet Table View */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-indigo-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-[#0b1329] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-indigo-950">
              <tr>
                <th className="py-3 px-4">Date &amp; Lec #</th>
                <th className="py-3 px-4">Subject &amp; Class</th>
                <th className="py-3 px-4">Unit #</th>
                <th className="py-3 px-4">Topic Covered</th>
                <th className="py-3 px-4">Pedagogy Mode</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Assignment / Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-indigo-950/60">
              {filteredLogs.map(log => {
                const attPct = Math.round((log.studentsPresent / log.totalStudents) * 100);
                return (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-[#0d1630] transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">{log.date}</div>
                      <div className="text-[11px] text-cyan-600 dark:text-cyan-400">Lec #{log.lectureNo}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{log.subjectName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{log.className}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      Unit {log.unitNo}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                        {log.topicCovered}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] whitespace-nowrap">
                        {log.pedagogy}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {log.studentsPresent}/{log.totalStudents}
                      </div>
                      <div className={`text-[10px] font-bold ${attPct >= 75 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {attPct}%
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-600 dark:text-slate-400">
                      <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        {log.assignmentGiven}
                      </div>
                      <div className="text-[10px] text-slate-400 italic mt-0.5">
                        {log.remarks}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Add Teaching Log Modal */}
      <AnimatePresence>
        {showAddLogModal && (
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
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Log Academic Lecture</h3>
                    <p className="text-xs text-slate-500">Record instructional topic &amp; pedagogical methodology</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddLogModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveLog} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                    <input
                      type="text"
                      value={formSubject}
                      onChange={e => setFormSubject(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Lecture Number</label>
                    <input
                      type="number"
                      value={formLectureNo}
                      onChange={e => setFormLectureNo(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Unit Number</label>
                    <select
                      value={formUnitNo}
                      onChange={e => setFormUnitNo(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                    >
                      {[1, 2, 3, 4, 5, 6].map(u => (
                        <option key={u} value={u}>Unit {u}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Students Present</label>
                    <input
                      type="number"
                      value={formPresent}
                      onChange={e => setFormPresent(Number(e.target.value))}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Topic Covered (As per MU Syllabus)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dynamic Programming: Longest Common Subsequence (LCS)"
                    value={formTopic}
                    onChange={e => setFormTopic(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pedagogical Methodology
                  </label>
                  <select
                    value={formPedagogy}
                    onChange={e => setFormPedagogy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Chalk & Board">Chalk &amp; Board</option>
                    <option value="PPT Presentation">PPT Presentation</option>
                    <option value="Lab Simulation">Lab Simulation</option>
                    <option value="Live Coding Walkthrough">Live Coding Walkthrough</option>
                    <option value="Case Study">Case Study</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assignment / Homework Given
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Solve problem sheet #4 on recurrence relations"
                    value={formAssignment}
                    onChange={e => setFormAssignment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Remarks / Observations
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Students grasped tabulation method well, extra problem assigned."
                    value={formRemarks}
                    onChange={e => setFormRemarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-indigo-950">
                  <button
                    type="button"
                    onClick={() => setShowAddLogModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Teaching Entry</span>
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
