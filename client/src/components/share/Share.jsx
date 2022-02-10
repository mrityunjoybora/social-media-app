import "./share.css";
import {PermMedia, Label,Room, EmojiEmotions} from "@material-ui/icons"
import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  
  const { user } = useContext(AuthContext);
  const desc = useRef();
  const [file, setFile] = useState(null);


  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value
    };
    if (file) { 
      const data = new FormData();
      data.append("file", file);

      // FIXME: Upload photo
      try {
        const res = await axios.post("/upload", data);
        const fileName = res.data;
              newPost.img = fileName;

      } catch (error) {
        console.log(error+""+"/upload");
      }
    }

    
    // FIXME: Share Status
    try {
      await axios.post("/posts", newPost);
     window.location.reload();
    } catch (error) {
      console.log(error+""+"/post");
    }
   }

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <Link to={`/profile/ + ${user.username}`}>
            <img className="shareProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF + "/person/noAvatar.png"} alt="" />
            </Link>
          <input ref={ desc}
            placeholder={`What's in your mind ${user.username}?`}
            className="shareInput"
          />
        </div>
        <hr className="shareHr"/>
        <form className="shareBottom" onSubmit={submitHandler}>
            <div className="shareOptions">
                <label htmlFor="file" className="shareOption">
                    <PermMedia htmlColor="tomato" className="shareIcon"/>
              <span className="shareOptionText">Photo or Video</span>
              <input type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(e) => setFile(e.target.files[0])} />
                </label>
                <div className="shareOption">
                    <Label htmlColor="blue" className="shareIcon"/>
                    <span className="shareOptionText">Tag</span>
                </div>
                <div className="shareOption">
                    <Room htmlColor="green" className="shareIcon"/>
                    <span className="shareOptionText">Location</span>
                </div>
                <div className="shareOption">
                    <EmojiEmotions htmlColor="goldenrod" className="shareIcon"/>
                    <span className="shareOptionText">Feelings</span>
                </div>
            </div>
            <button className="shareButton" type="submit">Share</button>
        </form>
      </div>
    </div>
  );
}
