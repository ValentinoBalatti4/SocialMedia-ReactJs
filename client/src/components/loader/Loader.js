import React from 'react'
import './Loader.css';

function Loader({ context }) {
  return (
    <div className={`loader-container ${context === 'particular' && ('particular')}`}>
      <div id="loading"></div>
    </div>
  )
}

export default Loader