// Extended Student type — used by placement/students pages
// StudentsTable.tsx uses a subset of these fields (all additions are optional-compatible)
export type Student = {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  branch: string;
  year: number;
  group: string; // CCG / batch group — can contain students across branches
  cgpa: number;
  readiness: number; // 0–100 placement readiness score
  placementStatus: "Unplaced" | "Shortlisted" | "Offered" | "Placed";
  status: "active" | "inactive";
  joinedAt: string;
  quizzesTaken: number;
  aiInterviews: number;
  resumesMade: number;
  codingAttempts: number;
  phone?: string;
  city?: string;
};

// All groups in this college (CCG = cross-branch batch groups)
export const COLLEGE_GROUPS = [
  "CSE Alpha 2026",
  "CSE Beta 2026",
  "IT Core 2026",
  "ECE Tech 2026",
  "Mech Drive 2026",
  "Cross-Branch Elite",
];

export const BRANCHES = ["CSE", "IT", "ECE", "Mechanical", "Civil"];
export const YEARS = [1, 2, 3, 4];

export const MOCK_STUDENTS: Student[] = [
  {
    id: "stu-001",
    name: "Arjun Reddy",
    email: "arjun.reddy@college.edu",
    rollNo: "CSE25A001",
    branch: "CSE",
    year: 4,
    group: "CSE Alpha 2026",
    cgpa: 8.7,
    readiness: 92,
    placementStatus: "Placed",
    status: "active",
    joinedAt: "2024-07-12",
    quizzesTaken: 18,
    aiInterviews: 4,
    resumesMade: 3,
    codingAttempts: 120,
    phone: "+91 98765 43210",
    city: "Hyderabad",
  },
  {
    id: "stu-002",
    name: "Ananya Iyer",
    email: "ananya.iyer@college.edu",
    rollNo: "CSE25A002",
    branch: "CSE",
    year: 4,
    group: "CSE Alpha 2026",
    cgpa: 9.1,
    readiness: 96,
    placementStatus: "Placed",
    status: "active",
    joinedAt: "2024-07-13",
    quizzesTaken: 22,
    aiInterviews: 6,
    resumesMade: 5,
    codingAttempts: 160,
    phone: "+91 98765 43211",
    city: "Chennai",
  },
  {
    id: "stu-003",
    name: "Karthik Subramanian",
    email: "karthik.s@college.edu",
    rollNo: "CSE25B003",
    branch: "CSE",
    year: 3,
    group: "CSE Beta 2026",
    cgpa: 7.2,
    readiness: 54,
    placementStatus: "Unplaced",
    status: "inactive",
    joinedAt: "2024-07-15",
    quizzesTaken: 9,
    aiInterviews: 1,
    resumesMade: 1,
    codingAttempts: 40,
    phone: "+91 87654 32100",
    city: "Coimbatore",
  },
  {
    id: "stu-004",
    name: "Priya Natarajan",
    email: "priya.n@college.edu",
    rollNo: "CSE25A004",
    branch: "CSE",
    year: 4,
    group: "Cross-Branch Elite",
    cgpa: 9.4,
    readiness: 98,
    placementStatus: "Offered",
    status: "active",
    joinedAt: "2024-07-16",
    quizzesTaken: 25,
    aiInterviews: 7,
    resumesMade: 6,
    codingAttempts: 180,
    phone: "+91 99887 65432",
    city: "Bangalore",
  },
  {
    id: "stu-005",
    name: "Suresh Kumar",
    email: "suresh.k@college.edu",
    rollNo: "IT25A005",
    branch: "IT",
    year: 4,
    group: "IT Core 2026",
    cgpa: 8.0,
    readiness: 76,
    placementStatus: "Shortlisted",
    status: "active",
    joinedAt: "2024-07-18",
    quizzesTaken: 14,
    aiInterviews: 3,
    resumesMade: 2,
    codingAttempts: 95,
    phone: "+91 91234 56789",
    city: "Pune",
  },
  {
    id: "stu-006",
    name: "Divya Srinivasan",
    email: "divya.s@college.edu",
    rollNo: "IT25A006",
    branch: "IT",
    year: 4,
    group: "IT Core 2026",
    cgpa: 8.9,
    readiness: 89,
    placementStatus: "Placed",
    status: "active",
    joinedAt: "2024-07-20",
    quizzesTaken: 30,
    aiInterviews: 8,
    resumesMade: 7,
    codingAttempts: 210,
    phone: "+91 92345 67890",
    city: "Mumbai",
  },
  {
    id: "stu-007",
    name: "Vignesh Raman",
    email: "vignesh.r@college.edu",
    rollNo: "IT25B007",
    branch: "IT",
    year: 3,
    group: "IT Core 2026",
    cgpa: 6.8,
    readiness: 42,
    placementStatus: "Unplaced",
    status: "inactive",
    joinedAt: "2024-07-21",
    quizzesTaken: 6,
    aiInterviews: 0,
    resumesMade: 1,
    codingAttempts: 25,
    phone: "+91 93456 78901",
    city: "Madurai",
  },
  {
    id: "stu-008",
    name: "Meera Krishnan",
    email: "meera.k@college.edu",
    rollNo: "ECE25A008",
    branch: "ECE",
    year: 4,
    group: "ECE Tech 2026",
    cgpa: 8.3,
    readiness: 80,
    placementStatus: "Shortlisted",
    status: "active",
    joinedAt: "2024-07-22",
    quizzesTaken: 19,
    aiInterviews: 5,
    resumesMade: 4,
    codingAttempts: 140,
    phone: "+91 94567 89012",
    city: "Kochi",
  },
  {
    id: "stu-009",
    name: "Rohit Balakrishnan",
    email: "rohit.b@college.edu",
    rollNo: "ECE25A009",
    branch: "ECE",
    year: 4,
    group: "ECE Tech 2026",
    cgpa: 7.9,
    readiness: 73,
    placementStatus: "Shortlisted",
    status: "active",
    joinedAt: "2024-07-23",
    quizzesTaken: 21,
    aiInterviews: 6,
    resumesMade: 5,
    codingAttempts: 155,
    phone: "+91 95678 90123",
    city: "Thiruvananthapuram",
  },
  {
    id: "stu-010",
    name: "Lakshmi Menon",
    email: "lakshmi.m@college.edu",
    rollNo: "ECE25B010",
    branch: "ECE",
    year: 3,
    group: "ECE Tech 2026",
    cgpa: 7.5,
    readiness: 61,
    placementStatus: "Unplaced",
    status: "active",
    joinedAt: "2024-07-24",
    quizzesTaken: 16,
    aiInterviews: 3,
    resumesMade: 3,
    codingAttempts: 110,
    phone: "+91 96789 01234",
    city: "Kozhikode",
  },
  {
    id: "stu-011",
    name: "Naveen Chandra",
    email: "naveen.c@college.edu",
    rollNo: "MECH25A011",
    branch: "Mechanical",
    year: 4,
    group: "Mech Drive 2026",
    cgpa: 6.5,
    readiness: 35,
    placementStatus: "Unplaced",
    status: "inactive",
    joinedAt: "2024-07-25",
    quizzesTaken: 8,
    aiInterviews: 1,
    resumesMade: 1,
    codingAttempts: 50,
    phone: "+91 97890 12345",
    city: "Nagpur",
  },
  {
    id: "stu-012",
    name: "Shreya Raghavan",
    email: "shreya.r@college.edu",
    rollNo: "CSE25A012",
    branch: "CSE",
    year: 4,
    group: "Cross-Branch Elite",
    cgpa: 9.2,
    readiness: 95,
    placementStatus: "Placed",
    status: "active",
    joinedAt: "2024-07-26",
    quizzesTaken: 27,
    aiInterviews: 7,
    resumesMade: 6,
    codingAttempts: 195,
    phone: "+91 98901 23456",
    city: "Delhi",
  },
  {
    id: "stu-013",
    name: "Aditya Verma",
    email: "aditya.v@college.edu",
    rollNo: "CSE25B013",
    branch: "CSE",
    year: 3,
    group: "CSE Beta 2026",
    cgpa: 7.8,
    readiness: 65,
    placementStatus: "Unplaced",
    status: "active",
    joinedAt: "2024-08-01",
    quizzesTaken: 12,
    aiInterviews: 2,
    resumesMade: 2,
    codingAttempts: 75,
    phone: "+91 99012 34567",
    city: "Jaipur",
  },
  {
    id: "stu-014",
    name: "Pooja Gupta",
    email: "pooja.g@college.edu",
    rollNo: "IT25A014",
    branch: "IT",
    year: 4,
    group: "Cross-Branch Elite",
    cgpa: 8.6,
    readiness: 88,
    placementStatus: "Offered",
    status: "active",
    joinedAt: "2024-08-02",
    quizzesTaken: 20,
    aiInterviews: 5,
    resumesMade: 4,
    codingAttempts: 130,
    phone: "+91 90123 45678",
    city: "Lucknow",
  },
  {
    id: "stu-015",
    name: "Rahul Mishra",
    email: "rahul.m@college.edu",
    rollNo: "MECH25A015",
    branch: "Mechanical",
    year: 4,
    group: "Mech Drive 2026",
    cgpa: 7.1,
    readiness: 48,
    placementStatus: "Unplaced",
    status: "active",
    joinedAt: "2024-08-05",
    quizzesTaken: 10,
    aiInterviews: 2,
    resumesMade: 2,
    codingAttempts: 30,
    phone: "+91 89012 34567",
    city: "Bhopal",
  },
];

