import React from 'react'
import "./Sidebar.css"

const Sidebar = () => {
  return (
    <aside className='aside-container'>
        <div className='item'>
            <div className='userinfo'>
                <img src='https://picsum.photos/200/300'/>
                <a>Jhon doe</a>
            </div>  
        </div>
    </aside>
  )
}

export default Sidebar