import { useState } from "react";
import {
  T, PrimaryBtn, SecondaryBtn, Field, Input, Select, ConfirmModal, EmptyState, SectionBar,
} from "./primitives";

interface Role {
  id: string;
  name: string;
  description: string;
  level: string;
  userCount: number;
}

const ROLES: Role[] = [
  {
    id: "R-01",
    name: "Leadership",
    description: "Full read and write access to all modules: Control Center, Projects, Utilization Intelligence, Prediction, and Setup. Reserved for partners and senior managers.",
    level: "Full Access",
    userCount: 4,
  },
];

interface AccessUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Invited" | "Suspended";
  joinedDate: string;
}

const SEED_USERS: AccessUser[] = [
  { id: "U-01", name: "Morgan Hayes", email: "m.hayes@amplify.com", role: "Leadership", status: "Active", joinedDate: "2023-01-10" },
  { id: "U-02", name: "James Mercer", email: "j.mercer@amplify.com", role: "Leadership", status: "Active", joinedDate: "2023-01-10" },
  { id: "U-03", name: "Sola Okafor", email: "s.okafor@amplify.com", role: "Leadership", status: "Active", joinedDate: "2023-02-28" },
  { id: "U-04", name: "Raj Patel", email: "r.patel@amplify.com", role: "Leadership", status: "Active", joinedDate: "2023-06-14" },
  { id: "U-05", name: "diane.wu@amplify.com", email: "diane.wu@amplify.com", role: "Leadership", status: "Invited", joinedDate: "2024-08-20" },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Active: { bg: "#EBF4EF", color: T.green },
  Invited: { bg: "#FBF6F0", color: T.amber },
  Suspended: { bg: "#FBF0EF", color: T.red },
};

