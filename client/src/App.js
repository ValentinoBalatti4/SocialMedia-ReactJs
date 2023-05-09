import './App.css'

import Login from "./pages/login/Login"
import Home from "./pages/home/Home"

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/" element={<Home/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App