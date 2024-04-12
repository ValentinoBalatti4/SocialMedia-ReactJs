import React, { useEffect, useState } from 'react'
import './Comment.css'
import axios from 'axios';

function Comment({ postId, comment, setComments, getTimeElapsed, currentUser }) {
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
            const res = await axios.post(`http://localhost:4444/posts/deleteComment/${postId}/${comment.id}`, {}, {withCredentials: true});

            if(res.status === 200){
                const updatedComments = res.data.comments;
                await setComments(updatedComments);
            }
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
                    <a href={`/${comment.username}`}>{comment.username}</a>
                </div>
                <p>{getTimeElapsed(comment.createdAt)}</p>
            </div>
            {
                comment.username === currentUser && (
                    <div className='right'>
                        <span className='material-symbols-outlined' onClick={handleDeleteButton}>delete</span>
                    </div>
                )
            }
        </div>
        <div className='comment-body'>
            <p>{comment.text}</p>
        </div>
  </div>
  )
}

export default Comment