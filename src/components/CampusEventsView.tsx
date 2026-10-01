import React, { useState } from 'react';
import {
  Award,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_CAMPUS_EVENTS } from '../data/initialData';
import { CampusEvent } from '../types/attendance';

export const CampusEventsView: React.FC = () => {
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_CAMPUS_EVENTS);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [regSuccessToast, setRegSuccessToast] = useState<string | null>(null);

  const handleRegister = (ev: CampusEvent) => {
    if (registeredEvents.includes(ev.id)) {
      setRegisteredEvents(prev => prev.filter(id => id !== ev.id));
      setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, registeredCount: e.registeredCount - 1 } : e));
    } else {
      setRegisteredEvents(prev => [...prev, ev.id]);
      setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, registeredCount: e.registeredCount + 1 } : e));
      setRegSuccessToast(`Successfully registered for ${ev.title}! Entry pass generated.`);
      setTimeout(() => setRegSuccessToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Toast Alert */}
      {regSuccessToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{regSuccessToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-slate-500 font-medium">
            <span className="text-purple-600 dark:text-purple-400 font-mono font-semibold">Student Activities, Sports &amp; Technical Council</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>BCOE Badlapur (W)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Award className="w-6 h-6" />
            </div>
            <span>Campus Events, Hackathons &amp; Sports</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Participate in annual national hackathons, inter-college sports championships, and technical workshops.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {events.map((ev) => {
          const isRegistered = registeredEvents.includes(ev.id);

          return (
            <motion.div
              key={ev.id}
              whileHover={{ y: -4 }}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                isRegistered
                  ? 'bg-gradient-to-br from-emerald-50/70 via-white to-white dark:from-emerald-950/30 dark:via-[#0b1329] dark:to-[#0b1329] border-emerald-400 shadow-md ring-1 ring-emerald-400/40'
                  : 'bg-white dark:bg-[#0b1329] border-slate-200 dark:border-indigo-900/60 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-mono font-bold text-[10px] uppercase tracking-wider">
                    {ev.category}
                  </span>
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {ev.registeredCount} Registered
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                  {ev.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {ev.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-indigo-950 space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{ev.date} · {ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{ev.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-slate-400 font-sans">Coordinator:</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-sans font-semibold">{ev.coordinator}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleRegister(ev)}
                  className={`w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isRegistered
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Registration Confirmed (Pass Active)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>1-Click Free Student Registration</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
