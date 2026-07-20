import React from 'react'

const MyButton = ({btnClass, text, color}) => {
  return (
    <button className={btnClass} style={{backgroundColor: color}}>{text}</button>
  )
}

export default MyButton