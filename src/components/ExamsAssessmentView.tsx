import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  Search,
  Save,
  Check,
  TrendingUp,
  FileCheck,
  GitBranch,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface ExamsAssessmentViewProps {
  onSelectStudentReport: (studentId: string) => void;
}

export const ExamsAssessmentView: React.FC<ExamsAssessmentViewProps> = ({ onSelectStudentReport }) => {
  const {
    activeClass,
    activeClassStudentStats,
    updateStudentMarks,
    defaulterThreshold
  } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Local draft of marks being edited
  const [editingMarks, setEditingMarks] = useState<Record<string, {
    ut1?: number;
    ut2?: number;
    practicalExam?: number;
    finalTheory?: number;
  }>>({});

  const handleMarkChange = (studentId: string, field: 'ut1' | 'ut2' | 'practicalExam' | 'finalTheory', value: number) => {
    setEditingMarks(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveStudentMarks = (studentId: string) => {
    const studentDraft = editingMarks[studentId];
    if (studentDraft) {
      updateStudentMarks(studentId, studentDraft);
      setSaveToast(`Marks updated successfully for student ID #${studentId}`);
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const filteredStats = activeClassStudentStats.filter(st => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      st.student.name.toLowerCase().includes(q) ||
      String(st.student.rollNo).includes(q) ||
      st.student.prn.toLowerCase().includes(q)
    );
  });

  // Calculate Class Averages
  const totalStudents = activeClassStudentStats.length;
  const avgUT1 = totalStudents > 0
    ? Math.round((activeClassStudentStats.reduce((acc, curr) => acc + curr.marks.ut1, 0) / totalStudents) * 10) / 10
    : 0;
  const avgUT2 = totalStudents > 0
    ? Math.round((activeClassStudentStats.reduce((acc, curr) => acc + curr.marks.ut2, 0) / totalStudents) * 10) / 10
    : 0;
  const avgPractical = totalStudents > 0
    ? Math.round((activeClassStudentStats.reduce((acc, curr) => acc + curr.marks.practicalExam, 0) / totalStudents) * 10) / 10
    : 0;
  const passCount = activeClassStudentStats.filter(st => st.marks.isPass).length;

  // Export Assessment Register CSV
  const handleExportAssessmentCSV = () => {
    const headers = [
      'Roll No',
      'Student Name',
      'PRN / ID',
      'Lab Batch',
      'Attendance %',
      'Exam Eligible (>75%)',
      'UT-1 (20M)',
      'UT-2 (20M)',
      'Avg IA (20M)',
      'Practical Exam (25M)',
      'Final Theory Exam (80M)',
      'Total Marks (125M)',
      'Grade',
      'Result'
    ];

    const rows = activeClassStudentStats.map(st => {
      const isEligible = st.percentage >= defaulterThreshold;
      return [
        st.student.rollNo,
        `"${st.student.name}"`,
        `"${st.student.prn}"`,
        st.student.batch,
        `${st.percentage}%`,
        isEligible ? 'ELIGIBLE' : 'DEBARRED (DEFAULTER)',
        st.marks.ut1,
        st.marks.ut2,
        st.marks.avgIA,
        st.marks.practicalExam,
        st.marks.finalTheory,
        st.marks.totalOutOf125,
        st.marks.grade,
        st.marks.isPass ? 'PASS' : 'FAIL / ATKT'
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BCOE_Exams_Assessment_${activeClass.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500 font-medium">
            <span className="text-purple-600 dark:text-purple-400 font-mono font-semibold">Academic Evaluation System</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>University of Mumbai Scheme</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span>Examinations &amp; Internal Assessment (IA) Module</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Unit Tests (UT-1, UT-2), Practical Lab Viva &amp; Final Theory Marks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Marks Sheet</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportAssessmentCSV}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Assessment</span>
          </motion.button>
        </div>
      </div>

      {/* Process Flowchart Banner with Smooth Connectors */}
      <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 text-white border border-indigo-900/60 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-cyan-300">
              Evaluation Workflow Flowchart
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">BCOE 125-Mark Evaluation Chain</span>
        </div>

        {/* Steps Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs pt-1">
          <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-xl bg-white/5 border border-white/10 transition-colors">
            <div className="font-bold text-cyan-300">1. Faculty Login</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">VA / RJ Passkey</div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-xl bg-white/5 border border-white/10 transition-colors">
            <div className="font-bold text-emerald-300">2. Attendance</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Theory &amp; Lab ≥75%</div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-xl bg-white/5 border border-white/10 transition-colors">
            <div className="font-bold text-amber-300">3. UT-1 &amp; UT-2</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">20M + 20M (Avg IA)</div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-xl bg-white/5 border border-white/10 transition-colors">
            <div className="font-bold text-purple-300">4. Practical Lab</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">25M Code &amp; Viva</div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-xl bg-white/5 border border-white/10 transition-colors">
            <div className="font-bold text-indigo-300">5. Theory Exam</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">80M Final Paper</div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 transition-colors">
            <div className="font-bold text-emerald-300">6. Final Grade</div>
            <div className="text-[10px] text-emerald-200 font-mono mt-0.5">Total / 125M</div>
          </motion.div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Avg UT-1 Score
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {avgUT1} <span className="text-xs text-slate-400 font-normal">/ 20</span>
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Avg UT-2 Score
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {avgUT2} <span className="text-xs text-slate-400 font-normal">/ 20</span>
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Avg Practical Exam
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {avgPractical} <span className="text-xs text-slate-400 font-normal">/ 25</span>
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pass Percentage
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {Math.round((passCount / totalStudents) * 100)}%
          </div>
        </div>
      </div>

      {/* Marks Management Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 overflow-hidden shadow-xs space-y-4 p-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Click on any Student ID to open their complete portfolio
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-750 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-14">Roll</th>
                <th className="py-3 px-3">Student Name &amp; ID</th>
                <th className="py-3 px-3 text-center">Batch</th>
                <th className="py-3 px-3 text-center">Attendance Status</th>
                <th className="py-3 px-2 text-center w-20">UT-1 (20)</th>
                <th className="py-3 px-2 text-center w-20">UT-2 (20)</th>
                <th className="py-3 px-2 text-center">Avg IA</th>
                <th className="py-3 px-2 text-center w-24">Practical (25)</th>
                <th className="py-3 px-2 text-center w-24">Final Theory (80)</th>
                <th className="py-3 px-3 text-center">Total (125)</th>
                <th className="py-3 px-2 text-center">Grade</th>
                <th className="py-3 px-3 text-right">Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredStats.map((st) => {
                const s = st.student;
                const m = st.marks;
                const draft = editingMarks[s.id] || {};
                const isDebarred = st.percentage < defaulterThreshold;

                return (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      #{s.rollNo}
                    </td>

                    {/* Direct Student ID Access */}
                    <td
                      onClick={() => onSelectStudentReport(s.id)}
                      className="py-3 px-3 cursor-pointer group"
                    >
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                        {s.name}
                      </div>
                      <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                        ID: {s.prn}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                        {s.batch}
                      </span>
                    </td>

                    {/* Attendance Clearance */}
                    <td className="py-3 px-3 text-center">
                      <div className={`font-black text-xs ${st.percentage >= defaulterThreshold ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                        {st.percentage}%
                      </div>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        isDebarred
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {isDebarred ? 'DEBARRED' : 'CLEARED'}
                      </span>
                    </td>

                    {/* UT-1 Input */}
                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={draft.ut1 !== undefined ? draft.ut1 : m.ut1}
                        onChange={(e) => handleMarkChange(s.id, 'ut1', Number(e.target.value))}
                        className="w-16 px-1.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-bold text-xs"
                      />
                    </td>

                    {/* UT-2 Input */}
                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={draft.ut2 !== undefined ? draft.ut2 : m.ut2}
                        onChange={(e) => handleMarkChange(s.id, 'ut2', Number(e.target.value))}
                        className="w-16 px-1.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-bold text-xs"
                      />
                    </td>

                    {/* Avg IA */}
                    <td className="py-3 px-2 text-center font-bold text-slate-800 dark:text-slate-200">
                      {m.avgIA}
                    </td>

                    {/* Practical Exam Input */}
                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={draft.practicalExam !== undefined ? draft.practicalExam : m.practicalExam}
                        onChange={(e) => handleMarkChange(s.id, 'practicalExam', Number(e.target.value))}
                        className="w-16 px-1.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-bold text-xs text-purple-600 dark:text-purple-400"
                      />
                    </td>

                    {/* Final Theory Input */}
                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="80"
                        value={draft.finalTheory !== undefined ? draft.finalTheory : m.finalTheory}
                        onChange={(e) => handleMarkChange(s.id, 'finalTheory', Number(e.target.value))}
                        className="w-16 px-1.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-bold text-xs"
                      />
                    </td>

                    {/* Total */}
                    <td className="py-3 px-3 text-center font-black text-slate-900 dark:text-white">
                      {m.totalOutOf125}
                    </td>

                    {/* Grade */}
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                        m.grade === 'O' || m.grade === 'A+'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : m.grade === 'A' || m.grade === 'B'
                          ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {m.grade}
                      </span>
                    </td>

                    {/* Save Button */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleSaveStudentMarks(s.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                        title="Save marks"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
