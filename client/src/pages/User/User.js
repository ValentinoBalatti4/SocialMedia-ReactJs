import React, { useEffect, useRef, useState } from 'react'
import "./User.css"
import Navbar from '../../components/navbar/Navbar'
import Post from '../../components/posts/Post'
import CommentsSection from '../../components/commentsSection/CommentsSection'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import FollowList from '../../components/followList/FollowList'
import Sidebar from '../../components/sidebar/Sidebar'

const User = () => {
    const { username } = useParams();
    const [data, setData] = useState({});
    const [posts, setPosts] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [cookies, removeCookie] = useCookies([]);
    const [currentUser, setCurrentUser] = useState("")
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [showFollowList, setShowFollowList] = useState(false);
    const [selectedFollowList, setSelectedFollowList] = useState("")

    const [showPostsComments, setShowPostsComments] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedPostComments, setSelectedPostComments] = useState([]);
  
    const [profilePicOptionsOpen, setProfilePicOptionsOpen] = useState(false);

    const profileOptionsRef = useRef(null);

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

    useEffect(() => {
        const verifyCookie = async () => {
            try{
                const { data } = await axios.post(`http://localhost:4444/auth/`, {}, {withCredentials: true});
                const { status, user } = data;
                
                return status && (setIsLoggedIn(true), setCurrentUser(user));
            }catch(error){
                console.log(error);
            }
        }
        verifyCookie();
    },[])

    useEffect(() => {
        const fetchUserData = async () => {
            try{
                const dataResponse = await axios.get(`http://localhost:4444/users/${username}`);
                setData(dataResponse.data.user);
                setFollowers(dataResponse.data.user.followers);
                setFollowings(dataResponse.data.user.following);

                const postsResponse = await axios.get(`http://localhost:4444/posts/${username}/posts`);
                setPosts(postsResponse.data.posts);
            }catch(error){
                console.log(error);
            }
        }   
        fetchUserData();
    }, [setData, username])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileOptionsRef.current && !profileOptionsRef.current.contains(event.target)) {
                setProfilePicOptionsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setProfilePicOptionsOpen, profileOptionsRef]);

    const showComments = (post) => {
        setSelectedPost(post);
        setSelectedPostComments(post.comments);
        setShowPostsComments(true);
    }

    const handleFollowButton = async (username) => {
        try{
            const res = await axios.post(`http://localhost:4444/users/follow/${username}`, {}, {withCredentials: true});
            if (res.status === 200) {
                setFollowers(res.data.followers);
                console.log("updated followers: ", followers);
            }
        } catch(error){
            console.log(error);
        }
    }

    const handleShowFollowList = (listType) => {
        setSelectedFollowList(listType);
        setShowFollowList(true);
    }

    return (
    <div className="user-container">
        <Navbar isLogged={isLoggedIn} removeCookie={removeCookie} currentUser={currentUser}/>
        <div className="user-wrapper">
            <Sidebar/>
            <div className='center-container'>
                <div className="user-banner">
                    <div className="banner-user-profile">
                        <img src={data.profilePic}/>
                        {
                            username === currentUser && (
                                <span className='material-symbols-outlined' onClick={e => setProfilePicOptionsOpen(true)}>
                                    more_horiz
                                </span>
                            )
                        }
                    </div>
                        {
                            profilePicOptionsOpen && (
                                <div className='profilePic-options' ref={profileOptionsRef}>
                                    <div className='options'>
                                        <b>Change profile picture</b>
                                    </div>
                                    <div className='options'>
                                        <b>Delete profile picture</b>
                                    </div>
                                </div>
                            )
                        }
                    <div className="banner-user-info">
                        <div className='top'>
                            <h1>{data.username}</h1>
                            {
                                (currentUser !== username) && (
                                    <div className='user-interactions'>
                                        <span id='follow-btn' className={followers?.includes(currentUser) ? 'unfollow' : ''} onClick={e => handleFollowButton(username)}>
                                        {
                                            followers?.includes(currentUser) ? 'Unfollow' : 'Follow'       
                                        }
                                        </span> 
                                                
                                                
                                        <span id='message-btn'>Message</span>
                                    </div>
                                )
                            }
                        </div>
                        <div className='bottom'>
                            <div>
                                <b>
                                    <span>{posts.length}</span> posts
                                </b>
                            </div>
                            <div>
                                <b onClick={e => handleShowFollowList('following')}>
                                    <span>{data.following?.length}</span> following
                                </b>
                            </div>
                            <div>
                                <b onClick={e => handleShowFollowList('followers')}>
                                    <span>{followers?.length}</span> followers
                                </b>
                            </div>
                        </div>
                    </div>
                </div>
            
            </div>
            <div className="user-main">
                <div className="user-posts">
                    {
                        (showPostsComments) ? 
                            <CommentsSection
                            comments={selectedPostComments}
                            setComments={setSelectedPostComments}
                            setShowPostsComments={setShowPostsComments}
                            postId={selectedPost._id}
                            getTimeElapsed={getTimeElapsed}
                            currentUser={username}
                            /> 
                        : (
                            posts.map((post, index) => (
                            <Post 
                                post={post}
                                currentUser={currentUser}
                                setPosts={setPosts}
                                showComments={() => showComments(post)} 
                                getTimeElapsed={getTimeElapsed}
                                key={index}/>
                            ))
                        )
                    }
                </div>
            </div>
            {
                showFollowList && (
                    <FollowList
                        listType={selectedFollowList}
                        follows={selectedFollowList === 'followers' ? followers : followings}
                        setFollowing={setFollowings}
                        setShowFollowList={setShowFollowList}
                        currentUser={currentUser}
                        handleFollowButton={handleFollowButton}
                        profileUsername={username}
                    />
                )
            }
        </div>
    </div>
    )}

export default User