import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  FileSpreadsheet,
  Search,
  Printer,
  Download,
  Calendar,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Eye,
  SlidersHorizontal,
  Table
} from 'lucide-react';
import { StudentAttendanceStats } from '../types/attendance';
import { ExcelPdfReportModal } from './ExcelPdfReportModal';

interface StudentReportsViewProps {
  onSelectStudentReport: (studentId: string) => void;
}

export const StudentReportsView: React.FC<StudentReportsViewProps> = ({ onSelectStudentReport }) => {
  const {
    activeClass,
    activeClassStudentStats,
    activeClassRecords,
    defaulterThreshold
  } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [reportView, setReportView] = useState<'cards' | 'matrix'>('cards');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const filteredStats = activeClassStudentStats.filter(st => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      st.student.name.toLowerCase().includes(q) ||
      String(st.student.rollNo).includes(q) ||
      st.student.prn.toLowerCase().includes(q)
    );
  });

  // Export Matrix to CSV
  const handleExportMatrixCSV = () => {
    const dates = activeClassRecords.map(r => r.date);
    const headers = ['Roll No', 'Name', 'PRN', ...dates, 'Attended', 'Total', 'Percentage'];

    const rows = activeClassStudentStats.map(st => {
      const dateStatuses = activeClassRecords.map(r =>
        r.presentStudentIds.includes(st.student.id) ? 'P' : 'A'
      );
      return [
        st.student.rollNo,
        `"${st.student.name}"`,
        `"${st.student.prn}"`,
        ...dateStatuses,
        st.attendedSessions,
        st.totalSessions,
        `${st.percentage}%`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Class_Attendance_Matrix_${activeClass.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <span>Student-Wise Attendance Reports</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {activeClass.name} • {activeClass.division} ({activeClassRecords.length} Lectures Conducted)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Switcher: Individual Cards vs Full Matrix */}
          <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setReportView('cards')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                reportView === 'cards'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Report Cards
            </button>
            <button
              onClick={() => setReportView('matrix')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                reportView === 'matrix'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Full Register Matrix
            </button>
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel &amp; PDF Report Hub</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportMatrixCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Matrix (CSV)</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name, roll, PRN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
          Showing {filteredStats.length} of {activeClassStudentStats.length} students
        </div>
      </div>

      {/* View 1: Student Individual Report Cards Grid */}
      {reportView === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStats.map((st) => {
            const isSafe = st.status === 'safe';
            const isWarning = st.status === 'warning';

            return (
              <div
                key={st.student.id}
                onClick={() => onSelectStudentReport(st.student.id)}
                className="rounded-2xl p-5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm shrink-0">
                        #{st.student.rollNo}
                      </div>
                      <div className="truncate">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {st.student.name}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400">
                          {st.student.prn}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isSafe
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {isSafe ? 'Eligible' : isWarning ? 'Warning' : 'Defaulter'}
                    </span>
                  </div>

                  {/* Progress & Stats */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Attended: <strong>{st.attendedSessions}</strong> / {st.totalSessions} sessions
                      </span>
                      <span className={`text-base font-black ${
                        isSafe
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isWarning
                          ? 'text-amber-500'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {st.percentage}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isSafe
                            ? 'bg-emerald-500'
                            : isWarning
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, st.percentage)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>View Detailed Dossier</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        
        /* View 2: Full Attendance Register Matrix (Date vs Students) */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-750 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-14 sticky left-0 bg-slate-50 dark:bg-slate-750 z-20">Roll</th>
                  <th className="py-3 px-3 min-w-[140px] sticky left-14 bg-slate-50 dark:bg-slate-750 z-20">Student Name</th>
                  {activeClassRecords.map(r => (
                    <th key={r.id} className="py-2 px-2 text-center min-w-[50px] font-mono text-[10px]">
                      <div>{r.date.slice(5)}</div>
                      <div className="text-[8px] font-normal text-slate-400">{r.presentStudentIds.length} P</div>
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center min-w-[70px] sticky right-20 bg-slate-50 dark:bg-slate-750 z-20">Attended</th>
                  <th className="py-3 px-3 text-center min-w-[70px] sticky right-0 bg-slate-50 dark:bg-slate-750 z-20">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredStats.map((st) => {
                  return (
                    <tr
                      key={st.student.id}
                      onClick={() => onSelectStudentReport(st.student.id)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3 font-bold sticky left-0 bg-white dark:bg-slate-800 group-hover:bg-slate-50 z-10">
                        #{st.student.rollNo}
                      </td>
                      <td className="py-2.5 px-3 font-semibold truncate max-w-[160px] sticky left-14 bg-white dark:bg-slate-800 z-10">
                        {st.student.name}
                      </td>
                      
                      {/* Date Cells */}
                      {activeClassRecords.map(r => {
                        const isPresent = r.presentStudentIds.includes(st.student.id);
                        return (
                          <td key={r.id} className="py-2 px-2 text-center">
                            <span
                              className={`inline-block w-6 h-6 rounded-md font-black text-[10px] leading-6 ${
                                isPresent
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                              }`}
                            >
                              {isPresent ? 'P' : 'A'}
                            </span>
                          </td>
                        );
                      })}

                      <td className="py-2.5 px-3 text-center font-bold sticky right-20 bg-white dark:bg-slate-800 z-10">
                        {st.attendedSessions} / {st.totalSessions}
                      </td>

                      <td className={`py-2.5 px-3 text-center font-black sticky right-0 bg-white dark:bg-slate-800 z-10 ${
                        st.status === 'safe'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : st.status === 'warning'
                          ? 'text-amber-500'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {st.percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Excel & PDF Export Modal */}
      <ExcelPdfReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
};
