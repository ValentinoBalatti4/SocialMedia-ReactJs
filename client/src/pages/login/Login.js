import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import axios from 'axios'
import Error from "../../components/Error/Error"


const Login = () => {
  const [wrapper, setWrapper] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [userData, setUserData] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const register = async (e) => {
    e.preventDefault()
    if(password !== password2){
      setError("Passwords must match!")
    } else{
      try{
        const registerUser = {username, password}
        const res = await axios.post("http://localhost:4444/auth/register", registerUser)
        setUserData({
          token: res.data.token,
          user: res.data.user
        })
        localStorage.setItem("token", res.data.token)
        navigate('/')
      } catch(e){
        setError(e.message)
      }
    }
  }

  const login = async (e) => {
    e.preventDefault()
    try{
      const loginUser = {username, password}
      const res = await axios.post("http://localhost:4444/auth/login", loginUser)
      setUserData({
        token: res.data.token,
        user: res.data.user
      })
      localStorage.setItem("token", userData.token)
      navigate("/")
    }catch(e){
      setError(e.message)
    }
  }

  return (
      <div className="container">
        { wrapper === true ?
            <div className="Wrapper">
              <h2>Login</h2>
              <form onSubmit={login}>
                <div className="field">
                  <label>Username</label>
                  <input minLength="4" value={username} type="text" onChange={e => setUsername(e.target.value)}/>
                </div>
                <div className="field">
                  <label>Password</label>
                  <input minLength="4" type='password' value={password} onChange={e => setPassword(e.target.value)}/>
                </div>

                <button type="submit">Login</button>
                {error && <Error message={error} clearError={() => setError(undefined)} />}
              </form>
              <p>You don't have an account? <b onClick={() => setWrapper(false)}>Click to register</b></p>
            </div>
          :
            <div className="Wrapper">
              <h2>Register</h2>
              <form onSubmit={register}>
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
                <button type='submit'>Register</button>
                {error && <Error message={error} clearError={() => setError(undefined)} />}
              </form>
              <p>Already have an account? <b onClick={() => setWrapper(true)}>Click to login</b></p>
            </div>
        }
      </div>
  )
}

export default Login