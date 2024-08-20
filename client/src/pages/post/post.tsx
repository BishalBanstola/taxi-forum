// src/components/Post.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../config/axios';
import { IPost } from '../../types/type';
import { useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { Comments } from '../../components/comments/comments.component';


const fetchPostById = async (id: string): Promise<AxiosResponse<IPost>> => {
  return api.get(`/posts/${id}`);
};

export const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey:['post',id],
    queryFn:()=> fetchPostById(id!)
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }
  const post = data?.data;

  return (
        <div className="container mx-auto p-4">
            <div className="flex justify-center">
          <div className="w-1/2">
              <div className="bg-white p-6 rounded shadow-md">
                <h1 className="text-2xl font-bold">{post?.title}</h1>
                <p className="text-gray-600">By {post?.user?.name} on {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown Date'}</p>
                <div className="mt-4">
                  <p>{post?.content}</p>
                </div>
              </div>
          </div>
        </div>

        <Comments />
      </div>
  );
};
