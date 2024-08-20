import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation,UseMutationResult } from '@tanstack/react-query';
import {AxiosResponse} from 'axios';
import { api } from '../../config/axios';
import {useNavigate} from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';

interface IFormInput {
  title: string;
  content: string;
}


export const CreatePost: React.FC = () => {
  const navigate=useNavigate();
  const user = useUserStore(state=>state.user);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const {mutate,isPending}: UseMutationResult<AxiosResponse<any,any>, Error, IFormInput> = useMutation({
    mutationFn:(newPost: IFormInput): Promise<AxiosResponse<any,any>> => {
      return api.post('/posts', newPost, {
        params: { username:user },
      });},
    onSuccess: (data: AxiosResponse<any, any>) => {
      console.log(data.data);
      navigate(`/`);
    },
    onError:(error:any)=>{
      setResponseMessage(error.response?.data || 'An error occurred');
    },
  });
  
  const onSubmit: SubmitHandler<IFormInput> = data => {
    console.log(data)
    mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="username">Title</label>
            <input
              {...register("title", { required: true })}
              id="title"
              type="text"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.title && <p className="text-red-500">Title is required</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="content">Content</label>
            <textarea
              {...register("content", { required: true })}
              id="content"
              rows={12}
              cols={80}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.content && <p className="text-red-500">Description is required</p>}
          </div>
          <button type="submit" className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
            Create Post
          </button>
        </form>
        {isPending && <p>Loading...</p>}
        {responseMessage && <p className="text-red-500">{responseMessage}</p>}
      </div>
    </div>
  );
};

