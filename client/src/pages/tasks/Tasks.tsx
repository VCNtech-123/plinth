// client/src/pages/tasks/Tasks.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TaskBoard from "./components/TaskBoard";
import type { Task } from "../../types/task.types";
import type { Project } from "../../types/project.types";
import { getTasks, updateTask, deleteTask, createTask } from "../../api/task.api";
import { getProjects } from "../../api/project.api";
import TaskDrawer from "./components/TaskDrawer";
import TasksHeader from "./components/TasksHeader";
import DeleteTaskModal from "./modals/DeleteModalTask";
import AddTaskModal from "./modals/AddTaskModal";
import { useWorkspaceStore } from "../../store/workspace.store";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [deleteTaskTitle, setDeleteTaskTitle] = useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState<string | undefined>();
  const workspaceVersion = useWorkspaceStore((s) => s.version)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        const response = await getTasks({
          search: debouncedSearch,
          project: projectFilter,
        });

        setTasks(response.data);
      } catch (err: any) {
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [debouncedSearch, projectFilter, workspaceVersion]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects({
          page: 1,
          limit: 100,
        });

        setProjects(response.data);
      } catch {
        toast.error("Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  const handleMoveTask = async (
    taskId: string,
    status: Task["status"]
  ) => {
    const previous = [...tasks];

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status } : t
      )
    );

    try {
      await updateTask(taskId, { status });
    } catch (err) {
      setTasks(previous);
      toast.error("Failed to update task");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTaskId) return;

    try {
      setDeleteLoading(true);

      await deleteTask(deleteTaskId);

      setTasks((prev) =>
        prev.filter((t) => t.id !== deleteTaskId)
      );

      toast.success("Task deleted");

      setDeleteTaskId(null);
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      const created = await createTask(data);
      setTasks((prev) => [created, ...prev]);
      setIsAddOpen(false);
      toast.success("Task created");
    } catch {
      toast.error("Failed to create task");
    }
  };

  // ✅ NEW: Handle task update from drawer (assignee, status, etc.)
  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      // Update local state immediately
      setTasks((prev) =>
        prev.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        )
      );

      const response = await getTasks({
        search: debouncedSearch,
        project: projectFilter,
      });
      setTasks(response.data);

      toast.success("Task updated");
    } catch (err: any) {
      toast.error("Failed to update task");
      // Refetch to revert optimistic update
      const response = await getTasks({
        search: debouncedSearch,
        project: projectFilter,
      });
      setTasks(response.data);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <TasksHeader
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
        }}
        projectFilter={projectFilter}
        onProjectChange={(value) => {
          setProjectFilter(value || undefined);
        }}
        projects={projects}
        onAddClick={() => setIsAddOpen(true)}
      />

      {loading ? (
        <p className="text-sm opacity-60">Loading tasks...</p>
      ) : (
        <>
          <TaskBoard
            tasks={tasks}
            onEdit={(task) => setActiveTaskId(task.id)}
            onDelete={(taskId) => {
              const task = tasks.find((t) => t.id === taskId);
              setDeleteTaskId(taskId);
              setDeleteTaskTitle(task?.title || "");
            }}
            onMove={handleMoveTask}
          />

          <TaskDrawer
            taskId={activeTaskId}
            open={!!activeTaskId}
            onClose={() => setActiveTaskId(null)}
            onUpdate={handleTaskUpdate}  // ✅ Pass the handler
          />

          <DeleteTaskModal
            open={!!deleteTaskId}
            onClose={() => setDeleteTaskId(null)}
            onConfirm={handleConfirmDelete}
            taskTitle={deleteTaskTitle}
            loading={deleteLoading}
          />

          <AddTaskModal
            open={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            onCreate={handleCreateTask}
            projects={projects}
            defaultProjectId={projectFilter}
          />
        </>
      )}
    </div>
  );
};

export default Tasks;