import { useState } from "react";
import { toast } from "sonner";
import Button from "../../../components/ui/Button";
import Card, { CardContent, CardFooter, CardHeader } from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import { useWorkspaceStore } from "../../../store/workspace.store";
import { leaveWorkspace, updateWorkspace } from "../../../api/workspace.api";

const WorkspaceSettings = () => {
  const current = useWorkspaceStore((s) => s.current);
  const role = current.role;
  const workspaceName = current.workspace?.name ?? "Workspace";

  const canRename = role === "owner" || role === "admin";
  const isOwner = role === "owner";

  const [name, setName] = useState(workspaceName);
  const [saving, setSaving] = useState(false);

  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // keep local input updated when workspace changes
  // (simple approach without effect: when opening page after switch, it initializes correctly)

  const onSave = async () => {
    if (!canRename) return;

    if (!name.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    setSaving(true);
    try {
      await updateWorkspace({ name: name.trim() });
      toast.success("Workspace updated");

      // Refresh current workspace info
      await useWorkspaceStore.getState().fetchCurrent?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to update workspace");
    } finally {
      setSaving(false);
    }
  };

  const onLeave = async () => {
    if (isOwner) return;

    setLeaving(true);
    try {
      await leaveWorkspace();
      toast.success("Left workspace");

      // Refresh workspace context + list after leaving
      const store = useWorkspaceStore.getState();
      await store.fetchWorkspaces?.();
      await store.fetchCurrent?.();

      setLeaveOpen(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to leave workspace");
    } finally {
      setLeaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      <div>
        <h1 className="text-2xl font-semibold text-app">Workspace settings</h1>
        <p className="text-sm text-app/60 mt-1">
          Manage settings for <span className="font-medium text-app">{workspaceName}</span>.
        </p>
      </div>

      {/* General */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-app">General</h3>
          <p className="text-sm text-app/60 mt-1">
            Update workspace details.
          </p>
        </CardHeader>

        <CardContent className="space-y-2">
          <label className="text-sm font-medium text-app">Workspace name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!canRename}
          />
          {!canRename && (
            <p className="text-xs text-app/60">
              Only owners and admins can rename the workspace.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="primary"
            onClick={onSave}
            disabled={!canRename || saving || name.trim() === ""}
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </Card>

      {/* Danger zone */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-app">Danger zone</h3>
          <p className="text-sm text-app/60 mt-1">
            Leaving removes your access to this workspace.
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-app">Leave workspace</div>
              <div className="text-sm text-app/60">
                You’ll lose access immediately.
              </div>
              {isOwner && (
                <div className="text-xs text-app/60 mt-1">
                  Owners can’t leave without transferring ownership.
                </div>
              )}
            </div>

            <Button
              variant="danger"
              onClick={() => setLeaveOpen(true)}
              disabled={isOwner}
            >
              Leave
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leave confirmation modal */}
      <Modal open={leaveOpen} onClose={() => setLeaveOpen(false)}>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-app">Leave workspace</h2>
            <p className="text-sm text-app/60 mt-1">
              Are you sure you want to leave <span className="font-medium text-app">{workspaceName}</span>?
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-app">
            <Button variant="secondary" onClick={() => setLeaveOpen(false)} disabled={leaving}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onLeave} disabled={leaving || isOwner}>
              {leaving ? "Leaving..." : "Leave workspace"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkspaceSettings;