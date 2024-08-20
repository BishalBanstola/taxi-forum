// src/components/Post.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../config/axios';
import { IComment } from '../../types/type';
import { useParams } from 'react-router-dom';

const fetchCommentsByPostId = async (id:String): Promise<IComment[]> => {
    const response = await api.get(`/posts/${id}/comments`);
    return response.data;
};
export const Comments: React.FC = () => {
    const { id } = useParams<{ id: string }>();
  
    const { data: comments, isLoading, isError, error } = useQuery<IComment[], Error>({
      queryKey: ['comments', id],
      queryFn: () => fetchCommentsByPostId(id!),
    });
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (isError) {
      return <div>Error: {error?.message}</div>;
    }
  
    return (
      <div className="w-1/2 mx-auto mt-6">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        {comments?.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-4 mb-4 rounded">
            <p className="text-gray-700"><strong>{comment.user.name}</strong></p>
            <p className="text-gray-600">{new Date(comment.createdAt).toLocaleString()}</p>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    );
  };