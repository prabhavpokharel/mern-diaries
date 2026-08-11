import React, { useContext } from 'react'
import { MyThemeContext } from '../../context/MyThemeContext'

const Footer = () => {
  let {theme} = useContext(MyThemeContext)
  return (
    <div className={`bg-${theme} mylink-${theme} text-center py-2`}>
        &copy; Copyright 2026 
    </div>
  )
}

export default Footer