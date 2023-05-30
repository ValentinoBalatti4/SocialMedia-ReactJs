import React from 'react'
import "./Post.css"

const Post = ( {post} ) => {

    const getTimeElapsed = (createdAt) => {
        const objectTimestamp = new Date(createdAt).getTime();
        const currentTimestamp = Date.now();
        const timeDifferenceInSeconds = Math.floor((currentTimestamp - objectTimestamp) / 1000);
      
        if (timeDifferenceInSeconds < 60) {
          return `${timeDifferenceInSeconds} seconds ago`;
        } else if (timeDifferenceInSeconds < 3600) {
          const minutes = Math.floor(timeDifferenceInSeconds / 60);
          return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (timeDifferenceInSeconds < 86400) {
          const hours = Math.floor(timeDifferenceInSeconds / 3600);
          return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (timeDifferenceInSeconds < 2592000) {
          const days = Math.floor(timeDifferenceInSeconds / 86400);
          return `${days} day${days !== 1 ? 's' : ''} ago`;
        } else {
          const years = Math.floor(timeDifferenceInSeconds / 31536000);
          return `${years} year${years !== 1 ? 's' : ''} ago`;
        }
    }

  return (
    <div className="post-container">
        <div className="post-header">
            <div className="post-userinfo">
                <img src="https://picsum.photos/200/300"/>
                <a>{post.username}</a>
            </div>
            <p>{getTimeElapsed(post.createdAt)}</p>
        </div>
        <div className="post-content">
            <p>{post.text}</p>
        </div>
        {
            post.img !== "" &&
                <div className="image-container">
                    <img src={post.img}/>
                </div>
                
        }

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
