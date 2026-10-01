import React, { useState } from 'react';
import {
  TrendingUp,
  BrainCircuit,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Calculator,
  UserCheck,
  Zap,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAttendance } from '../context/AttendanceContext';
import { Perspective3DCard } from './Perspective3DCard';

export const AttendancePredictionView: React.FC = () => {
  const {
    activeClass,
    activeClassStudentStats,
    activeClassRecords,
    defaulterThreshold,
    currentFaculty
  } = useAttendance();

  // Prediction Parameters
  const [totalPlannedSemesterSessions, setTotalPlannedSemesterSessions] = useState<number>(45);
  const [hypotheticalFutureRate, setHypotheticalFutureRate] = useState<number>(85); // % of remaining classes student attends
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'moderate' | 'safe'>('all');

  const conductedSessions = activeClassRecords.length || 18;
  const remainingSessions = Math.max(1, totalPlannedSemesterSessions - conductedSessions);

  // Calculate prediction for each student
  const predictedStudents = activeClassStudentStats.map(st => {
    const currentAttended = st.attendedSessions;
    const currentPercent = st.percentage;

    // Remaining lectures attended under hypothetical simulation rate
    const futureAttended = Math.round(remainingSessions * (hypotheticalFutureRate / 100));
    const projectedTotalAttended = currentAttended + futureAttended;
    const projectedFinalPercent = Math.round((projectedTotalAttended / totalPlannedSemesterSessions) * 100);

    // Minimum sessions needed from remaining to hit threshold (75%)
    // (currentAttended + X) / totalPlannedSemesterSessions >= defaulterThreshold / 100
    const neededToPass = Math.ceil((defaulterThreshold / 100) * totalPlannedSemesterSessions - currentAttended);
    const safeRemainingNeeded = Math.max(0, neededToPass);
    const canStillAchieve75 = safeRemainingNeeded <= remainingSessions;

    let riskLevel: 'Critical' | 'Moderate' | 'Safe';
    if (!canStillAchieve75 || projectedFinalPercent < 65) {
      riskLevel = 'Critical';
    } else if (projectedFinalPercent < defaulterThreshold) {
      riskLevel = 'Moderate';
    } else {
      riskLevel = 'Safe';
    }

    return {
      student: st.student,
      currentAttended,
      currentPercent,
      projectedFinalPercent,
      safeRemainingNeeded,
      canStillAchieve75,
      riskLevel,
      futureAttended
    };
  });

  const filteredStudents = predictedStudents.filter(item => {
    const matchesRisk =
      riskFilter === 'all' ||
      (riskFilter === 'high' && item.riskLevel === 'Critical') ||
      (riskFilter === 'moderate' && item.riskLevel === 'Moderate') ||
      (riskFilter === 'safe' && item.riskLevel === 'Safe');

    const matchesSearch =
      item.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.student.rollNo).includes(searchQuery) ||
      item.student.prn.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRisk && matchesSearch;
  });

  const criticalCount = predictedStudents.filter(s => s.riskLevel === 'Critical').length;
  const moderateCount = predictedStudents.filter(s => s.riskLevel === 'Moderate').length;
  const safeCount = predictedStudents.filter(s => s.riskLevel === 'Safe').length;

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Predictive Attendance Analytics</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeClass.name} · Statistical Trend Forecast
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
              End-of-Semester Attendance Forecaster
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Forecast final semester attendance eligibility before examinations occur. Simulate "What-If" future attendance rates to prevent student debarment and identify students requiring immediate counseling.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/70 p-4 rounded-2xl border border-indigo-900/60 font-mono text-xs text-right">
            <div>
              <div className="text-slate-400">Conducted / Planned</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {conductedSessions} <span className="text-slate-500">/</span> {totalPlannedSemesterSessions} Lectures
              </div>
              <div className="text-[11px] text-cyan-400">
                {remainingSessions} Sessions Remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive "What-If" Simulation Controller */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-950 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-indigo-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                "What-If" Future Attendance Simulation Slider
              </h3>
              <p className="text-xs text-slate-500">
                Adjust the expected future turnout rate across the remaining {remainingSessions} lectures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Total Term Lectures:</span>
            <input
              type="number"
              min={conductedSessions + 1}
              max={80}
              value={totalPlannedSemesterSessions}
              onChange={e => setTotalPlannedSemesterSessions(Number(e.target.value))}
              className="w-16 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900 font-mono font-bold text-xs text-center text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Slider Component */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Simulated Future Turnout: <strong className="text-cyan-600 dark:text-cyan-400 font-mono text-base">{hypotheticalFutureRate}%</strong>
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({Math.round(remainingSessions * (hypotheticalFutureRate / 100))} of {remainingSessions} remaining lectures attended)
            </span>
          </div>

          <input
            type="range"
            min={40}
            max={100}
            step={5}
            value={hypotheticalFutureRate}
            onChange={e => setHypotheticalFutureRate(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>40% (Slack)</span>
            <span>60% (Average)</span>
            <span>75% (Mandatory Cutoff)</span>
            <span>90% (Disciplined)</span>
            <span>100% (Perfect)</span>
          </div>
        </div>
      </div>

      {/* 3. Predictive Forecast Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Safe Trajectory */}
        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Predicted Exam Eligible</span>
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {safeCount} <span className="text-xs text-slate-400 font-normal">/ {predictedStudents.length} Students</span>
            </div>
            <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Forecasted &ge;75% final semester attendance
            </div>
          </div>
        </Perspective3DCard>

        {/* Moderate Risk */}
        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Moderate Defaulter Risk</span>
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {moderateCount}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Can qualify if they attend {hypotheticalFutureRate}% of remaining classes
            </div>
          </div>
        </Perspective3DCard>

        {/* Critical Risk */}
        <Perspective3DCard>
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mathematically In Danger</span>
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
                <AlertOctagon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {criticalCount}
            </div>
            <div className="mt-1 text-xs text-rose-500 font-semibold">
              Immediate HOD counseling &amp; remediation required
            </div>
          </div>
        </Perspective3DCard>
      </div>

      {/* 4. Student Prediction Roster */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-950 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-500" />
              Student-by-Student Trajectory Projections
            </h2>
            <p className="text-xs text-slate-500">
              Current attendance vs forecasted final attendance at {hypotheticalFutureRate}% turnout rate
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or roll no..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
              />
            </div>

            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-900/60 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
            >
              <option value="all">All Tiers ({predictedStudents.length})</option>
              <option value="high">Critical Risk ({criticalCount})</option>
              <option value="moderate">Moderate Risk ({moderateCount})</option>
              <option value="safe">Safe Trajectory ({safeCount})</option>
            </select>
          </div>
        </div>

        {/* Prediction Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-indigo-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-[#0b1329] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-indigo-950">
              <tr>
                <th className="py-3 px-4">Roll &amp; Student</th>
                <th className="py-3 px-4">Current Turnout</th>
                <th className="py-3 px-4">Remaining Needed for 75%</th>
                <th className="py-3 px-4">Projected Final % (@{hypotheticalFutureRate}%)</th>
                <th className="py-3 px-4">Risk Status</th>
                <th className="py-3 px-4">Action Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-indigo-950/60 font-mono">
              {filteredStudents.map(item => {
                const isUnder = item.projectedFinalPercent < defaulterThreshold;
                return (
                  <tr key={item.student.id} className="hover:bg-slate-50 dark:hover:bg-[#0d1630] transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold font-mono flex items-center justify-center text-xs">
                          {item.student.rollNo}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{item.student.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{item.student.prn}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {item.currentAttended} / {conductedSessions}
                      </div>
                      <div className={`text-xs font-bold ${item.currentPercent >= defaulterThreshold ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.currentPercent}%
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {item.safeRemainingNeeded} of {remainingSessions} lectures
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.canStillAchieve75 ? 'Mathematically Feasible' : 'Impossible to reach 75%'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className={`text-base font-black ${isUnder ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {item.projectedFinalPercent}%
                      </div>
                      <div className="w-24 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${isUnder ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, item.projectedFinalPercent)}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          item.riskLevel === 'Critical'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : item.riskLevel === 'Moderate'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {item.riskLevel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-sans text-xs text-slate-600 dark:text-slate-400">
                      {item.riskLevel === 'Critical'
                        ? 'Mandatory parent meeting & medical verification'
                        : item.riskLevel === 'Moderate'
                        ? 'Advise attending all Friday labs & tutorials'
                        : 'On track for examination clearance'}
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
