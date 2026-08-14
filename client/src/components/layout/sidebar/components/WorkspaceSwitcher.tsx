import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useWorkspaceStore } from "../../../../store/workspace.store";

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

  useEffect(() => {
    if (workspaces.length === 0 && !current.workspace) {
      hydrate();
    }
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

  return (
    <div className="px-4 py-4 border-b border-app">
      {/* Header row */}
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

      {/* Selector */}
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
              {loadingCurrent
                ? "Loading…"
                : current.workspace?.name ?? "No workspace"}
            </div>
            <div className="text-xs text-app/70 truncate">
              {current.role ?? " "}
            </div>
          </div>

          <div className="text-xs text-app/70">
            {switching ? "Switching…" : open ? "▲" : "▼"}
          </div>
        </div>
      </button>

      {/* Menu */}
      {open && (
        <div className="mt-2 rounded-md border border-app bg-card overflow-hidden animate-fadeIn">
          <div className="max-h-60 overflow-auto">
            {loadingWorkspaces ? (
              <div className="px-3 py-2 text-sm text-app/70">
                Loading workspaces…
              </div>
            ) : items.length === 0 ? (
              <div className="px-3 py-2 text-sm text-app/70">
                No workspaces found.
              </div>
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
                        <div className="text-xs text-app/70 truncate">
                          {m.role}
                        </div>
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
        </div>
      )}
    </div>
  );
};

export default WorkspaceSwitcher;