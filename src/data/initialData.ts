import { Faculty, ClassCourse, Student, AttendanceRecord, TimeTableSlot, DepartmentInfo } from '../types/attendance';

export const MANDATORY_FACULTY_PASSWORD = '<ZhWbFJ&Y@^BCOEP2026';

export const DEPARTMENTS_LIST: DepartmentInfo[] = [
  {
    id: 'dept-cse-ds',
    name: 'Computer Science and Engineering (Data Science)',
    shortName: 'CSE (Data Science)',
    hodName: 'Prof. Asha Gaikar',
    hodAbbreviation: 'AG',
    totalClassrooms: 'B105, B107 (ITI Building)',
    classCount: 2
  },
  {
    id: 'dept-cse-aiml',
    name: 'Computer Science and Engineering (AI & ML)',
    shortName: 'CSE (AI & ML)',
    hodName: 'Prof. Pratiksha Shinde',
    hodAbbreviation: 'PS',
    totalClassrooms: 'B108, B109 (ITI Building)',
    classCount: 2
  },
  {
    id: 'dept-it',
    name: 'Information Technology Department',
    shortName: 'Information Technology',
    hodName: 'Prof. Dimple Gupta',
    hodAbbreviation: 'DG',
    totalClassrooms: 'B104, B106 (ITI Building)',
    classCount: 1
  }
];

export const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'fac-vaibhav',
    name: 'Prof. Vaibhav Achalkhamb',
    email: 'vaibhav.achalkhamb@bharatengg.edu.in',
    department: 'Computer Science and Engineering (Data Science)',
    designation: 'Assistant Professor & Machine Learning Lab Head',
    employeeId: 'BCOE-CSE-2026',
    collegeName: 'Bharat College of Engineering, Badlapur (W)',
    phone: '+91 98221 44556',
    abbreviation: 'VA',
    subjects: ['Machine Learning (ML PR)', 'NLP Lab', 'Python Data Science']
  },
  {
    id: 'fac-rupali',
    name: 'Prof. Rupali Jadhav',
    email: 'rupali.jadhav@bharatengg.edu.in',
    department: 'Computer Science and Engineering (Data Science)',
    designation: 'Assistant Professor & Algorithms In-Charge',
    employeeId: 'BCOE-CSE-2045',
    collegeName: 'Bharat College of Engineering, Badlapur (W)',
    phone: '+91 98221 77889',
    abbreviation: 'RJ',
    subjects: ['Analysis of Algorithm (AOA TH & PR)', 'Data Structures']
  },
  {
    id: 'fac-asha',
    name: 'Prof. Asha Gaikar',
    email: 'asha.gaikar@bharatengg.edu.in',
    department: 'Computer Science and Engineering (Data Science)',
    designation: 'HOD & TE Class Co-ordinator',
    employeeId: 'BCOE-CSE-1002',
    collegeName: 'Bharat College of Engineering, Badlapur (W)',
    phone: '+91 98221 11223',
    abbreviation: 'AG',
    subjects: ['Agile Software Development (ASD)', 'Big Data Analytics (BDA)']
  },
  {
    id: 'fac-payal',
    name: 'Prof. Payal Tidke',
    email: 'payal.tidke@bharatengg.edu.in',
    department: 'Computer Science and Engineering (Data Science)',
    designation: 'Assistant Professor & SE Class Co-ordinator',
    employeeId: 'BCOE-CSE-1015',
    collegeName: 'Bharat College of Engineering, Badlapur (W)',
    phone: '+91 98221 33445',
    abbreviation: 'PT',
    subjects: ['Discrete Structures & Graph Theory (DSGT)', 'AI Lab', 'Blockchain Technologies (BT)']
  },
  {
    id: 'fac-deepali',
    name: 'Prof. Deepali Joshi',
    email: 'deepali.joshi@bharatengg.edu.in',
    department: 'Computer Science and Engineering (Data Science)',
    designation: 'Assistant Professor',
    employeeId: 'BCOE-CSE-1022',
    collegeName: 'Bharat College of Engineering, Badlapur (W)',
    phone: '+91 98221 55667',
    abbreviation: 'DJ',
    subjects: ['Computer Networks (CN)', 'Computer Organization & Architecture (COA)']
  }
];

