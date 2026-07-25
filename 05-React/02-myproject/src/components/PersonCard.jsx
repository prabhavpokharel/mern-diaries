import React from 'react'

const PersonCard = ({name = 'N/A', age = 'N/A', phone = 'N/A'}) => {
    // destructuring the onject
//   const { name, age, phone } = props;
  return (
    <div className='w-60 p-5 shadow rounded'>
        {/* Name: {props.name} <br/>
        Age: {props.age} <br/>
        Phone: {props.phone} */}

        {/* Alternative Way of writing it */}
        Name: {name} <br/>
        Age: {age} <br/>
        Phone: {phone}
    </div>
  )
}

export default PersonCard