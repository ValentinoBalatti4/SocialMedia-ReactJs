import React from 'react'
import "./Error.css"

const Error = (props) => {
  return (
    <div className="error-notice">
        <span>{props.message}</span>
        <button onClick={props.clearError}>x</button>
    </div>
  )
}

export default Error