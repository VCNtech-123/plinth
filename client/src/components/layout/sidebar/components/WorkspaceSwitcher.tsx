import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useWorkspaceStore } from "../../../../store/workspace.store";
import Modal from "../../../../components/ui/Modal";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import { toast } from "sonner";
import { createWorkspace } from "../../../../api/workspace.api";

const WorkspaceSwitcher = () => {
  const {
    workspaces,
    current,
    loadingWorkspaces,
    loadingCurrent,
    switching,
    hydrate,
    switchWorkspace,
  } = useWorkspaceStore();

  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (workspaces.length === 0 && !current.workspace) {
      hydrate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentWorkspaceId = current.workspace?.id;
  const items = useMemo(() => workspaces, [workspaces]);

  const onSelect = async (workspaceId: string) => {
    if (workspaceId === currentWorkspaceId) {
      setOpen(false);
      return;
    }
    await switchWorkspace(workspaceId);
    setOpen(false);
  };

  const handleCreateWorkspace = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    setCreating(true);
    try {
      await createWorkspace(trimmed);

      const store = useWorkspaceStore.getState();
      await store.fetchWorkspaces();
      await store.fetchCurrent();

      toast.success("Workspace created");
      setCreateOpen(false);
      setNewName("");
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to create workspace");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="px-4 py-4 border-b border-app relative text-app">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="text-xs font-medium uppercase tracking-wide text-app/70">
          Workspace
        </div>

        <a
          href="/workspace"
          className="text-xs font-medium text-primary hover:underline"
          onClick={() => setOpen(false)}
        >
          Manage
        </a>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={loadingCurrent || switching}
        className={clsx(
          "w-full rounded-md border border-app bg-card px-3 py-2 text-left",
          "hover:bg-app transition-colors",
          "disabled:opacity-60 disabled:cursor-not-allowed"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-app truncate">
              {loadingCurrent ? "Loading…" : current.workspace?.name ?? "No workspace"}
            </div>
            <div className="text-xs text-app/70 truncate">{current.role ?? " "}</div>
          </div>

          <div className="text-xs text-app/70">
            {switching ? "Switching…" : open ? "▲" : "▼"}
          </div>
        </div>
      </button>

      {open && (
        <div
          className={clsx(
            "absolute left-4 right-4 top-[calc(100%-0px)] mt-2",
            "rounded-md border border-app bg-card overflow-hidden",
            "shadow-lg z-50 animate-fadeIn text-app"
          )}
          role="menu"
        >
          <div className="max-h-60 overflow-auto">
            {loadingWorkspaces ? (
              <div className="px-3 py-2 text-sm text-app/70">Loading workspaces…</div>
            ) : items.length === 0 ? (
              <div className="px-3 py-2 text-sm text-app/70">No workspaces found.</div>
            ) : (
              items.map((m) => {
                const id = m.workspace.id;
                const active = id === currentWorkspaceId;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSelect(id)}
                    className={clsx(
                      "w-full px-3 py-2 text-left",
                      "hover:bg-app transition-colors",
                      active ? "bg-app" : "bg-card"
                    )}
                    role="menuitem"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-app truncate">
                          {m.workspace.name}
                        </div>
                        <div className="text-xs text-app/70 truncate">{m.role}</div>
                      </div>

                      {active && (
                        <span className="text-xs font-semibold text-primary shrink-0">
                          Current
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-app px-3 py-2 flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => {
                setOpen(false);
                setCreateOpen(true);
              }}
            >
              Create workspace…
            </button>

            <button
              type="button"
              className="text-sm text-app/70 hover:text-app"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setNewName("");
        }}
      >
        <div className="space-y-5 text-app">
          <div className="space-y-1">
            <div className="text-xs font-medium text-app/60">Workspace</div>
            <h2 className="text-lg font-semibold text-app">Create workspace</h2>
            <p className="text-sm text-app/60">
              This will create a new workspace and switch you into it.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-app">Name</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Acme Workspace"
              autoFocus
            />
            <p className="text-xs text-app/60">
              This appears in the workspace switcher.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-app">
            <Button
              variant="secondary"
              onClick={() => {
                setCreateOpen(false);
                setNewName("");
              }}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateWorkspace}
              disabled={creating || !newName.trim()}
            >
              {creating ? "Creating…" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkspaceSwitcher;