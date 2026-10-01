/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { Navbar } from './components/Navbar';
import { NavigationTabs, TabType } from './components/NavigationTabs';
import { DashboardOverview } from './components/DashboardOverview';
import { TimeTableView } from './components/TimeTableView';
import { MarkAttendanceView } from './components/MarkAttendanceView';
import { StudentDatabaseView } from './components/StudentDatabaseView';
import { ExamsAssessmentView } from './components/ExamsAssessmentView';
import { DefaultersView } from './components/DefaultersView';
import { StudentReportsView } from './components/StudentReportsView';
import { AIInsightsHub } from './components/AIInsightsHub';
import { CampusHubView } from './components/CampusHubView';
import { CanteenView } from './components/CanteenView';
import { CampusNoticesView } from './components/CampusNoticesView';
import { CampusEventsView } from './components/CampusEventsView';
import { StudyVaultView } from './components/StudyVaultView';
import { FacultyAcademicDiaryView } from './components/FacultyAcademicDiaryView';
import { FacultyLeaveProxyView } from './components/FacultyLeaveProxyView';
import { FacultyMentorshipView } from './components/FacultyMentorshipView';
import { Campus3DExperienceView } from './components/Campus3DExperienceView';
import { AttendancePredictionView } from './components/AttendancePredictionView';

import { AddClassModal } from './components/AddClassModal';
import { AddStudentModal } from './components/AddStudentModal';
import { BulkImportModal } from './components/BulkImportModal';
import { RollCallModal } from './components/RollCallModal';
import { AIPhotoScannerModal } from './components/AIPhotoScannerModal';
import { FacultyLoginModal } from './components/FacultyLoginModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { FacultyLoginPage } from './components/FacultyLoginPage';

import { Student, TimeTableSlot } from './types/attendance';
import { motion, AnimatePresence } from 'motion/react';
import { Boxes, Building2, CheckSquare, BookMarked, LayoutDashboard } from 'lucide-react';

const MainDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('campus-hub');

  // Modal states
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  // Student detailed dossier
  const [selectedStudentReportId, setSelectedStudentReportId] = useState<string | null>(null);

  // Slot prefill from timetable to attendance
  const [prefilledSlot, setPrefilledSlot] = useState<TimeTableSlot | null>(null);

  // Fast Roll Call modal state
  const [rollCallConfig, setRollCallConfig] = useState<{
    isOpen: boolean;
    initialPresentIds: string[];
    date: string;
    slot: string;
    topic: string;
    onComplete: (presentIds: string[]) => void;
  }>({
    isOpen: false,
    initialPresentIds: [],
    date: '',
    slot: '',
    topic: '',
    onComplete: () => {}
  });

  // AI Photo Scanner modal state
  const [scannerConfig, setScannerConfig] = useState<{
    isOpen: boolean;
    onScanned: (presentRolls: (string | number)[], absentRolls: (string | number)[]) => void;
  }>({
    isOpen: false,
    onScanned: () => {}
  });

  const handleOpenRollCall = (
    initialPresentIds: string[],
    date: string,
    slot: string,
    topic: string,
    onComplete: (presentIds: string[]) => void
  ) => {
    setRollCallConfig({
      isOpen: true,
      initialPresentIds,
      date,
      slot,
      topic,
      onComplete
    });
  };

  const handleOpenScanner = (
    onScanned: (presentRolls: (string | number)[], absentRolls: (string | number)[]) => void
  ) => {
    setScannerConfig({
      isOpen: true,
      onScanned
    });
  };

  const handleEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsAddStudentOpen(true);
  };

  const handleStartAttendanceFromSlot = (slot: TimeTableSlot) => {
    setPrefilledSlot(slot);
    setActiveTab('mark-attendance');
  };

  const handleStartLiveAttendance = (slotInfo: {
    sessionType: 'theory' | 'practical';
    batch: 'All' | 'T1' | 'T2' | 'T3';
    labName?: string;
    timeSlot: string;
    topic: string;
  }) => {
    setPrefilledSlot({
      day: 'WED',
      time: slotInfo.timeSlot,
      classId: 'class-te-cs-ds',
      subjectCode: 'BCOE-LIVE',
      subjectName: slotInfo.topic,
      subjectAbbreviation: slotInfo.topic.slice(0, 10),
      facultyName: 'Prof. Vaibhav Achalkhamb',
      facultyAbbreviation: 'VA',
      type: slotInfo.sessionType,
      labName: slotInfo.labName,
      batch: slotInfo.batch,
      room: slotInfo.labName || 'B105'
    });
    setActiveTab('mark-attendance');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-slate-100 transition-colors tech-grid-pattern relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Ambient Cyber Tech Glow Lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-64 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar with Bharat College of Engineering Logo */}
      <Navbar
        onOpenAddClass={() => setIsAddClassOpen(true)}
        onOpenFacultyModal={() => setIsFacultyModalOpen(true)}
        onSelectStudentReport={(id) => setSelectedStudentReportId(id)}
      />

      {/* Navigation Tab Bar */}
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {activeTab === '3d-campus' && (
              <Campus3DExperienceView />
            )}

            {activeTab === 'campus-hub' && (
              <CampusHubView
                setActiveTab={setActiveTab}
                onSelectStudentReport={(id) => setSelectedStudentReportId(id)}
              />
            )}

            {activeTab === 'teaching-diary' && (
              <FacultyAcademicDiaryView />
            )}

            {activeTab === 'leave-proxy' && (
              <FacultyLeaveProxyView />
            )}

            {activeTab === 'mentorship' && (
              <FacultyMentorshipView />
            )}

            {activeTab === 'canteen' && (
              <CanteenView />
            )}

            {activeTab === 'notices' && (
              <CampusNoticesView />
            )}

            {activeTab === 'events' && (
              <CampusEventsView />
            )}

            {activeTab === 'study-vault' && (
              <StudyVaultView />
            )}

            {activeTab === 'dashboard' && (
              <DashboardOverview
                setActiveTab={setActiveTab}
                onOpenAddStudent={() => {
                  setStudentToEdit(null);
                  setIsAddStudentOpen(true);
                }}
                onSelectStudentReport={(id) => setSelectedStudentReportId(id)}
                onStartLiveAttendance={handleStartLiveAttendance}
              />
            )}

            {activeTab === 'prediction' && (
              <AttendancePredictionView />
            )}

            {activeTab === 'timetable' && (
              <TimeTableView
                onStartAttendanceFromSlot={handleStartAttendanceFromSlot}
              />
            )}

            {activeTab === 'mark-attendance' && (
              <MarkAttendanceView
                onOpenRollCallModal={handleOpenRollCall}
                onOpenScannerModal={handleOpenScanner}
                prefillSlot={prefilledSlot}
                onClearPrefillSlot={() => setPrefilledSlot(null)}
              />
            )}

            {activeTab === 'students' && (
              <StudentDatabaseView
                onOpenAddStudent={() => {
                  setStudentToEdit(null);
                  setIsAddStudentOpen(true);
                }}
                onOpenBulkImport={() => setIsBulkImportOpen(true)}
                onSelectStudentReport={(id) => setSelectedStudentReportId(id)}
                onEditStudent={handleEditStudent}
              />
            )}

            {activeTab === 'exams' && (
              <ExamsAssessmentView
                onSelectStudentReport={(id) => setSelectedStudentReportId(id)}
              />
            )}

            {activeTab === 'defaulters' && (
              <DefaultersView
                onSelectStudentReport={(id) => setSelectedStudentReportId(id)}
              />
            )}

            {activeTab === 'reports' && (
              <StudentReportsView
                onSelectStudentReport={(id) => setSelectedStudentReportId(id)}
              />
            )}

            {activeTab === 'ai-insights' && (
              <AIInsightsHub
                onSelectStudentReport={(id) => setSelectedStudentReportId(id)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AddClassModal
        isOpen={isAddClassOpen}
        onClose={() => setIsAddClassOpen(false)}
      />

      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => {
          setIsAddStudentOpen(false);
          setStudentToEdit(null);
        }}
        studentToEdit={studentToEdit}
      />

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
      />

      <RollCallModal
        isOpen={rollCallConfig.isOpen}
        onClose={() => setRollCallConfig(prev => ({ ...prev, isOpen: false }))}
        initialPresentIds={rollCallConfig.initialPresentIds}
        date={rollCallConfig.date}
        slot={rollCallConfig.slot}
        topic={rollCallConfig.topic}
        onComplete={rollCallConfig.onComplete}
      />

      <AIPhotoScannerModal
        isOpen={scannerConfig.isOpen}
        onClose={() => setScannerConfig(prev => ({ ...prev, isOpen: false }))}
        onScanned={scannerConfig.onScanned}
      />

      <FacultyLoginModal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
      />

      <StudentDetailModal
        studentId={selectedStudentReportId}
        onClose={() => setSelectedStudentReportId(null)}
      />

      {/* Mobile Bottom Navigation Bar (Visible on mobile/small screens for 1-thumb ergonomics) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#070c18]/95 backdrop-blur-xl border-t border-slate-200 dark:border-indigo-950 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('campus-hub')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            activeTab === 'campus-hub' ? 'text-cyan-500 font-bold' : 'text-slate-500'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px]">Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('3d-campus')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            activeTab === '3d-campus' ? 'text-cyan-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Boxes className="w-5 h-5 animate-pulse" />
          <span className="text-[10px]">3D Campus</span>
        </button>

        <button
          onClick={() => setActiveTab('mark-attendance')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all shadow-md ${
            activeTab === 'mark-attendance'
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold'
              : 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] font-bold">Attendance</span>
        </button>

        <button
          onClick={() => setActiveTab('teaching-diary')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            activeTab === 'teaching-diary' ? 'text-cyan-500 font-bold' : 'text-slate-500'
          }`}
        >
          <BookMarked className="w-5 h-5" />
          <span className="text-[10px]">Diary</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">ERP</span>
        </button>
      </div>

    </div>
  );
};

const RootApp: React.FC = () => {
  const { isAuthenticated } = useAttendance();

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div
          key="login-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
        >
          <FacultyLoginPage />
        </motion.div>
      ) : (
        <motion.div
          key="main-portal"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <MainDashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AttendanceProvider>
      <RootApp />
    </AttendanceProvider>
  );
}
