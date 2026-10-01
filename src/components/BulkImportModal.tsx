import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { X, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Student } from '../types/attendance';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose }) => {
  const { activeClass, activeClassStudents, bulkAddStudents } = useAttendance();

  const [csvText, setCsvText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<Omit<Student, 'id'>[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const nextStartRoll = activeClassStudents.length > 0
    ? Math.max(...activeClassStudents.map(s => s.rollNo)) + 1
    : 1;

  const sampleCsv = `21,Manish Kute,72234021U,manish@student.edu,+91 98231 00021,Mr. Dattatray Kute,+91 98230 00021
22,Pooja Sawant,72234022V,pooja@student.edu,+91 98231 00022,Mrs. Vandana Sawant,+91 98230 00022
23,Nikhil Shinde,72234023W,nikhil@student.edu,+91 98231 00023,Mr. Ramesh Shinde,+91 98230 00023
24,Shruti Wagh,72234024X,shruti@student.edu,+91 98231 00024,Mr. Anil Wagh,+91 98230 00024
25,Abhishek Chavan,72234025Y,abhi@student.edu,+91 98231 00025,Mr. Sandeep Chavan,+91 98230 00025`;

  const handleParse = (text: string) => {
    setCsvText(text);
    setParseError(null);

    if (!text.trim()) {
      setParsedPreview([]);
      return;
    }

    try {
      const lines = text.trim().split('\n');
      const results: Omit<Student, 'id'>[] = [];

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        // Ignore header if present
        if (index === 0 && (trimmed.toLowerCase().includes('roll') || trimmed.toLowerCase().includes('name'))) {
          return;
        }

        const parts = trimmed.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length >= 2) {
          const roll = Number(parts[0]) || (nextStartRoll + results.length);
          const name = parts[1];
          const prn = parts[2] || `BCOE26DS${String(roll).padStart(3, '0')}`;
          const email = parts[3] || `${name.toLowerCase().replace(/\s+/g, '.')}@bharatengg.edu.in`;
          const phone = parts[4] || '+91 98000 00000';
          const parentName = parts[5] || 'Guardian';
          const parentPhone = parts[6] || '+91 98230 00000';
          const batch = (roll <= 8 ? 'T1' : roll <= 16 ? 'T2' : 'T3') as 'T1' | 'T2' | 'T3';

          results.push({
            rollNo: roll,
            name,
            prn,
            email,
            phone,
            parentName,
            parentPhone,
            batch,
            classId: activeClass.id
          });
        }
      });

      if (results.length === 0) {
        setParseError('No valid student rows detected. Format: Roll, Name, PRN, Email, Phone, ParentName, ParentPhone');
      } else {
        setParsedPreview(results);
      }
    } catch (e: any) {
      setParseError('Error parsing CSV: ' + e.message);
    }
  };

  const handleImport = () => {
    if (parsedPreview.length === 0) return;
    bulkAddStudents(parsedPreview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Bulk Student CSV Import
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quickly populate class roster for {activeClass.name}
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Paste CSV / Comma-Separated Values:
            </label>
            <button
              onClick={() => handleParse(sampleCsv)}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Load Sample 5 Students</span>
            </button>
          </div>

          <textarea
            rows={5}
            placeholder={`RollNo, Name, PRN, Email, StudentPhone, ParentName, ParentPhone\n21, Manish Kute, 72234021U, manish@student.edu, +91 98231 00021, Mr. Dattatray Kute, +91 98230 00021`}
            value={csvText}
            onChange={(e) => handleParse(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
          />

          {parseError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Preview of Parsed Students */}
          {parsedPreview.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Ready to Import ({parsedPreview.length} Students):
              </div>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-750 font-semibold text-slate-500">
                    <tr>
                      <th className="p-2">Roll</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">PRN</th>
                      <th className="p-2">Parent Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {parsedPreview.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="p-2 font-bold">#{s.rollNo}</td>
                        <td className="p-2">{s.name}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-400">{s.prn}</td>
                        <td className="p-2 text-slate-500">{s.parentPhone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
            disabled={parsedPreview.length === 0}
            onClick={handleImport}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Check className="w-4 h-4" />
            <span>Import {parsedPreview.length} Students</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
