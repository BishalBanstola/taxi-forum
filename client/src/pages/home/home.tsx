import { useEffect } from "react"
import { Posts } from "../posts/posts"

export const Home = () => {
    useEffect(()=>{
        console.log('here inside home')
    },[])
    return (
      <div className="container mx-auto p-4">
       <Posts />
      </div>
    )
  }
  
