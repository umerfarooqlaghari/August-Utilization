import { useState } from "react";
import {
  T, Badge, IconBtn, PrimaryBtn, SecondaryBtn, Field, Input, Select, Drawer,
  ConfirmModal, TableSkeleton, EmptyState, SearchInput, FilterSelect,
  TableShell, TR, TD, SectionBar,
} from "./primitives";

const DEPARTMENTS = ["Executive Search", "Board Advisory", "Research & Intelligence", "Talent Mapping", "Succession Planning", "Client Relations"];
const LEVELS = ["Analyst", "Associate", "Senior Associate", "Manager", "Director", "Partner"];
const EMP_TYPES = ["Full-time", "Part-time", "Contractor"];
const STATUSES = ["Active", "On Leave", "Inactive"];

interface Member {
  id: string;
  name: string;
  email: string;
  department: string;
  level: string;
  employmentType: string;
  weeklyCapacity: number;
  status: string;
  startDate: string;
}

const SEED: Member[] = [
  { id: "TM-001", name: "Priya Sharma", email: "p.sharma@amplify.com", department: "Executive Search", level: "Senior Associate", employmentType: "Full-time", weeklyCapacity: 40, status: "Active", startDate: "2021-09-01" },
  { id: "TM-002", name: "Daniel Osei", email: "d.osei@amplify.com", department: "Succession Planning", level: "Manager", employmentType: "Full-time", weeklyCapacity: 40, status: "Active", startDate: "2020-04-14" },
  { id: "TM-003", name: "Lydia Voss", email: "l.voss@amplify.com", department: "Board Advisory", level: "Associate", employmentType: "Full-time", weeklyCapacity: 40, status: "Active", startDate: "2022-01-10" },
  { id: "TM-004", name: "Marcus Bell", email: "m.bell@amplify.com", department: "Research & Intelligence", level: "Analyst", employmentType: "Full-time", weeklyCapacity: 37, status: "Active", startDate: "2023-06-05" },
  { id: "TM-005", name: "Aisha Nkrumah", email: "a.nkrumah@amplify.com", department: "Executive Search", level: "Senior Associate", employmentType: "Full-time", weeklyCapacity: 40, status: "Active", startDate: "2021-11-22" },
  { id: "TM-006", name: "Tom Reinhardt", email: "t.reinhardt@amplify.com", department: "Succession Planning", level: "Associate", employmentType: "Contractor", weeklyCapacity: 24, status: "Active", startDate: "2023-09-18" },
  { id: "TM-007", name: "Fiona Chan", email: "f.chan@amplify.com", department: "Talent Mapping", level: "Manager", employmentType: "Part-time", weeklyCapacity: 20, status: "Active", startDate: "2022-07-11" },
  { id: "TM-008", name: "Ben Oduola", email: "b.oduola@amplify.com", department: "Client Relations", level: "Director", employmentType: "Full-time", weeklyCapacity: 35, status: "On Leave", startDate: "2019-12-01" },
];

interface Draft {
  name: string;
  email: string;
  department: string;
  level: string;
  employmentType: string;
  weeklyCapacity: string;
  status: string;
  startDate: string;
}

function blankDraft(): Draft {
  return { name: "", email: "", department: "", level: "", employmentType: "Full-time", weeklyCapacity: "35", status: "Active", startDate: "" };
}

function EditIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
function RemoveIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
}

