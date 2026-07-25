import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Counter from './pages/Counter'

const MyRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>

                    <Route path='/' element={<Home />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/services' element={<Services />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path='/login' element={<Login/>}/>

                    <Route path='/counter' element={<Counter/>}/>

                    <Route path='*' element={<NotFound />} />

                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default MyRoutes