import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getInvites, acceptInvite, declineInvite } from "../../../../api/workspace.api";
import type { WorkspaceRole } from "../../../../types/workspace.types";
import { useWorkspaceStore } from "../../../../store/workspace.store";

export interface InviteRow {
  id: string; 
  workspace: { id: string; name: string; createdBy?: string };
  role: WorkspaceRole;
  status: "pending" | "active" | "declined" | "removed";
}

export const useWorkspaceInvites = () => {
  const workspaceVersion = useWorkspaceStore((s) => s.version);

  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const res = await getInvites();
      setInvites((res.data ?? []) as InviteRow[]);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to load invites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();

  }, [workspaceVersion]);

  const accept = async (inviteId: string) => {
    try {
      await acceptInvite(inviteId);
      toast.success("Invite accepted");

      await fetchInvites();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to accept invite");
    }
  };

  const decline = async (inviteId: string) => {
    try {
      await declineInvite(inviteId);
      toast.success("Invite declined");
      await fetchInvites();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to decline invite");
    }
  };

  return { invites, loading, accept, decline, refetch: fetchInvites };
};