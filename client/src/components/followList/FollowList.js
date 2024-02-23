import React, { useEffect, useRef, useState } from 'react'
import './FollowList.css'
import axios from 'axios';

const FollowList = ({ listType, follows, setFollowing, setShowFollowList, currentUser, handleFollowButton, profileUsername }) => {
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
    
    const fetchCurrentUserFollows = async () => {
        try{
            const res = await axios.get(`http://localhost:4444/users/${currentUser}`);

            setCurrentUserFollowList(res.data.user.following);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCurrentUserFollows();
    },[fetchCurrentUserFollows])

    return (
    <div className='background'>
        <div className='followList-container' ref={followListRef}>
            <h1>{listType}</h1>
            <div className='userList'>  
                {
                    follows.map((follow, index) => (
                        <div className='user-container' key={index}>
                            <div className='user-info'>
                                <a href={`/${follow}`}>{follow}</a>
                            </div>
                            {
                                follow !== currentUser && (
                                    <div className='user-interactions'>
                                            <span id='follow-btn' 
                                                className={currentUserFollowList?.includes(follow) ? 'unfollow' : ''}
                                                onClick={e => {
                                                    handleFollowButton(follow);
                                                    fetchCurrentUserFollows();
                                                    if(profileUsername === currentUser) {
                                                        setFollowing(currentUserFollowList)
                                                    }
                                                    console.log(currentUser + " " + profileUsername)
                                                    }
                                                }>
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