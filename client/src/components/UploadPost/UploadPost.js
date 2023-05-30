import React, { useState } from 'react'
import Error from '../Error/Error'
import "./UploadPost.css"
import axios from 'axios'

const UploadPost = () => {
  const [postText, setPostText] = useState("")
  const [image, setImage] = useState("")

  const [error, setError] = useState("")

  const selectImage = (e) => {
    setImage(e.target.files[0])
  }

  const uploadPost = async (e) => {
    e.preventDefault()
    if(postText !== "" || image !== ""){
      
      try{

        const formData = new FormData()
        formData.append('text', postText)
        formData.append('image', image)
        const res = await axios.post('http://localhost:4444/posts/upload', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setPostText("")
        setImage("")
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
                <div>
                  <label htmlFor="image-input">
                    <span className="material-symbols-outlined">image</span>
                  </label>
                  <input
                    id='image-input'
                    type='file'
                    accept='image/*'
                    onChange={selectImage}
                  />
                </div>
                <div><span className="material-symbols-outlined">mood</span></div>
            </div>
        </div>
    </form>
  )
}

export default UploadPost