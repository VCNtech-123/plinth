import Button from "../../../components/ui/Button";
import Card, { CardContent, CardHeader } from "../../../components/ui/Card";
import { useWorkspaceInvites } from "./hooks/useWorkspaceInvites";
import RolePill from "../members/components/RolePill"; // reuse your pill

const WorkspaceInvites = () => {
  const { invites, loading, accept, decline } = useWorkspaceInvites();

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-app">Invites</h1>
          <p className="text-sm text-app/60 mt-1">
            Invitations sent to you for other workspaces.
          </p>
        </div>
      </div>

      <Card padding={false}>
        <CardHeader className="px-6 py-4 border-b border-app mb-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-app">Pending invites</h3>
            <span className="text-sm text-app/60">
              {loading ? "Loading..." : `${invites.length} invite${invites.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="px-6 py-3 grid grid-cols-12 gap-4 text-xs font-medium text-app/60 border-b border-app bg-card">
            <div className="col-span-6">Workspace</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-4 text-right">Actions</div>
          </div>

          <div className="divide-y divide-(--color-border)">
            {loading ? (
              <div className="px-6 py-10 text-center text-sm text-app/60">
                Loading invites...
              </div>
            ) : invites.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-app/60">No pending invites.</p>
                <p className="text-xs text-app/40 mt-1">
                  When someone invites you, it will appear here.
                </p>
              </div>
            ) : (
              invites.map((inv) => (
                <div
                  key={inv.id}
                  className="px-6 py-3.5 grid grid-cols-12 gap-4 items-center hover:bg-app transition-colors"
                >
                  <div className="col-span-6 min-w-0">
                    <div className="text-sm font-medium text-app truncate">
                      {inv.workspace.name}
                    </div>
                    <div className="text-xs text-app/60 truncate">
                      Workspace ID: {inv.workspace.id}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <RolePill role={inv.role} />
                  </div>

                  <div className="col-span-4 flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => decline(inv.id)}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => accept(inv.id)}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceInvites;