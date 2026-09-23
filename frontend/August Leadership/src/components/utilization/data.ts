// ─── Design tokens (shared across utilization module) ─────────────────────────
export const C = {
  ink:      "#16303F",
  slate:    "#3E5568",
  paper:    "#FFFFFF",
  mist:     "#E4E9EC",
  graphite: "#5B6472",
  hairline: "#DAD7CF",
  ivory:    "#D9E2E8",
  bg:       "#F8FAFB",
  green:    "#3F7A5D",
  amber:    "#B8875A",
  red:      "#B14A3D",
  sans:     "'IBM Plex Sans', sans-serif",
  mono:     "'IBM Plex Mono', monospace",
};

// ─── Heatmap colour from utilization % ────────────────────────────────────────
export function utilColor(pct: number): { bg: string; text: string } {
  if (pct === 0)    return { bg: "#F0F3F5", text: C.graphite };
  if (pct < 50)     return { bg: "#DCE4E9", text: C.graphite };
  if (pct < 70)     return { bg: "#A8BEC9", text: C.ink };
  if (pct < 90)     return { bg: C.slate,   text: C.ivory };
  if (pct <= 100)   return { bg: C.ink,     text: C.ivory };
  if (pct <= 115)   return { bg: C.amber,   text: "#FFFFFF" };
  return              { bg: C.red,     text: "#FFFFFF" };
}

// ─── Departments + Levels ─────────────────────────────────────────────────────
export const DEPARTMENTS = [
  "Executive Search",
  "Board Advisory",
  "Research & Intel.",
  "Talent Mapping",
  "Succession Planning",
  "Client Relations",
] as const;

export const LEVELS = ["Analyst", "Associate", "Sr. Associate", "Manager", "Director"] as const;

// ─── Heatmap data: dept × level → { util%, people[] } ────────────────────────
export interface CellPerson { name: string; hours: number; capacity: number }

export interface HeatCell {
  util: number;
  hours: number;
  capacity: number;
  people: CellPerson[];
}

