import React from 'react'
import "./User.css"
import Navbar from '../../components/navbar/Navbar'
import Post from '../../components/posts/Post'



const User = () => {
  return (
    <div className="user-container">
        <Navbar/>
        <div className="user-wrapper">
            <div className="user-banner">
                <div className="banner-user-info">
                    <img src="https://picsum.photos/200/300"/>
                    <h1>Jhon doe</h1>
                </div>
                <div className="user-contacts">
                    <div>
                        <b>Followers: 100</b>
                    </div>
                    <div>
                        <b>Following: 200</b>
                    </div>
                </div>
            </div>
            <div className="user-posts">
                <Post/>
            </div>
        </div>
    </div>
  )
}

export default User