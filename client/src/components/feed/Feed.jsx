import { React, useState, useEffect } from "react";
// import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
// import { Posts } from "../../dummyData";
import axios from "axios";

export default function Feed() {
  
  useEffect(() => {
  
    const fetchPosts = async () => {
      const res = await axios.get("/posts/timeline/61daa18377e99ebcf8046cfc");
      console.log(res);
    };
    fetchPosts();
  }, []);
  
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {/* {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))} */}
      </div>
    </div>
  );
}