export default function TeamMembersRegistry() {
  const [members, setMembers] = useState<Member[]>(SEED);
  const [loading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [draft, setDraft] = useState<Draft>(blankDraft());
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);

  const [search, setSearch] = useState("");
  const [fDept, setFDept] = useState("");
  const [fType, setFType] = useState("");
  const [fStatus, setFStatus] = useState("");

  const openAdd = () => { setEditing(null); setDraft(blankDraft()); setDrawerOpen(true); };
  const openEdit = (m: Member) => {
    setEditing(m);
    setDraft({ name: m.name, email: m.email, department: m.department, level: m.level, employmentType: m.employmentType, weeklyCapacity: String(m.weeklyCapacity), status: m.status, startDate: m.startDate });
    setDrawerOpen(true);
  };

  const save = () => {
    const cap = parseInt(draft.weeklyCapacity) || 35;
    if (editing) {
      setMembers((prev) => prev.map((m) => m.id === editing.id ? { ...m, ...draft, weeklyCapacity: cap } : m));
    } else {
      const id = `TM-${String(members.length + 1).padStart(3, "0")}`;
      setMembers((prev) => [...prev, { id, ...draft, weeklyCapacity: cap }]);
    }
    setDrawerOpen(false);
  };

  const visible = members.filter((m) => {
    const q = search.toLowerCase();
    if (q && !m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
    if (fDept && m.department !== fDept) return false;
    if (fType && m.employmentType !== fType) return false;
    if (fStatus && m.status !== fStatus) return false;
    return true;
  });

  const HEADERS = ["Name", "Department", "Level", "Type", "Weekly Capacity", "Status", "Start Date", ""];

  return (
    <div>
      <SectionBar>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", flex: 1 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search team members…" />
          <FilterSelect label="Department" value={fDept} onChange={setFDept} options={DEPARTMENTS} />
          <FilterSelect label="Type" value={fType} onChange={setFType} options={EMP_TYPES} />
          <FilterSelect label="Status" value={fStatus} onChange={setFStatus} options={STATUSES} />
          {(fDept || fType || fStatus || search) && (
            <button onClick={() => { setFDept(""); setFType(""); setFStatus(""); setSearch(""); }} style={{ fontFamily: T.sans, fontSize: 12, color: T.graphite, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Clear</button>
          )}
        </div>
        <PrimaryBtn onClick={openAdd}>+ Add Team Member</PrimaryBtn>
      </SectionBar>

      <TableShell headers={HEADERS}>
        {loading ? (
          <TableSkeleton cols={HEADERS.length} />
        ) : visible.length === 0 ? (
          <tr>
            <td colSpan={HEADERS.length}>
              <EmptyState
                icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>}
                title={members.length === 0 ? "No team members yet" : "No results match your filters"}
                body={members.length === 0 ? "Add team members to track capacity and assign them to projects." : "Try adjusting your filters."}
                action={members.length === 0 ? <PrimaryBtn onClick={openAdd}>+ Add Team Member</PrimaryBtn> : undefined}
              />
            </td>
          </tr>
        ) : (
          visible.map((m, i) => (
            <TR key={m.id} index={i} onClick={() => openEdit(m)}>
              <TD>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.mist, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.sans, fontSize: 10, fontWeight: 600, color: T.slate, flexShrink: 0 }}>
                    {m.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{m.name}</div>
                    <div style={{ fontFamily: T.sans, fontSize: 11, color: T.graphite }}>{m.email}</div>
                  </div>
                </div>
              </TD>
              <TD muted>{m.department}</TD>
              <TD muted>{m.level}</TD>
              <TD><Badge label={m.employmentType} /></TD>
              <td style={{ padding: "11px 16px", verticalAlign: "middle" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 14, fontWeight: 600, color: T.ink }}>{m.weeklyCapacity}</span>
                  <span style={{ fontFamily: T.sans, fontSize: 11, color: T.graphite }}>hrs/wk</span>
                </div>
              </td>
              <TD><Badge label={m.status} /></TD>
              <TD mono muted>{m.startDate}</TD>
              <td style={{ padding: "8px 16px", verticalAlign: "middle" }}>
                <div style={{ display: "flex", gap: 5 }}>
                  <IconBtn onClick={() => openEdit(m)} title="Edit"><EditIcon /></IconBtn>
                  <IconBtn onClick={() => setRemoveTarget(m)} title="Remove" danger><RemoveIcon /></IconBtn>
                </div>
              </td>
            </TR>
          ))
        )}
      </TableShell>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? `Edit — ${editing.name}` : "Add Team Member"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Field label="Full Name">
            <Input value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} placeholder="e.g. Priya Sharma" />
          </Field>
          <Field label="Email">
            <Input type="email" value={draft.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} placeholder="member@amplify.com" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Department">
              <Select value={draft.department} onChange={(v) => setDraft((d) => ({ ...d, department: v }))} options={DEPARTMENTS} placeholder="Select department" />
            </Field>
            <Field label="Level">
              <Select value={draft.level} onChange={(v) => setDraft((d) => ({ ...d, level: v }))} options={LEVELS} placeholder="Select level" />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Employment Type">
              <Select value={draft.employmentType} onChange={(v) => setDraft((d) => ({ ...d, employmentType: v }))} options={EMP_TYPES} />
            </Field>
            <Field label="Status">
              <Select value={draft.status} onChange={(v) => setDraft((d) => ({ ...d, status: v }))} options={STATUSES} />
            </Field>
          </div>
          <Field label="Standard Weekly Capacity (hours)">
            <div style={{ position: "relative" }}>
              <Input type="number" value={draft.weeklyCapacity} onChange={(v) => setDraft((d) => ({ ...d, weeklyCapacity: v }))} placeholder="35" />
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontFamily: T.sans, fontSize: 12, color: T.graphite, pointerEvents: "none" }}>hrs/wk</span>
            </div>
            <p style={{ fontFamily: T.sans, fontSize: 11, color: T.graphite, margin: "4px 0 0", lineHeight: 1.5 }}>
              This value drives utilisation calculations. Full-time defaults to 35–40 hrs; adjust for part-time or contractor arrangements.
            </p>
          </Field>
          <Field label="Start Date">
            <Input type="date" value={draft.startDate} onChange={(v) => setDraft((d) => ({ ...d, startDate: v }))} />
          </Field>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.hairline}` }}>
            <SecondaryBtn onClick={() => setDrawerOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={save}>{editing ? "Save Changes" : "Add Member"}</PrimaryBtn>
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => { if (removeTarget) setMembers((prev) => prev.filter((m) => m.id !== removeTarget.id)); }}
        title="Remove team member?"
        body={<><strong>{removeTarget?.name}</strong> will be removed from the platform. Any projects they are currently assigned to will need to be updated. Historical records are retained.</>}
        confirmLabel="Remove Member"
      />
    </div>
  );
}
