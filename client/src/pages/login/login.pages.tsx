import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation,UseMutationResult } from '@tanstack/react-query';
import {AxiosResponse} from 'axios';
import { api } from '../../config/axios';
import {useNavigate} from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';

interface IFormInput {
  name: string;
  password: string;
}

const registerUser = (newUser: IFormInput): Promise<AxiosResponse<any,any>> => {
  return api.post('/login', newUser);
};

export const Login: React.FC = () => {
  const navigate=useNavigate();
  const setUser = useUserStore(state=>state.setUser);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const {mutate,isPending}: UseMutationResult<AxiosResponse<any,any>, Error, IFormInput> = useMutation({
    mutationFn:registerUser,
    onSuccess: (data: AxiosResponse<any, any>) => {
      const { token, username,refreshToken } = data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(username);
      navigate('/');
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
            <label className="block mb-1 font-medium" htmlFor="name">Username</label>
            <input
              {...register("name", { required: true })}
              id="name"
              type="text"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.name && <p className="text-red-500">Username is required</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="password">Password</label>
            <input
              {...register("password", { required: true })}
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.password && <p className="text-red-500">Password is required</p>}
          </div>
          <button type="submit" className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
            Register
          </button>
        </form>
        {isPending && <p>Loading...</p>}
        {responseMessage && <p className="text-red-500">{responseMessage}</p>}
      </div>
    </div>
  );
};

