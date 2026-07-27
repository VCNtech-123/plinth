import { useEffect, useState } from "react";
import { toast } from "sonner";
import TaskBoard from "./TaskBoard";
import type { Task } from "../../types/task.types";
import type { Project } from "../../types/project.types";
import { getTasks, updateTask, deleteTask } from "../../api/task.api";
import { getProjects } from "../../api/project.api";
import TaskDrawer from "./TaskDrawer";
import TasksHeader from "./TasksHeader";

const Tasks = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

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
      />

      {loading ? (
        <p className="text-sm opacity-60">Loading tasks...</p>
      ) : (
        <>
          <TaskBoard
            tasks={tasks}
            onEdit={(task) => setActiveTaskId(task.id)}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
          />

          <TaskDrawer
            taskId={activeTaskId}
            open={!!activeTaskId}
            onClose={() => setActiveTaskId(null)}
          />
        </>
        
      )}

    </div>
  );
};

export default Tasks;