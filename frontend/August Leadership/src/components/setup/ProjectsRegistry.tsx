import { useState } from "react";
import {
  T, Badge, IconBtn, PrimaryBtn, SecondaryBtn, Field, Input, Select, Drawer,
  ConfirmModal, TableSkeleton, EmptyState, SearchInput, FilterSelect,
  TableShell, TR, TD, SectionBar,
} from "./primitives";

const PARTNERS = ["J. Mercer", "S. Okafor", "L. Vance", "R. Patel"];
const TYPES = ["Client Project", "BD Opportunity", "Internal Work"];
const TIERS = ["Tier 1", "Tier 2", "Tier 3"];
const STATUSES = ["Active", "On Hold", "Closed"];
const STAGES = ["Intake", "Sourcing", "Shortlist", "Interviews", "Offer", "Closed"];
const STAGE_TEMPLATES = ["Executive Search Standard", "Board Advisory", "Succession Planning"];

interface Project {
  id: string;
  name: string;
  partner: string;
  client: string;
  type: string;
  tier: string;
  status: string;
  stage: string;
  startDate: string;
}

const SEED: Project[] = [
  { id: "P-041", name: "Northbridge Capital", partner: "J. Mercer", client: "Northbridge Capital", type: "Client Project", tier: "Tier 1", status: "Active", stage: "Interviews", startDate: "2024-06-10" },
  { id: "P-039", name: "Meridian Partners", partner: "S. Okafor", client: "Meridian Partners", type: "Client Project", tier: "Tier 2", status: "Active", stage: "Shortlist", startDate: "2024-05-22" },
  { id: "P-038", name: "Oaktree Ventures", partner: "L. Vance", client: "Oaktree Ventures", type: "Client Project", tier: "Tier 1", status: "Active", stage: "Sourcing", startDate: "2024-04-15" },
  { id: "P-037", name: "Briar Financial", partner: "J. Mercer", client: "Briar Financial", type: "Client Project", tier: "Tier 2", status: "Active", stage: "Offer", startDate: "2024-03-01" },
  { id: "P-035", name: "Atlas Group", partner: "R. Patel", client: "Atlas Group", type: "Client Project", tier: "Tier 3", status: "Active", stage: "Intake", startDate: "2024-08-20" },
  { id: "P-034", name: "Venn Capital", partner: "S. Okafor", client: "Venn Capital", type: "Client Project", tier: "Tier 2", status: "Active", stage: "Shortlist", startDate: "2024-07-08" },
  { id: "P-030", name: "Flagship BD — Halcyon", partner: "R. Patel", client: "Halcyon Ventures", type: "BD Opportunity", tier: "Tier 1", status: "On Hold", stage: "Sourcing", startDate: "2024-02-14" },
  { id: "P-022", name: "Leadership Benchmarking", partner: "L. Vance", client: "Internal", type: "Internal Work", tier: "Tier 3", status: "On Hold", stage: "Intake", startDate: "2024-01-08" },
];

function BlankProject(): Project {
  return { id: "", name: "", partner: "", client: "", type: "", tier: "", status: "Active", stage: "", startDate: "" };
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function ArchiveIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" rx="1" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}

export default function ProjectsRegistry() {
  const [projects, setProjects] = useState<Project[]>(SEED);
  const [loading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [draft, setDraft] = useState<Project>(BlankProject());
  const [archiveTarget, setArchiveTarget] = useState<Project | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [fPartner, setFPartner] = useState("");
  const [fType, setFType] = useState("");
  const [fTier, setFTier] = useState("");
  const [fStatus, setFStatus] = useState("");

  const openAdd = () => { setEditing(null); setDraft(BlankProject()); setDrawerOpen(true); };
  const openEdit = (p: Project) => { setEditing(p); setDraft({ ...p }); setDrawerOpen(true); };

  const save = () => {
    if (editing) {
      setProjects((prev) => prev.map((p) => (p.id === editing.id ? { ...draft } : p)));
    } else {
      const id = `P-${String(Math.max(0, ...projects.map((p) => parseInt(p.id.slice(2)))) + 1).padStart(3, "0")}`;
      setProjects((prev) => [{ ...draft, id }, ...prev]);
    }
    setDrawerOpen(false);
  };

  const archive = (p: Project) => {
    setProjects((prev) => prev.filter((x) => x.id !== p.id));
  };

  const visible = projects.filter((p) => {
    const q = search.toLowerCase();
    if (q && !p.name.toLowerCase().includes(q) && !p.client.toLowerCase().includes(q)) return false;
    if (fPartner && p.partner !== fPartner) return false;
    if (fType && p.type !== fType) return false;
    if (fTier && p.tier !== fTier) return false;
    if (fStatus && p.status !== fStatus) return false;
    return true;
  });

  const HEADERS = ["Project Name", "Partner", "Client", "Type", "Tier", "Status", "Stage", "Start Date", ""];

  return (
    <div>
      <SectionBar>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", flex: 1 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search projects…" />
          <FilterSelect label="Partner" value={fPartner} onChange={setFPartner} options={PARTNERS} />
          <FilterSelect label="Type" value={fType} onChange={setFType} options={TYPES} />
          <FilterSelect label="Tier" value={fTier} onChange={setFTier} options={TIERS} />
          <FilterSelect label="Status" value={fStatus} onChange={setFStatus} options={STATUSES} />
          {(fPartner || fType || fTier || fStatus || search) && (
            <button
              onClick={() => { setFPartner(""); setFType(""); setFTier(""); setFStatus(""); setSearch(""); }}
              style={{ fontFamily: T.sans, fontSize: 12, color: T.graphite, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              Clear
            </button>
          )}
        </div>
        <PrimaryBtn onClick={openAdd}>+ Add Project</PrimaryBtn>
      </SectionBar>

      <TableShell headers={HEADERS}>
        {loading ? (
          <TableSkeleton cols={HEADERS.length} />
        ) : visible.length === 0 ? (
          <tr>
            <td colSpan={HEADERS.length}>
              <EmptyState
                icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>}
                title={projects.length === 0 ? "No projects yet" : "No results match your filters"}
                body={projects.length === 0 ? "Add your first project to begin tracking engagements across the firm." : "Try adjusting the filters or clearing your search."}
                action={projects.length === 0 ? <PrimaryBtn onClick={openAdd}>+ Add Project</PrimaryBtn> : undefined}
              />
            </td>
          </tr>
        ) : (
          visible.map((p, i) => (
            <TR
              key={p.id}
              index={i}
              onClick={() => openEdit(p)}
              selected={false}
            >
              <TD>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontWeight: 500 }}>{p.name}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: T.graphite }}>{p.id}</span>
                </div>
              </TD>
              <TD>{p.partner}</TD>
              <TD muted>{p.client}</TD>
              <TD><Badge label={p.type} /></TD>
              <TD><Badge label={p.tier} /></TD>
              <TD><Badge label={p.status} /></TD>
              <TD muted>{p.stage}</TD>
              <TD mono muted>{p.startDate}</TD>
              <td style={{ padding: "8px 16px", verticalAlign: "middle" }}>
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    opacity: hoveredRow === p.id ? 1 : 0,
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={() => setHoveredRow(p.id)}
                >
                  <IconBtn onClick={() => openEdit(p)} title="Edit project"><EditIcon /></IconBtn>
                  <IconBtn onClick={() => setArchiveTarget(p)} title="Archive project" danger><ArchiveIcon /></IconBtn>
                </div>
              </td>
            </TR>
          ))
        )}
      </TableShell>

      {/* Hover shim — attach to table container to catch mouseleave */}
      <div
        onMouseLeave={() => setHoveredRow(null)}
        onMouseOver={(e) => {
          const row = (e.target as HTMLElement).closest("tr");
          if (row) {
            const cells = row.querySelectorAll("td");
            if (cells.length > 0) {
              const lastCell = cells[cells.length - 1];
              const btns = lastCell.querySelector<HTMLDivElement>("div");
              if (btns) btns.style.opacity = "1";
            }
          }
        }}
        style={{ display: "contents" }}
      />

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? `Edit — ${editing.name}` : "Add Project"}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Field label="Project Name">
            <Input value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} placeholder="e.g. Northbridge Capital" />
          </Field>
          <Field label="Type">
            <Select value={draft.type} onChange={(v) => setDraft((d) => ({ ...d, type: v }))} options={TYPES} placeholder="Select type" />
          </Field>
          <Field label="Partner">
            <Select value={draft.partner} onChange={(v) => setDraft((d) => ({ ...d, partner: v }))} options={PARTNERS} placeholder="Select partner" />
          </Field>
          <Field label="Client">
            <Input value={draft.client} onChange={(v) => setDraft((d) => ({ ...d, client: v }))} placeholder="Client organisation name" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Tier">
              <Select value={draft.tier} onChange={(v) => setDraft((d) => ({ ...d, tier: v }))} options={TIERS} placeholder="Select tier" />
            </Field>
            <Field label="Status">
              <Select value={draft.status} onChange={(v) => setDraft((d) => ({ ...d, status: v }))} options={STATUSES} placeholder="Select status" />
            </Field>
          </div>
          <Field label="Stage Template">
            <Select value={draft.stage} onChange={(v) => setDraft((d) => ({ ...d, stage: v }))} options={STAGE_TEMPLATES} placeholder="Select template" />
          </Field>
          <Field label="Current Stage">
            <Select value={draft.stage} onChange={(v) => setDraft((d) => ({ ...d, stage: v }))} options={STAGES} placeholder="Select stage" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Start Date">
              <Input type="date" value={draft.startDate} onChange={(v) => setDraft((d) => ({ ...d, startDate: v }))} />
            </Field>
            <Field label="Expected Duration">
              <Input value="" onChange={() => {}} placeholder="e.g. 12 weeks" />
            </Field>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.hairline}`, marginTop: 4 }}>
            <SecondaryBtn onClick={() => setDrawerOpen(false)}>Cancel</SecondaryBtn>
            <PrimaryBtn onClick={save}>{editing ? "Save Changes" : "Create Project"}</PrimaryBtn>
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        open={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => archiveTarget && archive(archiveTarget)}
        title="Archive project?"
        body={
          <>
            <strong>{archiveTarget?.name}</strong> ({archiveTarget?.id}) will be moved to the archive. It will no longer appear in active views across the platform. This does not delete any historical data.
          </>
        }
        confirmLabel="Archive Project"
      />
    </div>
  );
}
