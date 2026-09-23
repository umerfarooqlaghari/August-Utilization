export type RiskLevel = "green" | "amber" | "red";

export interface StageRecord {
  name: string;
  enteredDate: string;
  exitDate?: string;
  expectedDays: number;
}

export interface TeamMember {
  id: string;
  name: string;
  department: string;
  level: string;
  hoursThisPeriod: number;
}

export interface DeptHours {
  dept: string;
  planned: number;
  actual: number;
}

export interface OnboardingItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Project {
  id: string;
  name: string;
  partner: string;
  partnerFull: string;
  client: string;
  type: string;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  status: RiskLevel;
  completion: number;
  onboardingPct: number;
  onboardingItems: OnboardingItem[];
  currentStage: string;
  stageHistory: StageRecord[];
  plannedHoursTotal: number;
  actualHoursTotal: number;
  deptHours: DeptHours[];
  team: TeamMember[];
  lastUpdated: string;
  startDate: string;
}

export const ALL_STAGES = ["Intake", "Sourcing", "Shortlist", "Interviews", "Offer", "Closed"];

function onb(a: boolean, b: boolean, c: boolean, d: boolean): OnboardingItem[] {
  return [
    { id: "team", label: "Team staffed", done: a },
    { id: "plan", label: "Resourcing plan applied", done: b },
    { id: "kickoff", label: "Kickoff scheduled", done: c },
    { id: "access", label: "Client access granted", done: d },
  ];
}

export const PROJECTS: Project[] = [
  {
    id: "P-041",
    name: "Northbridge Capital",
    partner: "J. Mercer",
    partnerFull: "James Mercer",
    client: "Northbridge Capital",
    type: "Executive Search",
    tier: "Tier 1",
    status: "green",
    completion: 72,
    onboardingPct: 100,
    onboardingItems: onb(true, true, true, true),
    currentStage: "Interviews",
    stageHistory: [
      { name: "Intake",     enteredDate: "2024-06-10", exitDate: "2024-06-14", expectedDays: 4 },
      { name: "Sourcing",   enteredDate: "2024-06-14", exitDate: "2024-07-02", expectedDays: 12 },
      { name: "Shortlist",  enteredDate: "2024-07-02", exitDate: "2024-07-10", expectedDays: 6 },
      { name: "Interviews", enteredDate: "2024-07-10", expectedDays: 10 },
    ],
    plannedHoursTotal: 286,
    actualHoursTotal: 248,
    deptHours: [
      { dept: "Exec Search", planned: 120, actual: 108 },
      { dept: "Research",    planned: 60,  actual: 58  },
      { dept: "Board Adv.",  planned: 40,  actual: 32  },
      { dept: "Talent Map",  planned: 30,  actual: 28  },
      { dept: "Client Rel.", planned: 36,  actual: 22  },
    ],
    team: [
      { id: "TM-001", name: "Priya Sharma",  department: "Executive Search", level: "Senior Associate", hoursThisPeriod: 38 },
      { id: "TM-005", name: "Aisha Nkrumah", department: "Executive Search", level: "Senior Associate", hoursThisPeriod: 32 },
      { id: "TM-004", name: "Marcus Bell",   department: "Research & Intelligence", level: "Analyst",   hoursThisPeriod: 24 },
    ],
    lastUpdated: "2024-08-22",
    startDate: "2024-06-10",
  },
  {
    id: "P-039",
    name: "Meridian Partners",
    partner: "S. Okafor",
    partnerFull: "Sola Okafor",
    client: "Meridian Partners",
    type: "Board Advisory",
    tier: "Tier 2",
    status: "amber",
    completion: 55,
    onboardingPct: 100,
    onboardingItems: onb(true, true, true, true),
    currentStage: "Shortlist",
    stageHistory: [
      { name: "Intake",    enteredDate: "2024-05-22", exitDate: "2024-05-27", expectedDays: 4  },
      { name: "Sourcing",  enteredDate: "2024-05-27", exitDate: "2024-06-24", expectedDays: 14 },
      { name: "Shortlist", enteredDate: "2024-06-24", expectedDays: 7 },
    ],
    plannedHoursTotal: 186,
    actualHoursTotal: 194,
    deptHours: [
      { dept: "Board Adv.", planned: 60, actual: 78 },
      { dept: "Research",   planned: 48, actual: 52 },
      { dept: "Exec Search",planned: 40, actual: 36 },
      { dept: "Client Rel.",planned: 38, actual: 28 },
    ],
    team: [
      { id: "TM-003", name: "Lydia Voss",   department: "Board Advisory",       level: "Associate", hoursThisPeriod: 41 },
      { id: "TM-002", name: "Daniel Osei",  department: "Succession Planning",  level: "Manager",   hoursThisPeriod: 28 },
    ],
    lastUpdated: "2024-08-20",
    startDate: "2024-05-22",
  },
  {
    id: "P-038",
    name: "Oaktree Ventures",
    partner: "L. Vance",
    partnerFull: "Lydia Vance",
    client: "Oaktree Ventures",
    type: "Executive Search",
    tier: "Tier 1",
    status: "red",
    completion: 41,
    onboardingPct: 100,
    onboardingItems: onb(true, true, true, true),
    currentStage: "Sourcing",
    stageHistory: [
      { name: "Intake",   enteredDate: "2024-04-15", exitDate: "2024-04-22", expectedDays: 4  },
      { name: "Sourcing", enteredDate: "2024-04-22", expectedDays: 14 },
    ],
    plannedHoursTotal: 286,
    actualHoursTotal: 312,
    deptHours: [
      { dept: "Exec Search", planned: 120, actual: 148 },
      { dept: "Research",    planned: 60,  actual: 72  },
      { dept: "Board Adv.",  planned: 40,  actual: 42  },
      { dept: "Talent Map",  planned: 30,  actual: 28  },
      { dept: "Client Rel.", planned: 36,  actual: 22  },
    ],
    team: [
      { id: "TM-001", name: "Priya Sharma",  department: "Executive Search",       level: "Senior Associate", hoursThisPeriod: 40 },
      { id: "TM-004", name: "Marcus Bell",   department: "Research & Intelligence", level: "Analyst",          hoursThisPeriod: 36 },
      { id: "TM-006", name: "Tom Reinhardt", department: "Succession Planning",     level: "Associate",        hoursThisPeriod: 24 },
    ],
    lastUpdated: "2024-08-23",
    startDate: "2024-04-15",
  },
  {
    id: "P-037",
    name: "Briar Financial",
    partner: "J. Mercer",
    partnerFull: "James Mercer",
    client: "Briar Financial",
    type: "Talent Mapping",
    tier: "Tier 2",
    status: "green",
    completion: 95,
    onboardingPct: 100,
    onboardingItems: onb(true, true, true, true),
    currentStage: "Offer",
    stageHistory: [
      { name: "Intake",      enteredDate: "2024-03-01", exitDate: "2024-03-05", expectedDays: 4  },
      { name: "Sourcing",    enteredDate: "2024-03-05", exitDate: "2024-03-22", expectedDays: 14 },
      { name: "Shortlist",   enteredDate: "2024-03-22", exitDate: "2024-04-01", expectedDays: 7  },
      { name: "Interviews",  enteredDate: "2024-04-01", exitDate: "2024-04-18", expectedDays: 10 },
      { name: "Offer",       enteredDate: "2024-04-18", expectedDays: 7 },
    ],
    plannedHoursTotal: 186,
    actualHoursTotal: 178,
    deptHours: [
      { dept: "Exec Search", planned: 80, actual: 76 },
      { dept: "Research",    planned: 40, actual: 38 },
      { dept: "Talent Map",  planned: 36, actual: 40 },
      { dept: "Client Rel.", planned: 30, actual: 24 },
    ],
    team: [
      { id: "TM-007", name: "Fiona Chan",    department: "Talent Mapping",   level: "Manager",          hoursThisPeriod: 20 },
      { id: "TM-005", name: "Aisha Nkrumah", department: "Executive Search", level: "Senior Associate",  hoursThisPeriod: 16 },
    ],
    lastUpdated: "2024-08-21",
    startDate: "2024-03-01",
  },
  {
    id: "P-035",
    name: "Atlas Group",
    partner: "R. Patel",
    partnerFull: "Raj Patel",
    client: "Atlas Group",
    type: "Executive Search",
    tier: "Tier 3",
    status: "green",
    completion: 8,
    onboardingPct: 50,
    onboardingItems: onb(true, true, false, false),
    currentStage: "Intake",
    stageHistory: [
      { name: "Intake", enteredDate: "2024-08-20", expectedDays: 4 },
    ],
    plannedHoursTotal: 96,
    actualHoursTotal: 18,
    deptHours: [
      { dept: "Exec Search", planned: 40, actual: 10 },
      { dept: "Research",    planned: 20, actual: 6  },
      { dept: "Client Rel.", planned: 20, actual: 2  },
      { dept: "Talent Map",  planned: 16, actual: 0  },
    ],
    team: [
      { id: "TM-005", name: "Aisha Nkrumah", department: "Executive Search", level: "Senior Associate", hoursThisPeriod: 10 },
    ],
    lastUpdated: "2024-08-24",
    startDate: "2024-08-20",
  },
  {
    id: "P-034",
    name: "Venn Capital",
    partner: "S. Okafor",
    partnerFull: "Sola Okafor",
    client: "Venn Capital",
    type: "Succession Planning",
    tier: "Tier 2",
    status: "amber",
    completion: 63,
    onboardingPct: 75,
    onboardingItems: onb(true, true, true, false),
    currentStage: "Shortlist",
    stageHistory: [
      { name: "Intake",    enteredDate: "2024-07-08", exitDate: "2024-07-14", expectedDays: 4  },
      { name: "Sourcing",  enteredDate: "2024-07-14", exitDate: "2024-08-05", expectedDays: 14 },
      { name: "Shortlist", enteredDate: "2024-08-05", expectedDays: 7 },
    ],
    plannedHoursTotal: 186,
    actualHoursTotal: 162,
    deptHours: [
      { dept: "Exec Search", planned: 80, actual: 72 },
      { dept: "Succession",  planned: 48, actual: 52 },
      { dept: "Research",    planned: 32, actual: 24 },
      { dept: "Client Rel.", planned: 26, actual: 14 },
    ],
    team: [
      { id: "TM-002", name: "Daniel Osei",  department: "Succession Planning", level: "Manager",   hoursThisPeriod: 35 },
      { id: "TM-006", name: "Tom Reinhardt", department: "Succession Planning", level: "Associate", hoursThisPeriod: 22 },
    ],
    lastUpdated: "2024-08-19",
    startDate: "2024-07-08",
  },
];

export const RISK_COLOR: Record<string, string> = { green: "#3F7A5D", amber: "#B8875A", red: "#B14A3D" };
export const RISK_LABEL: Record<string, string> = { green: "On Track", amber: "At Risk", red: "Behind" };
export const RISK_BG:    Record<string, string> = { green: "#EBF4EF", amber: "#FBF6F0", red: "#FBF0EF" };
export const TIER_BADGE: Record<string, { bg: string; color: string }> = {
  "Tier 1": { bg: "#16303F", color: "#D9E2E8" },
  "Tier 2": { bg: "#3E5568", color: "#D9E2E8" },
  "Tier 3": { bg: "#7A95A8", color: "#FFFFFF"  },
};

export function relativeTime(iso: string): string {
  const days = Math.round((new Date("2024-08-24").getTime() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.round(days / 7)} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
}
