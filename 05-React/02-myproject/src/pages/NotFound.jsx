import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='flex flex-col justify-center items-center h-[80vh] text-2xl text-center'>
            <h1>404 - PAGE NOT FOUND</h1>
            <Link to='/' className='block mt-4 text-blue-500 hover:underline'>Go Home</Link>
        </div>
    )
}

export default NotFound