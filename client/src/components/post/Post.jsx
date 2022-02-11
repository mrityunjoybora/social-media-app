import "./post.css";
import { MoreVert } from "@material-ui/icons";
// import { Users } from "../../dummyData";
import { useState, useEffect } from "react";
import axios from "axios";
import * as timeago from 'timeago.js';
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [post.likes, currentUser._id ]);
  

  const likeHandler = () => {
    
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id })
    } catch (error) {
      
    }

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
              {/* FIXME: PF + user.profilePicture (/person/1.jpeg) */}
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
          <img className="postImg" src={PF + "/user-posts/" +post?.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {/* FIXME: like icon (image)*/}
            <img className="likeIcon" src={PF + "/like.png"} onClick={likeHandler} alt="" />
            {/* Commented out the heart button */}
            {/* <img className="likeIcon" src={PF + "/heart.png"} onClick={likeHandler} alt="" /> */}
            <span className="postLikeCounter">{!like?"":like + " " + "people like this"}</span>
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
