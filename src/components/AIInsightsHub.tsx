import React, { useState, useEffect } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  Sparkles,
  TrendingDown,
  ShieldAlert,
  BrainCircuit,
  RefreshCw,
  Lightbulb,
  CheckCircle,
  Copy,
  ChevronRight,
  Send,
  Building,
  Languages
} from 'lucide-react';
import { motion } from 'motion/react';
import { AIAnalysisResult } from '../types/attendance';

interface AIInsightsHubProps {
  onSelectStudentReport: (studentId: string) => void;
}

export const AIInsightsHub: React.FC<AIInsightsHubProps> = ({ onSelectStudentReport }) => {
  const {
    activeClass,
    activeClassStudentStats,
    activeClassRecords,
    defaulterThreshold,
    currentFaculty
  } = useAttendance();

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const studentPayload = activeClassStudentStats.map(s => ({
        rollNo: s.student.rollNo,
        name: s.student.name,
        attendancePercentage: s.percentage,
        attendedSessions: s.attendedSessions,
        totalSessions: s.totalSessions,
        status: s.status
      }));

      const res = await fetch('/api/ai/analyze-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: activeClass.name,
          subject: activeClass.code,
          threshold: defaulterThreshold,
          students: studentPayload,
          sessionsCount: activeClassRecords.length
        })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [activeClass.id, defaulterThreshold]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <span>AI Attendance Intelligence &amp; Counseling Hub</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Powered by Gemini • Automated drop-off risk detection &amp; counseling strategy
          </p>
        </div>

        <button
          onClick={runAnalysis}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing Class...' : 'Re-Run AI Analysis'}</span>
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl p-16 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-center space-y-3">
          <div className="w-10 h-10 mx-auto border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Gemini is analyzing student attendance trajectory...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Evaluating attendance consistency, spotting chronic absentees, and formulating counseling strategies.
          </p>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          
          {/* Executive Diagnosis Banner */}
          <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-sm uppercase tracking-wider text-indigo-300">
                  Academic Health Diagnosis
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                analysis.overallHealth === 'Healthy'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : analysis.overallHealth === 'Moderate Risk'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
              }`}>
                {analysis.overallHealth}
              </span>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-slate-200">
              {analysis.summary}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span>Class Average: <strong className="text-white">{analysis.classAverage}%</strong></span>
                <span>•</span>
                <span>Flagged Defaulters: <strong className="text-rose-400">{analysis.defaulterCount}</strong></span>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(analysis.summary);
                  setCopiedSummary(true);
                  setTimeout(() => setCopiedSummary(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1.5 transition-colors"
              >
                {copiedSummary ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Copied' : 'Copy Diagnosis'}</span>
              </button>
            </div>
          </div>

          {/* Actionable Faculty Recommendations */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Actionable Faculty Recommendations
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {analysis.actionableRecommendations?.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highest Risk Students Breakdown */}
          {analysis.atRiskPatterns && analysis.atRiskPatterns.length > 0 && (
            <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    High Vulnerability Students
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Priority for Academic Mentoring
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {analysis.atRiskPatterns.map((p, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-center shrink-0">
                        #{p.rollNo}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {p.name}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {p.advice || 'Recommend immediate parental notification and 1-on-1 counseling.'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                      <span className="font-black text-sm text-rose-600 dark:text-rose-400">
                        {p.percentage}%
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        p.riskLevel === 'High' || p.riskLevel === 'Critical'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {p.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : null}

    </div>
  );
};
