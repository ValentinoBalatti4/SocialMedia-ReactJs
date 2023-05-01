import { React, useState } from 'react'
import './Login.css'

const Login = () => {
  const [login, setLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")


  return (
      <div className="container">
        { login ?
            <div className="loginWrapper">
              <h2>Login</h2>
              <form>
                <div className="field">
                  <label>Username</label>
                  <input value={username} type="text" onClick={e => setUsername(e.target.value)}/>
                </div>
                <div className="field">
                  <label>Password</label>
                  <input type='password' value={password} onClick={e => setPassword(e.target.value)}/>
                </div>

                <button>Login</button>
              </form>
              <p>You don't have an account? <b onClick={setLogin(false)}>Click to login</b></p>
            </div>
          :
            <div className="registerWrapper">
              <h2>Register</h2>
              <form>
                <div className="field">
                  <label>Username</label>
                  <input value={username} type="text" onClick={e => setUsername(e.target.value)}/>
                </div>
                <div className="field">
                  <label>Password</label>
                  <input type='password' value={password} onClick={e => setPassword(e.target.value)}/>
                </div>
                <div className="field">
                  <label>Confirm password</label>
                  <input type='password' value={password2} onClick={e => setPassword2(e.target.value)}/>
                </div>
                <button>Register</button>
              </form>
              <p>Already have an account? <p onClick={setLogin(true)}>Click to login</p></p>
            </div>
        }
      </div>
  )
}

export default Login