import React, { useEffect, useState } from 'react'
import './Comment.css'
import axios from 'axios';

function Comment({ comment, getTimeElapsed }) {
    const [commentOwnerProfilePic, setCommentOwnerProfilePic] = useState("")

    useEffect(() => {
        const fetchUserProfilePic = async () => {
            try{
              const res = await axios.get(`http://localhost:4444/users/${comment.username}`);
              setCommentOwnerProfilePic(res.data.user.profilePic);
      
            }catch(error){
              console.log("Error fetching user profilePic: ", error);
            }
        }
        fetchUserProfilePic();
    },[])

    const handleDeleteButton = async () => {
        try{
            const res = await axios.post(`http://localhost:4444/posts/deleteComment/${comment.id}`, {}, {withCredentials: true});

        }catch(error){
            console.log(error);
        }
    }


  return (
    <div className='comment-container'>
        <div className='comment-container-header'>
            <div className='left'>
                <div className='user-info'>
                    <img src={commentOwnerProfilePic}/>
                    <a>{comment.username}</a>
                </div>
                <p>{getTimeElapsed(comment.createdAt)}</p>
            </div>
            <div className='right'>
                <span className='material-symbols-outlined' onClick={handleDeleteButton}>delete</span>
            </div>
        </div>
        <div className='comment-body'>
            <p>{comment.commentText}</p>
        </div>
  </div>
  )
}

export default Comment