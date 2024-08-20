// types.ts

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface IComment {
  id: number;
  content: string;
  createdAt: string; 
  post: IPost;
  user: User;
}

export interface ILike {
  id: number;
  isLike: boolean;
  createdAt: string;
  post: IPost;
  user: User;
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  createdAt: string; 
  user: User;
  likeCount: number;
}
