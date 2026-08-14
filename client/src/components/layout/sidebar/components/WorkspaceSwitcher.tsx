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
    // hydrate once if not loaded yet
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
    // optional: you can navigate to /dashboard here if you want
  };

  return (
    <div className="px-4 py-4 border-b border-app">
      <div className="text-xs uppercase tracking-wide text-app/70 mb-2">
        Workspace
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "w-full flex items-center justify-between gap-3",
          "rounded-md border border-app bg-card px-3 py-2",
          "text-left text-app",
          "hover:bg-app transition-colors"
        )}
        disabled={loadingCurrent || switching}
      >
        <div className="min-w-0">
          <div className="font-semibold truncate">
            {loadingCurrent ? "Loading..." : current.workspace?.name ?? "No workspace"}
          </div>
          <div className="text-xs text-app/70 truncate">
            {current.role ? `Role: ${current.role}` : ""}
          </div>
        </div>

        <div className="text-app/70 text-sm">
          {switching ? "..." : open ? "▲" : "▼"}
        </div>
      </button>

      {open && (
        <div className="mt-2 rounded-md border border-app bg-card overflow-hidden animate-fadeIn">
          <div className="max-h-56 overflow-auto">
            {loadingWorkspaces ? (
              <div className="px-3 py-2 text-sm text-app/70">Loading workspaces...</div>
            ) : items.length === 0 ? (
              <div className="px-3 py-2 text-sm text-app/70">No workspaces</div>
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
                      "w-full px-3 py-2 text-left text-sm",
                      "hover:bg-app transition-colors",
                      active ? "bg-app" : "bg-card"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-app">
                          {m.workspace.name}
                        </div>
                        <div className="text-xs text-app/70">
                          {m.role}
                        </div>
                      </div>

                      {active && (
                        <span className="text-xs text-primary font-semibold">
                          Current
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-app px-3 py-2">
            <a
              href="/workspace"
              className="text-sm text-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              Manage workspace
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSwitcher;