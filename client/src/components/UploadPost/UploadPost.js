import React, { useState } from 'react'
import Error from '../Error/Error'
import "./UploadPost.css"

import axios from 'axios'

const UploadPost = () => {
  const [postText, setPostText] = useState("")

  const [error, setError] = useState("")

  const uploadPost = async (e) => {
    e.preventDefault()
    if(postText !== ""){
      
      try{
        const res = await axios.post('http://localhost:4444/upload')
        console.log(res.data)
      }catch (e){
        setError(e.message)
        console.log(e)
      }
    } else{
      setError("Input something...")
    }
  }



  return (
    <form className='upload-post'  onSubmit={uploadPost}>
        <textarea placeholder="Share what you 're thinking..." value={postText} onChange={e => setPostText(e.target.value)}/>
        <div className="upload-options">
            <div>
                <input className='submit-btn' type='submit' value='Upload'/>
            </div>
            { error && <Error message={error} clearError={() => setError(undefined)}/> }
            <div className='upload-options-extra'>
                <div><span className="material-symbols-outlined">image</span></div>
                <div><span className="material-symbols-outlined">mood</span></div>
            </div>
        </div>
    </form>
  )
}

export default UploadPost