/* ─── Per-student detailed history (for profile page) ───────── */
export type QuizRecord = {
  id: string;
  title: string;
  category: string;
  score: number;
  totalMarks: number;
  timeTaken: string;
  date: string;
  result: "Passed" | "Failed";
};

export type InterviewRecord = {
  id: string;
  type: "Technical" | "HR" | "Behavioral" | "Mock";
  company: string;
  duration: string;
  rating: number;
  date: string;
  feedback: string;
};

export type ResumeRecord = {
  id: string;
  version: string;
  template: string;
  createdAt: string;
  updatedAt: string;
};

export type CodingRecord = {
  id: string;
  problem: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Solved" | "Attempted" | "Skipped";
  language: string;
  date: string;
};

export type AssessmentRecord = {
  id: string;
  company: string;
  title: string;
  type: "MCQ" | "Coding" | "Mixed";
  score: string;
  date: string;
  result: "Cleared" | "Not Cleared" | "Pending";
};

export type ApplicationRecord = {
  id: string;
  company: string;
  role: string;
  ctc: string;
  appliedOn: string;
  status: "Applied" | "Shortlisted" | "In Progress" | "Offered" | "Rejected" | "Accepted";
};

export type DetailedStudent = {
  quizzes: QuizRecord[];
  interviews: InterviewRecord[];
  resumes: ResumeRecord[];
  coding: CodingRecord[];
  assessments: AssessmentRecord[];
  applications: ApplicationRecord[];
};

