import './App.css'

import Login from "./pages/login/Login"
import Home from "./pages/home/Home"

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import User from './pages/User/User';


const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/search/:id" element={<User/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App