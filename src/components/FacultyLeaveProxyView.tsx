import React, { useState } from 'react';
import {
  CalendarDays,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Send,
  Calendar,
  FileText,
  ShieldCheck,
  Users,
  Briefcase,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAttendance } from '../context/AttendanceContext';
import { Perspective3DCard } from './Perspective3DCard';

interface LeaveApplication {
  id: string;
  applicantFacultyName: string;
  leaveType: 'Casual Leave (CL)' | 'Duty Leave (DL)' | 'Medical Leave (ML)';
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  proxyFacultyName: string;
  proxySubject: string;
  proxySlot: string;
  proxyStatus: 'Accepted' | 'Pending' | 'Declined';
  hodApprovalStatus: 'Approved' | 'Pending HOD Approval' | 'Under Review';
  appliedDate: string;
}

const INITIAL_LEAVE_APPLICATIONS: LeaveApplication[] = [
  {
    id: 'leave-101',
    applicantFacultyName: 'Prof. Rupali Jadhav',
    leaveType: 'Duty Leave (DL)',
    fromDate: '2026-10-06',
    toDate: '2026-10-06',
    totalDays: 1,
    reason: 'Deputed as University of Mumbai External Examiner for TE Practical Viva at Pillai College of Engineering.',
    proxyFacultyName: 'Prof. Sandeep Patil',
    proxySubject: 'Analysis of Algorithms (AOA)',
    proxySlot: '10:15 AM - 12:15 PM (Classroom 302)',
    proxyStatus: 'Accepted',
    hodApprovalStatus: 'Approved',
    appliedDate: '2026-09-28'
  },
  {
    id: 'leave-102',
    applicantFacultyName: 'Prof. Sandeep Patil',
    leaveType: 'Casual Leave (CL)',
    fromDate: '2026-10-12',
    toDate: '2026-10-13',
    totalDays: 2,
    reason: 'Family urgent personal commitment in Pune.',
    proxyFacultyName: 'Prof. Rupali Jadhav',
    proxySubject: 'Computer Networks (CN)',
    proxySlot: '01:15 PM - 02:15 PM',
    proxyStatus: 'Accepted',
    hodApprovalStatus: 'Approved',
    appliedDate: '2026-09-29'
  },
  {
    id: 'leave-103',
    applicantFacultyName: 'Prof. Rupali Jadhav',
    leaveType: 'Duty Leave (DL)',
    fromDate: '2026-10-19',
    toDate: '2026-10-20',
    totalDays: 2,
    reason: 'Attending IEEE International Conference on AI & Big Data as Invited Research Speaker.',
    proxyFacultyName: 'Prof. Sneha Deshmukh',
    proxySubject: 'AOA Lab (Batch S2)',
    proxySlot: '02:30 PM - 04:30 PM',
    proxyStatus: 'Pending',
    hodApprovalStatus: 'Pending HOD Approval',
    appliedDate: '2026-09-30'
  }
];

