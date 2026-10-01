import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { BharatCollegeLogo } from './BharatCollegeLogo';
import {
  AlertTriangle,
  AlertOctagon,
  Sliders,
  Send,
  Printer,
  Download,
  Sparkles,
  PhoneCall,
  Calendar,
  ExternalLink,
  MessageSquare,
  Copy,
  Check,
  Building,
  UserCheck,
  FlaskConical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StudentAttendanceStats } from '../types/attendance';

interface DefaultersViewProps {
  onSelectStudentReport: (studentId: string) => void;
}

export const DefaultersView: React.FC<DefaultersViewProps> = ({ onSelectStudentReport }) => {
  const {
    activeClass,
    defaultersList,
    defaulterThreshold,
    setDefaulterThreshold,
    currentFaculty
  } = useAttendance();

  const [selectedStudentForNotice, setSelectedStudentForNotice] = useState<StudentAttendanceStats | null>(null);
  const [noticeLanguage, setNoticeLanguage] = useState<'English' | 'Marathi'>('English');
  const [generatingNotice, setGeneratingNotice] = useState(false);
  const [generatedNoticeText, setGeneratedNoticeText] = useState<string>('');
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'lab'>('all');

  const displayedDefaulters = defaultersList.filter(d => {
    if (severityFilter === 'critical') return d.status === 'critical';
    if (severityFilter === 'lab') return d.isLabDefaulter;
    return true;
  });

  const criticalCount = defaultersList.filter(d => d.status === 'critical').length;
  const labDefaulterCount = defaultersList.filter(d => d.isLabDefaulter).length;

  const getWhatsAppLink = (d: StudentAttendanceStats) => {
    const phone = (d.student.parentPhone || d.student.phone || '').replace(/[^0-9]/g, '');
    const text = `BHARAT COLLEGE OF ENGINEERING, BADLAPUR (W) - OFFICIAL ACADEMIC NOTICE:\nDear Parent of ${d.student.name} (Roll No: ${d.student.rollNo}, PRN: ${d.student.prn}), your ward's attendance in ${activeClass.name} is critically deficient at ${d.percentage}% (Theory: ${d.theoryPercentage}%, Practical Lab: ${d.practicalPercentage}%). Minimum ${defaulterThreshold}% attendance is strictly mandatory as per University of Mumbai regulations for semester examination hall ticket clearance. Please report to the department counseling coordinator immediately.\n- ${currentFaculty.name}, Department of ${activeClass.name}`;
    return `https://wa.me/${phone.startsWith('91') ? phone : '91' + phone}?text=${encodeURIComponent(text)}`;
  };

  const handleOpenNoticeGenerator = async (d: StudentAttendanceStats) => {
    setSelectedStudentForNotice(d);
    setNoticeLanguage('English');
    setGeneratingNotice(true);
    setGeneratedNoticeText('');

    try {
      const response = await fetch('/api/ai/generate-defaulter-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: {
            name: d.student.name,
            rollNo: d.student.rollNo,
            totalSessions: d.totalSessions,
            attendedSessions: d.attendedSessions,
            attendancePercentage: d.percentage
          },
          className: activeClass.name,
          subject: activeClass.code,
          threshold: defaulterThreshold,
          facultyName: currentFaculty.name,
          collegeName: 'Bharat College of Engineering, Badlapur (W)',
          language: 'English'
        })
      });

      const data = await response.json();
      if (data.success && data.noticeText) {
        setGeneratedNoticeText(data.noticeText);
      } else {
        setGeneratedNoticeText(
          `BHARAT COLLEGE OF ENGINEERING, BADLAPUR (WEST)\nAffiliated to University of Mumbai | Approved by AICTE, New Delhi\nOpp. Railway Station, Hendre Pada, Badlapur (W), Thane - 421503\n------------------------------------------------------------\nOFFICIAL ATTENDANCE SHORTAGE NOTICE & WARNING LETTER\nDate: ${new Date().toLocaleDateString('en-GB')}\n\nTo The Parent / Guardian of:\nStudent Name: ${d.student.name}\nRoll No: ${d.student.rollNo} | PRN: ${d.student.prn}\nDepartment: ${activeClass.name}\n\nSubject: Critical shortage of attendance (Under ${defaulterThreshold}% requirement)\n\nRespected Parent/Guardian,\n\nThis is an official communication from Bharat College of Engineering to inform you that your ward has attended only ${d.attendedSessions} out of ${d.totalSessions} scheduled instructional sessions in ${activeClass.name}, recording an aggregate attendance of ${d.percentage}%\n- Theory Attendance: ${d.theoryPercentage}%\n- Practical Lab Attendance: ${d.practicalPercentage}%\n\nAs per Mumbai University Ordinance 6086, a minimum attendance of 75% is strictly compulsory to qualify for semester examinations and end-semester practical exams. Students failing to meet this requirement risk being debarred from exams and forfeiting their term-work marks.\n\nYou are requested to visit the Department within 3 working days along with your ward to meet the Head of Department and the Faculty Mentor to discuss academic recovery.\n\nYours faithfully,\n${currentFaculty.name}\nAssistant Professor & Class Coordinator\nDepartment of ${activeClass.name}\nBharat College of Engineering, Badlapur (W)`
        );
      }
    } catch (err) {
      console.error(err);
      setGeneratedNoticeText(
        `BHARAT COLLEGE OF ENGINEERING, BADLAPUR (WEST)\nOfficial Notice for ${d.student.name} (Roll ${d.student.rollNo}): Attendance stands at ${d.percentage}% (Required: ${defaulterThreshold}%). Parent reporting requested.`
      );
    } finally {
      setGeneratingNotice(false);
    }
  };

  const handleExportDefaultersCSV = () => {
    const headers = [
      'Roll No',
      'Student Name',
      'PRN ID',
      'Lab Batch',
      'Combined Attendance %',
      'Theory %',
      'Practical Lab %',
      'Lectures Needed For 75%',
      'Lab Sessions Needed For 75%',
      'Parent Contact'
    ];

    const rows = defaultersList.map(d => [
      d.student.rollNo,
      `"${d.student.name}"`,
      `"${d.student.prn}"`,
      d.student.batch,
      `${d.percentage}%`,
      `${d.theoryPercentage}%`,
      `${d.practicalPercentage}%`,
      d.lecturesNeededFor75,
      d.labSessionsNeededFor75,
      `"${d.student.parentPhone || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BCOE_Defaulters_${activeClass.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span>Attendance Defaulters &amp; Debarment Hub</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Bharat College of Engineering • Monitor students below {defaulterThreshold}% mandatory cutoff
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Notice</span>
          </button>

          <button
            onClick={handleExportDefaultersCSV}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5 border border-rose-200 dark:border-rose-900"
          >
            <Download className="w-4 h-4" />
            <span>Export Defaulter List (CSV)</span>
          </button>
        </div>
      </div>

      {/* Threshold Slider Banner */}
      <div className="rounded-2xl p-5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-500" />
              <span>University Minimum Requirement: <strong className="text-cyan-600 dark:text-cyan-400 font-black">{defaulterThreshold}%</strong></span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Students falling below this threshold are flagged for examination detention
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {[65, 70, 75, 80, 85].map((preset) => (
              <button
                key={preset}
                onClick={() => setDefaulterThreshold(preset)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  defaulterThreshold === preset
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setSeverityFilter('all')}
          className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
            severityFilter === 'all'
              ? 'bg-cyan-50/70 dark:bg-cyan-950/40 border-cyan-400 shadow-sm'
              : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Defaulters
            </span>
            <AlertTriangle className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {defaultersList.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Below {defaulterThreshold}% combined
          </p>
        </div>

        <div
          onClick={() => setSeverityFilter('critical')}
          className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
            severityFilter === 'critical'
              ? 'bg-rose-100/60 dark:bg-rose-950/50 border-rose-400 shadow-sm'
              : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Critical (&lt;65%)
            </span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600">
            {criticalCount}
          </div>
          <p className="text-[11px] text-rose-500 mt-1 font-medium">
            Immediate parent counseling required
          </p>
        </div>

        <div
          onClick={() => setSeverityFilter('lab')}
          className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
            severityFilter === 'lab'
              ? 'bg-purple-100/60 dark:bg-purple-950/50 border-purple-400 shadow-sm'
              : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Lab Defaulters
            </span>
            <FlaskConical className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600">
            {labDefaulterCount}
          </div>
          <p className="text-[11px] text-purple-500 mt-1 font-medium">
            Term-work submission at risk
          </p>
        </div>
      </div>

      {/* Defaulter List */}
      <div className="space-y-3.5">
        {displayedDefaulters.map((d) => (
          <div
            key={d.student.id}
            className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-800/90 border border-rose-200 dark:border-rose-900/60 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-base flex items-center justify-center shrink-0">
                #{d.student.rollNo}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white text-base">
                    {d.student.name}
                  </span>
                  <span className="text-xs font-mono text-cyan-600 font-bold">
                    PRN: {d.student.prn}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800">
                    Batch {d.student.batch}
                  </span>
                </div>

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                  <span>Theory: <strong className={d.isTheoryDefaulter ? 'text-rose-600 font-bold' : 'text-slate-800 dark:text-slate-200'}>{d.theoryPercentage}%</strong></span>
                  <span>•</span>
                  <span>Practical Lab: <strong className={d.isLabDefaulter ? 'text-rose-600 font-bold' : 'text-purple-600'}>{d.practicalPercentage}%</strong></span>
                  <span>•</span>
                  <span>Parent: {d.student.parentName} ({d.student.parentPhone})</span>
                </div>
              </div>
            </div>

            {/* Recovery Target */}
            <div className="rounded-xl px-4 py-2 bg-slate-50 dark:bg-slate-900 text-center shrink-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Recovery Target</div>
              <div className="text-sm font-black text-cyan-600 dark:text-cyan-400">
                Attend +{d.lecturesNeededFor75} classes
              </div>
              <div className="text-[10px] text-slate-400">to clear exam hall ticket</div>
            </div>

            {/* Percentage & Actions */}
            <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
              <div className="text-right">
                <div className="text-2xl font-black text-rose-600">{d.percentage}%</div>
                <div className="text-[10px] text-rose-500 font-bold">Combined</div>
              </div>

              <a
                href={getWhatsAppLink(d)}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp Alert</span>
              </a>

              <button
                onClick={() => handleOpenNoticeGenerator(d)}
                className="px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 font-bold text-xs flex items-center gap-1.5 border border-cyan-200 dark:border-cyan-800"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span>AI Notice</span>
              </button>

              <button
                onClick={() => onSelectStudentReport(d.student.id)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                title="Open Dossier"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Warning Letter Modal */}
      <AnimatePresence>
        {selectedStudentForNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <BharatCollegeLogo size={42} />
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base">
                      Official University Warning Notice
                    </h3>
                    <p className="text-xs text-slate-500">
                      Bharat College of Engineering • {selectedStudentForNotice.student.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 text-xs font-bold">
                    Official English
                  </span>

                  <button
                    onClick={() => setSelectedStudentForNotice(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {generatingNotice ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-8 h-8 mx-auto border-3 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-500">Drafting official notice with AI...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                    {generatedNoticeText}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedNoticeText);
                        setCopiedNotice(true);
                        setTimeout(() => setCopiedNotice(false), 2000);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5"
                    >
                      {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNotice ? 'Copied!' : 'Copy Notice'}</span>
                    </button>

                    <a
                      href={getWhatsAppLink(selectedStudentForNotice)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send to Parent WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
