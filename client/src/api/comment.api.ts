
import { api } from "./axios";

export const createComment = async (
    taskId: string,
    content: string
) => {

    const response = await api.post(`/tasks/${taskId}/comments`, {
        content
    });

    return response.data;
}

export const getCommentsByTask = async (
    taskId: string,
    page = 1,
    limit = 20
) => {

    const response = await api.get(`/tasks/${taskId}/comments`, {
        params: { page, limit },
    });

    return response.data;
}

export const deleteComment = async (commentId: string) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

export const restoreTask = async (commentId: string) => {
    const response = await api.patch(`/comments/${commentId}/restore`);
    return response.data;
}