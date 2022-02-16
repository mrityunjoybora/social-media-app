import { React, useState, useEffect } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
// import { Posts } from "../../dummyData";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username}) {

  const [post, setPost] = useState([]);

  const { user } = useContext(AuthContext);
  
  useEffect(() => {
  
    const fetchPosts = async () => {
      const res = username ? await axios.get("/posts/profile/" + user.username) : await axios.get("/posts/timeline/" + user._id);
      setPost(
        res.data.sort((p1,p2) => { 
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [user.username, user._id]);
  
  
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