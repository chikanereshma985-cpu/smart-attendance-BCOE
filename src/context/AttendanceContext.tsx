import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Faculty,
  ClassCourse,
  Student,
  AttendanceRecord,
  StudentAttendanceStats,
  StudentExamMarks,
  TimeTableSlot,
  DepartmentInfo,
  SubjectWiseStat
} from '../types/attendance';
import {
  INITIAL_FACULTY,
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  generateInitialAttendanceRecords,
  OFFICIAL_TIMETABLE_SLOTS,
  MANDATORY_FACULTY_PASSWORD,
  DEPARTMENTS_LIST
} from '../data/initialData';

interface AttendanceContextType {
  // Department
  departments: DepartmentInfo[];
  activeDepartment: DepartmentInfo;
  activeDepartmentId: string;
  setActiveDepartmentId: (id: string) => void;

  // Faculty Auth
  currentFaculty: Faculty;
  allFaculty: Faculty[];
  isAuthenticated: boolean;
  login: (faculty: Faculty) => void;
  logout: () => void;
  setCurrentFaculty: (faculty: Faculty) => void;
  updateFacultyProfile: (updated: Partial<Faculty>) => void;
  verifyFacultyPassword: (enteredPassword: string) => boolean;

  // Classes
  classes: ClassCourse[];
  activeClass: ClassCourse;
  setActiveClassId: (id: string) => void;
  addClass: (newClass: Omit<ClassCourse, 'id' | 'createdDate'>) => void;
  updateClass: (id: string, updated: Partial<ClassCourse>) => void;
  deleteClass: (id: string) => void;

  // Students
  students: Student[];
  activeClassStudents: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  bulkAddStudents: (students: Omit<Student, 'id'>[]) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  updateStudentMarks: (studentId: string, marks: Partial<StudentExamMarks>) => void;
  deleteStudent: (id: string) => void;

  // Attendance Records
  attendanceRecords: AttendanceRecord[];
  activeClassRecords: AttendanceRecord[];
  saveAttendanceRecord: (record: Omit<AttendanceRecord, 'id' | 'timestamp'> & { id?: string }) => void;
  deleteAttendanceRecord: (id: string) => void;

  // Time Table
  timeTableSlots: TimeTableSlot[];
  activeClassTimeTable: TimeTableSlot[];

  // Calculated Stats
  getStudentStats: (studentId: string) => StudentAttendanceStats | null;
  activeClassStudentStats: StudentAttendanceStats[];
  defaultersList: StudentAttendanceStats[];
  defaulterThreshold: number;
  setDefaulterThreshold: (val: number) => void;
  classSummary: {
    totalStudents: number;
    totalSessionsConducted: number;
    totalTheorySessions: number;
    totalPracticalSessions: number;
    averagePercentage: number;
    theoryAveragePercentage: number;
    practicalAveragePercentage: number;
    safeCount: number;
    warningCount: number;
    criticalCount: number;
    labDefaultersCount: number;
    examEligibleCount: number;
    examDebarredCount: number;
  };

