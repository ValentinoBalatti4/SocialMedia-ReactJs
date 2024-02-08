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
                <div className="banner-user-profile">
                    <img src="https://picsum.photos/200/300"/>
                    <h1>Jhon doe</h1>
                </div>
                <div className="banner-user-info">
                    <div>
                        <b>Posts: <span>100</span></b>
                    </div>
                    <div>
                        <b>Following: <span>100</span></b>
                    </div>
                    <div>
                        <b>Followers: <span>100</span></b>
                    </div>
                </div>
            </div>
            <div className="user-main">
                <div className="user-contacts"> 
                    <h6>Friends  <p>(10)</p></h6>
                    <div classname="contacts">
                        <div className="contact">
                            <img src='https://picsum.photos/300/300'/>
                            <a>Jhon doe</a>
                        </div>
                    </div>

                    <div classname="contacts">
                        <div className="contact">
                            <img src='https://picsum.photos/300/300'/>
                            <a>Jhon doe</a>
                        </div>
                    </div>

                    <div classname="contacts">
                        <div className="contact">
                            <img src='https://picsum.photos/300/300'/>
                            <a>Jhon doe</a>
                        </div>
                    </div>

                    <div classname="contacts">
                        <div className="contact">
                            <img src='https://picsum.photos/300/300'/>
                            <a>Jhon doe</a>
                        </div>
                    </div>
                </div>
                <div className="user-posts">
                    <Post/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default User