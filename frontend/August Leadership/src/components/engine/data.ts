// ─── Design tokens (mirrored from prediction) ────────────────────────────────
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

/* ────────────────────────────────────────────────────────────────────────────
   Forecast Engine — worked example

   Every figure rendered in the walkthrough is derived from the constants in
   this file. Change a value here and all six steps recompute. Nothing in the
   UI is a hard-coded illustration.
──────────────────────────────────────────────────────────────────────────── */

export const MANDATE = {
  id: "P-041",
  client: "Northbridge Capital",
  partner: "J. Mercer",
  type: "Executive Search",
  tier: "Tier 1",
  assignmentValue: 180_000,
  plannedHours: 286,
};

export interface EngineResource {
  id: string;
  name: string;
  department: string;
  level: string;
  costRate: number;          // $/hr — assumption
  contractedHours: number;   // per week
  leaveHours: number;        // per week, confirmed
  internalHours: number;     // per week, internal + BD
  otherCommitments: number;  // per week, demand from other mandates
  plannedHours: number;      // on this mandate
}

export const RESOURCES: EngineResource[] = [
  {
    id: "TM-001", name: "Priya Sharma",
    department: "Executive Search", level: "Sr. Associate",
    costRate: 120, contractedHours: 40, leaveHours: 0, internalHours: 6,
    otherCommitments: 18, plannedHours: 120,
  },
  {
    id: "TM-005", name: "Aisha Nkrumah",
    department: "Executive Search", level: "Sr. Associate",
    costRate: 120, contractedHours: 40, leaveHours: 8, internalHours: 4,
    otherCommitments: 10, plannedHours: 100,
  },
  {
    id: "TM-004", name: "Marcus Bell",
    department: "Research & Intel.", level: "Analyst",
    costRate: 70, contractedHours: 40, leaveHours: 0, internalHours: 5,
    otherCommitments: 20, plannedHours: 66,
  },
];

/** Ordinary friction of a working day — task switching, interruptions. */
export const DOWNTIME_FACTOR = 0.10;

/** Stage weights follow ALL_STAGES in projects/data.ts. Must sum to 1. */
export const STAGE_WEIGHTS: { name: string; weight: number }[] = [
  { name: "Intake",     weight: 0.07 },
  { name: "Sourcing",   weight: 0.33 },
  { name: "Shortlist",  weight: 0.20 },
  { name: "Interviews", weight: 0.22 },
  { name: "Offer",      weight: 0.12 },
  { name: "Closed",     weight: 0.06 },
];

/** Expected pace — how remaining work lands across the coming weeks. */
export const PACE_PROFILES: Record<string, number[]> = {
  Quicker:  [0.55, 0.30, 0.15],
  Typical:  [0.40, 0.35, 0.25],
  Slower:   [0.28, 0.30, 0.24, 0.18],
};

export type ScenarioKey = "onTrack" | "overrun";

export interface Scenario {
  label: string;
  stageIndex: number;
  stageCompletion: number;
  actualHours: number;
  pace: keyof typeof PACE_PROFILES;
  holdWeeks?: number;
  reading: string;
}

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  onTrack: {
    label: "On track",
    stageIndex: 3, stageCompletion: 0.70, actualHours: 214, pace: "Typical",
    reading:
      "Hours consumed are tracking behind the stage plan. The forecast lands inside the planned envelope, and the capacity it needs is already available.",
  },
  overrun: {
    label: "Overrunning",
    stageIndex: 3, stageCompletion: 0.45, actualHours: 248, pace: "Typical",
    reading:
      "Effort is running ahead of operational progress — more hours consumed than the stage position justifies. The forecast exceeds plan, and says so now rather than at close.",
   },
  // hold: {
  //   label: "On hold, then resumed",
  //   stageIndex: 2, stageCompletion: 0.60, actualHours: 168, pace: "Slower", holdWeeks: 3,
  //   reading:
  //     "Work froze mid-Shortlist while the client reconsidered scope. Capacity returned to the pool during the hold; remaining hours re-spread on resumption without a single hour being created or lost.",
  // },
};

/* ─── Derived model ──────────────────────────────────────────────────────── */

export interface ResourceSupply {
  resource: EngineResource;
  netCapacity: number;
  deducted: number;
}