export const INITIAL_CLASSES: ClassCourse[] = [
  {
    id: 'class-te-cs-ds',
    name: 'TE Computer Science & Engineering (Data Science)',
    code: 'SEM V (w.e.f. 28/09/2026)',
    department: 'Computer Science and Engineering (Data Science)',
    semester: 5,
    academicYear: '2026-27 (ODD SEMESTER)',
    division: 'Div A',
    classRoom: 'B105 (ITI BUILDING)',
    coordinator: 'Prof. Asha Gaikar',
    targetThreshold: 75,
    totalPlannedSessions: 42,
    createdDate: '2026-09-28'
  },
  {
    id: 'class-se-cs-ds',
    name: 'SE Computer Science & Engineering (Data Science)',
    code: 'SEM III (w.e.f. 28/09/2026)',
    department: 'Computer Science and Engineering (Data Science)',
    semester: 3,
    academicYear: '2026-27 (ODD SEMESTER)',
    division: 'Div A',
    classRoom: 'B107 (ITI BUILDING)',
    coordinator: 'Prof. Payal Tidke',
    targetThreshold: 75,
    totalPlannedSessions: 40,
    createdDate: '2026-09-28'
  },
  {
    id: 'class-be-cs-aiml',
    name: 'BE Computer Science & Engineering (AI&ML)',
    code: 'SEM VII (w.e.f. 28/09/2026)',
    department: 'Computer Science and Engineering (AI&ML)',
    semester: 7,
    academicYear: '2026-27 (ODD SEMESTER)',
    division: 'Div A',
    classRoom: 'B109 (ITI BUILDING)',
    coordinator: 'Prof. Swati Gaikwad',
    targetThreshold: 75,
    totalPlannedSessions: 38,
    createdDate: '2026-09-28'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-101',
    rollNo: 1,
    prn: 'BCOE26DS001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@bharatengg.edu.in',
    phone: '+91 98231 00001',
    parentPhone: '+91 98230 00001',
    parentName: 'Mr. Dinesh Sharma',
    classId: 'class-te-cs-ds',
    batch: 'T1',
    gender: 'Male',
    marks: { ut1: 18, ut2: 19, practicalExam: 23, finalTheory: 72 }
  },
  {
    id: 'stu-102',
    rollNo: 2,
    prn: 'BCOE26DS002',
    name: 'Reshma Chikanere',
    email: 'reshma.c@bharatengg.edu.in',
    phone: '+91 98231 00002',
    parentPhone: '+91 98230 00002',
    parentName: 'Mrs. Sunita Chikanere',
    classId: 'class-te-cs-ds',
    batch: 'T1',
    gender: 'Female',
    marks: { ut1: 19, ut2: 20, practicalExam: 24, finalTheory: 76 }
  },
  {
    id: 'stu-103',
    rollNo: 3,
    prn: 'BCOE26DS003',
    name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@bharatengg.edu.in',
    phone: '+91 98231 00003',
    parentPhone: '+91 98230 00003',
    parentName: 'Mr. Prakash Deshmukh',
    classId: 'class-te-cs-ds',
    batch: 'T1',
    gender: 'Male',
    marks: { ut1: 9, ut2: 11, practicalExam: 14, finalTheory: 38 }
  },
  {
    id: 'stu-104',
    rollNo: 4,
    prn: 'BCOE26DS004',
    name: 'Snehal Patil',
    email: 'snehal.patil@bharatengg.edu.in',
    phone: '+91 98231 00004',
    parentPhone: '+91 98230 00004',
    parentName: 'Mr. Anand Patil',
    classId: 'class-te-cs-ds',
    batch: 'T1',
    gender: 'Female',
    marks: { ut1: 17, ut2: 18, practicalExam: 22, finalTheory: 68 }
  },
  {
    id: 'stu-105',
    rollNo: 5,
    prn: 'BCOE26DS005',
    name: 'Siddharth Shinde',
    email: 'siddharth.s@bharatengg.edu.in',
    phone: '+91 98231 00005',
    parentPhone: '+91 98230 00005',
    parentName: 'Mr. Sanjay Shinde',
    classId: 'class-te-cs-ds',
    batch: 'T1',
    gender: 'Male',
    marks: { ut1: 16, ut2: 17, practicalExam: 21, finalTheory: 65 }
  },
  {
    id: 'stu-106',
    rollNo: 6,
    prn: 'BCOE26DS006',
    name: 'Priya Kulkarni',
    email: 'priya.kulkarni@bharatengg.edu.in',
    phone: '+91 98231 00006',
    parentPhone: '+91 98230 00006',
    parentName: 'Mr. Mahesh Kulkarni',
    classId: 'class-te-cs-ds',
    batch: 'T1',
    gender: 'Female',
    marks: { ut1: 18, ut2: 19, practicalExam: 24, finalTheory: 74 }
  },
  {
    id: 'stu-107',
    rollNo: 7,
    prn: 'BCOE26DS007',
    name: 'Aditya Joshi',
    email: 'aditya.joshi@bharatengg.edu.in',
    phone: '+91 98231 00007',
    parentPhone: '+91 98230 00007',
    parentName: 'Mr. Shrikant Joshi',
    classId: 'class-te-cs-ds',
    batch: 'T1',
    gender: 'Male',
    marks: { ut1: 15, ut2: 16, practicalExam: 20, finalTheory: 62 }
  },
  {
    id: 'stu-108',
    rollNo: 8,
    prn: 'BCOE26DS008',
    name: 'Tanvi Pawar',
    email: 'tanvi.pawar@bharatengg.edu.in',
    phone: '+91 98231 00008',
    parentPhone: '+91 98230 00008',
    parentName: 'Mrs. Meena Pawar',
    classId: 'class-te-cs-ds',
    batch: 'T1',
    gender: 'Female',
    marks: { ut1: 17, ut2: 18, practicalExam: 23, finalTheory: 70 }
  },
  {
    id: 'stu-109',
    rollNo: 9,
    prn: 'BCOE26DS009',
    name: 'Omkar Jadhav',
    email: 'omkar.jadhav@bharatengg.edu.in',
    phone: '+91 98231 00009',
    parentPhone: '+91 98230 00009',
    parentName: 'Mr. Ashok Jadhav',
    classId: 'class-te-cs-ds',
    batch: 'T2',
    gender: 'Male',
    marks: { ut1: 11, ut2: 12, practicalExam: 15, finalTheory: 44 }
  },
  {
    id: 'stu-110',
    rollNo: 10,
    prn: 'BCOE26DS010',
    name: 'Ananya Kadam',
    email: 'ananya.kadam@bharatengg.edu.in',
    phone: '+91 98231 00010',
    parentPhone: '+91 98230 00010',
    parentName: 'Mr. Ravindra Kadam',
    classId: 'class-te-cs-ds',
    batch: 'T2',
    gender: 'Female',
    marks: { ut1: 18, ut2: 18, practicalExam: 23, finalTheory: 71 }
  },
  {
    id: 'stu-111',
    rollNo: 11,
    prn: 'BCOE26DS011',
    name: 'Karan Mehra',
    email: 'karan.mehra@bharatengg.edu.in',
    phone: '+91 98231 00011',
    parentPhone: '+91 98230 00011',
    parentName: 'Mr. Vikram Mehra',
    classId: 'class-te-cs-ds',
    batch: 'T2',
    gender: 'Male',
    marks: { ut1: 13, ut2: 14, practicalExam: 17, finalTheory: 52 }
  },
  {
    id: 'stu-112',
    rollNo: 12,
    prn: 'BCOE26DS012',
    name: 'Gauri Gaikwad',
    email: 'gauri.g@bharatengg.edu.in',
    phone: '+91 98231 00012',
    parentPhone: '+91 98230 00012',
    parentName: 'Mr. Nitin Gaikwad',
    classId: 'class-te-cs-ds',
    batch: 'T2',
    gender: 'Female',
    marks: { ut1: 19, ut2: 19, practicalExam: 24, finalTheory: 75 }
  },
  {
    id: 'stu-113',
    rollNo: 13,
    prn: 'BCOE26DS013',
    name: 'Prathamesh More',
    email: 'prathamesh.m@bharatengg.edu.in',
    phone: '+91 98231 00013',
    parentPhone: '+91 98230 00013',
    parentName: 'Mr. Suresh More',
    classId: 'class-te-cs-ds',
    batch: 'T2',
    gender: 'Male',
    marks: { ut1: 16, ut2: 17, practicalExam: 21, finalTheory: 64 }
  },
  {
    id: 'stu-114',
    rollNo: 14,
    prn: 'BCOE26DS014',
    name: 'Isha Verma',
    email: 'isha.verma@bharatengg.edu.in',
    phone: '+91 98231 00014',
    parentPhone: '+91 98230 00014',
    parentName: 'Mr. Rajesh Verma',
    classId: 'class-te-cs-ds',
    batch: 'T2',
    gender: 'Female',
    marks: { ut1: 17, ut2: 18, practicalExam: 22, finalTheory: 69 }
  },
  {
    id: 'stu-115',
    rollNo: 15,
    prn: 'BCOE26DS015',
    name: 'Varun Thorat',
    email: 'varun.thorat@bharatengg.edu.in',
    phone: '+91 98231 00015',
    parentPhone: '+91 98230 00015',
    parentName: 'Mr. Deepak Thorat',
    classId: 'class-te-cs-ds',
    batch: 'T2',
    gender: 'Male',
    marks: { ut1: 12, ut2: 13, practicalExam: 16, finalTheory: 48 }
  },
  {
    id: 'stu-116',
    rollNo: 16,
    prn: 'BCOE26DS016',
    name: 'Sakshi Kale',
    email: 'sakshi.kale@bharatengg.edu.in',
    phone: '+91 98231 00016',
    parentPhone: '+91 98230 00016',
    parentName: 'Mr. Arvind Kale',
    classId: 'class-te-cs-ds',
    batch: 'T2',
    gender: 'Female',
    marks: { ut1: 18, ut2: 19, practicalExam: 23, finalTheory: 73 }
  },
  {
    id: 'stu-117',
    rollNo: 17,
    prn: 'BCOE26DS017',
    name: 'Tejas Sonawane',
    email: 'tejas.sonawane@bharatengg.edu.in',
    phone: '+91 98231 00017',
    parentPhone: '+91 98230 00017',
    parentName: 'Mr. Balasaheb Sonawane',
    classId: 'class-te-cs-ds',
    batch: 'T3',
    gender: 'Male',
    marks: { ut1: 15, ut2: 16, practicalExam: 20, finalTheory: 61 }
  },
  {
    id: 'stu-118',
    rollNo: 18,
    prn: 'BCOE26DS018',
    name: 'Riya Naik',
    email: 'riya.naik@bharatengg.edu.in',
    phone: '+91 98231 00018',
    parentPhone: '+91 98230 00018',
    parentName: 'Mrs. Archana Naik',
    classId: 'class-te-cs-ds',
    batch: 'T3',
    gender: 'Female',
    marks: { ut1: 17, ut2: 18, practicalExam: 22, finalTheory: 68 }
  },
  {
    id: 'stu-119',
    rollNo: 19,
    prn: 'BCOE26DS019',
    name: 'Harshwardhan Bhosale',
    email: 'harsh.bhosale@bharatengg.edu.in',
    phone: '+91 98231 00019',
    parentPhone: '+91 98230 00019',
    parentName: 'Mr. Dilip Bhosale',
    classId: 'class-te-cs-ds',
    batch: 'T3',
    gender: 'Male',
    marks: { ut1: 10, ut2: 11, practicalExam: 13, finalTheory: 40 }
  },
  {
    id: 'stu-120',
    rollNo: 20,
    prn: 'BCOE26DS020',
    name: 'Divya Nalawade',
    email: 'divya.nalawade@bharatengg.edu.in',
    phone: '+91 98231 00020',
    parentPhone: '+91 98230 00020',
    parentName: 'Mr. Mohan Nalawade',
    classId: 'class-te-cs-ds',
    batch: 'T3',
    gender: 'Female',
    marks: { ut1: 19, ut2: 19, practicalExam: 24, finalTheory: 77 }
  }
];

