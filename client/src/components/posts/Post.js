import React, { useEffect, useState } from 'react'
import "./Post.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Post = ({ post, currentUser, setPosts, showComments, getTimeElapsed } ) => {
  const [likes, setLikes] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments.length);
  const [isLiked, setIsLiked] = useState();
  const [postOwnerProfilePic, setPostOwnerProfilePic] = useState();
  const navigate = useNavigate();



  useEffect(() =>{
    setIsLiked(post.likes.includes(currentUser));

    const fetchUserProfilePic = async () => {
      try{
        const res = await axios.get(`http://localhost:4444/users/${post.username}`);
        setPostOwnerProfilePic(res.data.user.profilePic);

      }catch(error){
        console.log("Error fetching user profilePic: ", error);
      }
    }
    fetchUserProfilePic();
  }, [post.likes, currentUser]);

  const handleUserClick = () => {
    navigate(`/${post.username}`)  
  }

  const handleDeleteButton = async () => {
    console.log(post._id)
    try{
      const res = await axios.post(`http://localhost:4444/posts/delete/${post._id}`, {}, {withCredentials: true});

      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
    }catch(e){
      console.log(e)
    }
  }

  const hanleLikeButton = async () => {
    try{
        const res = await axios.post(`http://localhost:4444/posts/like/${post._id}`,  {}, {withCredentials: true});
        
        setLikes(res.data.likes.length);
        setIsLiked(res.data.likes.includes(currentUser));
    }catch(e){
      console.log(e);
    }
  }

  return (
    <div className="post-container">
        <div className="post-header">
          <div className='left'>
            <div className="post-userinfo" onClick={handleUserClick}>
                <img src={postOwnerProfilePic}/>
                <a>{post.username}</a>
            </div>
            <p>{getTimeElapsed(post.createdAt)}</p>
          </div>
          {  
            (currentUser === post.username) && (
              <div className='post-options'>
                <span className="material-symbols-outlined" onClick={handleDeleteButton}>delete</span>
              </div>
            )
          }
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
                <span className={`material-symbols-outlined likes-icon ${isLiked ? 'liked' : ''}`} onClick={hanleLikeButton} >favorite</span>
                <p>{likes}</p>
            </div>
            <div className="comments-container">
                <span className="material-symbols-outlined" onClick={showComments}>comment</span>
                <p>{comments}</p>
            </div>
        </div>
    </div>
  )
}

export default Post