export interface WeekSpread {
  index: number;
  hours: number;
  byResource: { resource: EngineResource; hours: number }[];
}

export interface RollupRow {
  resource: EngineResource;
  mandateHours: number;
  demand: number;
  netCapacity: number;
  utilisation: number;
}

export interface EngineModel {
  stagePlan: { name: string; weight: number; hours: number }[];
  plannedCost: number;
  blendedRate: number;
  supply: ResourceSupply[];
  currentStage: { name: string; hours: number };
  currentStageRemaining: number;
  futureStagesRemaining: number;
  remaining: number;
  naiveRemaining: number;
  forecastAtCompletion: number;
  variance: number;
  costImpact: number;
  weeks: WeekSpread[];
  spreadTotal: number;
  reconciles: boolean;
  rollup: RollupRow[];
  capacityReleased: number;
}

export function buildModel(sc: Scenario): EngineModel {
  const stagePlan = STAGE_WEIGHTS.map((s) => ({
    ...s,
    hours: MANDATE.plannedHours * s.weight,
  }));

  const plannedCost = RESOURCES.reduce((a, r) => a + r.plannedHours * r.costRate, 0);
  const blendedRate = plannedCost / MANDATE.plannedHours;

  const supply: ResourceSupply[] = RESOURCES.map((r) => {
    const afterDeductions = r.contractedHours - r.leaveHours - r.internalHours;
    const netCapacity = afterDeductions * (1 - DOWNTIME_FACTOR);
    return { resource: r, netCapacity, deducted: r.contractedHours - netCapacity };
  });

  const currentStage = stagePlan[sc.stageIndex];
  const currentStageRemaining = currentStage.hours * (1 - sc.stageCompletion);
  const futureStagesRemaining = stagePlan
    .slice(sc.stageIndex + 1)
    .reduce((a, s) => a + s.hours, 0);
  const remaining = currentStageRemaining + futureStagesRemaining;

  const naiveRemaining = MANDATE.plannedHours - sc.actualHours;
  const forecastAtCompletion = sc.actualHours + remaining;
  const variance = forecastAtCompletion - MANDATE.plannedHours;
  const costImpact = variance * blendedRate;

  const profile = PACE_PROFILES[sc.pace];
  const weightSum = profile.reduce((a, b) => a + b, 0);
  const weeks: WeekSpread[] = profile.map((w, i) => {
    const hours = remaining * (w / weightSum);
    return {
      index: i + 1,
      hours,
      byResource: RESOURCES.map((r) => ({
        resource: r,
        hours: hours * (r.plannedHours / MANDATE.plannedHours),
      })),
    };
  });

  const spreadTotal = weeks.reduce((a, w) => a + w.hours, 0);
  const reconciles = Math.abs(spreadTotal - remaining) < 0.0001;

  const rollup: RollupRow[] = supply.map((s) => {
    const mandateHours =
      weeks[0].byResource.find((b) => b.resource.id === s.resource.id)?.hours ?? 0;
    const demand = mandateHours + s.resource.otherCommitments;
    return {
      resource: s.resource,
      mandateHours,
      demand,
      netCapacity: s.netCapacity,
      utilisation: demand / s.netCapacity,
    };
  });

  // Hours handed back to the pool while a mandate is paused.
  const weeklyRunRate = remaining / profile.length;
  const capacityReleased = (sc.holdWeeks ?? 0) * weeklyRunRate;

  return {
    stagePlan, plannedCost, blendedRate, supply,
    currentStage, currentStageRemaining, futureStagesRemaining, remaining,
    naiveRemaining, forecastAtCompletion, variance, costImpact,
    weeks, spreadTotal, reconciles, rollup, capacityReleased,
  };
}

export const STEPS = [
  { n: "01", label: "Inputs",          title: "What the model starts from" },
  { n: "02", label: "Capacity",        title: "What each person actually has available" },
  { n: "03", label: "Stage plan",      title: "How planned hours spread across the lifecycle" },
  { n: "04", label: "Remaining work",  title: "How much work is actually left" },
  { n: "05", label: "Re-spread",       title: "Placing remaining hours into weeks" },
  { n: "06", label: "Roll-up",         title: "Demand against capacity, and the decision it drives" },
];