// Past Attendance Records: Separate Theory vs Practical Lab Batches!
export function generateInitialAttendanceRecords(): AttendanceRecord[] {
  const sessions: Omit<AttendanceRecord, 'id' | 'timestamp' | 'presentStudentIds' | 'absentStudentIds'>[] = [
    // 1. Theory
    {
      classId: 'class-te-cs-ds',
      sessionType: 'theory',
      batch: 'All',
      date: '2026-09-08',
      timeSlot: '11:15 AM - 12:15 PM',
      topic: 'Machine Learning Basics: Supervised vs Unsupervised Learning',
      conductedByFacultyId: 'fac-vaibhav',
      facultyName: 'Prof. Vaibhav Achalkhamb'
    },
    // 2. Practical Lab Batch T1 (ML LAB - Prof. Vaibhav Achalkhamb)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'practical',
      batch: 'T1',
      labName: 'ML LAB / NLP LAB',
      date: '2026-09-09',
      timeSlot: '02:45 PM - 04:45 PM',
      topic: 'Lab Exp 1: Linear Regression & Gradient Descent in Python',
      conductedByFacultyId: 'fac-vaibhav',
      facultyName: 'Prof. Vaibhav Achalkhamb'
    },
    // 3. Theory (Agile Software Development - Prof. Asha Gaikar)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'theory',
      batch: 'All',
      date: '2026-09-10',
      timeSlot: '01:45 PM - 02:45 PM',
      topic: 'Scrum Sprints & Agile Manifestos',
      conductedByFacultyId: 'fac-asha',
      facultyName: 'Prof. Asha Gaikar'
    },
    // 4. Practical Lab Batch T2 (ML LAB - Prof. Vaibhav Achalkhamb)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'practical',
      batch: 'T2',
      labName: 'ML LAB / NLP LAB',
      date: '2026-09-11',
      timeSlot: '02:45 PM - 04:45 PM',
      topic: 'Lab Exp 1: Linear Regression Model Tuning & Scikit-learn',
      conductedByFacultyId: 'fac-vaibhav',
      facultyName: 'Prof. Vaibhav Achalkhamb'
    },
    // 5. Theory (Computer Networks - Prof. Deepali Joshi)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'theory',
      batch: 'All',
      date: '2026-09-14',
      timeSlot: '10:15 AM - 11:15 AM',
      topic: 'OSI 7-Layer Architecture & TCP/IP Header',
      conductedByFacultyId: 'fac-deepali',
      facultyName: 'Prof. Deepali Joshi'
    },
    // 6. Practical Lab Batch T3 (ML LAB - Prof. Vaibhav Achalkhamb)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'practical',
      batch: 'T3',
      labName: 'LANG LAB / ML LAB',
      date: '2026-09-15',
      timeSlot: '12:45 PM - 02:45 PM',
      topic: 'Lab Exp 1: Feature Scaling & Model Loss Curve Evaluation',
      conductedByFacultyId: 'fac-vaibhav',
      facultyName: 'Prof. Vaibhav Achalkhamb'
    },
    // 7. Theory (Wireless & Mobile Computing)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'theory',
      batch: 'All',
      date: '2026-09-17',
      timeSlot: '12:45 PM - 01:45 PM',
      topic: 'Cellular Concepts, Frequency Reuse & Hand-off',
      conductedByFacultyId: 'fac-asha',
      facultyName: 'Prof. Manbodh Gond'
    },
    // 8. Practical Lab Batch T1 (ML LAB - Prof. Vaibhav Achalkhamb)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'practical',
      batch: 'T1',
      labName: 'ML LAB',
      date: '2026-09-18',
      timeSlot: '02:45 PM - 04:45 PM',
      topic: 'Lab Exp 2: Logistic Regression & Confusion Matrix Metrics',
      conductedByFacultyId: 'fac-vaibhav',
      facultyName: 'Prof. Vaibhav Achalkhamb'
    },
    // 9. Theory (AI & Soft Computing - Prof. Shital Gujar)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'theory',
      batch: 'All',
      date: '2026-09-21',
      timeSlot: '10:15 AM - 11:15 AM',
      topic: 'Fuzzy Logic & Membership Functions',
      conductedByFacultyId: 'fac-payal',
      facultyName: 'Prof. Shital Gujar'
    },
    // 10. Practical Lab Batch T2 (ML LAB - Prof. Vaibhav Achalkhamb)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'practical',
      batch: 'T2',
      labName: 'ML LAB',
      date: '2026-09-22',
      timeSlot: '02:45 PM - 04:45 PM',
      topic: 'Lab Exp 2: Logistic Regression Classification on Iris Dataset',
      conductedByFacultyId: 'fac-vaibhav',
      facultyName: 'Prof. Vaibhav Achalkhamb'
    },
    // 11. Theory (Machine Learning Theory)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'theory',
      batch: 'All',
      date: '2026-09-24',
      timeSlot: '11:15 AM - 12:15 PM',
      topic: 'Decision Trees, ID3, C4.5 & Information Gain',
      conductedByFacultyId: 'fac-vaibhav',
      facultyName: 'Prof. Vaibhav Achalkhamb'
    },
    // 12. Practical Lab Batch T3 (ML LAB - Prof. Vaibhav Achalkhamb)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'practical',
      batch: 'T3',
      labName: 'LANG LAB',
      date: '2026-09-25',
      timeSlot: '12:45 PM - 02:45 PM',
      topic: 'Lab Exp 2: Classification Precision, Recall & F1-Score',
      conductedByFacultyId: 'fac-vaibhav',
      facultyName: 'Prof. Vaibhav Achalkhamb'
    },
    // 13. Theory (Agile Development - Prof. Asha Gaikar)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'theory',
      batch: 'All',
      date: '2026-09-28',
      timeSlot: '01:45 PM - 02:45 PM',
      topic: 'Kanban boards, Jira Workflow & Continuous Delivery',
      conductedByFacultyId: 'fac-asha',
      facultyName: 'Prof. Asha Gaikar'
    },
    // 14. Practical Lab Batch T1 (ML LAB - Prof. Vaibhav Achalkhamb)
    {
      classId: 'class-te-cs-ds',
      sessionType: 'practical',
      batch: 'T1',
      labName: 'ML LAB',
      date: '2026-09-29',
      timeSlot: '02:45 PM - 04:45 PM',
      topic: 'Lab Exp 3: Support Vector Machines (SVM) & Kernel Trick',
      conductedByFacultyId: 'fac-vaibhav',
      facultyName: 'Prof. Vaibhav Achalkhamb'
    }
  ];

  return sessions.map((s, index) => {
    const presentIds: string[] = [];
    const absentIds: string[] = [];

    // Filter which students are eligible for this session (if batch-specific)
    const eligibleStudents = INITIAL_STUDENTS.filter(stu => {
      if (s.sessionType === 'theory' || !s.batch || s.batch === 'All') return true;
      return stu.batch === s.batch;
    });

    eligibleStudents.forEach(student => {
      let isPresent = true;

      if (student.rollNo === 3) {
        // Rohan: Defaulter in both theory and lab (attended only 40%)
        isPresent = [0, 4, 8].includes(index);
      } else if (student.rollNo === 9) {
        // Omkar: Low attendance in labs
        isPresent = index % 2 === 0;
      } else if (student.rollNo === 11) {
        // Karan: Warning zone
        isPresent = index % 3 !== 0;
      } else if (student.rollNo === 19) {
        // Harshwardhan: Missed several sessions
        isPresent = index % 2 !== 0;
      } else {
        // Safe students: 85-95% attendance
        isPresent = (student.rollNo * 3 + index * 7) % 7 !== 0;
      }

      if (isPresent) {
        presentIds.push(student.id);
      } else {
        absentIds.push(student.id);
      }
    });

    return {
      id: `att-rec-${index + 1}`,
      classId: s.classId,
      sessionType: s.sessionType,
      batch: s.batch,
      labName: s.labName,
      date: s.date,
      timeSlot: s.timeSlot,
      topic: s.topic,
      conductedByFacultyId: s.conductedByFacultyId,
      facultyName: s.facultyName,
      presentStudentIds: presentIds,
      absentStudentIds: absentIds,
      timestamp: new Date(s.date).getTime() + index * 1000
    };
  });
}

// Authentic Bharat College Time Table extracted from the official PDF
export const OFFICIAL_TIMETABLE_SLOTS: TimeTableSlot[] = [
  // MONDAY
  { day: 'MON', time: '10:15 AM - 11:15 AM', classId: 'class-te-cs-ds', subjectCode: '2485311', subjectName: 'Social Media Marketing', subjectAbbreviation: 'SMM(JL)', facultyName: 'Prof. Johnson Lathe', facultyAbbreviation: 'JL', type: 'theory', room: 'B105' },
  { day: 'MON', time: '11:15 AM - 12:15 PM', classId: 'class-te-cs-ds', subjectCode: '2485311', subjectName: 'Social Media Marketing', subjectAbbreviation: 'SMM(JL)', facultyName: 'Prof. Johnson Lathe', facultyAbbreviation: 'JL', type: 'theory', room: 'B105' },
  { day: 'MON', time: '12:45 PM - 01:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485211', subjectName: 'Wireless & Mobile Computing', subjectAbbreviation: 'WMC(MG)', facultyName: 'Prof. Manbodh Gond', facultyAbbreviation: 'MG', type: 'theory', room: 'B105' },
  { day: 'MON', time: '01:45 PM - 02:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485113', subjectName: 'Agile Software Development', subjectAbbreviation: 'ASD(AG)', facultyName: 'Prof. Asha Gaikar', facultyAbbreviation: 'AG', type: 'theory', room: 'B105' },
  { day: 'MON', time: '02:45 PM - 04:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485116', subjectName: 'CN Lab (Batch T1)', subjectAbbreviation: 'CN(T1)_AI LAB', facultyName: 'Prof. Gayatri Sonawane', facultyAbbreviation: 'GS', type: 'practical', labName: 'AI LAB', batch: 'T1', room: 'AI LAB' },
  { day: 'MON', time: '02:45 PM - 04:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485113', subjectName: 'ASD Lab (Batch T2)', subjectAbbreviation: 'ASD(T2)_NETWORK LAB', facultyName: 'Prof. Hemangi Bhoir', facultyAbbreviation: 'HAB', type: 'practical', labName: 'NETWORK LAB', batch: 'T2', room: 'NETWORK LAB' },
  { day: 'MON', time: '02:45 PM - 04:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485112', subjectName: 'AI&SC Lab (Batch T3)', subjectAbbreviation: 'AI&SC(T3)_ML LAB', facultyName: 'Prof. Payal Tidke', facultyAbbreviation: 'PT', type: 'practical', labName: 'ML LAB', batch: 'T3', room: 'ML LAB' },
  { day: 'MON', time: '04:45 PM - 05:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485511', subjectName: 'Indian Knowledge System', subjectAbbreviation: 'IKS(HB)', facultyName: 'Prof. Hemant Bhalerao', facultyAbbreviation: 'HB', type: 'theory', room: 'B105' },

  // TUESDAY
  { day: 'TUE', time: '10:15 AM - 11:15 AM', classId: 'class-te-cs-ds', subjectCode: '2485116', subjectName: 'Computer Networks', subjectAbbreviation: 'CN(DJ)', facultyName: 'Prof. Deepali Joshi', facultyAbbreviation: 'DJ', type: 'theory', room: 'B105' },
  { day: 'TUE', time: '11:15 AM - 12:15 PM', classId: 'class-te-cs-ds', subjectCode: '2485111', subjectName: 'Machine Learning', subjectAbbreviation: 'ML(SG)', facultyName: 'Prof. Swati Gaikwad', facultyAbbreviation: 'SG', type: 'theory', room: 'B105' },
  { day: 'TUE', time: '12:45 PM - 01:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485113', subjectName: 'Agile Software Development', subjectAbbreviation: 'ASD(AG)', facultyName: 'Prof. Asha Gaikar', facultyAbbreviation: 'AG', type: 'theory', room: 'B105' },
  { day: 'TUE', time: '01:45 PM - 02:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485211', subjectName: 'Wireless & Mobile Computing', subjectAbbreviation: 'WMC(MG)', facultyName: 'Prof. Manbodh Gond', facultyAbbreviation: 'MG', type: 'theory', room: 'B105' },
  { day: 'TUE', time: '02:45 PM - 04:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485111', subjectName: 'Machine Learning Lab (Batch T2)', subjectAbbreviation: 'ML(T2)_NLP LAB(VA)', facultyName: 'Prof. Vaibhav Achalkhamb', facultyAbbreviation: 'VA', type: 'practical', labName: 'NLP LAB', batch: 'T2', room: 'NLP LAB' },
  { day: 'TUE', time: '02:45 PM - 04:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485112', subjectName: 'AI&SC Lab (Batch T1)', subjectAbbreviation: 'AI&SC(T1)_AI LAB(PT)', facultyName: 'Prof. Payal Tidke', facultyAbbreviation: 'PT', type: 'practical', labName: 'AI LAB', batch: 'T1', room: 'AI LAB' },

  // WEDNESDAY
  { day: 'WED', time: '10:15 AM - 11:15 AM', classId: 'class-te-cs-ds', subjectCode: '2485112', subjectName: 'AI & Soft Computing', subjectAbbreviation: 'AI&SC(SSG)', facultyName: 'Prof. Shital Gujar', facultyAbbreviation: 'SSG', type: 'theory', room: 'B105' },
  { day: 'WED', time: '11:15 AM - 12:15 PM', classId: 'class-te-cs-ds', subjectCode: '2485116', subjectName: 'Computer Networks', subjectAbbreviation: 'CN(DJ)', facultyName: 'Prof. Deepali Joshi', facultyAbbreviation: 'DJ', type: 'theory', room: 'B105' },
  { day: 'WED', time: '02:45 PM - 04:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485111', subjectName: 'Machine Learning Lab (Batch T1)', subjectAbbreviation: 'ML(T1)_NLP LAB(VA)', facultyName: 'Prof. Vaibhav Achalkhamb', facultyAbbreviation: 'VA', type: 'practical', labName: 'NLP LAB', batch: 'T1', room: 'NLP LAB' },

  // THURSDAY
  { day: 'THU', time: '10:15 AM - 11:15 AM', classId: 'class-te-cs-ds', subjectCode: '2485111', subjectName: 'Machine Learning', subjectAbbreviation: 'ML(SG)', facultyName: 'Prof. Swati Gaikwad', facultyAbbreviation: 'SG', type: 'theory', room: 'B105' },
  { day: 'THU', time: '11:15 AM - 12:15 PM', classId: 'class-te-cs-ds', subjectCode: '2485112', subjectName: 'AI & Soft Computing', subjectAbbreviation: 'AI&SC(SSG)', facultyName: 'Prof. Shital Gujar', facultyAbbreviation: 'SSG', type: 'theory', room: 'B105' },
  { day: 'THU', time: '12:45 PM - 02:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485111', subjectName: 'Machine Learning Lab (Batch T3)', subjectAbbreviation: 'ML(T3)_LANG LAB(VA)', facultyName: 'Prof. Vaibhav Achalkhamb', facultyAbbreviation: 'VA', type: 'practical', labName: 'LANG LAB', batch: 'T3', room: 'LANG LAB' },

  // FRIDAY
  { day: 'FRI', time: '10:15 AM - 11:15 AM', classId: 'class-te-cs-ds', subjectCode: '2485112', subjectName: 'AI & Soft Computing', subjectAbbreviation: 'AI&SC(SSG)', facultyName: 'Prof. Shital Gujar', facultyAbbreviation: 'SSG', type: 'theory', room: 'B105' },
  { day: 'FRI', time: '11:15 AM - 12:15 PM', classId: 'class-te-cs-ds', subjectCode: '2485116', subjectName: 'Computer Networks', subjectAbbreviation: 'CN(DJ)', facultyName: 'Prof. Deepali Joshi', facultyAbbreviation: 'DJ', type: 'theory', room: 'B105' },
  { day: 'FRI', time: '02:45 PM - 03:45 PM', classId: 'class-te-cs-ds', subjectCode: '2485111', subjectName: 'Machine Learning Theory', subjectAbbreviation: 'ML(SG)', facultyName: 'Prof. Swati Gaikwad', facultyAbbreviation: 'SG', type: 'theory', room: 'B105' },

  // SE (CSE_DS) - Prof. Rupali Jadhav (AOA)
  { day: 'MON', time: '10:15 AM - 12:15 PM', classId: 'class-se-cs-ds', subjectCode: '2163113', subjectName: 'AOA Lab (Batch S3)', subjectAbbreviation: 'AOA(S3)_NETWORK LAB(RJ)', facultyName: 'Prof. Rupali Jadhav', facultyAbbreviation: 'RJ', type: 'practical', labName: 'NETWORK LAB', batch: 'S3', room: 'B107' },
  { day: 'TUE', time: '10:15 AM - 12:15 PM', classId: 'class-se-cs-ds', subjectCode: '2163113', subjectName: 'AOA Lab (Batch S1)', subjectAbbreviation: 'AOA(S1)_NLP LAB(RJ)', facultyName: 'Prof. Rupali Jadhav', facultyAbbreviation: 'RJ', type: 'practical', labName: 'NLP LAB', batch: 'S1', room: 'B107' },
  { day: 'WED', time: '12:45 PM - 01:45 PM', classId: 'class-se-cs-ds', subjectCode: '2163113', subjectName: 'Analysis of Algorithm', subjectAbbreviation: 'AOA(RJ)', facultyName: 'Prof. Rupali Jadhav', facultyAbbreviation: 'RJ', type: 'theory', room: 'B107' },
  { day: 'THU', time: '12:45 PM - 01:45 PM', classId: 'class-se-cs-ds', subjectCode: '2163113', subjectName: 'Analysis of Algorithm', subjectAbbreviation: 'AOA(RJ)', facultyName: 'Prof. Rupali Jadhav', facultyAbbreviation: 'RJ', type: 'theory', room: 'B107' },
  { day: 'FRI', time: '11:15 AM - 12:15 PM', classId: 'class-se-cs-ds', subjectCode: '2163113', subjectName: 'Analysis of Algorithm', subjectAbbreviation: 'AOA(RJ)', facultyName: 'Prof. Rupali Jadhav', facultyAbbreviation: 'RJ', type: 'theory', room: 'B107' }
];

