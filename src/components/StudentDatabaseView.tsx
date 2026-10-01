import React, { useState, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  Users,
  Search,
  Plus,
  Upload,
  Download,
  FileText,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  ArrowUpDown,
  Phone,
  Mail,
  FlaskConical
} from 'lucide-react';
import { Student } from '../types/attendance';

interface StudentDatabaseViewProps {
  onOpenAddStudent: () => void;
  onOpenBulkImport: () => void;
  onSelectStudentReport: (studentId: string) => void;
  onEditStudent: (student: Student) => void;
}

export const StudentDatabaseView: React.FC<StudentDatabaseViewProps> = ({
  onOpenAddStudent,
  onOpenBulkImport,
  onSelectStudentReport,
  onEditStudent
}) => {
  const {
    activeClass,
    activeClassStudents,
    activeClassStudentStats,
    deleteStudent,
    defaulterThreshold
  } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'safe' | 'warning' | 'critical'>('all');
  const [batchFilter, setBatchFilter] = useState<'ALL' | 'T1' | 'T2' | 'T3'>('ALL');
  const [sortField, setSortField] = useState<'rollNo' | 'name' | 'percentage'>('rollNo');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Filter & Sort
  const filteredAndSortedStats = useMemo(() => {
    return activeClassStudentStats
      .filter((st) => {
        if (statusFilter !== 'all' && st.status !== statusFilter) {
          return false;
        }

        if (batchFilter !== 'ALL' && st.student.batch !== batchFilter) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = st.student.name.toLowerCase().includes(q);
          const matchRoll = String(st.student.rollNo).includes(q);
          const matchPrn = st.student.prn.toLowerCase().includes(q);
          const matchParent = st.student.parentName?.toLowerCase().includes(q);
          return matchName || matchRoll || matchPrn || matchParent;
        }

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === 'rollNo') {
          diff = a.student.rollNo - b.student.rollNo;
        } else if (sortField === 'name') {
          diff = a.student.name.localeCompare(b.student.name);
        } else if (sortField === 'percentage') {
          diff = a.percentage - b.percentage;
        }
        return sortAsc ? diff : -diff;
      });
  }, [activeClassStudentStats, statusFilter, batchFilter, searchQuery, sortField, sortAsc]);

  const counts = useMemo(() => {
    let safe = 0;
    let warning = 0;
    let critical = 0;
    activeClassStudentStats.forEach(s => {
      if (s.status === 'safe') safe++;
      else if (s.status === 'warning') warning++;
      else critical++;
    });
    return {
      all: activeClassStudentStats.length,
      safe,
      warning,
      critical
    };
  }, [activeClassStudentStats]);

  const handleSortToggle = (field: 'rollNo' | 'name' | 'percentage') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Roll No',
      'Student Name',
      'PRN / ID',
      'Lab Batch',
      'Student Email',
      'Student Phone',
      'Parent Name',
      'Parent Phone',
      'Theory Attended',
      'Theory Total',
      'Theory %',
      'Lab Attended',
      'Lab Total',
      'Lab %',
      'Combined Total %',
      'Eligibility Status'
    ];

    const rows = activeClassStudentStats.map(st => [
      st.student.rollNo,
      `"${st.student.name}"`,
      `"${st.student.prn}"`,
      st.student.batch,
      `"${st.student.email}"`,
      `"${st.student.phone}"`,
      `"${st.student.parentName || ''}"`,
      `"${st.student.parentPhone || ''}"`,
      st.theoryAttended,
      st.theoryTotal,
      `${st.theoryPercentage}%`,
      st.practicalAttended,
      st.practicalTotal,
      `${st.practicalPercentage}%`,
      `${st.percentage}%`,
      st.percentage >= defaulterThreshold ? 'ELIGIBLE' : 'DEBARRED (DEFAULTER)'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BCOE_Student_Register_${activeClass.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            <span>Student Attendance &amp; ID Database</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {activeClass.name} • {activeClassStudents.length} Students Registered with Individual IDs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddStudent}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>

          <button
            onClick={onOpenBulkImport}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Upload className="w-4 h-4 text-cyan-500" />
            <span>Bulk CSV Import</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Register</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="rounded-2xl p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Status & Batch Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All ({counts.all})
            </button>

            <button
              onClick={() => setStatusFilter('safe')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                statusFilter === 'safe'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Safe ≥{defaulterThreshold}% ({counts.safe})</span>
            </button>

            <button
              onClick={() => setStatusFilter('warning')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                statusFilter === 'warning'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Warning ({counts.warning})</span>
            </button>

            <button
              onClick={() => setStatusFilter('critical')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                statusFilter === 'critical'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Critical Defaulter ({counts.critical})</span>
            </button>

            {/* Batch Filter */}
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 ml-2">
              {(['ALL', 'T1', 'T2', 'T3'] as const).map(b => (
                <button
                  key={b}
                  onClick={() => setBatchFilter(b)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${batchFilter === b ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}
                >
                  {b === 'ALL' ? 'All Batches' : `Batch ${b}`}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name or PRN ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>

        </div>

      </div>

      {/* Database Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-750 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th
                  onClick={() => handleSortToggle('rollNo')}
                  className="py-3.5 px-4 w-16 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Roll</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Student Details &amp; PRN ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3 text-center">Batch</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Guardian Contact</th>
                <th className="py-3.5 px-3 text-center">Theory Ratio</th>
                <th className="py-3.5 px-3 text-center">Practical Lab Ratio</th>
                <th
                  onClick={() => handleSortToggle('percentage')}
                  className="py-3.5 px-4 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Combined %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredAndSortedStats.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    No students found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredAndSortedStats.map((st) => {
                  const s = st.student;
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-700/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-black text-sm text-slate-900 dark:text-white">
                        #{s.rollNo}
                      </td>

                      {/* Direct Student ID / PRN click */}
                      <td
                        onClick={() => onSelectStudentReport(s.id)}
                        className="py-3.5 px-4 cursor-pointer"
                      >
                        <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-cyan-600 transition-colors">
                          {s.name}
                        </div>
                        <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                          ID: {s.prn}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                          {s.batch}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 hidden md:table-cell text-slate-600 dark:text-slate-300 text-[11px]">
                        <div>{s.parentName}</div>
                        <div className="font-mono text-slate-400">{s.parentPhone}</div>
                      </td>

                      {/* Theory Ratio */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`font-bold ${st.isTheoryDefaulter ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                          {st.theoryPercentage}%
                        </span>
                        <div className="text-[9px] text-slate-400">{st.theoryAttended}/{st.theoryTotal}</div>
                      </td>

                      {/* Lab Ratio */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`font-bold ${st.isLabDefaulter ? 'text-rose-500 font-black' : 'text-purple-600 dark:text-purple-400'}`}>
                          {st.practicalPercentage}%
                        </span>
                        <div className="text-[9px] text-slate-400">{st.practicalAttended}/{st.practicalTotal}</div>
                      </td>

                      {/* Combined Attendance % */}
                      <td className="py-3.5 px-4 text-center">
                        <div className={`font-black text-sm ${
                          st.status === 'safe'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : st.status === 'warning'
                            ? 'text-amber-500'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {st.percentage}%
                        </div>
                      </td>

                      {/* Status Tag */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          st.status === 'safe'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : st.status === 'warning'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {st.status === 'safe' ? 'Eligible' : st.status === 'warning' ? 'Warning' : 'Defaulter'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectStudentReport(s.id)}
                            title="Open Student 360 Dossier"
                            className="p-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onEditStudent(s)}
                            title="Edit Student Info"
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Remove student ${s.name} from class?`)) {
                                deleteStudent(s.id);
                              }
                            }}
                            title="Delete Student"
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
