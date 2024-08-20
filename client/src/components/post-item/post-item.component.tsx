// src/components/PostItem.tsx
import React from 'react';
import { IPost } from '../../types/type';
import { Link } from 'react-router-dom';


interface PostItemProps {
  post: IPost;
}

export const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
    <Link to={`/posts/${post.id}`} className="block mb-4">
        <div key={post.id} className="mb-4 p-4 bg-white rounded shadow-md">
        <div className="flex items-center mb-2">
            <div className="text-gray-700 font-bold">{post.user.name}</div>
            <div className="ml-auto text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-2">{post.content}</p>
      </div>
    </Link>
  );
};
