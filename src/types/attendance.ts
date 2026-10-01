export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  employeeId: string;
  collegeName: string;
  phone?: string;
  avatar?: string;
  abbreviation?: string; // e.g. "VA", "RJ"
  subjects?: string[];
}

export interface DepartmentInfo {
  id: string;
  name: string;
  shortName: string;
  hodName: string;
  hodAbbreviation: string;
  totalClassrooms: string;
  classCount: number;
}

export interface ClassCourse {
  id: string;
  name: string;
  code: string;
  department: string;
  semester: number;
  academicYear: string;
  division: string;
  classRoom: string; // e.g. "B105 (ITI BUILDING)"
  coordinator: string; // e.g. "Prof. Asha Gaikar"
  targetThreshold: number; // default 75
  totalPlannedSessions: number;
  createdDate: string;
}

export interface StudentExamMarks {
  ut1?: number; // Unit Test 1 (max 20)
  ut2?: number; // Unit Test 2 (max 20)
  practicalExam?: number; // Practical / Oral (max 25)
  finalTheory?: number; // Final Theory Exam (max 80)
}

export interface Student {
  id: string;
  rollNo: number;
  prn: string; // Permanent Registration Number / Student ID e.g. BCOE26DS001
  name: string;
  email: string;
  phone: string;
  parentPhone: string;
  parentName: string;
  classId: string;
  batch: 'T1' | 'T2' | 'T3' | 'S1' | 'S2' | 'S3'; // Practical / Lab Batch
  gender?: 'Male' | 'Female' | 'Other';
  marks?: StudentExamMarks;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  sessionType: 'theory' | 'practical';
  batch?: 'All' | 'T1' | 'T2' | 'T3' | 'S1' | 'S2' | 'S3';
  labName?: string; // e.g. "ML LAB", "AI LAB", "NETWORK LAB", "NLP LAB", "PROG LAB"
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:15 AM - 11:15 AM" or "02:45 PM - 04:45 PM"
  topic: string;
  conductedByFacultyId: string;
  facultyName?: string;
  presentStudentIds: string[];
  absentStudentIds: string[];
  notes?: string;
  timestamp: number;
}

export interface SubjectWiseStat {
  subjectOrLab: string;
  type: 'theory' | 'practical';
  attended: number;
  total: number;
  percentage: number;
  isDefaulter: boolean; // <75%
}

export interface StudentAttendanceStats {
  student: Student;
  totalSessions: number;
  attendedSessions: number;
  absentSessions: number;
  percentage: number;
  
  // Specific Separate Ratio for Theory vs Lab / Practical
  theoryTotal: number;
  theoryAttended: number;
  theoryPercentage: number;
  practicalTotal: number;
  practicalAttended: number;
  practicalPercentage: number;

  status: 'safe' | 'warning' | 'critical';
  isTheoryDefaulter: boolean;
  isLabDefaulter: boolean;
  lecturesNeededFor75: number;
  labSessionsNeededFor75: number;

  // Strict Policy: 75% Mandatory in EVERY individual Subject & Practical Lab
  subjectWiseList: SubjectWiseStat[];
  examEligibilityStatus: 'ALLOWED' | 'NOT_ALLOWED';
  debarredReasons: string[]; // List of subjects / practicals below 75%

  // Marks Summary
  marks: {
    ut1: number;
    ut2: number;
    avgIA: number; // Average Internal Assessment (UT1 + UT2) / 2
    practicalExam: number;
    finalTheory: number;
    totalOutOf125: number;
    grade: string;
    isPass: boolean;
  };
}

export interface TimeTableSlot {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  time: string; // "10:15 AM - 11:15 AM", etc.
  classId: string;
  subjectCode: string;
  subjectName: string;
  subjectAbbreviation: string;
  facultyName: string;
  facultyAbbreviation: string;
  type: 'theory' | 'practical' | 'special';
  labName?: string;
  batch?: string; // e.g. "T1", "T2", "T3" or "All"
  room: string;
}

export interface AIAnalysisResult {
  overallHealth: 'Healthy' | 'Moderate Risk' | 'Critical Deficit';
  classAverage: number;
  defaulterCount: number;
  summary: string;
  actionableRecommendations: string[];
  atRiskPatterns: {
    rollNo: string | number;
    name: string;
    percentage: number;
    riskLevel: 'High' | 'Moderate' | 'Critical';
    advice?: string;
  }[];
}

// College Friendly Campus Companion Types
export interface CampusNotice {
  id: string;
  title: string;
  titleMr?: string;
  category: 'Exam' | 'Academic' | 'Holiday' | 'Event' | 'Placement';
  date: string;
  department: string;
  isUrgent?: boolean;
  content: string;
  fileAttachment?: string;
}

export interface CanteenItem {
  id: string;
  name: string;
  nameMr: string;
  price: number;
  category: 'Snacks' | 'Meals' | 'Beverages' | 'Specials';
  isVeg: boolean;
  rating: number;
  available: boolean;
  prepTime: string;
  popular?: boolean;
}

export interface CampusEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: 'TechFest' | 'Cultural' | 'Sports' | 'Hackathon';
  coordinator: string;
  description: string;
  registeredCount: number;
}

export interface BusSchedule {
  id: string;
  departureTime: string;
  fromLocation: string;
  toLocation: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  status: 'On Time' | 'Boarding Now' | 'Scheduled' | 'Departed';
}

export interface StudyMaterial {
  id: string;
  subject: string;
  subjectCode: string;
  title: string;
  type: 'QuestionPaper' | 'LabManual' | 'Syllabus' | 'Notes';
  yearOrSemester: string;
  fileSize: string;
  facultyAuthor: string;
}

// Complete Faculty Ecosystem Types
export interface SyllabusPlan {
  id: string;
  subjectCode: string;
  subjectName: string;
  className: string;
  totalUnits: number;
  completedUnits: number;
  totalPlannedLectures: number;
  conductedLectures: number;
  facultyName: string;
  status: 'On Track' | 'Ahead of Schedule' | 'Needs Catch-up';
  lastUpdatedDate: string;
}

export interface FacultyLeaveProxy {
  id: string;
  facultyId: string;
  facultyName: string;
  leaveType: 'Casual Leave (CL)' | 'Duty Leave (DL)' | 'Medical Leave (ML)';
  startDate: string;
  endDate: string;
  reason: string;
  proxyFacultyName: string;
  affectedSlot: string;
  status: 'Approved by HOD' | 'Pending Review';
}

export interface MentorshipNote {
  id: string;
  studentId: string;
  studentRollNo: number;
  studentName: string;
  date: string;
  facultyMentor: string;
  category: 'Attendance Shortage (<75%)' | 'Exam Performance' | 'Personal Mentoring';
  actionPoints: string;
  followUpRequired: boolean;
}