  // UI & System
  darkMode: boolean;
  toggleDarkMode: () => void;
  isOnline: boolean;
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonData: string) => boolean;
  resetToInitialDemo: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  FACULTY: 'bcoe_att_faculty',
  CLASSES: 'bcoe_att_classes',
  STUDENTS: 'bcoe_att_students',
  RECORDS: 'bcoe_att_records',
  ACTIVE_CLASS: 'bcoe_att_active_class_id',
  ACTIVE_DEPT: 'bcoe_att_active_dept_id',
  THEME: 'bcoe_att_dark_mode',
  THRESHOLD: 'bcoe_att_threshold',
  AUTH: 'bcoe_att_is_authenticated'
};

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved !== null) return saved === 'true';
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // 2. Online / Offline status
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 3. Departments
  const [departments] = useState<DepartmentInfo[]>(DEPARTMENTS_LIST);
  const [activeDepartmentId, setActiveDepartmentIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_DEPT);
    return saved || 'dept-cse-ds';
  });

  const setActiveDepartmentId = (id: string) => {
    setActiveDepartmentIdState(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DEPT, id);
    // Switch active class to match department if available
    const deptClasses = classes.filter(c => 
      id === 'dept-cse-ds' ? c.department.includes('Data Science') :
      id === 'dept-cse-aiml' ? c.department.includes('AI') : true
    );
    if (deptClasses.length > 0) {
      setActiveClassId(deptClasses[0].id);
    }
  };

  const activeDepartment = useMemo(() => {
    return departments.find(d => d.id === activeDepartmentId) || departments[0];
  }, [departments, activeDepartmentId]);

  // 4. Faculty & Auth
  const [allFaculty] = useState<Faculty[]>(INITIAL_FACULTY);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved === 'true';
  });

  const [currentFaculty, setCurrentFacultyState] = useState<Faculty>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FACULTY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_FACULTY[0]; // Prof. Vaibhav Achalkhamb
  });

  const login = (faculty: Faculty) => {
    setCurrentFacultyState(faculty);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  const setCurrentFaculty = (fac: Faculty) => {
    setCurrentFacultyState(fac);
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(fac));
  };

  const updateFacultyProfile = (updated: Partial<Faculty>) => {
    setCurrentFacultyState(prev => {
      const neu = { ...prev, ...updated };
      localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(neu));
      return neu;
    });
  };

  const verifyFacultyPassword = (enteredPassword: string): boolean => {
    return enteredPassword === MANDATORY_FACULTY_PASSWORD;
  };

  // 5. Classes
  const [classes, setClasses] = useState<ClassCourse[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLASSES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CLASSES;
  });

  const [activeClassId, setActiveClassIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_CLASS);
    if (saved && classes.some(c => c.id === saved)) return saved;
    return 'class-te-cs-ds';
  });

  const setActiveClassId = (id: string) => {
    setActiveClassIdState(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CLASS, id);
  };

  const activeClass = useMemo(() => {
    return classes.find(c => c.id === activeClassId) || classes[0] || INITIAL_CLASSES[0];
  }, [classes, activeClassId]);

  const addClass = (newClass: Omit<ClassCourse, 'id' | 'createdDate'>) => {
    const created: ClassCourse = {
      ...newClass,
      id: `class-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    const updated = [created, ...classes];
    setClasses(updated);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(updated));
    setActiveClassId(created.id);
  };

  const updateClass = (id: string, updated: Partial<ClassCourse>) => {
    const neu = classes.map(c => (c.id === id ? { ...c, ...updated } : c));
    setClasses(neu);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(neu));
  };

  const deleteClass = (id: string) => {
    if (classes.length <= 1) return;
    const neu = classes.filter(c => c.id !== id);
    setClasses(neu);
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(neu));
    if (activeClassId === id) {
      setActiveClassId(neu[0].id);
    }
  };

  // 6. Students
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STUDENTS;
  });

  const activeClassStudents = useMemo(() => {
    return students
      .filter(s => s.classId === activeClass.id)
      .sort((a, b) => a.rollNo - b.rollNo);
  }, [students, activeClass.id]);

  const addStudent = (newStu: Omit<Student, 'id'>) => {
    const created: Student = {
      ...newStu,
      id: `stu-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    const neu = [...students, created];
    setStudents(neu);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(neu));
  };

  const bulkAddStudents = (newStudents: Omit<Student, 'id'>[]) => {
    const createdList: Student[] = newStudents.map((s, idx) => ({
      ...s,
      id: `stu-${Date.now()}-${idx}`
    }));
    const neu = [...students, ...createdList];
    setStudents(neu);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(neu));
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    const neu = students.map(s => (s.id === id ? { ...s, ...updated } : s));
    setStudents(neu);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(neu));
  };

  const updateStudentMarks = (studentId: string, marks: Partial<StudentExamMarks>) => {
    const neu = students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          marks: {
            ...(s.marks || {}),
            ...marks
          }
        };
      }
      return s;
    });
    setStudents(neu);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(neu));
  };

  const deleteStudent = (id: string) => {
    const neu = students.filter(s => s.id !== id);
    setStudents(neu);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(neu));
  };

  // 7. Attendance Records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return generateInitialAttendanceRecords();
  });

  const activeClassRecords = useMemo(() => {
    return attendanceRecords
      .filter(r => r.classId === activeClass.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendanceRecords, activeClass.id]);

  const saveAttendanceRecord = (record: Omit<AttendanceRecord, 'id' | 'timestamp'> & { id?: string }) => {
    let neu: AttendanceRecord[];
    if (record.id) {
      neu = attendanceRecords.map(r =>
        r.id === record.id
          ? { ...r, ...record, timestamp: Date.now() }
          : r
      );
    } else {
      const created: AttendanceRecord = {
        ...record,
        id: `att-${Date.now()}`,
        timestamp: Date.now()
      };
      neu = [created, ...attendanceRecords];
    }
    setAttendanceRecords(neu);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(neu));
  };

  const deleteAttendanceRecord = (id: string) => {
    const neu = attendanceRecords.filter(r => r.id !== id);
    setAttendanceRecords(neu);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(neu));
  };

  // 8. Time Table Slots
  const [timeTableSlots] = useState<TimeTableSlot[]>(OFFICIAL_TIMETABLE_SLOTS);
  const activeClassTimeTable = useMemo(() => {
    return timeTableSlots.filter(t => t.classId === activeClass.id);
  }, [timeTableSlots, activeClass.id]);

  // 9. Threshold State
  const [defaulterThreshold, setDefaulterThresholdState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THRESHOLD);
    return saved ? Number(saved) : (activeClass.targetThreshold || 75);
  });

  const setDefaulterThreshold = (val: number) => {
    setDefaulterThresholdState(val);
    localStorage.setItem(STORAGE_KEYS.THRESHOLD, String(val));
  };

  // 10. Core Calculation: Separate Theory vs Practical Lab + STRICT INDIVIDUAL 75% EXAM ELIGIBILITY
  const getStudentStats = (studentId: string): StudentAttendanceStats | null => {
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const classRecords = attendanceRecords.filter(r => r.classId === student.classId);

    const relevantSessions = classRecords.filter(r => {
      if (r.sessionType === 'theory' || !r.batch || r.batch === 'All') return true;
      return r.batch === student.batch;
    });

    const totalSessions = relevantSessions.length;

    let attendedSessions = 0;
    let theoryTotal = 0;
    let theoryAttended = 0;
    let practicalTotal = 0;
    let practicalAttended = 0;

    // Track Subject-Wise and Lab-Wise Individual Attendance
    const subjectMap: Record<string, { type: 'theory' | 'practical'; attended: number; total: number }> = {};

    relevantSessions.forEach(rec => {
      const isPresent = rec.presentStudentIds.includes(student.id);

      if (rec.sessionType === 'theory') {
        theoryTotal++;
        if (isPresent) {
          theoryAttended++;
          attendedSessions++;
        }
      } else {
        practicalTotal++;
        if (isPresent) {
          practicalAttended++;
          attendedSessions++;
        }
      }

      // Group by subject or lab
      let key = rec.topic.split(':')[0].trim();
      if (rec.sessionType === 'practical') {
        key = rec.labName || `Lab Exp (${rec.batch || 'Batch'})`;
      } else {
        const topLow = rec.topic.toLowerCase();
        if (topLow.includes('machine learning')) key = 'Machine Learning (TH)';
        else if (topLow.includes('computer network') || topLow.includes('osi')) key = 'Computer Networks (TH)';
        else if (topLow.includes('agile') || topLow.includes('scrum') || topLow.includes('kanban')) key = 'Agile Software Dev (TH)';
        else if (topLow.includes('soft computing') || topLow.includes('ai') || topLow.includes('fuzzy')) key = 'AI & Soft Computing (TH)';
        else if (topLow.includes('wireless') || topLow.includes('cellular')) key = 'Wireless Computing (TH)';
        else if (topLow.includes('algorithm')) key = 'Analysis of Algorithm (TH)';
        else key = rec.topic.slice(0, 24);
      }

      if (!subjectMap[key]) {
        subjectMap[key] = { type: rec.sessionType, attended: 0, total: 0 };
      }
      subjectMap[key].total++;
      if (isPresent) subjectMap[key].attended++;
    });

    const absentSessions = totalSessions - attendedSessions;
    const percentage = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 1000) / 10 : 100;
    const theoryPercentage = theoryTotal > 0 ? Math.round((theoryAttended / theoryTotal) * 1000) / 10 : 100;
    const practicalPercentage = practicalTotal > 0 ? Math.round((practicalAttended / practicalTotal) * 1000) / 10 : 100;

    const target = defaulterThreshold / 100;
    let status: 'safe' | 'warning' | 'critical' = 'safe';
    if (percentage < 65) {
      status = 'critical';
    } else if (percentage < defaulterThreshold) {
      status = 'warning';
    } else {
      status = 'safe';
    }

    const isTheoryDefaulter = theoryPercentage < defaulterThreshold;
    const isLabDefaulter = practicalPercentage < defaulterThreshold;

    let lecturesNeededFor75 = 0;
    if (percentage < defaulterThreshold && totalSessions > 0) {
      const numerator = target * totalSessions - attendedSessions;
      const denominator = 1 - target;
      if (denominator > 0 && numerator > 0) {
        lecturesNeededFor75 = Math.ceil(numerator / denominator);
      }
    }

    let labSessionsNeededFor75 = 0;
    if (practicalPercentage < defaulterThreshold && practicalTotal > 0) {
      const numerator = target * practicalTotal - practicalAttended;
      const denominator = 1 - target;
      if (denominator > 0 && numerator > 0) {
        labSessionsNeededFor75 = Math.ceil(numerator / denominator);
      }
    }

    // Individual Subject & Lab 75% Strict Compliance
    const subjectWiseList: SubjectWiseStat[] = Object.keys(subjectMap).map(k => {
      const item = subjectMap[k];
      const pct = item.total > 0 ? Math.round((item.attended / item.total) * 1000) / 10 : 100;
      return {
        subjectOrLab: k,
        type: item.type,
        attended: item.attended,
        total: item.total,
        percentage: pct,
        isDefaulter: pct < defaulterThreshold
      };
    });

    // STRICT UNIVERSITY RULE:
    // Every individual practical subject OR lecture 75% attendance must asel, otherwise NOT ALLOWED FOR EXAMINATION!
    const debarredReasons: string[] = [];
    subjectWiseList.forEach(s => {
      if (s.total > 0 && s.isDefaulter) {
        debarredReasons.push(`${s.subjectOrLab} (${s.percentage}%)`);
      }
    });

    if (percentage < defaulterThreshold && debarredReasons.length === 0) {
      debarredReasons.push(`Overall Attendance (${percentage}%)`);
    }

    const examEligibilityStatus: 'ALLOWED' | 'NOT_ALLOWED' = 
      (debarredReasons.length === 0 && percentage >= defaulterThreshold)
        ? 'ALLOWED'
        : 'NOT_ALLOWED';

    // Exam Marks
    const m = student.marks || {};
    const ut1 = m.ut1 ?? 15;
    const ut2 = m.ut2 ?? 16;
    const avgIA = Math.round(((ut1 + ut2) / 2) * 10) / 10;
    const practicalExam = m.practicalExam ?? 20;
    const finalTheory = m.finalTheory ?? 55;
    const totalOutOf125 = Math.round(avgIA + practicalExam + finalTheory);

    const scorePct = (totalOutOf125 / 125) * 100;
    let grade = 'B';
    if (scorePct >= 80) grade = 'O';
    else if (scorePct >= 70) grade = 'A+';
    else if (scorePct >= 60) grade = 'A';
    else if (scorePct >= 50) grade = 'B';
    else if (scorePct >= 40) grade = 'C';
    else grade = 'F';

    const isPass = ut1 >= 8 && ut2 >= 8 && practicalExam >= 10 && finalTheory >= 32;

    return {
      student,
      totalSessions,
      attendedSessions,
      absentSessions,
      percentage,
      theoryTotal,
      theoryAttended,
      theoryPercentage,
      practicalTotal,
      practicalAttended,
      practicalPercentage,
      status,
      isTheoryDefaulter,
      isLabDefaulter,
      lecturesNeededFor75,
      labSessionsNeededFor75,
      subjectWiseList,
      examEligibilityStatus,
      debarredReasons,
      marks: {
        ut1,
        ut2,
        avgIA,
        practicalExam,
        finalTheory,
        totalOutOf125,
        grade,
        isPass
      }
    };
  };

  const activeClassStudentStats = useMemo(() => {
    return activeClassStudents
      .map(s => getStudentStats(s.id))
      .filter((st): st is StudentAttendanceStats => st !== null)
      .sort((a, b) => a.student.rollNo - b.student.rollNo);
  }, [activeClassStudents, attendanceRecords, defaulterThreshold]);

  const defaultersList = useMemo(() => {
    return activeClassStudentStats
      .filter(st => st.examEligibilityStatus === 'NOT_ALLOWED' || st.percentage < defaulterThreshold)
      .sort((a, b) => a.percentage - b.percentage);
  }, [activeClassStudentStats, defaulterThreshold]);

  const classSummary = useMemo(() => {
    const totalStudents = activeClassStudents.length;
    const totalSessionsConducted = activeClassRecords.length;
    const totalTheorySessions = activeClassRecords.filter(r => r.sessionType === 'theory').length;
    const totalPracticalSessions = activeClassRecords.filter(r => r.sessionType === 'practical').length;

    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        totalSessionsConducted: 0,
        totalTheorySessions: 0,
        totalPracticalSessions: 0,
        averagePercentage: 0,
        theoryAveragePercentage: 0,
        practicalAveragePercentage: 0,
        safeCount: 0,
        warningCount: 0,
        criticalCount: 0,
        labDefaultersCount: 0,
        examEligibleCount: 0,
        examDebarredCount: 0
      };
    }

    const sumPercentages = activeClassStudentStats.reduce((acc, curr) => acc + curr.percentage, 0);
    const averagePercentage = Math.round((sumPercentages / totalStudents) * 10) / 10;

    const sumTheory = activeClassStudentStats.reduce((acc, curr) => acc + curr.theoryPercentage, 0);
    const theoryAveragePercentage = Math.round((sumTheory / totalStudents) * 10) / 10;

    const sumPractical = activeClassStudentStats.reduce((acc, curr) => acc + curr.practicalPercentage, 0);
    const practicalAveragePercentage = Math.round((sumPractical / totalStudents) * 10) / 10;

    let safeCount = 0;
    let warningCount = 0;
    let criticalCount = 0;
    let labDefaultersCount = 0;
    let examEligibleCount = 0;
    let examDebarredCount = 0;

    activeClassStudentStats.forEach(st => {
      if (st.status === 'safe') safeCount++;
      else if (st.status === 'warning') warningCount++;
      else criticalCount++;

      if (st.isLabDefaulter) labDefaultersCount++;

      if (st.examEligibilityStatus === 'ALLOWED') examEligibleCount++;
      else examDebarredCount++;
    });

    return {
      totalStudents,
      totalSessionsConducted,
      totalTheorySessions,
      totalPracticalSessions,
      averagePercentage,
      theoryAveragePercentage,
      practicalAveragePercentage,
      safeCount,
      warningCount,
      criticalCount,
      labDefaultersCount,
      examEligibleCount,
      examDebarredCount
    };
  }, [activeClassStudents, activeClassRecords, activeClassStudentStats]);

  const exportDatabaseJSON = () => {
    const data = {
      institution: 'Bharat College of Engineering, Badlapur (W)',
      version: '2.5',
      exportDate: new Date().toISOString(),
      classes,
      students,
      attendanceRecords,
      faculty: currentFaculty
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BCOE_Attendance_${activeClass.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseJSON = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.classes && parsed.students && parsed.attendanceRecords) {
        setClasses(parsed.classes);
        setStudents(parsed.students);
        setAttendanceRecords(parsed.attendanceRecords);
        if (parsed.faculty) setCurrentFaculty(parsed.faculty);
        localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(parsed.classes));
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(parsed.students));
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(parsed.attendanceRecords));
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const resetToInitialDemo = () => {
    localStorage.clear();
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setAttendanceRecords(generateInitialAttendanceRecords());
    setCurrentFaculty(INITIAL_FACULTY[0]);
    setActiveClassId(INITIAL_CLASSES[0].id);
    setActiveDepartmentIdState('dept-cse-ds');
    setDefaulterThresholdState(75);
  };

  return (
    <AttendanceContext.Provider
      value={{
        departments,
        activeDepartment,
        activeDepartmentId,
        setActiveDepartmentId,
        currentFaculty,
        allFaculty,
        isAuthenticated,
        login,
        logout,
        setCurrentFaculty,
        updateFacultyProfile,
        verifyFacultyPassword,
        classes,
        activeClass,
        setActiveClassId,
        addClass,
        updateClass,
        deleteClass,
        students,
        activeClassStudents,
        addStudent,
        bulkAddStudents,
        updateStudent,
        updateStudentMarks,
        deleteStudent,
        attendanceRecords,
        activeClassRecords,
        saveAttendanceRecord,
        deleteAttendanceRecord,
        timeTableSlots,
        activeClassTimeTable,
        getStudentStats,
        activeClassStudentStats,
        defaultersList,
        defaulterThreshold,
        setDefaulterThreshold,
        classSummary,
        darkMode,
        toggleDarkMode,
        isOnline,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetToInitialDemo
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
