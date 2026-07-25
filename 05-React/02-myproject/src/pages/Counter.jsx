import React, { useState } from 'react'

const Counter = () => {
    let [count, setCount] = useState(0)
    let [data, setData] = useState(1000)

    const increase = () => {
        setCount(++count)
        console.log(count)
    }
  return (
    <div className='flex h-[80vh] justify-center items-center text-3xl flex-column'>
        Counter Value = {count}
        <div className="btn-group">
            {
                count <20 &&
                <button className="btn btn-success" onClick={increase}>+</button>
            }
            {
                count == 0 ? <button className='btn btn-success disabled'>RESET</button>:<button className="btn btn-danger" onClick={() => setCount(0)}>RESET</button>
            }
            {
                count > 0 &&
                <button className="btn btn-info" onClick={() => setCount(--count)}>-</button>
            }
        </div>

        Data: {data}
        <div className='btn-group'>
            <button className='btn btn-primary' onClick={() => setData(data+10)}>Increase Data</button>
            <button className='btn btn-success' onClick={() => setData(1000)}>Reset Data</button>
            <button className='btn btn-danger' onClick={() => setData(data-10)}>Decrese Data</button>
        </div>
    </div>
  )
}

export default Counter