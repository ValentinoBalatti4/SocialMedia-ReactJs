import './App.css'

import Login from "./pages/login/Login"

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
        </Routes>
    </BrowserRouter>
  )
}

export default App