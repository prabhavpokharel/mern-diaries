import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
        <Header/>
        <div className="min-h-[80vh]">
            <Outlet/>
        </div>
        <Footer/>
    </>
  )
}

export default Layout