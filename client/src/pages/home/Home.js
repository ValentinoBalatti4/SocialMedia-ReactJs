import React from 'react'
import "./Home.css"
import Navbar from '../../components/navbar/Navbar'
import Post from '../../components/posts/Post'
import Sidebar from '../../components/sidebar/Sidebar'
import UploadPost from '../../components/UploadPost/UploadPost'


const Home = () => {
  return (
    <div className='container'>
        <Navbar/>
        <div className='home-wrapper'>
          <Sidebar/>
          <div className='center'>
            <UploadPost/>


            <Post/>
          </div>
        </div>
    </div>
  )
}

export default Home