/* =========================================================================
 * BCOE College Friendly Datasets (Campus Mitra)
 * ========================================================================= */

export const INITIAL_CAMPUS_NOTICES: import('../types/attendance').CampusNotice[] = [
  {
    id: 'not-01',
    title: 'Mumbai University Even Semester 2026 Examination Forms Open',
    category: 'Exam',
    date: '2026-10-01',
    department: 'Exam Cell · BCOE',
    isUrgent: true,
    content: 'All TE and SE students of Computer Science & Engineering must submit exam forms on the MU portal. Minimum 75% attendance is required to generate the hall ticket.',
    fileAttachment: 'MU_Exam_Timetable_2026.pdf'
  },
  {
    id: 'not-02',
    title: 'TCS & Infosys Joint Campus Placement Drive Registration',
    category: 'Placement',
    date: '2026-09-29',
    department: 'Training & Placement Cell',
    isUrgent: true,
    content: 'Eligible candidates with 6.5+ CGPA and no active backlogs must upload their updated resume at the T&P office by Friday 5 PM.',
    fileAttachment: 'Placement_Guidelines_BCOE.pdf'
  },
  {
    id: 'not-03',
    title: 'TechnoBharat 2026: Annual Inter-College Hackathon & Robotics',
    category: 'Event',
    date: '2026-09-26',
    department: 'CSE Students Association (CSESA)',
    isUrgent: false,
    content: '24-hour national hackathon with cash prize pool of INR 1,00,000. Themes: AI in Healthcare, Smart Agriculture, and Blockchain.',
    fileAttachment: 'TechnoBharat_Rulebook.pdf'
  },
  {
    id: 'not-04',
    title: 'College Bus Route Schedule & Pass Renewal for October 2026',
    category: 'Academic',
    date: '2026-09-25',
    department: 'Transport Admin',
    isUrgent: false,
    content: 'Special shuttle services run from Badlapur Railway Station (West) to Kanhor Campus every 20 minutes between 8:00 AM and 10:00 AM.',
    fileAttachment: 'Bus_Schedule_Oct2026.pdf'
  }
];

