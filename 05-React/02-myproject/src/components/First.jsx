import React from 'react'

const First = () => {
  return (
    <div>
        {/* <h1 className="h1" style={{color: 'red', backgroundColor: "yellow"}}>First</h1> */}

        <h1 className='text-red-700 bg-slate-300 text-sm p-7 hover:bg-slate-200 active:text-red-300 md:text-2xl xl:text-3xl xxl:text-4xl md:bg-red-300'>First</h1>
        <button className='btn btn-primary'>Click Me</button>
        <button className='btn btn-success'>Click Me</button>
    </div>
  )
}

export default First