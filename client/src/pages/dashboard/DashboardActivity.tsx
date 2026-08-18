interface Props {
  activity: {
    completed: any[];
    created: any[];
  };
}

const DashboardActivity = ({ activity }: Props) => {
  const items = [...activity.created].slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="text-sm text-app/60">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((task) => (
        <div
          key={task.id}
          className="flex items-start justify-between gap-4 py-2 border-b border-app last:border-b-0"
        >
          <div className="min-w-0">
            <div className="text-sm font-medium text-app truncate">
              {task.title}
            </div>
            <div className="text-xs text-app/60 truncate">
              {task.project?.name}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default DashboardActivity;