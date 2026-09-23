import { useState } from "react";

const SANS = "'IBM Plex Sans', sans-serif";
const MONO = "'IBM Plex Mono', monospace";
const C = {
  ink: "#16303F", slate: "#3E5568", graphite: "#5B6472",
  paper: "#FFFFFF", mist: "#E4E9EC", bg: "#F8FAFB",
  red: "#B14A3D", ivory: "#D9E2E8", hairline: "#F0F4F6",
};

// ── Option lists ───────────────────────────────────────────────────────────────
const PRACTICE_AREAS = [
  "Mobility (Automotive)", "Technology", "Consumer",
  "Healthcare", "Financial Services", "Industrial",
  "Energy", "Real Estate", "Professional Services",
];
const FUNCTIONAL_AREAS = [
  "Brand & Product Marketing", "Finance", "Operations",
  "Human Resources", "Legal", "Information Technology",
  "Strategy", "Sales & Commercial", "Supply Chain",
];
const SERVICE_TYPES = ["Search", "BD Pitch", "Internal"];
const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France",
  "Switzerland", "Australia", "Singapore", "UAE", "Canada",
  "Netherlands", "Japan", "South Africa",
];
const REGIONS = ["North America", "EMEA", "APAC", "LATAM", "Middle East"];
const COMPANY_TYPES = [
  "Private Corporation", "Public Corporation", "PE-backed",
  "Family Business", "Non-profit", "Government",
];
const COMPENSATION_TYPES = [
  "Permanent position", "Interim", "Project-based", "Advisory", "Board",
];
const YES_NO = ["Yes", "No"];
const INDUSTRY_OPTIONS = [
  "Aviation & Aerospace", "Technology", "Consumer Goods",
  "Healthcare", "Financial Services", "Energy", "Automotive", "Real Estate",
];

// ── Shared UI primitives ───────────────────────────────────────────────────────
function ReqStar() {
  return <span style={{ color: C.red, marginLeft: 2 }}>*</span>;
}

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <div style={{ fontFamily: SANS, fontSize: 13, color: C.ink, marginBottom: 6, display: "flex", alignItems: "center" }}>
      {text}{required && <ReqStar />}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || ""}
      style={{
        width: "100%", height: 36, padding: "0 12px",
        border: `1px solid ${C.mist}`, borderRadius: 6,
        fontFamily: SANS, fontSize: 13, color: C.ink,
        background: C.paper, boxSizing: "border-box", outline: "none",
        transition: "border-color 0.15s",
      }}
      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = C.slate; }}
      onBlur={e => { (e.target as HTMLInputElement).style.borderColor = C.mist; }}
    />
  );
}

function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="date"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", height: 36, padding: "0 12px",
        border: `1px solid ${C.mist}`, borderRadius: 6,
        fontFamily: SANS, fontSize: 13, color: C.ink,
        background: C.paper, boxSizing: "border-box", outline: "none",
        transition: "border-color 0.15s",
      }}
      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = C.slate; }}
      onBlur={e => { (e.target as HTMLInputElement).style.borderColor = C.mist; }}
    />
  );
}

function MoneyInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontFamily: MONO, fontSize: 13, color: C.graphite, pointerEvents: "none" }}>$</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "Unset"}
        style={{
          width: "100%", height: 36, paddingLeft: 26, paddingRight: 12,
          border: `1px solid ${C.mist}`, borderRadius: 6,
          fontFamily: MONO, fontSize: 13, color: C.ink,
          background: C.paper, boxSizing: "border-box", outline: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = C.slate; }}
        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = C.mist; }}
      />
    </div>
  );
}

function SelectInput({
  value, onChange, options, placeholder,
}: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", height: 36, padding: "0 32px 0 12px",
          border: `1px solid ${C.mist}`, borderRadius: 6,
          fontFamily: SANS, fontSize: 13,
          color: value ? C.ink : C.graphite,
          background: C.paper, boxSizing: "border-box", outline: "none",
          cursor: "pointer", appearance: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={e => { (e.target as HTMLSelectElement).style.borderColor = C.slate; }}
        onBlur={e => { (e.target as HTMLSelectElement).style.borderColor = C.mist; }}
      >
        <option value="">{placeholder || "Select…"}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: C.graphite }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.mist}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 24px", borderBottom: `1px solid ${C.mist}`, background: C.bg }}>
        <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, color: C.graphite, letterSpacing: "0.09em", textTransform: "uppercase" }}>
          {title}
        </span>
      </div>
      <div style={{ padding: "22px 24px" }}>
        {children}
      </div>
    </div>
  );
}

// Label + input in a 2-col row (for Custom Fields section)
function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", alignItems: "start", gap: 20, paddingBottom: 14, borderBottom: `1px solid ${C.hairline}`, marginBottom: 14 }}>
      <div style={{ fontFamily: SANS, fontSize: 13, color: C.ink, paddingTop: 8, display: "flex", alignItems: "center" }}>
        {label}{required && <ReqStar />}
      </div>
      {children}
    </div>
  );
}

// ── Main form ──────────────────────────────────────────────────────────────────
interface FormState {
  assignmentName: string; description: string; client: string;
  projectId: string; startDate: string; endDate: string;
  industries: string[];
  practiceArea: string; functionalArea: string; serviceType: string;
  clientCountry: string; clientRegion: string;
  searchCountry: string; searchRegion: string;
  partnerCountry: string; partnerRegion: string;
  companyType: string; peBackedClient: string;
  pitchExists: string; opportunityExists: string;
  compensationType: string; compensationMin: string; compensationMax: string;
}

interface Props { onClose: () => void; }

export default function NewProjectForm({ onClose }: Props) {
  const [form, setForm] = useState<FormState>({
    assignmentName: "", description: "", client: "",
    projectId: "AL-920606", startDate: "", endDate: "",
    industries: ["Aviation & Aerospace"],
    practiceArea: "", functionalArea: "", serviceType: "",
    clientCountry: "", clientRegion: "",
    searchCountry: "", searchRegion: "",
    partnerCountry: "", partnerRegion: "",
    companyType: "", peBackedClient: "No",
    pitchExists: "No", opportunityExists: "No",
    compensationType: "Permanent position", compensationMin: "", compensationMax: "",
  });

  const set = (k: keyof FormState, v: string) =>
    setForm(p => ({ ...p, [k]: v }));

  const removeIndustry = (tag: string) =>
    setForm(p => ({ ...p, industries: p.industries.filter(t => t !== tag) }));

  const addIndustry = (tag: string) => {
    if (tag && !form.industries.includes(tag))
      setForm(p => ({ ...p, industries: [...p.industries, tag] }));
  };

  const [industryInput, setIndustryInput] = useState("");

  const mandatoryFields: Array<{ key: keyof FormState; label: string; opts: string[] }> = [
    { key: "practiceArea",    label: "Practice Area",                       opts: PRACTICE_AREAS   },
    { key: "functionalArea",  label: "Functional Area",                     opts: FUNCTIONAL_AREAS  },
    { key: "serviceType",     label: "Service Type",                        opts: SERVICE_TYPES    },
    { key: "clientCountry",   label: "Client Country",                      opts: COUNTRIES        },
    { key: "clientRegion",    label: "Client Region",                       opts: REGIONS          },
    { key: "searchCountry",   label: "Search Country",                      opts: COUNTRIES        },
    { key: "searchRegion",    label: "Search Region",                       opts: REGIONS          },
    { key: "partnerCountry",  label: "Partner Country",                     opts: COUNTRIES        },
    { key: "partnerRegion",   label: "Partner Region",                      opts: REGIONS          },
    { key: "companyType",     label: "Company Type",                        opts: COMPANY_TYPES    },
    { key: "peBackedClient",  label: "Client backed by Private Equity",     opts: YES_NO           },
  ];

  const milestoneFields: Array<{ key: keyof FormState; label: string; opts: string[] }> = [
    { key: "pitchExists",       label: "Pitch Exists",       opts: YES_NO },
    { key: "opportunityExists", label: "Opportunity Exists", opts: YES_NO },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.bg }}>

      {/* Sticky top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: C.paper, borderBottom: `1px solid ${C.mist}`,
        padding: "0 28px", height: 58, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onClose}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: C.graphite, fontFamily: SANS, fontSize: 13, padding: "4px 0", transition: "color 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.ink; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.graphite; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Control Center
          </button>
          <span style={{ color: C.mist, fontSize: 16 }}>/</span>
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 14, color: C.ink }}>
            {form.assignmentName || "New Assignment"}
          </span>
          {form.assignmentName && (
            <span style={{ fontFamily: MONO, fontSize: 11, color: C.graphite, background: C.bg, border: `1px solid ${C.mist}`, borderRadius: 4, padding: "2px 8px" }}>
              {form.projectId}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onClose}
            style={{ height: 34, padding: "0 16px", borderRadius: 7, border: `1px solid ${C.mist}`, background: "none", cursor: "pointer", fontFamily: SANS, fontSize: 13, color: C.graphite, transition: "background 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.bg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            style={{ height: 34, padding: "0 20px", borderRadius: 7, border: "none", background: C.ink, cursor: "pointer", fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.ivory, transition: "background 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#243F50"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.ink; }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 60px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* ── GENERAL ── */}
          <SectionCard title="General">
            {/* Row 1: Assignment Name + Description (spans 2 rows) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 }}>
              <div>
                <FieldLabel text="Assignment Name" required />
                <TextInput value={form.assignmentName} onChange={v => set("assignmentName", v)} placeholder="e.g. Director of Marketing" />
              </div>
              <div style={{ gridRow: "1 / 3" }}>
                <FieldLabel text="Description" />
                <textarea
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="Brief description of the assignment…"
                  rows={4}
                  style={{
                    width: "100%", padding: "10px 12px",
                    border: `1px solid ${C.mist}`, borderRadius: 6,
                    fontFamily: SANS, fontSize: 13, color: C.ink,
                    background: C.paper, resize: "vertical",
                    boxSizing: "border-box", outline: "none",
                    lineHeight: 1.5,
                  }}
                  onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = C.slate; }}
                  onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = C.mist; }}
                />
              </div>
              <div>
                <FieldLabel text="Client" required />
                <TextInput value={form.client} onChange={v => set("client", v)} placeholder="e.g. Pilatus Aircraft Ltd" />
              </div>
            </div>

            {/* Row 2: Project ID + Industries */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 }}>
              <div>
                <FieldLabel text="Project ID" />
                <TextInput value={form.projectId} onChange={v => set("projectId", v)} />
              </div>
              <div>
                <FieldLabel text="Industries" />
                <div style={{ border: `1px solid ${C.mist}`, borderRadius: 6, padding: "6px 8px", background: C.paper, minHeight: 36 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: form.industries.length ? 6 : 0 }}>
                    {form.industries.map(tag => (
                      <span key={tag} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: SANS, fontSize: 12, color: C.slate, background: "#EEF2F5", border: `1px solid ${C.mist}`, borderRadius: 4, padding: "2px 8px" }}>
                        {tag}
                        <button onClick={() => removeIndustry(tag)} style={{ background: "none", border: "none", cursor: "pointer", color: C.graphite, padding: 0, fontSize: 12, lineHeight: 1 }}>×</button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <select
                      value=""
                      onChange={e => { addIndustry(e.target.value); setIndustryInput(""); }}
                      style={{ flex: 1, height: 26, border: "none", background: "none", fontFamily: SANS, fontSize: 12, color: C.graphite, outline: "none", cursor: "pointer" }}
                    >
                      <option value="">+ Add industry…</option>
                      {INDUSTRY_OPTIONS.filter(o => !form.industries.includes(o)).map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Start Date + End Date */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <FieldLabel text="Start Date" required />
                <DateInput value={form.startDate} onChange={v => set("startDate", v)} />
              </div>
              <div>
                <FieldLabel text="End Date" />
                <DateInput value={form.endDate} onChange={v => set("endDate", v)} />
              </div>
            </div>
          </SectionCard>

          {/* ── CUSTOM FIELDS ── */}
          {false && <SectionCard title="Custom Fields">
            {/* Mandatory sub-group */}
            <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, color: C.graphite, background: C.bg, border: `1px solid ${C.mist}`, borderRadius: 6, padding: "7px 12px", marginBottom: 16 }}>
              Mandatory Fields
            </div>
            {mandatoryFields.map(f => (
              <FieldRow key={f.key} label={f.label} required>
                <SelectInput
                  value={form[f.key] as string}
                  onChange={v => set(f.key, v)}
                  options={f.opts}
                />
              </FieldRow>
            ))}

            {/* Milestones sub-group */}
            <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, color: C.graphite, background: C.bg, border: `1px solid ${C.mist}`, borderRadius: 6, padding: "7px 12px", margin: "20px 0 16px" }}>
              Milestones
            </div>
            {milestoneFields.map((f, i) => (
              <FieldRow key={f.key} label={f.label} required>
                <SelectInput
                  value={form[f.key] as string}
                  onChange={v => set(f.key, v)}
                  options={f.opts}
                />
              </FieldRow>
            ))}
          </SectionCard>}

          {/* ── COMPENSATION ── */}
          <SectionCard title="Compensation">
            <div style={{ marginBottom: 18 }}>
              <FieldLabel text="Position Type" />
              <SelectInput value={form.compensationType} onChange={v => set("compensationType", v)} options={COMPENSATION_TYPES} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <FieldLabel text="Minimum" />
                <MoneyInput value={form.compensationMin} onChange={v => set("compensationMin", v)} placeholder="Unset" />
              </div>
              <div>
                <FieldLabel text="Maximum" />
                <MoneyInput value={form.compensationMax} onChange={v => set("compensationMax", v)} placeholder="Unset" />
              </div>
            </div>
          </SectionCard>

          {/* ── ROLE CLASSIFICATIONS ── */}
          <SectionCard title="Role Classifications">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.graphite }}>No selected role classifications.</span>
              <button
                style={{ height: 32, padding: "0 14px", border: `1px solid ${C.mist}`, borderRadius: 6, background: "none", cursor: "pointer", fontFamily: SANS, fontSize: 12, color: C.slate, transition: "background 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.bg; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; }}
              >
                + Add
              </button>
            </div>
          </SectionCard>

          {/* ── CONNECT LINK ── */}
          <SectionCard title="Connect Link">
            <p style={{ fontFamily: SANS, fontSize: 12, color: C.graphite, marginBottom: 12, lineHeight: 1.6, margin: "0 0 12px" }}>
              Executives who connect to your firm through this link will be added directly to this assignment.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 36, padding: "0 12px", border: `1px solid ${C.mist}`, borderRadius: 6, background: C.bg, display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: MONO, fontSize: 12, color: C.graphite, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  https://app.notactivelylooking.com/connect/august-leadership?project={form.projectId}
                </span>
              </div>
              <button
                style={{ height: 36, padding: "0 14px", border: `1px solid ${C.mist}`, borderRadius: 6, background: C.paper, cursor: "pointer", fontFamily: SANS, fontSize: 12, color: C.slate, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", transition: "background 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.bg; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.paper; }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </button>
            </div>
          </SectionCard>

          {/* Save actions (bottom) */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
            <button
              onClick={onClose}
              style={{ height: 36, padding: "0 20px", borderRadius: 8, border: `1px solid ${C.mist}`, background: C.paper, cursor: "pointer", fontFamily: SANS, fontSize: 13, color: C.graphite, transition: "background 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.bg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.paper; }}
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              style={{ height: 36, padding: "0 24px", borderRadius: 8, border: "none", background: C.ink, cursor: "pointer", fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.ivory, transition: "background 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#243F50"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.ink; }}
            >
              Save Assignment
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
