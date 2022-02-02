import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { Users } from "../../dummyData";
import { useState, useEffect } from "react";
import axios from "axios";
import * as timeago from 'timeago.js';
import { Link } from "react-router-dom";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;


  const likeHandler =()=>{
    setLike(isLiked ? like-1 : like+1)
    setIsLiked(!isLiked)
  }

  useEffect(() => {
  
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            
            <Link to={`/profile/${user.username}`}>
              <img
              className="postProfileImg"
              src={user.profilePicture || PF+"/person/noAvatar.png"}
              alt=""
            />
            </Link>
            
            <span className="postUsername">
              {user.username}
            </span>
            {/* FIXME: date */}
            <span className="postDate">{timeago.format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={post?.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {/* FIXME: like*/}
            <img className="likeIcon" src={PF + "/like.png"} onClick={likeHandler} alt="" />
            <img className="likeIcon" src={PF + "/heart.png"} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{!like?"":like + " people"}</span>
          </div>
          <div className="postBottomRight">
             {/* FIXME: comment*/}
            <span className="postCommentText">{!post?.comment?"":post?.comment + "comments"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}