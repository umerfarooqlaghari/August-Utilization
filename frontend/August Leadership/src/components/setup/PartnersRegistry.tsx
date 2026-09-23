import { useState } from "react";
import {
  T, IconBtn, PrimaryBtn, SecondaryBtn, Field, Input, Textarea, Drawer,
  ConfirmModal, TableSkeleton, EmptyState, SearchInput, TableShell, TR, TD, SectionBar,
} from "./primitives";

interface Partner {
  id: string;
  name: string;
  email: string;
  activeProjects: number;
  totalProjects: number;
  dateAdded: string;
  notes: string;
}

const SEED: Partner[] = [
  { id: "PA-01", name: "James Mercer", email: "j.mercer@amplify.com", activeProjects: 2, totalProjects: 18, dateAdded: "2019-03-12", notes: "Founding partner. Specialises in financial services C-suite." },
  { id: "PA-02", name: "Sola Okafor", email: "s.okafor@amplify.com", activeProjects: 2, totalProjects: 14, dateAdded: "2020-08-05", notes: "Board advisory and succession planning lead." },
  { id: "PA-03", name: "Lydia Vance", email: "l.vance@amplify.com", activeProjects: 1, totalProjects: 11, dateAdded: "2021-01-17", notes: "Private equity and venture-backed companies." },
  { id: "PA-04", name: "Raj Patel", email: "r.patel@amplify.com", activeProjects: 2, totalProjects: 9, dateAdded: "2022-06-20", notes: "" },
];

const PROJECT_PREVIEWS: Record<string, { id: string; name: string; status: string; stage: string }[]> = {
  "PA-01": [
    { id: "P-041", name: "Northbridge Capital", status: "Active", stage: "Interviews" },
    { id: "P-037", name: "Briar Financial", status: "Active", stage: "Offer" },
  ],
  "PA-02": [
    { id: "P-039", name: "Meridian Partners", status: "Active", stage: "Shortlist" },
    { id: "P-034", name: "Venn Capital", status: "Active", stage: "Shortlist" },
  ],
  "PA-03": [
    { id: "P-038", name: "Oaktree Ventures", status: "Active", stage: "Sourcing" },
    { id: "P-022", name: "Leadership Benchmarking", status: "On Hold", stage: "Intake" },
  ],
  "PA-04": [
    { id: "P-035", name: "Atlas Group", status: "Active", stage: "Intake" },
    { id: "P-030", name: "Flagship BD — Halcyon", status: "On Hold", stage: "Sourcing" },
  ],
};

function BlankPartner(): Omit<Partner, "id" | "activeProjects" | "totalProjects" | "dateAdded"> {
  return { name: "", email: "", notes: "" };
}

function EditIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
function RemoveIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>;
}

export default function PartnersRegistry() {
  const [partners, setPartners] = useState<Partner[]>(SEED);
  const [loading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [draft, setDraft] = useState(BlankPartner());
  const [selected, setSelected] = useState<Partner | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Partner | null>(null);
  const [search, setSearch] = useState("");

  const openAdd = () => { setEditing(null); setDraft(BlankPartner()); setDrawerOpen(true); };
  const openEdit = (p: Partner) => { setEditing(p); setDraft({ name: p.name, email: p.email, notes: p.notes }); setDrawerOpen(true); };

  const save = () => {
    if (editing) {
      setPartners((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...draft } : p));
    } else {
      const id = `PA-0${partners.length + 1}`;
      setPartners((prev) => [...prev, { id, ...draft, activeProjects: 0, totalProjects: 0, dateAdded: new Date().toISOString().slice(0, 10) }]);
    }
    setDrawerOpen(false);
  };

  const visible = partners.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
  });

  const HEADERS = ["Name", "Email", "Active Projects", "Total Projects", "Date Added", ""];

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 300px" : "1fr", gap: 16, alignItems: "start" }}>
      <div>
        <SectionBar>
          <SearchInput value={search} onChange={setSearch} placeholder="Search partners…" />
          <PrimaryBtn onClick={openAdd}>+ Add Partner</PrimaryBtn>
        </SectionBar>

        <TableShell headers={HEADERS}>
          {loading ? (
            <TableSkeleton cols={HEADERS.length} />
          ) : visible.length === 0 ? (
            <tr>
              <td colSpan={HEADERS.length}>
                <EmptyState
                  icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                  title={partners.length === 0 ? "No partners yet" : "No partners match your search"}
                  body="Add partners to assign them to engagements and track their project load."
                  action={partners.length === 0 ? <PrimaryBtn onClick={openAdd}>+ Add Partner</PrimaryBtn> : undefined}
                />
              </td>
            </tr>
          ) : (
            visible.map((p, i) => (
              <TR key={p.id} index={i} onClick={() => setSelected(selected?.id === p.id ? null : p)} selected={selected?.id === p.id}>
                <TD>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: T.mist, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.slate, flexShrink: 0 }}>
                      {p.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span style={{ fontWeight: 500 }}>{p.name}</span>
                  </div>
                </TD>
                <TD muted>{p.email}</TD>
                <TD mono>{p.activeProjects}</TD>
                <TD mono>{p.totalProjects}</TD>
                <TD mono muted>{p.dateAdded}</TD>
                <td style={{ padding: "8px 16px", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    <IconBtn onClick={() => openEdit(p)} title="Edit"><EditIcon /></IconBtn>
                    <IconBtn onClick={() => setRemoveTarget(p)} title="Remove" danger><RemoveIcon /></IconBtn>
                  </div>
                </td>
              </TR>
            ))
          )}
        </TableShell>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ background: T.paper, border: `1px solid ${T.hairline}`, borderRadius: 8, overflow: "hidden", position: "sticky", top: 0 }}>
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${T.hairline}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.ink }}>{selected.name}</div>
              <div style={{ fontFamily: T.sans, fontSize: 12, color: T.graphite, marginTop: 2 }}>{selected.email}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.graphite, fontSize: 18, lineHeight: 1 }}>×</button>
          </div>

          <div style={{ padding: "14px 18px" }}>
            <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
              {[
                { l: "Active", v: selected.activeProjects },
                { l: "All-time", v: selected.totalProjects },
                { l: "Since", v: selected.dateAdded.slice(0, 7) },
              ].map((s) => (
                <div key={s.l}>
                  <div style={{ fontFamily: T.sans, fontSize: 9, fontWeight: 600, color: T.graphite, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{s.l}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 600, color: T.ink }}>{s.v}</div>
                </div>
              ))}
            </div>

            {selected.notes && (
              <div style={{ fontFamily: T.sans, fontSize: 12, color: T.graphite, lineHeight: 1.6, marginBottom: 14, padding: "10px 12px", background: T.bg, borderRadius: 6 }}>
                {selected.notes}
              </div>
            )}

            <div style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.graphite, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
              Current Projects
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(PROJECT_PREVIEWS[selected.id] ?? []).map((proj) => (
                <div key={proj.id} style={{ padding: "9px 12px", background: T.bg, borderRadius: 6, border: `1px solid ${T.hairline}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 500, color: T.ink }}>{proj.name}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.graphite }}>{proj.id}</span>
                  </div>
                  <div style={{ fontFamily: T.sans, fontSize: 11, color: T.graphite, marginTop: 2 }}>{proj.stage}</div>
                </div>
              ))}
              {!PROJECT_PREVIEWS[selected.id]?.length && (
                <div style={{ fontFamily: T.sans, fontSize: 12, color: T.graphite, textAlign: "center", padding: "16px 0" }}>No active projects.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? `Edit — ${editing.name}` : "Add Partner"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Field label="Full Name">
            <Input value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} placeholder="e.g. James Mercer" />
          </Field>
          <Field label="Email">
            <Input type="email" value={draft.email} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} placeholder="partner@amplify.com" />
          </Field>
          <Field label="Notes">
            <Textarea value={draft.notes} onChange={(v) => setDraft((d) => ({ ...d, notes: v }))} placeholder="Specialisms, background, or any context…" rows={4} />
          </Field>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.hairline}` }}>
            <SecondaryBtn onClick={() => setDrawerOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={save}>{editing ? "Save Changes" : "Add Partner"}</PrimaryBtn>
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => { if (removeTarget) setPartners((prev) => prev.filter((p) => p.id !== removeTarget.id)); setSelected(null); }}
        title="Remove partner?"
        body={<><strong>{removeTarget?.name}</strong> will be removed from the platform. Their historical project records will be retained, but they will no longer be assignable to new engagements.</>}
        confirmLabel="Remove Partner"
      />
    </div>
  );
}
