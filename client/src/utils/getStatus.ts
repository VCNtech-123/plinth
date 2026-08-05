export const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "default";
      case "paused":
        return "warning";
      default:
        return "default";
    }
  };

  export const getTaskStatusVariant = (status: string) => {
    switch (status) {
      case "done":
        return "success";
      case "in-progress":
        return "warning";
      case "todo":
        return "default";
      default:
        return "default";
    }
  };