// ─── Design tokens (mirrored from utilization) ───────────────────────────────
export const C = {
  ink:      "#16303F",
  slate:    "#3E5568",
  paper:    "#FFFFFF",
  mist:     "#E4E9EC",
  graphite: "#5B6472",
  hairline: "#DAD7CF",
  bg:       "#F8FAFB",
  green:    "#3F7A5D",
  amber:    "#B8875A",
  red:      "#B14A3D",
  greenBg:  "#EBF4EF",
  amberBg:  "#FBF6F0",
  redBg:    "#FBF0EF",
  sans:     "'IBM Plex Sans', sans-serif",
  mono:     "'IBM Plex Mono', monospace",
};

// ─── Section 1: Capacity vs Demand ───────────────────────────────────────────
export const FORECAST_WEEKS = ["Aug 26", "Sep 2", "Sep 9", "Sep 16", "Sep 23", "Sep 30", "Oct 7"];

export interface WeekData { capacity: number; demand: number; }

export const CAPACITY_DEMAND: Record<string, WeekData[]> = {
  "Firm-wide": [
    { capacity: 760, demand: 680 },
    { capacity: 760, demand: 740 },
    { capacity: 720, demand: 795 },
    { capacity: 720, demand: 828 },
    { capacity: 760, demand: 782 },
    { capacity: 760, demand: 745 },
    { capacity: 760, demand: 702 },
  ],
  "Executive Search": [
    { capacity: 240, demand: 210 },
    { capacity: 240, demand: 228 },
    { capacity: 240, demand: 257 },
    { capacity: 240, demand: 272 },
    { capacity: 240, demand: 262 },
    { capacity: 240, demand: 242 },
    { capacity: 240, demand: 221 },
  ],
  "Board Advisory": [
    { capacity: 80, demand: 72 },
    { capacity: 80, demand: 80 },
    { capacity: 80, demand: 89 },
    { capacity: 80, demand: 93 },
    { capacity: 80, demand: 86 },
    { capacity: 80, demand: 78 },
    { capacity: 80, demand: 72 },
  ],
  "Research & Intel.": [
    { capacity: 160, demand: 122 },
    { capacity: 160, demand: 140 },
    { capacity: 160, demand: 154 },
    { capacity: 160, demand: 163 },
    { capacity: 160, demand: 159 },
    { capacity: 160, demand: 148 },
    { capacity: 160, demand: 139 },
  ],
  "Talent Mapping": [
    { capacity: 120, demand: 88 },
    { capacity: 120, demand: 100 },
    { capacity: 120, demand: 108 },
    { capacity: 120, demand: 112 },
    { capacity: 120, demand: 118 },
    { capacity: 120, demand: 112 },
    { capacity: 120, demand: 104 },
  ],
  "Succession Planning": [
    { capacity: 80, demand: 83 },
    { capacity: 80, demand: 90 },
    { capacity: 80, demand: 96 },
    { capacity: 80, demand: 92 },
    { capacity: 80, demand: 87 },
    { capacity: 80, demand: 80 },
    { capacity: 80, demand: 76 },
  ],
  "Client Relations": [
    { capacity: 60, demand: 36 },
    { capacity: 60, demand: 42 },
    { capacity: 60, demand: 46 },
    { capacity: 60, demand: 48 },
    { capacity: 60, demand: 44 },
    { capacity: 60, demand: 41 },
    { capacity: 60, demand: 38 },
  ],
};

export const DEPT_OPTIONS = Object.keys(CAPACITY_DEMAND);

// ─── Section 2: Team Bandwidth Grid ──────────────────────────────────────────
export interface BandwidthMember {
  id: string;
  name: string;
  department: string;
  weeklyUtil: number[]; // 6 forward weeks
}

export const BANDWIDTH_MEMBERS: BandwidthMember[] = [
  { id: "TM-001", name: "Priya Sharma",  department: "Executive Search",    weeklyUtil: [95, 98, 102, 105, 100, 96] },
  { id: "TM-002", name: "Daniel Osei",   department: "Succession Planning", weeklyUtil: [118, 122, 118, 110, 105, 98] },
  { id: "TM-003", name: "Lydia Voss",    department: "Board Advisory",      weeklyUtil: [103, 108, 112, 106, 98, 92] },
  { id: "TM-004", name: "Marcus Bell",   department: "Research & Intel.",   weeklyUtil: [67, 72, 88, 94, 90, 82] },
  { id: "TM-005", name: "Aisha Nkrumah", department: "Executive Search",    weeklyUtil: [95, 98, 105, 108, 104, 98] },
  { id: "TM-006", name: "Tom Reinhardt", department: "Succession Planning", weeklyUtil: [112, 116, 120, 114, 106, 98] },
  { id: "TM-007", name: "Fiona Chan",    department: "Talent Mapping",      weeklyUtil: [58, 62, 70, 78, 82, 80] },
  { id: "TM-008", name: "Ben Oduola",    department: "Client Relations",    weeklyUtil: [65, 68, 72, 75, 72, 68] },
];

// ─── Section 3: Project Health ────────────────────────────────────────────────
export type RiskLevel = "Low Risk" | "Medium Risk" | "High Risk";

export interface HealthFactor {
  label: string;
  value: number;   // –100 to +100; negative = under-burn / behind; positive = over-burn / ahead
  unit: string;    // e.g. "%" or "days"
  description: string;
}

export interface ProjectHealth {
  id: string;
  name: string;
  client: string;
  stage: string;
  risk: RiskLevel;
  summary: string;   // one plain-English line
  factors: HealthFactor[];
}

export const PROJECT_HEALTH: ProjectHealth[] = [
  {
    id: "PJ-001",
    name: "Northbridge Capital – CFO Search",
    client: "Northbridge Capital",
    stage: "Shortlist",
    risk: "Low Risk",
    summary: "On track — hours within 4% of plan, stage timing nominal.",
    factors: [
      { label: "Hours Burn Variance",   value: -4,  unit: "%",   description: "4% under planned hours at this stage — within acceptable tolerance." },
      { label: "Stage Timing Variance", value: 2,   unit: "days", description: "2 days ahead of expected stage duration." },
      { label: "Staffing Gap",          value: 0,   unit: "%",   description: "All required roles filled for this stage." },
    ],
  },
  {
    id: "PJ-002",
    name: "Meridian Partners – CEO",
    client: "Meridian Partners",
    stage: "Interviews",
    risk: "Medium Risk",
    summary: "Stage running 9 days over expected; hours burn tracking high.",
    factors: [
      { label: "Hours Burn Variance",   value: 18,  unit: "%",   description: "18% over planned hours — additional partner time logged during extended interview rounds." },
      { label: "Stage Timing Variance", value: -9,  unit: "days", description: "9 days behind expected stage completion date." },
      { label: "Staffing Gap",          value: -10, unit: "%",   description: "Research associate capacity partially reassigned this week." },
    ],
  },
  {
    id: "PJ-003",
    name: "Oaktree Ventures – COO",
    client: "Oaktree Ventures",
    stage: "Sourcing",
    risk: "High Risk",
    summary: "12% behind planned hours; stage overdue by 14 days with no shortlist yet.",
    factors: [
      { label: "Hours Burn Variance",   value: -12, unit: "%",   description: "12% below planned hours — sourcing team under-resourced for this mandate." },
      { label: "Stage Timing Variance", value: -14, unit: "days", description: "14 days past expected Sourcing completion with no shortlist formed." },
      { label: "Staffing Gap",          value: -25, unit: "%",   description: "Senior Associate capacity gap of ~25% for the next two weeks." },
    ],
  },
  {
    id: "PJ-004",
    name: "Venn Capital – CIO",
    client: "Venn Capital",
    stage: "Offer",
    risk: "Low Risk",
    summary: "Nearing close — offer stage, staffing and hours on plan.",
    factors: [
      { label: "Hours Burn Variance",   value: 6,   unit: "%",   description: "6% over planned hours, within normal variance for offer-stage negotiations." },
      { label: "Stage Timing Variance", value: 1,   unit: "days", description: "1 day behind expected — negligible." },
      { label: "Staffing Gap",          value: 0,   unit: "%",   description: "Full team engaged and on plan." },
    ],
  },
  {
    id: "PJ-005",
    name: "Briar Financial – MD Risk",
    client: "Briar Financial",
    stage: "Shortlist",
    risk: "Medium Risk",
    summary: "Hours tracking ahead of plan but shortlist quality under review.",
    factors: [
      { label: "Hours Burn Variance",   value: 22,  unit: "%",   description: "22% over plan — extensive long-listing before shortlist consolidation." },
      { label: "Stage Timing Variance", value: -5,  unit: "days", description: "5 days behind expected shortlist delivery." },
      { label: "Staffing Gap",          value: -5,  unit: "%",   description: "Minor gap in analyst support this week." },
    ],
  },
  {
    id: "PJ-006",
    name: "Atlas Group – CTO",
    client: "Atlas Group",
    stage: "Intake",
    risk: "High Risk",
    summary: "Severely under-resourced at intake; demand spike in Sep 9 week.",
    factors: [
      { label: "Hours Burn Variance",   value: -38, unit: "%",   description: "38% below planned hours — project effectively stalled at intake stage." },
      { label: "Stage Timing Variance", value: -18, unit: "days", description: "18 days behind expected Intake completion." },
      { label: "Staffing Gap",          value: -40, unit: "%",   description: "No dedicated team assigned yet — competing resource demands elsewhere." },
    ],
  },
];

// ─── Section 4: Recommended Actions ──────────────────────────────────────────
export type ActionTag = "Hire" | `Reallocate from ${string}` | "Monitor" | "Escalate";

export interface RecommendedAction {
  id: string;
  department: string;
  description: string;
  tag: string;
  priority: "high" | "medium" | "low";
  relatedProject?: string;
}

export const RECOMMENDED_ACTIONS: RecommendedAction[] = [
  {
    id: "RA-01",
    department: "Executive Search",
    description: "Short ~1.8 FTE for the Sep 9–23 window as Northbridge and Oaktree overlap at peak sourcing.",
    tag: "Reallocate from Talent Mapping",
    priority: "high",
    relatedProject: "Oaktree Ventures – COO",
  },
  {
    id: "RA-02",
    department: "Succession Planning",
    description: "Daniel Osei and Tom Reinhardt both projected over 115% for 3+ consecutive weeks. Risk of burnout and output quality decline.",
    tag: "Hire",
    priority: "high",
  },
  {
    id: "RA-03",
    department: "Research & Intel.",
    description: "Demand reaches 163h against 160h capacity in Sep 16 week. Narrow gap — worth watching but not yet critical.",
    tag: "Monitor",
    priority: "medium",
    relatedProject: "Atlas Group – CTO",
  },
  {
    id: "RA-04",
    department: "Board Advisory",
    description: "Sep 9–23 shows demand exceeding capacity by 6–16%. Lydia Voss is the primary constraint; consider re-sequencing deliverables.",
    tag: "Escalate",
    priority: "medium",
    relatedProject: "Meridian Partners – CEO",
  },
  {
    id: "RA-05",
    department: "Client Relations",
    description: "Consistently under-utilised (65–75% projected). Capacity could absorb light coordination tasks from busier departments.",
    tag: "Reallocate from Client Relations",
    priority: "low",
  },
];
