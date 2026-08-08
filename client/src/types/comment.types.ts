export interface CommentAuthor {
  id: string;
  name: string;
  email: string;
}

export interface Comment {
  id: string;
  content: string;
  author: CommentAuthor;
  createdAt: string;
}