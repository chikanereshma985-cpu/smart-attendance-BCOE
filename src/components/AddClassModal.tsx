import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { X, Plus, School, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose }) => {
  const { addClass, currentFaculty } = useAttendance();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [division, setDivision] = useState('Div A');
  const [department, setDepartment] = useState(currentFaculty.department || 'Computer Science & Engineering');
  const [classRoom, setClassRoom] = useState('B105 (ITI BUILDING)');
  const [coordinator, setCoordinator] = useState('Prof. Asha Gaikar');
  const [semester, setSemester] = useState<number>(5);
  const [academicYear, setAcademicYear] = useState('2026-27 (ODD SEMESTER)');
  const [targetThreshold, setTargetThreshold] = useState<number>(75);
  const [totalPlannedSessions, setTotalPlannedSessions] = useState<number>(42);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      alert('Please fill in Course/Class name and Subject Code.');
      return;
    }

    addClass({
      name: name.trim(),
      code: code.trim(),
      division: division.trim() || 'Div A',
      department: department.trim() || currentFaculty.department,
      classRoom: classRoom.trim() || 'B105 (ITI BUILDING)',
      coordinator: coordinator.trim() || 'Prof. Asha Gaikar',
      semester: Number(semester) || 1,
      academicYear: academicYear.trim() || '2026-27 (ODD SEMESTER)',
      targetThreshold: Number(targetThreshold) || 75,
      totalPlannedSessions: Number(totalPlannedSessions) || 40
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Add New Class / Subject
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a class register for this semester
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Class / Course Name *
            </label>
            <input
              type="text"
              placeholder="e.g. BE Computer Engineering"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Code &amp; Title *
              </label>
              <input
                type="text"
                placeholder="e.g. CS801 - Cloud Computing"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Division / Section
              </label>
              <input
                type="text"
                placeholder="e.g. Div A / Batch 1"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-xs"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Sem {s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Min %
              </label>
              <input
                type="number"
                min="50"
                max="95"
                value={targetThreshold}
                onChange={(e) => setTargetThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Class</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
