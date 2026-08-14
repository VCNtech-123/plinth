import { create } from "zustand";
import {
  getUserWorkspaces,
  getCurrentWorkspace,
  switchWorkspace as switchWorkspaceApi,
} from "../api/workspace.api";

import type {
  WorkspaceRole,
  WorkspaceMembershipSummary,
  WorkspaceSummary,
} from "../types/workspace.types";

interface WorkspaceContext {
  workspace: WorkspaceSummary | null;
  role: WorkspaceRole | null;
}

interface WorkspaceState {
  workspaces: WorkspaceMembershipSummary[];
  current: WorkspaceContext;

  loadingWorkspaces: boolean;
  loadingCurrent: boolean;
  switching: boolean;

  fetchWorkspaces: () => Promise<void>;
  fetchCurrent: () => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  hydrate: () => Promise<void>;
  clear: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  current: { workspace: null, role: null },

  loadingWorkspaces: false,
  loadingCurrent: false,
  switching: false,

  fetchWorkspaces: async () => {
    set({ loadingWorkspaces: true });
    try {
      const res = await getUserWorkspaces();

      const list = (res?.data ?? []) as WorkspaceMembershipSummary[];

      set({ workspaces: list });
    } finally {
      set({ loadingWorkspaces: false });
    }
  },

  fetchCurrent: async () => {
    set({ loadingCurrent: true });
    try {
      const res = await getCurrentWorkspace();

      const data = res?.data ?? res;

      set({
        current: {
          workspace: data.workspace ?? data.currentWorkspace ?? null,
          role: data.role ?? data.membership?.role ?? null,
        },
      });
    } finally {
      set({ loadingCurrent: false });
    }
  },

  switchWorkspace: async (workspaceId: string) => {
    set({ switching: true });
    try {
      await switchWorkspaceApi(workspaceId);
      await get().fetchCurrent();
    } finally {
      set({ switching: false });
    }
  },

  hydrate: async () => {
    await Promise.all([get().fetchWorkspaces(), get().fetchCurrent()]);
  },

  clear: () => {
    set({
      workspaces: [],
      current: { workspace: null, role: null },
      loadingWorkspaces: false,
      loadingCurrent: false,
      switching: false,
    });
  },
}));