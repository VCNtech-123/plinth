import { useState } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useAuthStore } from "../../../store/auth.store";
import { useTaskComments } from "../hooks/useTaskComments";

interface CommentSectionProps {
  taskId: string;
}

const CommentSection = ({ taskId }: CommentSectionProps) => {
  const user = useAuthStore((state) => state.user);
  const { comments, loading, creating, createComment, deleteComment } =
    useTaskComments(taskId);

  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await createComment(content.trim());
    setContent("");
  };

  return (
    <div className="space-y-6 border-t border-app pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Input Section */}
      <div className="flex gap-3">
        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </span>
        </div>

        <div className="flex-1 space-y-2">
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
          />

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={creating || !content.trim()}
            >
              {creating ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <p className="text-sm text-text/60">Loading comments...</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isMine = comment.author.id === user?._id;

            return (
              <div
                key={comment.id}
                className="flex gap-3 p-4 rounded-xl bg-app/50 border border-app"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">
                    {comment.author.name[0].toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text">
                        {comment.author.name}
                      </p>
                      <span className="text-xs text-text/60">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {isMine && (
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="text-xs text-danger hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-text whitespace-pre-wrap wrap-break-word">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;