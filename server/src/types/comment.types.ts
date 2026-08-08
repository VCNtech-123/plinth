import { IComment } from "../modules/comment/comment.model"

export type PopulatedComment = Omit<IComment, "author"> & {
  author: {
    _id: string
    name: string;
    email: string;
  };
};

export interface GetCommentsResponse {
    results: number;
    comments: PopulatedComment[];
};