export const INITIAL_CANTEEN_MENU: import('../types/attendance').CanteenItem[] = [
  {
    id: 'cant-01',
    name: 'Fresh Hot Vada Pav (2 Pcs)',
    nameMr: 'Spicy Potato Fritter with Chutney',
    price: 30,
    category: 'Snacks',
    isVeg: true,
    rating: 4.8,
    available: true,
    prepTime: '2 mins',
    popular: true
  },
  {
    id: 'cant-02',
    name: 'Special Spicy Misal Pav Combo',
    nameMr: 'Sprouted Curry with Farsan and Bread',
    price: 45,
    category: 'Snacks',
    isVeg: true,
    rating: 4.9,
    available: true,
    prepTime: '5 mins',
    popular: true
  },
  {
    id: 'cant-03',
    name: 'Steamed Onion Poha with Sev & Lemon',
    nameMr: 'Flattened Rice with Peanuts and Herbs',
    price: 25,
    category: 'Snacks',
    isVeg: true,
    rating: 4.6,
    available: true,
    prepTime: '3 mins'
  },
  {
    id: 'cant-04',
    name: 'College Veg Thali (Roti, Sabzi, Dal-Rice, Salad)',
    nameMr: 'Complete Balanced Lunch Meal',
    price: 80,
    category: 'Meals',
    isVeg: true,
    rating: 4.7,
    available: true,
    prepTime: '8 mins',
    popular: true
  },
  {
    id: 'cant-05',
    name: 'Grilled Cheese Sandwich',
    nameMr: 'Toasted Bread with Veggies and Cheese',
    price: 50,
    category: 'Snacks',
    isVeg: true,
    rating: 4.5,
    available: true,
    prepTime: '7 mins'
  },
  {
    id: 'cant-06',
    name: 'Special Cutting Masala Ginger Tea',
    nameMr: 'Brewed Indian Spiced Tea',
    price: 12,
    category: 'Beverages',
    isVeg: true,
    rating: 4.9,
    available: true,
    prepTime: '1 min',
    popular: true
  },
  {
    id: 'cant-07',
    name: 'Cold Coffee with Choco Chips',
    nameMr: 'Chilled Milk Brew with Chocolate',
    price: 40,
    category: 'Beverages',
    isVeg: true,
    rating: 4.7,
    available: true,
    prepTime: '3 mins'
  },
  {
    id: 'cant-08',
    name: 'Crispy Samosa Chaat Bowl',
    nameMr: 'Crushed Samosa with Tangy Chickpea Gravy',
    price: 40,
    category: 'Specials',
    isVeg: true,
    rating: 4.6,
    available: true,
    prepTime: '4 mins'
  }
];

