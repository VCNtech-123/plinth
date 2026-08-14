import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useWorkspaceStore } from "../../../../store/workspace.store";

const WorkspaceSwitcher = () => {
  const {
    workspaces,
    current,
    loadingWorkspaces,
    loadingCurrent,
    switching,
    switchWorkspace,
  } = useWorkspaceStore((s) => ({
    workspaces: s.workspaces,
    current: s.current,
    loadingWorkspaces: s.loadingWorkspaces,
    loadingCurrent: s.loadingCurrent,
    switching: s.switching,
    switchWorkspace: s.switchWorkspace,
  }));

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const currentWorkspaceId = current.workspace?.id;
  const items = useMemo(() => workspaces, [workspaces]);

  const onSelect = async (workspaceId: string) => {
    if (!workspaceId || workspaceId === currentWorkspaceId) {
      setOpen(false);
      return;
    }
    await switchWorkspace(workspaceId);
    setOpen(false);
  };

  // close on outside click
  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="px-4 py-4 border-b border-app">
      {/* Header */}
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
          "w-full rounded-md border border-app bg-card",
          "px-3 py-2 text-left",
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
                ? "Loading..."
                : current.workspace?.name ?? "No workspace"}
            </div>
            <div className="text-xs text-app/70 truncate">
              {current.role ? `Role: ${current.role}` : " "}
            </div>
          </div>

          <div className="text-xs text-app/70">
            {switching ? "Switching…" : open ? "▲" : "▼"}
          </div>
        </div>
      </button>

      {/* Menu */}
      {open && (
        <div
          role="menu"
          className={clsx(
            "mt-2 rounded-md border border-app bg-card",
            "overflow-hidden animate-fadeIn"
          )}
        >
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
                const isCurrent = id === currentWorkspaceId;

                return (
                  <button
                    key={id}
                    type="button"
                    role="menuitem"
                    onClick={() => onSelect(id)}
                    className={clsx(
                      "w-full px-3 py-2 text-left",
                      "hover:bg-app transition-colors",
                      isCurrent && "bg-app"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-app truncate">
                          {m.workspace.name}
                        </div>
                        <div className="text-xs text-app/70 truncate">
                          Joined {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : ""}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-app/70">{m.role}</span>
                        {isCurrent && (
                          <span className="text-xs font-semibold text-primary">
                            Current
                          </span>
                        )}
                      </div>
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