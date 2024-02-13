import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import axios from 'axios';

const Sidebar = () => {
  const [hidden, setHidden] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => { 
    const fetchUsers = async () => {
      const res = await axios.get(`http://localhost:4444/users/discover/`,  {withCredentials: true});

      console.log(res);
      setUsers(res.data.users);
    }
    fetchUsers();
  }, [])

  const handleHideButton = () => {
    setHidden(!hidden);
  } 

  return (
    <aside className={`aside-container ${hidden ? 'hidden' : ''}`}>
        <p>Discover new people</p>
        {
          users.map((user, index) => 
            <div className='item' key={index}>
                <div className='userinfo'>
                    <img src={user.profilePic}/>
                    <a href={`/${user.username}`}>{user.username}</a>
                </div>  
            </div>
          )
        }
        <span className='material-symbols-outlined' onClick={handleHideButton}>arrow_forward_ios</span>
    </aside>
  )
}

export default Sidebar