export default function RolesAccess() {
  const [users, setUsers] = useState<AccessUser[]>(SEED_USERS);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Leadership");
  const [suspendTarget, setSuspendTarget] = useState<AccessUser | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<AccessUser | null>(null);

  const sendInvite = () => {
    if (!inviteEmail.trim()) return;
    const id = `U-0${users.length + 1}`;
    setUsers((prev) => [...prev, { id, name: inviteEmail, email: inviteEmail, role: inviteRole, status: "Invited", joinedDate: new Date().toISOString().slice(0, 10) }]);
    setInviteEmail("");
    setInviteOpen(false);
  };

  const toggleSuspend = (u: AccessUser) => {
    setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: x.status === "Suspended" ? "Active" : "Suspended" } : x));
  };

  return (
    <div style={{ maxWidth: 820 }}>
      {/* Role cards */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.graphite, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          Roles
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ROLES.map((role) => (
            <div
              key={role.id}
              style={{
                background: T.paper,
                border: `1px solid ${T.hairline}`,
                borderRadius: 8,
                padding: "22px 24px",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 20,
                alignItems: "start",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 15, color: T.ink }}>{role.name}</span>
                  <span
                    style={{
                      fontFamily: T.sans,
                      fontSize: 10,
                      fontWeight: 600,
                      color: T.ivory,
                      background: T.ink,
                      padding: "2px 8px",
                      borderRadius: 3,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {role.level}
                  </span>
                </div>
                <p style={{ fontFamily: T.sans, fontSize: 13, color: T.graphite, lineHeight: 1.65, margin: 0, maxWidth: 480 }}>
                  {role.description}
                </p>
                <div style={{ marginTop: 14, display: "flex", gap: 20 }}>
                  {[
                    { mod: "Control Center", has: true },
                    { mod: "Projects", has: true },
                    { mod: "Utilization", has: true },
                    { mod: "Prediction", has: true },
                    { mod: "Setup", has: true },
                  ].map((m) => (
                    <div key={m.mod} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: m.has ? T.green : T.hairline }} />
                      <span style={{ fontFamily: T.sans, fontSize: 11, color: m.has ? T.ink : T.graphite }}>{m.mod}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background: T.bg,
                  border: `1px solid ${T.hairline}`,
                  borderRadius: 6,
                  padding: "14px 18px",
                  textAlign: "center",
                  minWidth: 90,
                }}
              >
                <div style={{ fontFamily: T.mono, fontWeight: 600, fontSize: 28, color: T.ink, lineHeight: 1 }}>
                  {role.userCount}
                </div>
                <div style={{ fontFamily: T.sans, fontSize: 11, color: T.graphite, marginTop: 4 }}>
                  assigned users
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* "Add role" hint — shows the pattern is extensible */}
        <div
          style={{
            marginTop: 10,
            border: `1px dashed ${T.hairline}`,
            borderRadius: 8,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: T.graphite,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
          <span style={{ fontFamily: T.sans, fontSize: 12, color: T.graphite }}>Additional roles can be added here when access tiers expand.</span>
        </div>
      </div>

      {/* Access table */}
      <SectionBar>
        <div>
          <div style={{ fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.graphite, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Invited Users
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 12, color: T.graphite, marginTop: 2 }}>
            {users.filter((u) => u.status === "Active").length} active · {users.filter((u) => u.status === "Invited").length} pending
          </div>
        </div>
        <PrimaryBtn onClick={() => setInviteOpen(true)}>+ Invite User</PrimaryBtn>
      </SectionBar>

      <div style={{ background: T.paper, border: `1px solid ${T.hairline}`, borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.bg, borderBottom: `1px solid ${T.hairline}` }}>
              {["User", "Email", "Role", "Status", "Joined", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontFamily: T.sans, fontSize: 11, fontWeight: 600, color: T.graphite, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>}
                    title="No users invited yet"
                    body="Invite the leadership team so they can access Amplify Vantage."
                    action={<PrimaryBtn onClick={() => setInviteOpen(true)}>+ Invite User</PrimaryBtn>}
                  />
                </td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: i < users.length - 1 ? `1px solid ${T.mist}` : "none",
                    background: i % 2 === 0 ? T.paper : T.bg,
                    opacity: u.status === "Suspended" ? 0.6 : 1,
                  }}
                >
                  <td style={{ padding: "11px 16px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: u.status === "Invited" ? T.mist : T.slate, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.sans, fontSize: 10, fontWeight: 600, color: u.status === "Invited" ? T.graphite : T.ivory, flexShrink: 0 }}>
                        {u.status === "Invited" ? "?" : u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 500, color: T.ink }}>{u.status === "Invited" ? u.email : u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "11px 16px", fontFamily: T.sans, fontSize: 12, color: T.graphite, verticalAlign: "middle" }}>{u.email}</td>
                  <td style={{ padding: "11px 16px", fontFamily: T.sans, fontSize: 13, color: T.ink, verticalAlign: "middle" }}>{u.role}</td>
                  <td style={{ padding: "11px 16px", verticalAlign: "middle" }}>
                    <span
                      style={{
                        fontFamily: T.sans,
                        fontSize: 11,
                        fontWeight: 500,
                        ...STATUS_STYLES[u.status],
                        padding: "2px 8px",
                        borderRadius: 3,
                      }}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px", fontFamily: T.mono, fontSize: 12, color: T.graphite, verticalAlign: "middle" }}>{u.joinedDate}</td>
                  <td style={{ padding: "8px 16px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {u.status !== "Invited" && (
                        <button
                          onClick={() => setSuspendTarget(u)}
                          style={{
                            fontFamily: T.sans,
                            fontSize: 11,
                            fontWeight: 500,
                            color: u.status === "Suspended" ? T.green : T.amber,
                            background: u.status === "Suspended" ? "#EBF4EF" : "#FBF6F0",
                            border: "none",
                            borderRadius: 4,
                            padding: "3px 10px",
                            cursor: "pointer",
                          }}
                        >
                          {u.status === "Suspended" ? "Reinstate" : "Suspend"}
                        </button>
                      )}
                      <button
                        onClick={() => setRevokeTarget(u)}
                        style={{
                          fontFamily: T.sans,
                          fontSize: 11,
                          fontWeight: 500,
                          color: T.red,
                          background: "#FBF0EF",
                          border: "none",
                          borderRadius: 4,
                          padding: "3px 10px",
                          cursor: "pointer",
                        }}
                      >
                        Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(22,48,63,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}
          onClick={() => setInviteOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: T.paper, borderRadius: 10, width: 420, padding: "28px", boxShadow: "0 8px 40px rgba(22,48,63,0.2)" }}>
            <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 15, color: T.ink, marginBottom: 20 }}>Invite User</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Email Address">
                <Input type="email" value={inviteEmail} onChange={setInviteEmail} placeholder="colleague@amplify.com" />
              </Field>
              <Field label="Role">
                <Select value={inviteRole} onChange={setInviteRole} options={ROLES.map((r) => r.name)} />
                <p style={{ fontFamily: T.sans, fontSize: 11, color: T.graphite, margin: "4px 0 0", lineHeight: 1.5 }}>
                  Only one access tier is available today. Additional roles will appear here as the platform expands.
                </p>
              </Field>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
              <SecondaryBtn onClick={() => setInviteOpen(false)}>Cancel</SecondaryBtn>
              <PrimaryBtn onClick={sendInvite}>Send Invitation</PrimaryBtn>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={() => { if (suspendTarget) toggleSuspend(suspendTarget); }}
        title={suspendTarget?.status === "Suspended" ? "Reinstate user?" : "Suspend user?"}
        body={
          suspendTarget?.status === "Suspended"
            ? <><strong>{suspendTarget?.name}</strong> will regain full access to Amplify Vantage immediately.</>
            : <><strong>{suspendTarget?.name}</strong> will lose access to Amplify Vantage immediately. Their account and data are preserved and access can be reinstated at any time.</>
        }
        confirmLabel={suspendTarget?.status === "Suspended" ? "Reinstate" : "Suspend Access"}
        danger={suspendTarget?.status !== "Suspended"}
      />

      <ConfirmModal
        open={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={() => { if (revokeTarget) setUsers((prev) => prev.filter((u) => u.id !== revokeTarget.id)); }}
        title="Revoke access?"
        body={<><strong>{revokeTarget?.email}</strong>'s access will be permanently revoked. They will need to be re-invited to regain access. This action cannot be undone.</>}
        confirmLabel="Revoke Access"
      />
    </div>
  );
}
