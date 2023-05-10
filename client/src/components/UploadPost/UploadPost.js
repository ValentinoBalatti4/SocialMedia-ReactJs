import React from 'react'
import "./UploadPost.css"

const UploadPost = () => {
  return (
    <div className='upload-post'>
        <textarea placeholder="Share what you 're thinking..." />
        <div className="upload-options">
            <div>
                <input className='submit-btn' type='submit' value='Upload'/>
            </div>
            <div className='upload-options-extra'>
                <div><span className="material-symbols-outlined">image</span></div>
                <div><span className="material-symbols-outlined">mood</span></div>
            </div>
        </div>
    </div>
  )
}

export default UploadPost