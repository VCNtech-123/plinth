import { IComment } from "../modules/comment/comment.model"

export type PopulatedComment = Omit<IComment, "author"> & {
  author: {
    name: string;
    email: string;
  };
};