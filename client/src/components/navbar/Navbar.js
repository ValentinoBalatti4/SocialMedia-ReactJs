import React from 'react'
import "./Navbar.css"

const Navbar = () => {
  return (
    <nav>
        <div className="wrapper">
            <div className='logo-container'>
                <h2>TalkWire</h2>
            </div>
            <div className='search-container'>
                <input/>
                <span class="material-symbols-outlined">search</span>
            </div>
            <div className='options-container'>
                ...
            </div>
        </div>
    </nav>
  )
}

export default Navbar