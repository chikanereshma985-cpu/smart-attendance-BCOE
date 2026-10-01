import React, { useState, useEffect } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { X, UserPlus, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { Student } from '../types/attendance';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  studentToEdit
}) => {
  const { activeClass, activeClassStudents, addStudent, updateStudent } = useAttendance();

  // Find next suggested roll number
  const nextRollNo = activeClassStudents.length > 0
    ? Math.max(...activeClassStudents.map(s => s.rollNo)) + 1
    : 1;

  const [rollNo, setRollNo] = useState<number>(nextRollNo);
  const [name, setName] = useState('');
  const [prn, setPrn] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [batch, setBatch] = useState<'T1' | 'T2' | 'T3' | 'S1' | 'S2' | 'S3'>('T1');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  useEffect(() => {
    if (studentToEdit) {
      setRollNo(studentToEdit.rollNo);
      setName(studentToEdit.name);
      setPrn(studentToEdit.prn);
      setEmail(studentToEdit.email);
      setPhone(studentToEdit.phone);
      setParentName(studentToEdit.parentName || '');
      setParentPhone(studentToEdit.parentPhone || '');
      setBatch(studentToEdit.batch || 'T1');
      setGender(studentToEdit.gender || 'Male');
    } else {
      setRollNo(nextRollNo);
      setName('');
      setPrn(`BCOE26DS${String(nextRollNo).padStart(3, '0')}`);
      setEmail('');
      setPhone('');
      setParentName('');
      setParentPhone('');
      setBatch(nextRollNo <= 8 ? 'T1' : nextRollNo <= 16 ? 'T2' : 'T3');
      setGender('Male');
    }
  }, [studentToEdit, nextRollNo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Student name is required.');
      return;
    }

    if (studentToEdit) {
      updateStudent(studentToEdit.id, {
        rollNo: Number(rollNo),
        name: name.trim(),
        prn: prn.trim() || `PRN-${rollNo}`,
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@bharatengg.edu.in`,
        phone: phone.trim() || '+91 98000 00000',
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
        batch,
        gender
      });
    } else {
      addStudent({
        rollNo: Number(rollNo),
        name: name.trim(),
        prn: prn.trim() || `BCOE26DS${String(rollNo).padStart(3, '0')}`,
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@bharatengg.edu.in`,
        phone: phone.trim() || '+91 98000 00000',
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
        classId: activeClass.id,
        batch,
        gender
      });
    }

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
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {studentToEdit ? 'Edit Student Details' : 'Add Student to Class'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeClass.name} • {activeClass.division}
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
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Roll No *
              </label>
              <input
                type="number"
                min="1"
                value={rollNo}
                onChange={(e) => setRollNo(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold text-xs"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Reshma Chikanere"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                PRN / Registration ID
              </label>
              <input
                type="text"
                placeholder="e.g. 72234021A"
                value={prn}
                onChange={(e) => setPrn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Email
              </label>
              <input
                type="email"
                placeholder="student@engg.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Parent / Guardian Name
              </label>
              <input
                type="text"
                placeholder="e.g. Mr. Sanjay Sharma"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Parent Phone (WhatsApp Alert)
              </label>
              <input
                type="text"
                placeholder="+91 98230 12345"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
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
              <Save className="w-4 h-4" />
              <span>{studentToEdit ? 'Save Changes' : 'Enroll Student'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