export const INITIAL_CAMPUS_EVENTS: import('../types/attendance').CampusEvent[] = [
  {
    id: 'ev-01',
    title: 'TechnoBharat 2026: National Techfest & Hackathon',
    date: '2026-10-14',
    time: '09:00 AM - 05:00 PM',
    venue: 'Auditorium & Computer Labs (ITI Building)',
    category: 'Hackathon',
    coordinator: 'Prof. Vaibhav Achalkhamb & Prof. Swati Gaikwad',
    description: 'Code sprint, Web3 track, Machine Learning model building, and Robo-race competition with 50+ college teams.',
    registeredCount: 142
  },
  {
    id: 'ev-02',
    title: 'Rann-Neeti 2026: BCOE Annual Sports Championship',
    date: '2026-10-22',
    time: '08:00 AM onwards',
    venue: 'BCOE Sports Ground, Kanhor',
    category: 'Sports',
    coordinator: 'Prof. Hemant Bhalerao',
    description: 'Inter-department Cricket League, Football, Volleyball, Badminton, and Chess tournament.',
    registeredCount: 88
  },
  {
    id: 'ev-03',
    title: 'Workshop: Generative AI & LLM Deployment on Cloud',
    date: '2026-10-08',
    time: '01:45 PM - 04:45 PM',
    venue: 'NLP LAB (2nd Floor, ITI Building)',
    category: 'TechFest',
    coordinator: 'Prof. Vaibhav Achalkhamb',
    description: 'Hands-on project using Transformers, Gemini APIs, and Docker containerization.',
    registeredCount: 65
  }
];

export const INITIAL_BUS_SCHEDULE: import('../types/attendance').BusSchedule[] = [
  {
    id: 'bus-01',
    departureTime: '08:30 AM',
    fromLocation: 'Badlapur Railway Station (West)',
    toLocation: 'BCOE Kanhor Campus Main Gate',
    busNumber: 'MH-05-BC-101',
    driverName: 'Santosh Shinde',
    driverPhone: '+91 98234 11221',
    status: 'Scheduled'
  },
  {
    id: 'bus-02',
    departureTime: '09:15 AM',
    fromLocation: 'Badlapur Railway Station (West)',
    toLocation: 'BCOE Kanhor Campus Main Gate',
    busNumber: 'MH-05-BC-102',
    driverName: 'Ramesh Patil',
    driverPhone: '+91 98234 33442',
    status: 'Boarding Now'
  },
  {
    id: 'bus-03',
    departureTime: '01:45 PM',
    fromLocation: 'BCOE Kanhor Campus Main Gate',
    toLocation: 'Badlapur Railway Station (West)',
    busNumber: 'MH-05-BC-101',
    driverName: 'Santosh Shinde',
    driverPhone: '+91 98234 11221',
    status: 'Scheduled'
  },
  {
    id: 'bus-04',
    departureTime: '05:15 PM (Evening Return)',
    fromLocation: 'BCOE Kanhor Campus Main Gate',
    toLocation: 'Badlapur Railway Station (West)',
    busNumber: 'MH-05-BC-102',
    driverName: 'Ramesh Patil',
    driverPhone: '+91 98234 33442',
    status: 'Scheduled'
  }
];

