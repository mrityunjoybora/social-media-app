import { React, useState, useEffect } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
// import { Posts } from "../../dummyData";
import axios from "axios";

export default function Feed({ username}) {

  const [post, setPost] = useState([]);
  
  useEffect(() => {
  
    // FIXME: Dynamic userId
    const fetchPosts = async () => {
      const res = username ? await axios.get("/posts/profile/" + username) : await axios.get("/posts/timeline/61daa18377e99ebcf8046cfc");
      setPost(res.data);
    };
    fetchPosts();
  }, [username]);
  
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {post.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
