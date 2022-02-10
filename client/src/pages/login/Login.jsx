import { useRef, useContext } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import { CircularProgress } from "@material-ui/core";

export default function Login() {

  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch} = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    // FIXME:Can I directly pass email.current.value?
    // Is email: is a variable?
    loginCall({email: email.current.value, password: password.current.value}, dispatch);
  }
  // console.log(user);

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social App</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Social App.
          </span>
        </div>
        <div className="loginRight">
          <form onSubmit={handleClick} className="loginBox">
            <input placeholder="Email" type="email" ref={email} required className="loginInput" />
            <input placeholder="Password" ref={password} required type="password" minLength="6" className="loginInput" />
            {/* FIXME: How to check is the CircularProgress is working or not?
            FIXME: How to check is color="white" is working or not?
            */}
             
            <button className="loginButton" type="submit" disabled={isFetching}>{isFetching? <CircularProgress style={{ color: 'white' }}
            size="20px"/> : "Log In"} </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton" disabled={isFetching}>
              {isFetching? <CircularProgress style={{ color: 'white' }}
              size="20px"/> : "Create a New Account"}
              
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