export const INITIAL_STUDY_MATERIALS: import('../types/attendance').StudyMaterial[] = [
  {
    id: 'study-01',
    subject: 'Machine Learning',
    subjectCode: '2485111',
    title: 'MU Dec 2025 Solved Question Paper & Answer Scheme',
    type: 'QuestionPaper',
    yearOrSemester: 'Sem VI · Data Science',
    fileSize: '4.2 MB',
    facultyAuthor: 'Prof. Swati Gaikwad'
  },
  {
    id: 'study-02',
    subject: 'Machine Learning Lab',
    subjectCode: '2485111',
    title: 'Complete ML Lab Manual (Experiments 1 to 10 with Code)',
    type: 'LabManual',
    yearOrSemester: 'Sem VI · Data Science',
    fileSize: '8.7 MB',
    facultyAuthor: 'Prof. Vaibhav Achalkhamb (VA)'
  },
  {
    id: 'study-03',
    subject: 'Analysis of Algorithm',
    subjectCode: '2163113',
    title: 'AOA Complete Lecture Notes & Complexity Proofs',
    type: 'Notes',
    yearOrSemester: 'Sem IV · SE CSE',
    fileSize: '6.1 MB',
    facultyAuthor: 'Prof. Rupali Jadhav (RJ)'
  },
  {
    id: 'study-04',
    subject: 'Computer Networks',
    subjectCode: '2485116',
    title: 'Packet Tracer Lab Manual & Socket Programming Handbook',
    type: 'LabManual',
    yearOrSemester: 'Sem VI · Data Science',
    fileSize: '5.5 MB',
    facultyAuthor: 'Prof. Deepali Joshi'
  }
];

export const INITIAL_SYLLABUS_DATA: import('../types/attendance').SyllabusPlan[] = [
  {
    id: 'syl-01',
    subjectCode: '2485111',
    subjectName: 'Machine Learning (Theory & Practice)',
    className: 'TE CSE (Data Science) - Sem VI',
    totalUnits: 6,
    completedUnits: 4,
    totalPlannedLectures: 45,
    conductedLectures: 32,
    facultyName: 'Prof. Vaibhav Achalkhamb (VA)',
    status: 'On Track',
    lastUpdatedDate: '2026-09-30'
  },
  {
    id: 'syl-02',
    subjectCode: '2485116',
    subjectName: 'Computer Networks & Distributed Systems',
    className: 'TE CSE (Data Science) - Sem VI',
    totalUnits: 6,
    completedUnits: 4,
    totalPlannedLectures: 42,
    conductedLectures: 30,
    facultyName: 'Prof. Deepali Joshi (DJ)',
    status: 'On Track',
    lastUpdatedDate: '2026-09-29'
  },
  {
    id: 'syl-03',
    subjectCode: '2485113',
    subjectName: 'Agile Software Development Methodologies',
    className: 'TE CSE (Data Science) - Sem VI',
    totalUnits: 6,
    completedUnits: 5,
    totalPlannedLectures: 40,
    conductedLectures: 34,
    facultyName: 'Prof. Asha Gaikar (AG - HOD)',
    status: 'Ahead of Schedule',
    lastUpdatedDate: '2026-10-01'
  },
  {
    id: 'syl-04',
    subjectCode: '2163113',
    subjectName: 'Analysis of Algorithm (AOA)',
    className: 'SE CSE (Data Science) - Sem IV',
    totalUnits: 6,
    completedUnits: 3,
    totalPlannedLectures: 48,
    conductedLectures: 26,
    facultyName: 'Prof. Rupali Jadhav (RJ)',
    status: 'Needs Catch-up',
    lastUpdatedDate: '2026-09-28'
  }
];

export const INITIAL_FACULTY_LEAVES: import('../types/attendance').FacultyLeaveProxy[] = [
  {
    id: 'leave-01',
    facultyId: 'fac-vaibhav',
    facultyName: 'Prof. Vaibhav Achalkhamb',
    leaveType: 'Duty Leave (DL)',
    startDate: '2026-10-05',
    endDate: '2026-10-06',
    reason: 'Attending IEEE International Conference on AI & Machine Learning at IIT Bombay',
    proxyFacultyName: 'Prof. Swati Gaikwad',
    affectedSlot: 'Mon 02:45 PM NLP Lab (Batch T1)',
    status: 'Approved by HOD'
  },
  {
    id: 'leave-02',
    facultyId: 'fac-rupali',
    facultyName: 'Prof. Rupali Jadhav',
    leaveType: 'Casual Leave (CL)',
    startDate: '2026-10-12',
    endDate: '2026-10-12',
    reason: 'Family event and personal commitment',
    proxyFacultyName: 'Prof. Deepali Joshi',
    affectedSlot: 'Wed 12:45 PM AOA Theory (Room B107)',
    status: 'Approved by HOD'
  }
];

export const INITIAL_MENTORSHIP_LOGS: import('../types/attendance').MentorshipNote[] = [
  {
    id: 'ment-01',
    studentId: 'stud-te-04',
    studentRollNo: 4,
    studentName: 'Amit Suresh Shinde',
    date: '2026-09-28',
    facultyMentor: 'Prof. Vaibhav Achalkhamb',
    category: 'Attendance Shortage (<75%)',
    actionPoints: 'Student reported health issues and train delays on Central Line. Informed parents to submit medical certificate and attend remedial Saturday lab sessions.',
    followUpRequired: true
  },
  {
    id: 'ment-02',
    studentId: 'stud-te-14',
    studentRollNo: 14,
    studentName: 'Kavita Mohan Kulkarni',
    date: '2026-09-25',
    facultyMentor: 'Prof. Rupali Jadhav',
    category: 'Exam Performance',
    actionPoints: 'Scored 11/20 in UT-1. Recommended textbook chapters on Dynamic Programming and assigned extra problem set for revision.',
    followUpRequired: false
  },
  {
    id: 'ment-03',
    studentId: 'stud-te-01',
    studentRollNo: 1,
    studentName: 'Aarav Rajesh Sharma',
    date: '2026-09-22',
    facultyMentor: 'Prof. Vaibhav Achalkhamb',
    category: 'Personal Mentoring',
    actionPoints: 'Discussed Smart India Hackathon 2026 project submission and research paper draft on Transformer optimization.',
    followUpRequired: false
  }
];


