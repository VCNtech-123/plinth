import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWorkspaceStore } from "../../../../store/workspace.store";
import { getWorkspaceMembers, inviteUser, removeMember } from "../../../../api/workspace.api";
import type { WorkspaceMemberRow, WorkspaceRole } from "../../../../types/workspace.types";
import { changeMemberRole } from "../../../../api/workspace.api";

export const useWorkspaceMembers = () => {
  const workspaceVersion = useWorkspaceStore((s) => s.version);
  const myRole = useWorkspaceStore((s) => s.current.role);

  const [members, setMembers] = useState<WorkspaceMemberRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await getWorkspaceMembers();
      setMembers(res.data ?? []);
    } catch {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();

  }, [workspaceVersion]);

  const invite = async (email: string, role: WorkspaceRole) => {
    try {
      await inviteUser({ email, role });
      toast.success("Invite sent");
      await fetchMembers();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to invite member");
    }
  };

  const remove = async (membershipId: string) => {
    try {
      await removeMember(membershipId);
      toast.success("Member removed");
      await fetchMembers();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to remove member");
    }
  };

  const updateRole = async (membershipId: string, role: "admin" | "member" | "viewer") => {
    try {
      await changeMemberRole(membershipId, role); 
      toast.success("Role updated");
      await fetchMembers();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to update role");
    }
  };

  return { members, loading, myRole, invite, remove, refetch: fetchMembers, updateRole };
};