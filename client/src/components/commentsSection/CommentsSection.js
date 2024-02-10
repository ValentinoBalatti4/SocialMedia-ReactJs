import React, { useEffect, useRef, useState } from 'react'
import './CommentsSection.css'
import axios from 'axios';
import Comment from '../comment/Comment';

const CommentsSection = ({ 
    comments, 
    setComments,
    setShowPostsComments,
    postId,
    getTimeElapsed,
    currentUser 
  }) => {

  const commentsSectionRef = useRef(null);
  const [commentText, setCommentText] = useState("")

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (commentsSectionRef.current && !commentsSectionRef.current.contains(event.target)) {
        setShowPostsComments(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setShowPostsComments]);

  const handleUploadComment = async () => {
    try{
      const res = await axios.post(`http://localhost:4444/posts/comment/${postId}`, 
        {commentText},
        {withCredentials: true}
      );

      const updatedComments = res.data.comments;
      setComments(updatedComments);
      setCommentText("");
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className='commentsSection-container' ref={commentsSectionRef}>
        <h2>Comments</h2>
        <div className='comments-display'>
          {
            comments.length ===  0 ? <p>There are no comments yet...</p> : (
              comments.map((comment, index) => (
                <Comment 
                  postId={postId}
                  comment={comment}
                  setComments={setComments}
                  getTimeElapsed={getTimeElapsed}
                  currentUser={currentUser} 
                  key={index}/>
              ))
            )
          }
        </div>
        <div className='upload-comment-container'>
          <input value={commentText} onChange={(e) => setCommentText(e.target.value)}/>
          <span className='material-symbols-outlined' onClick={handleUploadComment}>send</span>
        </div>
    </div>
  )
}

export default CommentsSection