// Shared detailed history (used by profile page for all students as mock)
export const MOCK_STUDENT_DETAIL: DetailedStudent = {
  quizzes: [
    { id: "q1", title: "TCS Aptitude Test", category: "Aptitude", score: 82, totalMarks: 100, timeTaken: "42 min", date: "2026-02-01", result: "Passed" },
    { id: "q2", title: "Infosys Technical Assessment", category: "Core CS", score: 79, totalMarks: 100, timeTaken: "55 min", date: "2026-01-22", result: "Passed" },
    { id: "q3", title: "Advanced DSA Quiz", category: "DSA", score: 88, totalMarks: 100, timeTaken: "38 min", date: "2026-01-10", result: "Passed" },
    { id: "q4", title: "SQL & DBMS Basics", category: "Database", score: 71, totalMarks: 100, timeTaken: "30 min", date: "2025-12-18", result: "Passed" },
    { id: "q5", title: "OS Fundamentals", category: "Core CS", score: 58, totalMarks: 100, timeTaken: "45 min", date: "2025-12-05", result: "Failed" },
    { id: "q6", title: "System Design MCQ", category: "System Design", score: 64, totalMarks: 100, timeTaken: "50 min", date: "2025-11-20", result: "Passed" },
  ],
  interviews: [
    { id: "i1", type: "Technical", company: "Google", duration: "45 min", rating: 8.5, date: "2026-02-10", feedback: "Strong problem-solving. Needs improvement in system design explanation." },
    { id: "i2", type: "HR", company: "Deloitte", duration: "30 min", rating: 9.0, date: "2026-01-28", feedback: "Excellent communication skills. Very well articulated responses." },
    { id: "i3", type: "Behavioral", company: "TCS", duration: "25 min", rating: 7.8, date: "2026-01-15", feedback: "Good STAR answers. Could be more specific on impact metrics." },
    { id: "i4", type: "Mock", company: "PrepAI Mock", duration: "40 min", rating: 7.2, date: "2025-12-28", feedback: "Confidence level improved. Review OS concepts before next round." },
    { id: "i5", type: "Technical", company: "Amazon", duration: "60 min", rating: 8.1, date: "2025-12-10", feedback: "Solid LeetCode performance. Optimal solution found in 2 of 3 problems." },
  ],
  resumes: [
    { id: "r1", version: "v4.0", template: "Modern", createdAt: "2026-02-05", updatedAt: "2026-02-12" },
    { id: "r2", version: "v3.0", template: "Professional", createdAt: "2026-01-10", updatedAt: "2026-01-18" },
    { id: "r3", version: "v2.0", template: "Creative", createdAt: "2025-11-22", updatedAt: "2025-12-01" },
    { id: "r4", version: "v1.0", template: "Minimal", createdAt: "2025-09-14", updatedAt: "2025-09-14" },
  ],
  coding: [
    { id: "c1", problem: "Two Sum", category: "Array", difficulty: "Easy", status: "Solved", language: "Python", date: "2026-02-08" },
    { id: "c2", problem: "LRU Cache", category: "Design", difficulty: "Medium", status: "Solved", language: "JavaScript", date: "2026-02-03" },
    { id: "c3", problem: "Word Ladder", category: "BFS/DFS", difficulty: "Hard", status: "Attempted", language: "C++", date: "2026-01-30" },
    { id: "c4", problem: "Binary Tree Level Order", category: "Tree", difficulty: "Medium", status: "Solved", language: "Java", date: "2026-01-25" },
    { id: "c5", problem: "Merge Intervals", category: "Array", difficulty: "Medium", status: "Solved", language: "Python", date: "2026-01-20" },
    { id: "c6", problem: "Trapping Rain Water", category: "Two Pointer", difficulty: "Hard", status: "Attempted", language: "C++", date: "2026-01-12" },
    { id: "c7", problem: "Valid Parentheses", category: "Stack", difficulty: "Easy", status: "Solved", language: "Python", date: "2025-12-22" },
    { id: "c8", problem: "Longest Substring Without Repeating", category: "Sliding Window", difficulty: "Medium", status: "Solved", language: "Python", date: "2025-12-15" },
  ],
  assessments: [
    { id: "a1", company: "TCS", title: "TCS NQT Aptitude + Technical", type: "Mixed", score: "178 / 200", date: "2026-01-25", result: "Cleared" },
    { id: "a2", company: "Google", title: "Google OA Round 1", type: "Coding", score: "2 / 3 problems", date: "2026-02-06", result: "Cleared" },
    { id: "a3", company: "Infosys", title: "InfyTQ Certification", type: "MCQ", score: "82%", date: "2025-12-10", result: "Cleared" },
    { id: "a4", company: "Amazon", title: "Amazon OA — SDE-1", type: "Coding", score: "1.5 / 2 problems", date: "2026-01-18", result: "Not Cleared" },
    { id: "a5", company: "Deloitte", title: "Deloitte Aptitude Assessment", type: "MCQ", score: "76%", date: "2025-11-28", result: "Cleared" },
  ],
  applications: [
    { id: "ap1", company: "Google", role: "SWE Intern → FTE", ctc: "₹22L", appliedOn: "2026-02-01", status: "In Progress" },
    { id: "ap2", company: "TCS", role: "Software Engineer", ctc: "₹3.6L", appliedOn: "2026-01-20", status: "Offered" },
    { id: "ap3", company: "Deloitte", role: "Analyst", ctc: "₹7L", appliedOn: "2026-01-15", status: "Shortlisted" },
    { id: "ap4", company: "Amazon", role: "SDE-1", ctc: "₹18L", appliedOn: "2026-01-10", status: "Rejected" },
    { id: "ap5", company: "Infosys", role: "Systems Engineer", ctc: "₹4L", appliedOn: "2025-12-20", status: "Accepted" },
  ],
};

export const MOCK_CONTEXT = {
  collegeName: "IIT Bombay",
  branchName: "Computer Science",
  ccgName: "CSE Alpha 2026",
  academicYear: "2025",
};
