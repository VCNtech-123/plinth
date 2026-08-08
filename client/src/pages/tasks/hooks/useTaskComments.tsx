import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getCommentsByTask,
  createComment as createCommentApi,
  deleteComment as deleteCommentApi,
} from "../../../api/comment.api";
import type { Comment } from "../../../types/comment.types";

export const useTaskComments = (taskId: string | null) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchComments = async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      const res = await getCommentsByTask(taskId);
      setComments(res.data);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (content: string) => {
    if (!taskId) return;

    try {
      setCreating(true);
      const res = await createCommentApi(taskId, content);
      setComments((prev) => [res.data, ...prev]);
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setCreating(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await deleteCommentApi(commentId);
      setComments((prev) =>
        prev.filter((comment) => comment.id !== commentId)
      );
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  return {
    comments,
    loading,
    creating,
    createComment,
    deleteComment,
  };
};