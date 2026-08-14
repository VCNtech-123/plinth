import { useMemo, useState } from "react";
import Button from "../../../components/ui/Button";
import Card, { CardContent, CardFooter, CardHeader } from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import type { WorkspaceRole } from "../../../types/workspace.types";
import { useWorkspaceMembers } from "./hooks/useWorkspaceMembers";
import RolePill from "./components/RolePill";
import StatusPill, { type MemberStatus } from "./components/StatusPill";

const ROLE_OPTIONS: WorkspaceRole[] = ["viewer", "member", "admin"];

const WorkspaceMembers = () => {
  const { members, loading, myRole, invite, remove } = useWorkspaceMembers();

  const canInvite = myRole === "owner" || myRole === "admin";
  const canRemove = myRole === "owner";

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
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-app">Members</h1>
          <p className="text-sm text-app/60 mt-1">
            Manage who can access and collaborate in this workspace.
          </p>
        </div>

        {canInvite && (
          <Button variant="primary" size="md" onClick={() => setInviteOpen(true)}>
            Invite member
          </Button>
        )}
      </div>

      {/* Members list */}
      <Card padding={false}>
        <CardHeader className="px-6 py-4 border-b border-app mb-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-app">Workspace members</h3>
            <span className="text-sm text-app/60">
              {loading ? "Loading..." : `${rows.length} member${rows.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Column header (fixed look) */}
          <div className="px-6 py-3 grid grid-cols-12 gap-4 text-xs font-medium text-app/60 border-b border-app bg-card">
            <div className="col-span-5">User</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Table body */}
          <div className="divide-y divide-(--color-border)">
            {loading ? (
              <div className="px-6 py-10 text-center text-sm text-app/60">
                Loading members...
              </div>
            ) : rows.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-app/60">No members found.</p>
                {canInvite && (
                  <p className="text-xs text-app/40 mt-1">Invite someone to get started.</p>
                )}
              </div>
            ) : (
              rows.map((m) => {
                const removable = canRemove && m.role !== "owner" && m.status === "active";

                return (
                  <div
                    key={m.id}
                    className="px-6 py-3.5 grid grid-cols-12 gap-4 items-center hover:bg-app transition-colors"
                  >
                    {/* User */}
                    <div className="col-span-5 min-w-0 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-semibold text-primary">
                        {getInitials(m.user.name, m.user.email)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-app truncate">
                          {m.user.name}
                        </div>
                        <div className="text-xs text-app/60 truncate">
                          {m.user.email}
                        </div>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-span-2">
                      <RolePill role={m.role} />
                    </div>

                    {/* Status */}
                    <div className="col-span-3">
                      <StatusPill status={m.status as MemberStatus} />
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end">
                      {removable ? (
                        <Button variant="danger" size="sm" onClick={() => remove(m.id)}>
                          Remove
                        </Button>
                      ) : (
                        <span className="text-xs text-app/30">—</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>

        <CardFooter className="px-6 py-3 border-t border-app">
          <div className="text-xs text-app/60">
            Your role: <span className="font-semibold text-app">{myRole ?? "—"}</span>
          </div>
        </CardFooter>
      </Card>

      {/* Invite modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)}>
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-app">Invite member</h2>
            <p className="text-sm text-app/60 mt-1">
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
                className="w-full px-3 py-2 rounded-lg border border-app bg-card text-app text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
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

          <div className="flex justify-end gap-3 pt-4 border-t border-app">
            <Button variant="secondary" onClick={() => setInviteOpen(false)} disabled={submittingInvite}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={submitInvite}
              disabled={!inviteEmail.trim() || submittingInvite}
            >
              {submittingInvite ? "Sending..." : "Send invite"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkspaceMembers;