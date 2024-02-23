import React, { useEffect, useRef, useState } from 'react'
import "./Navbar.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Navbar = ({ isLogged, removeCookie, currentUser }) => {
    const [input, setInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
   
    useEffect(() => {
        const fetchSearchResults = async () => {
            try{
                if(input.trim() !== ""){
                    const res = await axios.get(`http://localhost:4444/users/search?query=${input}`);
                    setSearchResults(res.data.users);
                }else{
                    setSearchResults([]);
                }
            }catch(error){
                console.log(error);
            }
        }
        fetchSearchResults();
    }, [input]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && showOptions && !dropdownRef.current.contains(event.target)) {
                setShowOptions(false);
                console.log('clicked outside')
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const toggleShowOptions = () => {
        setShowOptions(!showOptions);
    }

    const toggleShowSearchBar = () => {
        setShowSearchBar(!showSearchBar);
        if(showSearchBar){setInput("")}
    }

    const logout = () => {
        removeCookie("token");
        navigate("/login");
    };

  return (
    <nav>
        <div className="wrapper">
            <div className='logo-container'>
                <a href="/">TalkWire</a>
            </div>
            <div className={`search-container ${showSearchBar && 'active'}`}>
                <input value={input} onChange={e => setInput(e.target.value)}/>
                <span className="material-symbols-outlined">search</span>
            </div>
            <div className='search-container-btn'>
                <span className="material-symbols-outlined" onClick={e => toggleShowSearchBar()}>{showSearchBar ? 'close' : 'search'}</span>
            </div>
            <div className='options-hamburger-btn'>
                <span className="material-symbols-outlined" onClick={e => toggleShowOptions()}>{showOptions ? 'close' : 'menu'}</span>
            </div>
            <div className={`options-container ${showOptions && 'active'}`} ref={dropdownRef}>
                {isLogged ? (
                    <div>
                        <a href={`/${currentUser}`}>My profile</a>
                    </div>
                )
                    : <></>
                }
                <div>
                    {
                        isLogged ? <a onClick={(e) => logout()}>Log out</a> : <a href='/login'>Log in</a>
                    }
                </div>
            </div>
        </div>
        {
            input !== "" && (
                <div className="results">
                    {
                        searchResults.map((result) => (
                            <div className="result" key={result._id}>
                                <img src={result.profilePic} />
                                <a href={`/${result.username}`}>{result.username}</a>
                          </div>
                        ))
                    }
                </div>
            )
        }
    </nav>
  )
}

export default Navbar