export const FacultyLeaveProxyView: React.FC = () => {
  const { currentFaculty, allFaculty } = useAttendance();
  const [leaves, setLeaves] = useState<LeaveApplication[]>(INITIAL_LEAVE_APPLICATIONS);
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'my-leaves' | 'proxy-requests'>('my-leaves');

  // Form State
  const [leaveType, setLeaveType] = useState<LeaveApplication['leaveType']>('Casual Leave (CL)');
  const [fromDate, setFromDate] = useState<string>('2026-10-15');
  const [toDate, setToDate] = useState<string>('2026-10-15');
  const [reason, setReason] = useState<string>('');
  const [selectedProxyFaculty, setSelectedProxyFaculty] = useState<string>('Prof. Sandeep Patil');
  const [proxySubject, setProxySubject] = useState<string>('Analysis of Algorithms (AOA)');
  const [proxySlot, setProxySlot] = useState<string>('10:15 AM - 11:15 AM (Room 302)');

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const newApp: LeaveApplication = {
      id: `leave-${Date.now()}`,
      applicantFacultyName: currentFaculty.name,
      leaveType,
      fromDate,
      toDate,
      totalDays: fromDate === toDate ? 1 : 2,
      reason,
      proxyFacultyName: selectedProxyFaculty,
      proxySubject,
      proxySlot,
      proxyStatus: 'Pending',
      hodApprovalStatus: 'Pending HOD Approval',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaves([newApp, ...leaves]);
    setShowApplyModal(false);
    setReason('');
  };

  const handleProxyAction = (id: string, status: 'Accepted' | 'Declined') => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, proxyStatus: status } : l));
  };

  const myLeaves = leaves.filter(l => l.applicantFacultyName.includes(currentFaculty.name) || currentFaculty.name.includes('Rupali'));
  const proxyRequestsAssignedToMe = leaves.filter(l => l.proxyFacultyName.includes(currentFaculty.name) || currentFaculty.name.includes('Rupali'));

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold uppercase tracking-wider">
                Department Faculty Governance
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Bharat College of Engineering · Administrative Portal
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <CalendarDays className="w-8 h-8 text-cyan-400" />
              Faculty Leave &amp; Proxy Substitution Portal
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Apply for casual, duty, or medical leaves with seamless peer lecture substitution. Ensures zero instructional downtime for students and maintains complete department compliance.
            </p>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Apply For Leave &amp; Proxy</span>
          </button>
        </div>
      </div>

      {/* 2. Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Casual Leave (CL)</span>
              <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white font-mono">
              7 <span className="text-xs text-slate-400 font-normal">/ 12 Days Remaining</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">Credited for Academic Year 2025-26</div>
          </div>
        </Perspective3DCard>

        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duty Leave (DL)</span>
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              10 <span className="text-xs text-slate-400 font-normal">/ 15 Days Available</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">For Mumbai University Exam / Conference duty</div>
          </div>
        </Perspective3DCard>

        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Proxy Substituted</span>
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              100%
            </div>
            <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              All scheduled lectures covered by colleagues
            </div>
          </div>
        </Perspective3DCard>
      </div>

      {/* 3. Sub Tabs & Applications Board */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-950 shadow-sm space-y-4">
        
        {/* Sub Navigation */}
        <div className="flex border-b border-slate-200 dark:border-indigo-950 gap-4">
          <button
            onClick={() => setActiveSubTab('my-leaves')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeSubTab === 'my-leaves'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Applied Leaves &amp; Substitutions ({myLeaves.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('proxy-requests')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeSubTab === 'proxy-requests'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Proxy Substitution Assigned to Me ({proxyRequestsAssignedToMe.length})</span>
          </button>
        </div>

        {/* Tab 1: My Applied Leaves */}
        {activeSubTab === 'my-leaves' && (
          <div className="space-y-3">
            {myLeaves.map(leave => (
              <div
                key={leave.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                      {leave.leaveType}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Duration: {leave.fromDate} {leave.fromDate !== leave.toDate ? `to ${leave.toDate}` : ''} ({leave.totalDays} Day{leave.totalDays > 1 ? 's' : ''})
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    Reason: {leave.reason}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-500" />
                      Substitute Faculty: <strong className="text-slate-800 dark:text-slate-200">{leave.proxyFacultyName}</strong>
                    </span>
                    <span>•</span>
                    <span>Slot: <strong>{leave.proxySlot}</strong> ({leave.proxySubject})</span>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-col items-end gap-2 text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      leave.hodApprovalStatus === 'Approved'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    }`}
                  >
                    HOD: {leave.hodApprovalStatus}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold ${
                      leave.proxyStatus === 'Accepted'
                        ? 'text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/70'
                        : 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70'
                    }`}
                  >
                    Proxy: {leave.proxyStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Proxy Requests Assigned to Me */}
        {activeSubTab === 'proxy-requests' && (
          <div className="space-y-3">
            {proxyRequestsAssignedToMe.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {req.applicantFacultyName} requested you to substitute
                    </span>
                    <span className="text-xs text-slate-500 font-mono">({req.fromDate})</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Subject: <strong>{req.proxySubject}</strong> · Slot: <strong>{req.proxySlot}</strong>
                  </p>

                  <p className="text-xs text-slate-500 italic">
                    Applicant note: "{req.reason}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {req.proxyStatus === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleProxyAction(req.id, 'Accepted')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Substitution</span>
                      </button>
                      <button
                        onClick={() => handleProxyAction(req.id, 'Declined')}
                        className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Substitution Confirmed</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Apply Leave Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-indigo-950">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Apply For Faculty Leave</h3>
                    <p className="text-xs text-slate-500">Designate substitute professor for scheduled lectures</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={e => setLeaveType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                    <option value="Duty Leave (DL)">Duty Leave (DL - University Exam/CAP/Conf)</option>
                    <option value="Medical Leave (ML)">Medical Leave (ML)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">From Date</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={e => setFromDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">To Date</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={e => setToDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Reason for Leave (Official College Record)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Attending Mumbai University CAP paper assessment duty at examination center."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                {/* Proxy Allocation Section */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 space-y-3">
                  <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-cyan-500" />
                    <span>Peer Lecture Substitution (Mandatory)</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Select Department Colleague as Substitute
                    </label>
                    <select
                      value={selectedProxyFaculty}
                      onChange={e => setSelectedProxyFaculty(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                    >
                      {allFaculty
                        .filter(f => f.name !== currentFaculty.name)
                        .map(f => (
                          <option key={f.id} value={f.name}>{f.name} ({f.department})</option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject to Cover</label>
                      <input
                        type="text"
                        value={proxySubject}
                        onChange={e => setProxySubject(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Slot &amp; Room</label>
                      <input
                        type="text"
                        value={proxySlot}
                        onChange={e => setProxySlot(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/60 text-slate-900 dark:text-white focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-indigo-950">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit to HOD &amp; Notify Proxy</span>
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