export const HEATMAP_BY_LEVEL: Record<string, Record<string, HeatCell>> = {
  "Executive Search": {
    "Analyst":      { util: 68,  hours: 27,  capacity: 40, people: [{ name: "Jordan Wei",    hours: 27,  capacity: 40 }] },
    "Associate":    { util: 88,  hours: 35,  capacity: 40, people: [{ name: "Clem Adeyemi",  hours: 35,  capacity: 40 }] },
    "Sr. Associate":{ util: 95,  hours: 76,  capacity: 80, people: [{ name: "Priya Sharma",  hours: 38,  capacity: 40 }, { name: "Aisha Nkrumah", hours: 38, capacity: 40 }] },
    "Manager":      { util: 82,  hours: 33,  capacity: 40, people: [{ name: "Leo Bastian",   hours: 33,  capacity: 40 }] },
    "Director":     { util: 73,  hours: 29,  capacity: 40, people: [{ name: "Eve Moreau",    hours: 29,  capacity: 40 }] },
  },
  "Board Advisory": {
    "Analyst":      { util: 0,   hours: 0,   capacity: 0,  people: [] },
    "Associate":    { util: 103, hours: 41,  capacity: 40, people: [{ name: "Lydia Voss",    hours: 41,  capacity: 40 }] },
    "Sr. Associate":{ util: 78,  hours: 31,  capacity: 40, people: [{ name: "Sam Okoro",     hours: 31,  capacity: 40 }] },
    "Manager":      { util: 91,  hours: 36,  capacity: 40, people: [{ name: "Bea Falconer",  hours: 36,  capacity: 40 }] },
    "Director":     { util: 0,   hours: 0,   capacity: 0,  people: [] },
  },
  "Research & Intel.": {
    "Analyst":      { util: 67,  hours: 27,  capacity: 40, people: [{ name: "Marcus Bell",   hours: 27,  capacity: 40 }] },
    "Associate":    { util: 75,  hours: 30,  capacity: 40, people: [{ name: "Kira Santos",   hours: 30,  capacity: 40 }] },
    "Sr. Associate":{ util: 80,  hours: 32,  capacity: 40, people: [{ name: "Dev Patel",     hours: 32,  capacity: 40 }] },
    "Manager":      { util: 55,  hours: 22,  capacity: 40, people: [{ name: "Nina Kroll",    hours: 22,  capacity: 40 }] },
    "Director":     { util: 0,   hours: 0,   capacity: 0,  people: [] },
  },
  "Talent Mapping": {
    "Analyst":      { util: 60,  hours: 12,  capacity: 20, people: [{ name: "Ru Nakamura",   hours: 12,  capacity: 20 }] },
    "Associate":    { util: 74,  hours: 15,  capacity: 20, people: [{ name: "Imo Eze",       hours: 15,  capacity: 20 }] },
    "Sr. Associate":{ util: 0,   hours: 0,   capacity: 0,  people: [] },
    "Manager":      { util: 58,  hours: 20,  capacity: 35, people: [{ name: "Fiona Chan",    hours: 20,  capacity: 35 }] },
    "Director":     { util: 0,   hours: 0,   capacity: 0,  people: [] },
  },
  "Succession Planning": {
    "Analyst":      { util: 0,   hours: 0,   capacity: 0,  people: [] },
    "Associate":    { util: 112, hours: 45,  capacity: 40, people: [{ name: "Tom Reinhardt", hours: 45,  capacity: 40 }] },
    "Sr. Associate":{ util: 0,   hours: 0,   capacity: 0,  people: [] },
    "Manager":      { util: 118, hours: 47,  capacity: 40, people: [{ name: "Daniel Osei",   hours: 47,  capacity: 40 }] },
    "Director":     { util: 0,   hours: 0,   capacity: 0,  people: [] },
  },
  "Client Relations": {
    "Analyst":      { util: 0,   hours: 0,   capacity: 0,  people: [] },
    "Associate":    { util: 62,  hours: 25,  capacity: 40, people: [{ name: "Ali Hassan",    hours: 25,  capacity: 40 }] },
    "Sr. Associate":{ util: 70,  hours: 28,  capacity: 40, people: [{ name: "Tess Ivory",    hours: 28,  capacity: 40 }] },
    "Manager":      { util: 0,   hours: 0,   capacity: 0,  people: [] },
    "Director":     { util: 65,  hours: 23,  capacity: 35, people: [{ name: "Ben Oduola",    hours: 23,  capacity: 35 }] },
  },
};

// Weekly heatmap (last 6 weeks) — dept × week index → util%
export const WEEKS = ["W/c Jul 15", "W/c Jul 22", "W/c Jul 29", "W/c Aug 5", "W/c Aug 12", "W/c Aug 19"];
export const HEATMAP_BY_WEEK: Record<string, number[]> = {
  "Executive Search":    [82, 85, 88, 90, 92, 88],
  "Board Advisory":      [78, 80, 95, 103, 98, 91],
  "Research & Intel.":   [65, 70, 72, 75, 71, 70],
  "Talent Mapping":      [55, 58, 62, 60, 61, 63],
  "Succession Planning": [95, 100, 108, 115, 118, 112],
  "Client Relations":    [60, 62, 65, 63, 60, 64],
};

// Stacked bar (hours by work type per dept)
export interface WorkSplit { dept: string; client: number; bd: number; internal: number }
export const WORK_SPLITS: WorkSplit[] = [
  { dept: "Executive Search",    client: 185, bd: 18,  internal: 12  },
  { dept: "Board Advisory",      client: 108, bd: 12,  internal: 8   },
  { dept: "Research & Intel.",   client: 111, bd: 8,   internal: 22  },
  { dept: "Talent Mapping",      client: 47,  bd: 5,   internal: 8   },
  { dept: "Succession Planning", client: 92,  bd: 0,   internal: 6   },
  { dept: "Client Relations",    client: 76,  bd: 4,   internal: 8   },
];

// ─── Team members (for By Team Member tab) ────────────────────────────────────
export interface TeamMemberRow {
  id: string;
  name: string;
  department: string;
  level: string;
  utilPct: number;
  hoursLogged: number;
  capacity: number;
  projects: string[];
  leaveStart?: string;
  leaveEnd?: string;
  weeklyUtil: number[];   // last 6 weeks
  twelveWeekUtil: number[]; // last 12 weeks for drawer
  assignments: { project: string; hours: number; planned: number }[];
}

