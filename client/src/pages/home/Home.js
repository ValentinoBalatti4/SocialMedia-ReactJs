import React, { useEffect, useState } from 'react'
import "./Home.css"
import Navbar from '../../components/navbar/Navbar'
import Post from '../../components/posts/Post'
import Sidebar from '../../components/sidebar/Sidebar'
import UploadPost from '../../components/UploadPost/UploadPost'
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";


const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");

  const [posts, setPosts] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(0)

  useEffect(() => {
    const verifyCookie = async () => {
      if(!cookies.token){navigate("/login");}
      const { data } = await axios.post(
        "http://localhost:4444/auth/",
        {},
        {withCredentials: true}
      )
      const { status, user } = data;
      setUsername(user)
      return status
      ? (setIsLoggedIn(1),
          toast(`Hello ${user}`, {
            position: "top-right",
          }))
        : (removeCookie("token"), navigate("/login"));}
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  useEffect(() => {
    const getPosts = async () => {
      try{
        const BASE_URL = "http://localhost:4444"
        const res = await axios.get(`${BASE_URL}/posts/`)
        setPosts(res.data.posts)

      } catch(e){
        console.log(e)
      }
    }
    getPosts()
  }, [setPosts])

  return (
    <div className='container'>
        <Navbar isLogged={isLoggedIn} removeCookie={removeCookie} />
        <div className='home-wrapper'>
          <Sidebar/>
          <div className='center'>
            {
              isLoggedIn && <UploadPost/>
            }
            {
              posts.map((post, index) => (
                <Post post={post} currentUser={username} key={index}/>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default Home