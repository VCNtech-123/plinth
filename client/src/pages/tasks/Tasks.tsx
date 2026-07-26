import { useEffect, useState } from "react";
import { toast } from "sonner";
import TaskBoard from "./TaskBoard";
import type { Task } from "../../types/task.types";
import type { Project } from "../../types/project.types";
import Input from "../../components/ui/Input";
import { getTasks, updateTask, deleteTask } from "../../api/task.api";
import { getProjects } from "../../api/project.api";

const Tasks = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState<string | undefined>();

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
  }, [debouncedSearch, projectFilter]);

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

    // optimistic update
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

  // ✅ Delete
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) =>
        prev.filter((t) => t.id !== taskId)
      );
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">
            Tasks
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Manage and track your workflow.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">

          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />

          <select
            value={projectFilter || ""}
            onChange={(e) =>
              setProjectFilter(e.target.value || undefined)
            }
            className="px-3 py-2 rounded-lg border border-app bg-card text-sm"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* Board */}
      {loading ? (
        <p className="text-sm opacity-60">Loading tasks...</p>
      ) : (
        <TaskBoard
          tasks={tasks}
          onEdit={(task) => console.log("edit", task)}
          onDelete={handleDeleteTask}
          onMove={handleMoveTask}
        />
      )}

    </div>
  );
};

export default Tasks;