export const TEAM_MEMBERS: TeamMemberRow[] = [
  {
    id: "TM-001", name: "Priya Sharma",    department: "Executive Search",    level: "Sr. Associate",
    utilPct: 95,  hoursLogged: 38, capacity: 40,
    projects: ["Northbridge Capital", "Oaktree Ventures"],
    weeklyUtil: [88, 90, 92, 94, 96, 95],
    twelveWeekUtil: [70, 72, 78, 82, 85, 88, 90, 92, 94, 96, 95, 95],
    assignments: [
      { project: "Northbridge Capital", hours: 22, planned: 20 },
      { project: "Oaktree Ventures",    hours: 16, planned: 18 },
    ],
  },
  {
    id: "TM-002", name: "Daniel Osei",     department: "Succession Planning", level: "Manager",
    utilPct: 118, hoursLogged: 47, capacity: 40,
    projects: ["Meridian Partners", "Venn Capital"],
    weeklyUtil: [95, 100, 108, 112, 118, 118],
    twelveWeekUtil: [80, 84, 88, 90, 92, 95, 100, 108, 112, 115, 118, 118],
    assignments: [
      { project: "Meridian Partners", hours: 28, planned: 22 },
      { project: "Venn Capital",      hours: 19, planned: 18 },
    ],
  },
  {
    id: "TM-003", name: "Lydia Voss",      department: "Board Advisory",      level: "Associate",
    utilPct: 103, hoursLogged: 41, capacity: 40,
    projects: ["Meridian Partners"],
    leaveStart: "2024-09-02", leaveEnd: "2024-09-06",
    weeklyUtil: [88, 92, 95, 98, 103, 103],
    twelveWeekUtil: [72, 74, 78, 80, 84, 88, 90, 92, 95, 98, 103, 103],
    assignments: [
      { project: "Meridian Partners", hours: 41, planned: 38 },
    ],
  },
  {
    id: "TM-004", name: "Marcus Bell",     department: "Research & Intel.",    level: "Analyst",
    utilPct: 67,  hoursLogged: 27, capacity: 40,
    projects: ["Northbridge Capital", "Oaktree Ventures"],
    weeklyUtil: [62, 64, 68, 70, 65, 67],
    twelveWeekUtil: [55, 58, 60, 62, 64, 66, 68, 70, 68, 65, 67, 67],
    assignments: [
      { project: "Northbridge Capital", hours: 14, planned: 16 },
      { project: "Oaktree Ventures",    hours: 13, planned: 14 },
    ],
  },
  {
    id: "TM-005", name: "Aisha Nkrumah",   department: "Executive Search",    level: "Sr. Associate",
    utilPct: 95,  hoursLogged: 38, capacity: 40,
    projects: ["Northbridge Capital", "Briar Financial", "Atlas Group"],
    weeklyUtil: [85, 88, 90, 92, 95, 95],
    twelveWeekUtil: [70, 74, 78, 80, 84, 85, 88, 90, 92, 94, 95, 95],
    assignments: [
      { project: "Northbridge Capital", hours: 16, planned: 16 },
      { project: "Briar Financial",     hours: 12, planned: 14 },
      { project: "Atlas Group",         hours: 10, planned: 10 },
    ],
  },
  {
    id: "TM-006", name: "Tom Reinhardt",   department: "Succession Planning", level: "Associate",
    utilPct: 112, hoursLogged: 27, capacity: 24,
    projects: ["Oaktree Ventures", "Venn Capital"],
    weeklyUtil: [95, 100, 105, 110, 112, 112],
    twelveWeekUtil: [82, 86, 90, 95, 98, 100, 102, 105, 108, 110, 112, 112],
    assignments: [
      { project: "Oaktree Ventures", hours: 14, planned: 12 },
      { project: "Venn Capital",     hours: 13, planned: 12 },
    ],
  },
  {
    id: "TM-007", name: "Fiona Chan",      department: "Talent Mapping",      level: "Manager",
    utilPct: 58,  hoursLogged: 20, capacity: 35,
    projects: ["Briar Financial"],
    leaveStart: "2024-08-26", leaveEnd: "2024-08-30",
    weeklyUtil: [55, 56, 58, 60, 58, 58],
    twelveWeekUtil: [50, 52, 54, 55, 56, 58, 60, 60, 58, 58, 58, 58],
    assignments: [
      { project: "Briar Financial", hours: 20, planned: 22 },
    ],
  },
  {
    id: "TM-008", name: "Ben Oduola",      department: "Client Relations",    level: "Director",
    utilPct: 65,  hoursLogged: 23, capacity: 35,
    projects: [],
    weeklyUtil: [60, 62, 65, 65, 64, 65],
    twelveWeekUtil: [55, 58, 60, 62, 64, 65, 65, 65, 64, 65, 65, 65],
    assignments: [],
  },
];

// ─── Partners (for By Partner tab) ───────────────────────────────────────────
export interface PartnerRow {
  id: string;
  name: string;
  activeProjects: number;
  totalProjects: number;
  totalHours: number;
  avgTier: string;
  conversionRate: number;
  weeklyHours: number[];   // last 8 weeks
  projects: { name: string; status: string; hours: number; planned: number; tier: string }[];
}

export const PARTNERS: PartnerRow[] = [
  {
    id: "PA-01", name: "James Mercer", activeProjects: 2, totalProjects: 18, totalHours: 464, avgTier: "Tier 1", conversionRate: 72,
    weeklyHours: [54, 58, 62, 60, 55, 58, 62, 55],
    projects: [
      { name: "Northbridge Capital", status: "Active", hours: 248, planned: 286, tier: "Tier 1" },
      { name: "Briar Financial",     status: "Active", hours: 178, planned: 186, tier: "Tier 2" },
      { name: "Pinnacle PE",         status: "Closed", hours: 290, planned: 286, tier: "Tier 1" },
      { name: "Verity Group",        status: "Closed", hours: 182, planned: 186, tier: "Tier 2" },
    ],
  },
  {
    id: "PA-02", name: "Sola Okafor", activeProjects: 2, totalProjects: 14, totalHours: 356, avgTier: "Tier 2", conversionRate: 58,
    weeklyHours: [42, 44, 48, 50, 46, 42, 46, 44],
    projects: [
      { name: "Meridian Partners",   status: "Active", hours: 194, planned: 186, tier: "Tier 2" },
      { name: "Venn Capital",        status: "Active", hours: 162, planned: 186, tier: "Tier 2" },
      { name: "Crestwood Advisors",  status: "Closed", hours: 188, planned: 186, tier: "Tier 2" },
    ],
  },
  {
    id: "PA-03", name: "Lydia Vance", activeProjects: 1, totalProjects: 11, totalHours: 312, avgTier: "Tier 1", conversionRate: 64,
    weeklyHours: [38, 40, 44, 46, 48, 44, 40, 38],
    projects: [
      { name: "Oaktree Ventures",    status: "Active", hours: 312, planned: 286, tier: "Tier 1" },
      { name: "Summit Capital",      status: "Closed", hours: 280, planned: 286, tier: "Tier 1" },
    ],
  },
  {
    id: "PA-04", name: "Raj Patel", activeProjects: 2, totalProjects: 9, totalHours: 186, avgTier: "Tier 2", conversionRate: 44,
    weeklyHours: [22, 24, 26, 28, 26, 24, 22, 20],
    projects: [
      { name: "Atlas Group",         status: "Active", hours: 18,  planned: 96,  tier: "Tier 3" },
      { name: "Flagship BD-Halcyon", status: "On Hold",hours: 168, planned: 186, tier: "Tier 2" },
    ],
  },
];

// ─── Firm-wide KPIs ────────────────────────────────────────────────────────────
export const FIRM_KPIS = {
  overallUtil: 78,
  totalHours: 619,
  availableCapacity: 141,
  overCapacityCount: 3,
  totalCapacity: 760,
};
