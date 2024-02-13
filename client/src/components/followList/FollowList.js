import React, { useEffect, useRef, useState } from 'react'
import './FollowList.css'
import axios from 'axios';

const FollowList = ({ listType, follows, setShowFollowList, currentUser, handleFollowButton }) => {
    const [currentUserFollowList, setCurrentUserFollowList] = useState([])
    
    const followListRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
          if (followListRef.current && !followListRef.current.contains(event.target)) {
            setShowFollowList(false);
          }
        };
    
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [setShowFollowList]);
    
    useEffect(() => {
        const fetchCurrentUserFollows = async () => {
            try{
                const res = await axios.get(`http://localhost:4444/users/${currentUser}`);

                setCurrentUserFollowList(res.data.user.following);
            }catch(error){
                console.log(error);
            }
        }
        fetchCurrentUserFollows();
    },[])




    return (
    <div className='background'>
        <div className='followList-container' ref={followListRef}>
            <h1>{listType}</h1>
            <div className='userList'>  
                {
                    follows.map((follow, index) => (
                        <div className='user-container' key={index}>
                            <div className='user-info'>
                                
                                <a>{follow}</a>
                            </div>
                            {
                                follow !== currentUser && (
                                    <div className='user-interactions'>
                                            <span id='follow-btn' className={currentUserFollowList?.includes(follow) ? 'unfollow' : ''} onClick={handleFollowButton(follow)}>
                                            {
                                                currentUserFollowList?.includes(follow) ? 'Unfollow' : 'Follow'       
                                            }
                                            </span> 
                                                    
                                                    
                                            <span id='message-btn'>Message</span>
                                        </div>                                    
                                )
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default FollowList