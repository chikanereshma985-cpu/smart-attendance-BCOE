import React, { useState } from 'react';
import {
  Boxes,
  RotateCw,
  Sparkles,
  Layers,
  Cpu,
  Activity,
  Maximize2,
  Building2,
  Users,
  Compass,
  Zap,
  Globe,
  MonitorCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Interactive3DFacultyCanvas } from './Interactive3DFacultyCanvas';
import { Perspective3DCard } from './Perspective3DCard';
import { useAttendance } from '../context/AttendanceContext';

export const Campus3DExperienceView: React.FC = () => {
  const { activeClass, activeDepartment, currentFaculty } = useAttendance();
  const [selectedNode, setSelectedNode] = useState<string>('cs-ds');

  const campusNodes = [
    {
      id: 'cs-ds',
      title: 'Dept of Computer Science & Data Science',
      code: 'CSE-DS',
      floor: '3rd Floor - Tech Wing',
      head: 'Prof. Rupali Jadhav',
      activeLabs: 4,
      studentsCount: 204,
      status: 'Live & Operational'
    },
    {
      id: 'it',
      title: 'Department of Information Technology',
      code: 'IT',
      floor: '2nd Floor - Innovation Block',
      head: 'Prof. Sandeep Patil',
      activeLabs: 3,
      studentsCount: 180,
      status: 'Live & Operational'
    },
    {
      id: 'extc',
      title: 'Electronics & Telecommunication',
      code: 'EXTC',
      floor: '1st Floor - Hardware Lab Wing',
      head: 'Prof. Sneha Deshmukh',
      activeLabs: 3,
      studentsCount: 120,
      status: 'Active Class in Session'
    },
    {
      id: 'mech',
      title: 'Department of Mechanical Engineering',
      code: 'MECH',
      floor: 'Ground Floor - Workshop & CAD Labs',
      head: 'Prof. Rajesh Sharma',
      activeLabs: 5,
      studentsCount: 150,
      status: 'Workshop Practical Active'
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold uppercase tracking-wider">
                Three.js WebGL Engine · 60 FPS
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Bharat College of Engineering · Real-Time 3D Digital Twin
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Boxes className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
              Interactive 3D Campus Hologram &amp; Cyber Twin
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Experience the college faculty ecosystem in real-time 3D. Rotate the holographic campus core with your mouse or touch gestures to view active academic nodes, telemetry streams, and department status.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Full 3D Interactive Canvas Component */}
      <div className="rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl bg-[#070c18]">
        <Interactive3DFacultyCanvas variant="standalone" className="h-[380px] sm:h-[480px]" />
      </div>

      {/* 3. 3D Department Node Explorer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-500" />
              Connected Campus Nodes &amp; Academic Wings
            </h3>
            <p className="text-xs text-slate-500">
              Interactive 3D telemetry cards synchronized with the physical college campus
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            All 4 Nodes Connected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {campusNodes.map(node => (
            <Perspective3DCard key={node.id} depth={15}>
              <div
                onClick={() => setSelectedNode(node.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer h-full ${
                  selectedNode === node.id
                    ? 'bg-gradient-to-b from-cyan-950/50 to-indigo-950/50 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : 'bg-white dark:bg-[#0b1329] border-slate-200 dark:border-indigo-900/50 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 rounded-md">
                    {node.code}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3 line-clamp-1">
                  {node.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {node.floor}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-indigo-950 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>HOD:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{node.head}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Active Labs:</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{node.activeLabs} Labs</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Enrolled Students:</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{node.studentsCount}</span>
                  </div>
                </div>
              </div>
            </Perspective3DCard>
          ))}
        </div>
      </div>
    </div>
  );
};
