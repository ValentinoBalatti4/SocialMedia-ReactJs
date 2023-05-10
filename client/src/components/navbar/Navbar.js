import React, { useState } from 'react'
import "./Navbar.css"

const Navbar = () => {
    const [input, setInput] = useState("")
   


  return (
    <nav>
        <div className="wrapper">
            <div className='logo-container'>
                <a href="/">TalkWire</a>
            </div>
            <div className='search-container'>
                <input value={input} onChange={e => setInput(e.target.value)}/>
                <span className="material-symbols-outlined">search</span>
            </div>
            <div className='options-container'>
                ...
            </div>
        </div>
        {
            input !== "" && (
                <div className="results">
                    <div className="result">
                        <img src="https://picsum.photos/200/300"/>
                        <a>Jhon doe</a>
                    </div>
                                        <div className="result">
                        <img src="https://picsum.photos/200/300"/>
                        <a>Jhon doe</a>
                    </div>
                </div>
            )
        }
    </nav>
  )
}

export default Navbar