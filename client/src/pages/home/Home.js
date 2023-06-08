import React, { useEffect, useState } from 'react'
import "./Home.css"
import Navbar from '../../components/navbar/Navbar'
import Post from '../../components/posts/Post'
import Sidebar from '../../components/sidebar/Sidebar'
import UploadPost from '../../components/UploadPost/UploadPost'
import axios from 'axios'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(0)

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = localStorage.getItem('token')
      if(accessToken){
        try{
          const BASE_URL = 'http://localhost:4444'
          const res = await axios.get(`${BASE_URL}/auth/verify`, {
            headers: { 'Authorization': 'Bearer ' + accessToken}
          })
          setIsLoggedIn(1)
        } catch{}
      }
    }
    checkLoginStatus()
  }, [])



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
        <Navbar isLogged={isLoggedIn}/>
        <div className='home-wrapper'>
          <Sidebar/>
          <div className='center'>
            {
              isLoggedIn && <UploadPost/>
            }
            {
              posts.map(post => (
                <Post post={post}/>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default Home