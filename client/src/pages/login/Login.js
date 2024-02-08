import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [wrapper, setWrapper] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")

  const navigate = useNavigate()

  const handleError = (err) => {
    toast.error(err, {
      position: "bottom-left",
    });
  }

  const handleSuccess = (msg) => {
    toast.success(msg, {
      position: "bottom-right",
    });
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try{
      const { data } = await axios.post(
        "http://localhost:4444/auth/login",
        {
          username,
          password
        },
        {withCredentials: true}
      );
      console.log(data);
      const {success, message } = data;
      if(success){
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }else{
        handleError(message);
      }
      setUsername("");
      setPassword("");
    }catch(error){
      console.log(error);
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try{
      const { data } = await axios.post(
        "http://localhost:4444/auth/register",
        {
          username,
          password
        },
        {withCredentials: true}
      )
      const { success, message } = data;
      if(success){
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else{
        handleError(message);
      }
    }catch(error){
      console.log(error);
    }
    setUsername("");
    setPassword("");
    setPassword2("");
  }

  return (
      <div className="container">
        { wrapper === true ?
            <div className="Wrapper">
              <h2>Login</h2>
              <form onSubmit={handleLoginSubmit}>
                <div className="field">
                  <label>Username</label>
                  <input minLength="4" value={username} type="text" onChange={e => setUsername(e.target.value)}/>
                </div>
                <div className="field">
                  <label>Password</label>
                  <input minLength="4" type='password' value={password} onChange={e => setPassword(e.target.value)}/>
                </div>

                <button type="submit" disabled={!username || !password}>Login</button>
              </form>
              <p>You don't have an account? <b onClick={() => setWrapper(false)}>Click to register</b></p>
            </div>
          :
            <div className="Wrapper">
              <h2>Register</h2>
              <form onSubmit={handleRegisterSubmit}>
                <div className="field">
                  <label>Username</label>
                  <input minLength="4" value={username} type="text" onChange={e => setUsername(e.target.value)}/>
                </div>
                <div className="field">
                  <label>Password</label>
                  <input minLength="4" type='password' value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
                <div className="field">
                  <label>Confirm password</label>
                  <input minLength="4" type='password' value={password2} onChange={e => setPassword2(e.target.value)}/>
                </div>
                <button type='submit' disabled={!username || !password}>Register</button>

              </form>
              <p>Already have an account? <b onClick={() => setWrapper(true)}>Click to login</b></p>
            </div>
        }
        <ToastContainer/>
      </div>
  )
}

export default Login