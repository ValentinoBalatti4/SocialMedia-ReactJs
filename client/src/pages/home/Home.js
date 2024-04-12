import React, { useEffect, useState } from 'react'
import "./Home.css"
import Navbar from '../../components/navbar/Navbar'
import Post from '../../components/posts/Post'
import Sidebar from '../../components/sidebar/Sidebar'
import UploadPost from '../../components/UploadPost/UploadPost'
import CommentsSection from "../../components/commentsSection/CommentsSection"
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/loader/Loader'

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");

  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(0);

  const [showPostsComments, setShowPostsComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostComments, setSelectedPostComments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

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

  const handleError = (err) => {
    toast.error(err, {
      position: "bottom-left",
    });
  }

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      try {
        const { data } = await axios.post(
          "http://localhost:4444/auth/",
          {},
          { withCredentials: true }
        );
        const { status, user } = data;
        if (status) {
          setIsLoggedIn(1);
          setUsername(user);
          toast(`Hello ${user}`, {
            position: "bottom-left",
          });
        } else {
          removeCookie("token");
          navigate("/login");
        }
      } catch (e) {
        console.log(e);
      }finally{
        setIsLoading(false);
      }
    };
  
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  
  useEffect(() => {
    const getPosts = async () => {
      try{
        const BASE_URL = "http://localhost:4444"
        const res = await axios.get(`${BASE_URL}/posts/`)
        setPosts(res.data.posts)

      } catch(e){
        console.log(e)
      }
    }
    getPosts()
  }, [setPosts]) 

  const showComments = async (post) => {
      setSelectedPost(post);
      setSelectedPostComments(post.comments);
      setShowPostsComments(true);
  }

  return (
    <div className={`container ${showPostsComments && 'blur-background'}`}>
        <Navbar isLogged={isLoggedIn} removeCookie={removeCookie} currentUser={username}/>
        <div className='home-wrapper'>
          <Sidebar/>
          <div className='center'>
            {
              isLoggedIn && <UploadPost setPosts={setPosts}/>
            }
            {
              !isLoading ?
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
                      currentUser={username}
                      setPosts={setPosts}
                      showComments={() => showComments(post)} 
                      getTimeElapsed={getTimeElapsed}
                      key={index}/>
                  ))
                )
                :
                <Loader/>
            }
          </div>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default Home