import React, { useEffect, useState } from 'react'
import "./User.css"
import Navbar from '../../components/navbar/Navbar'
import Post from '../../components/posts/Post'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie'

const User = () => {
    const { username } = useParams();
    const [data, setData] = useState({});
    const [posts, setPosts] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState();
    const [cookies, removeCookie] = useCookies([]);
    const [currentUser, setCurrentUser] = useState("")

    useEffect(() => {
        const verifyCookie = async () => {
            try{
                const { data } = await axios.post(`http://localhost:4444/auth/`, {}, {withCredentials: true});
                const { status, user } = data;
                
                console.log(user)
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
                setData(dataResponse.data);

                const postsResponse = await axios.get(`http://localhost:4444/posts/${username}/posts`);
                setPosts(postsResponse.data.posts);
            }catch(error){
                console.log(error);
            }
        }   
        fetchUserData();
    }, [setData, username])

    return (
    <div className="user-container">
        <Navbar isLogged={isLoggedIn} removeCookie={removeCookie} currentUser={currentUser}/>
        <div className="user-wrapper">
            <div className="user-banner">
                <div className="banner-user-profile">
                    <img src={data.user?.profilePic}/>
                    <h1>{data.user?.username}</h1>
                </div>
                <div className="banner-user-info">
                    <div>
                        <b>Posts: <span>{posts.length}</span></b>
                    </div>
                    <div>
                        <b>Following: <span>{data.user?.following.length}</span></b>
                    </div>
                    <div>
                        <b>Followers: <span>{data.user?.followers.length}</span></b>
                    </div>
                </div>
            </div>
            <div className="user-main">
                <div className="user-contacts"> 
                    <h6>Friends  <p>(10)</p></h6>
                    <div className="contacts">
                        <div className="contact">
                            <img src='https://picsum.photos/300/300'/>
                            <a>Jhon doe</a>
                        </div>
                    </div>

                    <div className="contacts">
                        <div className="contact">
                            <img src='https://picsum.photos/300/300'/>
                            <a>Jhon doe</a>
                        </div>
                    </div>

                    <div className="contacts">
                        <div className="contact">
                            <img src='https://picsum.photos/300/300'/>
                            <a>Jhon doe</a>
                        </div>
                    </div>

                    <div className="contacts">
                        <div className="contact">
                            <img src='https://picsum.photos/300/300'/>
                            <a>Jhon doe</a>
                        </div>
                    </div>
                </div>
                <div className="user-posts">
                    {
                        posts.map((post, index) => (
                            <Post post={post} currentUser={currentUser} setPosts={setPosts} key={index}/>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
    )}

export default User