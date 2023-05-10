import React from 'react'
import "./Post.css"

const Post = () => {
  return (
    <div className="post-container">
        <div className="post-header">
            <div className="post-userinfo">
                <img src="https://picsum.photos/200/300"/>
                <a>Jhon doe</a>
            </div>
            <p>Hace 22 minutos</p>
        </div>
        <div className="post-content">
            <p>Lhello</p>
        </div>
        <div className="image-container">
            <img src="https://picsum.photos/200/300"/>
        </div>
        <div className="interactions">
            <div className="likes-container">
                <span className="material-symbols-outlined">favorite</span>
            </div>
            <div className="comments-container">
                <span className="material-symbols-outlined">comment</span>
            </div>
        </div>
    </div>
  )
}

export default Post
