import { useState, useRef } from "react";
import { T, PrimaryBtn, SecondaryBtn, Field, Input, Select } from "./primitives";

const DEPARTMENTS = ["Exec Search", "Board Adv.", "Research", "Talent Map", "Succession", "Client Rel."];
const TIERS = ["Tier 1", "Tier 2", "Tier 3"];

type Grid = Record<string, Record<string, number>>;

const DEFAULT_GRID: Grid = {
  "Tier 1": { "Exec Search": 120, "Board Adv.": 40, "Research": 60, "Talent Map": 30, "Succession": 20, "Client Rel.": 16 },
  "Tier 2": { "Exec Search": 80, "Board Adv.": 24, "Research": 40, "Talent Map": 20, "Succession": 12, "Client Rel.": 10 },
  "Tier 3": { "Exec Search": 40, "Board Adv.": 12, "Research": 20, "Talent Map": 10, "Succession": 8, "Client Rel.": 6 },
};

// Stage templates data
interface Stage {
  id: string;
  name: string;
  durationMin: number;
  durationMax: number;
  weights: Record<string, number>; // dept → % of effort
}

const STAGE_DEPT_KEYS = ["ES", "BA", "RI", "TM", "SP", "CR"];
const STAGE_DEPT_LABELS = ["ES", "BA", "RI", "TM", "SP", "CR"];

interface StageTemplate {
  id: string;
  name: string;
  stages: Stage[];
}

const DEFAULT_TEMPLATES: StageTemplate[] = [
  {
    id: "T1",
    name: "Executive Search Standard",
    stages: [
      { id: "s1", name: "Intake", durationMin: 3, durationMax: 5, weights: { ES: 20, BA: 5, RI: 50, TM: 15, SP: 5, CR: 5 } },
      { id: "s2", name: "Sourcing", durationMin: 10, durationMax: 14, weights: { ES: 30, BA: 5, RI: 40, TM: 15, SP: 5, CR: 5 } },
      { id: "s3", name: "Shortlist", durationMin: 5, durationMax: 7, weights: { ES: 40, BA: 10, RI: 20, TM: 10, SP: 5, CR: 15 } },
      { id: "s4", name: "Interviews", durationMin: 7, durationMax: 14, weights: { ES: 50, BA: 15, RI: 5, TM: 5, SP: 10, CR: 15 } },
      { id: "s5", name: "Offer", durationMin: 5, durationMax: 10, weights: { ES: 30, BA: 5, RI: 5, TM: 5, SP: 5, CR: 50 } },
      { id: "s6", name: "Closed", durationMin: 2, durationMax: 3, weights: { ES: 10, BA: 5, RI: 5, TM: 5, SP: 5, CR: 70 } },
    ],
  },
  {
    id: "T2",
    name: "Board Advisory",
    stages: [
      { id: "b1", name: "Scoping", durationMin: 5, durationMax: 7, weights: { ES: 10, BA: 50, RI: 20, TM: 5, SP: 10, CR: 5 } },
      { id: "b2", name: "Research", durationMin: 7, durationMax: 10, weights: { ES: 5, BA: 30, RI: 50, TM: 10, SP: 0, CR: 5 } },
      { id: "b3", name: "Candidate Review", durationMin: 7, durationMax: 14, weights: { ES: 10, BA: 50, RI: 10, TM: 5, SP: 15, CR: 10 } },
      { id: "b4", name: "Recommendation", durationMin: 3, durationMax: 5, weights: { ES: 5, BA: 50, RI: 10, TM: 5, SP: 5, CR: 25 } },
    ],
  },
];

// Draggable stage row
function StageRow({
  stage,
  idx,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  stage: Stage;
  idx: number;
  total: number;
  onChange: (s: Stage) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const weightEntries = STAGE_DEPT_KEYS.map((k) => stage.weights[k] ?? 0);
  const weightTotal = weightEntries.reduce((a, b) => a + b, 0);

  const WEIGHT_COLORS = ["#16303F", "#3E5568", "#7A95A8", "#B8875A", "#3F7A5D", "#B14A3D"];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr 140px 1fr 36px",
        alignItems: "center",
        gap: 12,
        padding: "11px 14px",
        borderBottom: `1px solid ${T.mist}`,
        background: T.paper,
      }}
    >
      {/* drag handle + reorder */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
        <button disabled={idx === 0} onClick={onMoveUp} style={{ background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? T.hairline : T.graphite, lineHeight: 1, padding: 2 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 7l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button disabled={idx === total - 1} onClick={onMoveDown} style={{ background: "none", border: "none", cursor: idx === total - 1 ? "default" : "pointer", color: idx === total - 1 ? T.hairline : T.graphite, lineHeight: 1, padding: 2 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {/* Stage name */}
      <input
        value={stage.name}
        onChange={(e) => onChange({ ...stage, name: e.target.value })}
        style={{ fontFamily: T.sans, fontSize: 13, color: T.ink, background: "none", border: "none", outline: "none", fontWeight: 500, padding: 0 }}
      />

      {/* Duration */}
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <input
          type="number"
          value={stage.durationMin}
          onChange={(e) => onChange({ ...stage, durationMin: parseInt(e.target.value) || 0 })}
          style={{ fontFamily: T.mono, fontSize: 12, color: T.ink, background: T.bg, border: `1px solid ${T.hairline}`, borderRadius: 4, padding: "3px 6px", width: 40, textAlign: "center", outline: "none" }}
        />
        <span style={{ fontFamily: T.sans, fontSize: 11, color: T.graphite }}>–</span>
        <input
          type="number"
          value={stage.durationMax}
          onChange={(e) => onChange({ ...stage, durationMax: parseInt(e.target.value) || 0 })}
          style={{ fontFamily: T.mono, fontSize: 12, color: T.ink, background: T.bg, border: `1px solid ${T.hairline}`, borderRadius: 4, padding: "3px 6px", width: 40, textAlign: "center", outline: "none" }}
        />
        <span style={{ fontFamily: T.sans, fontSize: 11, color: T.graphite }}>d</span>
      </div>

      {/* Dept weight mini bar */}
      <div>
        <div style={{ display: "flex", height: 10, borderRadius: 3, overflow: "hidden", gap: "1px" }}>
          {weightEntries.map((w, i) => (
            <div
              key={i}
              title={`${STAGE_DEPT_LABELS[i]}: ${w}%`}
              style={{ flex: w || 0, background: WEIGHT_COLORS[i], minWidth: w > 0 ? 2 : 0 }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          {STAGE_DEPT_LABELS.map((l, i) => (
            <span key={l} style={{ fontFamily: T.mono, fontSize: 9, color: T.graphite }} title={l}>{weightEntries[i]}%</span>
          ))}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        style={{ background: "none", border: "none", cursor: "pointer", color: T.graphite, display: "flex", alignItems: "center", justifyContent: "center" }}
        title="Remove stage"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

function StageTemplatesPanel({ onClose }: { onClose: () => void }) {
  const [templates, setTemplates] = useState<StageTemplate[]>(DEFAULT_TEMPLATES);
  const [activeId, setActiveId] = useState(templates[0]?.id ?? "");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [addingTemplate, setAddingTemplate] = useState(false);

  const active = templates.find((t) => t.id === activeId);

  const updateStage = (stageIdx: number, updated: Stage) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id !== activeId ? t : { ...t, stages: t.stages.map((s, i) => (i === stageIdx ? updated : s)) }
      )
    );
  };

  const deleteStage = (stageIdx: number) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id !== activeId ? t : { ...t, stages: t.stages.filter((_, i) => i !== stageIdx) }
      )
    );
  };

  const moveStage = (from: number, to: number) => {
    if (!active) return;
    const stages = [...active.stages];
    const [item] = stages.splice(from, 1);
    stages.splice(to, 0, item);
    setTemplates((prev) => prev.map((t) => (t.id !== activeId ? t : { ...t, stages })));
  };

  const addStage = () => {
    const newStage: Stage = {
      id: `s${Date.now()}`,
      name: "New Stage",
      durationMin: 3,
      durationMax: 7,
      weights: { ES: 20, BA: 10, RI: 30, TM: 20, SP: 10, CR: 10 },
    };
    setTemplates((prev) => prev.map((t) => (t.id !== activeId ? t : { ...t, stages: [...t.stages, newStage] })));
  };

  const addTemplate = () => {
    if (!newTemplateName.trim()) return;
    const id = `T${Date.now()}`;
    setTemplates((prev) => [...prev, { id, name: newTemplateName.trim(), stages: [] }]);
    setActiveId(id);
    setNewTemplateName("");
    setAddingTemplate(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(22,48,63,0.22)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 680,
          background: T.paper,
          borderLeft: `1px solid ${T.hairline}`,
          boxShadow: "-8px 0 32px rgba(22,48,63,0.14)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${T.hairline}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 15, color: T.ink }}>Stage Templates</div>
            <div style={{ fontFamily: T.sans, fontSize: 12, color: T.graphite, marginTop: 2 }}>Define the stages and effort distribution for each project type.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.graphite, fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Template list */}
          <div style={{ width: 200, borderRight: `1px solid ${T.hairline}`, padding: "12px 0", flexShrink: 0, overflowY: "auto" }}>
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  textAlign: "left",
                  background: activeId === t.id ? T.mist : "none",
                  border: "none",
                  borderLeft: `2px solid ${activeId === t.id ? T.ink : "transparent"}`,
                  cursor: "pointer",
                  fontFamily: T.sans,
                  fontSize: 13,
                  color: activeId === t.id ? T.ink : T.graphite,
                  fontWeight: activeId === t.id ? 500 : 400,
                  transition: "all 0.1s",
                }}
              >
                <div>{t.name}</div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.graphite, marginTop: 2 }}>{t.stages.length} stages</div>
              </button>
            ))}
            {addingTemplate ? (
              <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                <input
                  autoFocus
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addTemplate(); if (e.key === "Escape") setAddingTemplate(false); }}
                  placeholder="Template name"
                  style={{ fontFamily: T.sans, fontSize: 12, color: T.ink, border: `1px solid ${T.hairline}`, borderRadius: 5, padding: "5px 8px", outline: "none", background: T.paper }}
                />
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={addTemplate} style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 500, color: T.ivory, background: T.ink, border: "none", borderRadius: 4, padding: "3px 10px", cursor: "pointer" }}>Add</button>
                  <button onClick={() => setAddingTemplate(false)} style={{ fontFamily: T.sans, fontSize: 11, color: T.graphite, background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingTemplate(true)}
                style={{ width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontFamily: T.sans, fontSize: 12, color: T.graphite, display: "flex", alignItems: "center", gap: 6 }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Template
              </button>
            )}
          </div>

          {/* Stage editor */}
          {active ? (
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              {/* Column headers */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "28px 1fr 140px 1fr 36px",
                gap: 12,
                padding: "9px 14px",
                borderBottom: `1px solid ${T.hairline}`,
                background: T.bg,
                flexShrink: 0,
              }}>
                <div />
                <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 600, color: T.graphite, letterSpacing: "0.07em", textTransform: "uppercase" }}>Stage</span>
                <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 600, color: T.graphite, letterSpacing: "0.07em", textTransform: "uppercase" }}>Duration (days)</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {STAGE_DEPT_LABELS.map((l) => (
                    <span key={l} style={{ fontFamily: T.mono, fontSize: 9, fontWeight: 600, color: T.graphite, flex: 1, textAlign: "center" }}>{l}</span>
                  ))}
                </div>
                <div />
              </div>

              {active.stages.length === 0 ? (
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <div style={{ fontFamily: T.sans, fontSize: 13, color: T.graphite, marginBottom: 12 }}>No stages yet. Add the first stage for this template.</div>
                  <button onClick={addStage} style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 500, color: T.ivory, background: T.ink, border: "none", borderRadius: 6, padding: "8px 18px", cursor: "pointer" }}>+ Add Stage</button>
                </div>
              ) : (
                active.stages.map((stage, i) => (
                  <StageRow
                    key={stage.id}
                    stage={stage}
                    idx={i}
                    total={active.stages.length}
                    onChange={(updated) => updateStage(i, updated)}
                    onDelete={() => deleteStage(i)}
                    onMoveUp={() => moveStage(i, i - 1)}
                    onMoveDown={() => moveStage(i, i + 1)}
                  />
                ))
              )}

              <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.mist}` }}>
                <button
                  onClick={addStage}
                  style={{ fontFamily: T.sans, fontSize: 12, color: T.slate, background: "none", border: `1px dashed ${T.hairline}`, borderRadius: 5, padding: "7px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span>+</span> Add Stage
                </button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: T.sans, fontSize: 13, color: T.graphite }}>Select a template to edit.</span>
            </div>
          )}
        </div>

        <div style={{ padding: "14px 24px", borderTop: `1px solid ${T.hairline}`, display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
          <PrimaryBtn onClick={onClose}>Done</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

export default function ResourcingTemplate() {
  const [grid, setGrid] = useState<Grid>(DEFAULT_GRID);
  const [editingCell, setEditingCell] = useState<{ tier: string; dept: string } | null>(null);
  const [cellValue, setCellValue] = useState("");
  const [stagesOpen, setStagesOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = (tier: string, dept: string) => {
    setEditingCell({ tier, dept });
    setCellValue(String(grid[tier][dept]));
    setTimeout(() => inputRef.current?.select(), 30);
  };

  const commitEdit = () => {
    if (!editingCell) return;
    const val = parseInt(cellValue);
    if (!isNaN(val) && val >= 0) {
      setGrid((prev) => ({
        ...prev,
        [editingCell.tier]: { ...prev[editingCell.tier], [editingCell.dept]: val },
      }));
    }
    setEditingCell(null);
  };

  const tierTotal = (tier: string) => DEPARTMENTS.reduce((s, d) => s + (grid[tier]?.[d] ?? 0), 0);
  const deptTotal = (dept: string) => TIERS.reduce((s, t) => s + (grid[t]?.[dept] ?? 0), 0);
  const grandTotal = TIERS.reduce((s, t) => s + tierTotal(t), 0);

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Metadata row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          padding: "12px 16px",
          background: T.paper,
          border: `1px solid ${T.hairline}`,
          borderRadius: 8,
        }}
      >
        <div>
          <span style={{ fontFamily: T.sans, fontSize: 12, color: T.graphite }}>
            Last updated by <strong style={{ color: T.ink }}>Morgan Hayes</strong> on <span style={{ fontFamily: T.mono }}>2024-08-19</span>
          </span>
          <span style={{ fontFamily: T.sans, fontSize: 12, color: T.graphite }}> · </span>
          <button style={{ fontFamily: T.sans, fontSize: 12, color: T.slate, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>
            View history
          </button>
        </div>
        <SecondaryBtn onClick={() => setStagesOpen(true)}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Stage Templates
          </div>
        </SecondaryBtn>
      </div>

      {/* Context note */}
      <div style={{ fontFamily: T.sans, fontSize: 12, color: T.graphite, marginBottom: 16, lineHeight: 1.6 }}>
        This table defines the <strong>planned hours per engagement</strong> by project tier and department. It is the master reference used to calculate capacity demand when new projects are added to the pipeline. Click any cell to edit.
      </div>

      {/* Grid */}
      <div
        style={{
          background: T.paper,
          border: `1px solid ${T.hairline}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.ink }}>
              <th style={{ padding: "12px 18px", textAlign: "left", fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.ivory, letterSpacing: "0.07em", textTransform: "uppercase", width: 120 }}>
                Tier
              </th>
              {DEPARTMENTS.map((d) => (
                <th key={d} style={{ padding: "12px 14px", textAlign: "right", fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.ivory, letterSpacing: "0.06em" }}>
                  {d}
                </th>
              ))}
              <th style={{ padding: "12px 14px", textAlign: "right", fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: "rgba(217,226,232,0.6)", letterSpacing: "0.06em" }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((tier, ti) => (
              <tr
                key={tier}
                style={{ borderBottom: ti < TIERS.length - 1 ? `1px solid ${T.hairline}` : "none", background: ti % 2 === 0 ? T.paper : T.bg }}
              >
                <td style={{ padding: "13px 18px", verticalAlign: "middle" }}>
                  <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 13, color: T.ink }}>{tier}</div>
                </td>
                {DEPARTMENTS.map((dept) => {
                  const isEditing = editingCell?.tier === tier && editingCell?.dept === dept;
                  const val = grid[tier]?.[dept] ?? 0;
                  return (
                    <td
                      key={dept}
                      style={{ padding: "4px 6px", textAlign: "right", verticalAlign: "middle", cursor: "pointer" }}
                      onClick={() => startEdit(tier, dept)}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type="number"
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditingCell(null); }}
                          style={{
                            fontFamily: T.mono,
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.ink,
                            background: "#EEF4F8",
                            border: `2px solid ${T.slate}`,
                            borderRadius: 4,
                            padding: "6px 8px",
                            width: 72,
                            textAlign: "right",
                            outline: "none",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div
                          style={{
                            fontFamily: T.mono,
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.ink,
                            padding: "6px 8px",
                            borderRadius: 4,
                            transition: "background 0.12s",
                            display: "inline-block",
                            minWidth: 52,
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.mist; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          {val}
                        </div>
                      )}
                    </td>
                  );
                })}
                {/* Row total */}
                <td style={{ padding: "13px 14px", textAlign: "right", verticalAlign: "middle" }}>
                  <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 600, color: T.graphite }}>{tierTotal(tier)}</span>
                </td>
              </tr>
            ))}

            {/* Column totals */}
            <tr style={{ background: T.bg, borderTop: `1px solid ${T.hairline}` }}>
              <td style={{ padding: "11px 18px", fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.graphite, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Total
              </td>
              {DEPARTMENTS.map((dept) => (
                <td key={dept} style={{ padding: "11px 14px", textAlign: "right" }}>
                  <span style={{ fontFamily: T.mono, fontSize: 12, color: T.graphite }}>{deptTotal(dept)}</span>
                </td>
              ))}
              <td style={{ padding: "11px 14px", textAlign: "right" }}>
                <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: T.ink }}>{grandTotal}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 10, fontFamily: T.sans, fontSize: 11, color: T.graphite }}>
        Values represent planned hours per engagement at each tier. All figures are editable — click any cell to update.
      </div>

      {stagesOpen && <StageTemplatesPanel onClose={() => setStagesOpen(false)} />}
    </div>
  );
}
