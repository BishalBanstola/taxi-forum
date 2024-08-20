import React from 'react'
import { Link } from 'react-router-dom'

interface PostCardProps {
  post: {
    id: number
    title: string
    content: string
  }
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p>{post.content}</p>
      <Link to={`/post/${post.id}`} className="text-blue-500">Read more</Link>
    </div>
  )
}
