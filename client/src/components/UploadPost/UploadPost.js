import React, { useState } from 'react'
import Error from '../Error/Error'
import "./UploadPost.css"
import axios from 'axios'

const UploadPost = ({ setPosts }) => {
  const [postText, setPostText] = useState("")
  const [image, setImage] = useState("")
  const [error, setError] = useState("")

  const [imageUrl, setImageUrl] = useState(''); // State for image preview URL

  const selectImage = (e) => {
    setImage(e.target.files[0])

    // Create a URL for the selected image and set it in the state
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    setImageUrl(imageUrl);
  }

  const uploadPost = async (e) => {
    e.preventDefault()
    if(postText !== "" || image !== ""){
      try{
        const formData = new FormData()
        formData.append('text', postText)
        formData.append('image', image)
        const res = await axios.post('http://localhost:4444/posts/upload', formData, {withCredentials: true})

        setPostText("");
        setImage("");

        setPosts((prevPosts) => [res.data.newPost, ...prevPosts]);        
      }catch (e){
        setError(e.message);
        console.log(e);
      }
    } else{
      setError("Input something...");
    }
  }

  const handleCancelImgUpload = () => {
    setImage("");
    setImageUrl("");
  }

  return (
    <form className='upload-post' onSubmit={uploadPost}>
        <textarea placeholder="Share what you 're thinking..." value={postText} onChange={e => setPostText(e.target.value)}/>
        {
          (image) && (
            <div className='image-preview'>
              <span className='material-symbols-outlined' onClick={handleCancelImgUpload}>close</span>
              <img src={imageUrl} alt='image-preview'/>
            </div>
          )
        }
        <div className="upload-options">
            <div>
                <input className='submit-btn' type='submit' value='Upload'/>
            </div>
            { error && <Error message={error} clearError={() => setError(undefined)}/> }
            <div className='upload-options-extra'>
                <div>
                  <label htmlFor="image-input" >
                    <span className="material-symbols-outlined">image</span>
                  </label>
                  <input
                    id='image-input'
                    type='file'
                    accept='image/*'
                    onChange={selectImage}
                    style={{display: 'none'}}
                  />
                </div>
                <div>
                  <span className="material-symbols-outlined">mood</span>
                </div>
            </div>
        </div>
    </form>
  )
}

export default UploadPost