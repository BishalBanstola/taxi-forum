// src/components/Post.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../config/axios';
import { PostItem } from '../../components/post-item/post-item.component';
import { IPost } from '../../types/type';


const fetchPosts = async (): Promise<IPost[]> => {
  const { data } = await api.get('/posts');
  return data;
};

export const Posts: React.FC = () => {
  const { data: posts, isLoading, isError, error } = useQuery<IPost[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
       <div className="flex justify-center">
          <div className="w-1/2">
           {posts && posts.length > 0 ? (
            posts.map((post) => <PostItem key={post.id} post={post} />)
            ) : (
            <div>No posts available</div>
            )}
          </div>
        </div>
    </div>
  );
};
