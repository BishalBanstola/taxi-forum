import { useForm } from 'react-hook-form'
import { api } from '../../config/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useUserStore } from '../../store/useUserStore';

interface PostFormData {
  title: string
  content: string
}

export const CreatePostForm = () => {
  const user=useUserStore(store=>store.user);
  const { register, handleSubmit, reset } = useForm<PostFormData>()
  const queryClient = useQueryClient()

  const mutation = useMutation<AxiosResponse<any>, Error, PostFormData>({
    mutationFn: (newPost: PostFormData) => api.post(`/posts`, newPost,{params:{username:user}}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      reset();
    },
  });


  const onSubmit = (data: PostFormData) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border p-4 mb-4">
      <div className="mb-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          {...register('title', { required: true })}
          className="mt-1 block w-full border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Content</label>
        <textarea
          {...register('content', { required: true })}
          className="mt-1 block w-full border-gray-300 rounded-md"
        />
      </div>
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">
        Create Post
      </button>
    </form>
  )
}
