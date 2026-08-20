// client/src/pages/workspaces/members/WorkspaceMembers.tsx
import { useMemo, useState } from "react";
import Button from "../../../components/ui/Button";
import Card, { CardContent, CardFooter, CardHeader } from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import Dropdown from "../../../components/ui/Dropdown";
import type { WorkspaceRole } from "../../../types/workspace.types";
import { useWorkspaceMembers } from "./hooks/useWorkspaceMembers";
import RolePill from "./components/RolePill";
import StatusPill, { type MemberStatus } from "./components/StatusPill";

const ROLE_OPTIONS: WorkspaceRole[] = ["viewer", "member", "admin"];

const WorkspaceMembers = () => {
  const { members, loading, myRole, invite, remove, updateRole } = useWorkspaceMembers();

  const canInvite = myRole === "owner" || myRole === "admin";
  const canRemove = myRole === "owner";
  const canChangeRole = myRole === "owner";

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>("member");
  const [submittingInvite, setSubmittingInvite] = useState(false);

  const rows = useMemo(() => members, [members]);

  const submitInvite = async () => {
    if (!inviteEmail.trim()) return;

    setSubmittingInvite(true);
    try {
      await invite(inviteEmail.trim(), inviteRole);
      setInviteOpen(false);
      setInviteEmail("");
      setInviteRole("member");
    } finally {
      setSubmittingInvite(false);
    }
  };

  const getInitials = (name: string, email: string) =>
    (name?.charAt(0) || email?.charAt(0) || "?").toUpperCase();

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-app">Members</h1>
          <p className="text-sm text-app/60">
            Manage access for this workspace.
          </p>
        </div>

        {canInvite && (
          <Button variant="primary" size="md" onClick={() => setInviteOpen(true)}>
            Invite
          </Button>
        )}
      </div>

      <Card padding={false}>
        <CardHeader className="px-6 py-4 mb-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-app">Workspace members</div>
              <div className="text-xs text-app/60 mt-1">
                {loading ? "Loading…" : `${rows.length} member${rows.length !== 1 ? "s" : ""}`}
              </div>
            </div>

            <div className="text-xs text-app/60">
              Your role: <span className="font-semibold text-app">{myRole ?? "—"}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop table header */}
          <div className="hidden md:grid px-6 py-2.5 grid-cols-12 gap-4 text-xs font-medium text-app/60 border-y border-app bg-app">
            <div className="col-span-5">User</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-app/60">
              Loading members…
            </div>
          ) : rows.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-app/60">No members found.</p>
              {canInvite && (
                <p className="text-xs text-app/40 mt-1">Invite someone to get started.</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {rows.map((m) => {
                const removable = canRemove && m.role !== "owner" && m.status === "active";
                const editableRole = canChangeRole && m.role !== "owner" && m.status === "active";

                const roleItems = editableRole
                  ? (["viewer", "member", "admin"] as const)
                      .filter((r) => r !== m.role)
                      .map((r) => ({
                        label: `Set role: ${r}`,
                        onClick: () => updateRole(m.id, r),
                      }))
                  : [];

                const actionItems = [
                  ...roleItems,
                  ...(removable
                    ? [{ label: "Remove member", onClick: () => remove(m.id), danger: true }]
                    : []),
                ];

                return (
                  <div key={m.id} className="px-6 py-4">
                    {/* Mobile row */}
                    <div className="md:hidden space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-semibold text-primary">
                            {getInitials(m.user.name, m.user.email)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-app truncate">{m.user.name}</div>
                            <div className="text-xs text-app/60 truncate">{m.user.email}</div>
                          </div>
                        </div>

                        {actionItems.length ? <Dropdown items={actionItems} /> : null}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs text-app/60">Role</div>
                        <RolePill role={m.role} />
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs text-app/60">Status</div>
                        <StatusPill status={m.status as MemberStatus} />
                      </div>
                    </div>

                    {/* Desktop row */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 min-w-0 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-semibold text-primary">
                          {getInitials(m.user.name, m.user.email)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-app truncate">{m.user.name}</div>
                          <div className="text-xs text-app/60 truncate">{m.user.email}</div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <RolePill role={m.role} />
                      </div>

                      <div className="col-span-3">
                        <StatusPill status={m.status as MemberStatus} />
                      </div>

                      <div className="col-span-2 flex justify-end">
                        {actionItems.length ? (
                          <Dropdown items={actionItems} />
                        ) : (
                          <span className="text-xs text-app/40">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        <CardFooter className="px-6 py-3">
          <div className="text-xs text-app/60">
            Owners can change roles and remove members.
          </div>
        </CardFooter>
      </Card>

      {/* Invite modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)}>
        <div className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-app">Invite member</h2>
            <p className="text-sm text-app/60">
              Send an invitation to join this workspace.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-app">Email address</label>
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="member@example.com"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-app">Role</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-app bg-card text-app text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <p className="text-xs text-app/60">
                Admins cannot invite other admins or owners (server enforced).
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-app">
            <Button
              variant="secondary"
              onClick={() => setInviteOpen(false)}
              disabled={submittingInvite}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={submitInvite}
              disabled={!inviteEmail.trim() || submittingInvite}
            >
              {submittingInvite ? "Sending…" : "Send invite"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkspaceMembers;