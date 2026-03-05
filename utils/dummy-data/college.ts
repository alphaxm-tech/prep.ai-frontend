// lib/college.ts
export type College = {
  id: string;
  name: string;
  city?: string;
  studentsCount?: number;
  verifiedPercent?: number; // 0-100
  lastActive?: string; // human readable
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  tier?: "Premium" | "Standard";
  active?: boolean;
};

export const MOCK_COLLEGES: College[] = [
  {
    id: "c1",
    name: "IIT Bombay",
    city: "Powai, Mumbai",
    studentsCount: 1240,
    verifiedPercent: 81,
    lastActive: "2 hours ago",
    code: "IITB",
    email: "admin@iitb.ac.in",
    phone: "+91 22 2576 4545",
    address: "Powai, Mumbai, Maharashtra 400076",
    tier: "Premium",
    active: true,
  },
  {
    id: "c2",
    name: "IIT Delhi",
    city: "Hauz Khas, New Delhi",
    studentsCount: 820,
    verifiedPercent: 76,
    lastActive: "1 day ago",
    code: "IITD",
    email: "admin@iitd.ac.in",
    phone: "+91 11 2659 1000",
    address: "Hauz Khas, New Delhi 110016",
    tier: "Standard",
    active: true,
  },
  {
    id: "c3",
    name: "Vikram University",
    city: "Pune",
    studentsCount: 430,
    verifiedPercent: 92,
    lastActive: "30 mins ago",
    code: "VU",
    email: "admin@vikramu.edu",
    phone: "+91 20 1234 5678",
    address: "FC Road, Pune",
    tier: "Standard",
    active: false,
  },
];
