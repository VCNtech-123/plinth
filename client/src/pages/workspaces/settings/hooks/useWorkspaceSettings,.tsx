import { useEffect, useState } from "react";
import { toast } from "sonner";
import { leaveWorkspace, updateWorkspace } from "../../../../api/workspace.api";
import { useWorkspaceStore } from "../../../../store/workspace.store";

export const useWorkspaceSettings = () => {
  const workspaceVersion = useWorkspaceStore((s) => s.version);
  const current = useWorkspaceStore((s) => s.current);

  const [name, setName] = useState(current.workspace?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setName(current.workspace?.name ?? "");
  }, [current.workspace?.id, current.workspace?.name]);

  const canRename = current.role === "owner" || current.role === "admin";
  const isOwner = current.role === "owner";

  const saveName = async () => {
    if (!canRename) return;

    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Workspace name is required");
      return;
    }

    setSaving(true);
    try {
      await updateWorkspace({ name: trimmed });
      toast.success("Workspace updated");

      const store = useWorkspaceStore.getState();
      await store.fetchCurrent();
      await store.fetchWorkspaces();   

      store.switchWorkspace; 
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to update workspace");
    } finally {
      setSaving(false);
    }
  };

  const leave = async () => {
    if (isOwner) {
      toast.error("Owner cannot leave the workspace");
      return;
    }

    setLeaving(true);
    try {
      await leaveWorkspace();
      toast.success("Left workspace");

      const store = useWorkspaceStore.getState();
      await store.fetchWorkspaces();
      await store.fetchCurrent();

    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to leave workspace");
    } finally {
      setLeaving(false);
    }
  };

  return {
    workspaceVersion,
    current,
    name,
    setName,
    canRename,
    isOwner,
    saving,
    leaving,
    saveName,
    leave,
  };
};