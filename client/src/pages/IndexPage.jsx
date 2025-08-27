import { useEffect, useState } from "react";
import Post from "../components/Post";

export default function IndexPage(){

    const [posts, setposts] = useState([]);

    useEffect(() => {
  fetch(`${API_BASE_URL}/api/post`).then(response=>{
        response.json().then(posts => {
            console.log(posts);
            setposts(posts);
        });
      });
    }, [])
    


    return (
  <>
    {posts.length > 0 && posts.map(post => (
      <Post key={post._id} {...post} />
    ))}
  </>
)}
