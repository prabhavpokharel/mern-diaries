import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Person = () => {
  // let { name, age } = useSelector(store => store)

  // OR
  let personStore = useSelector((store) => store.personStore);
  let { name, age } = personStore;

  // OR
  // let name = useSelector(store => store.name)
  // let age = useSelector(store => store.age)

    let [nameValue, setName] = useState('')
    let [ageValue, setAge] = useState(0)

    const dispatch = useDispatch()

  return (
    <div>
      <div className="d-flex my-3">
        <h2>Name: {name}</h2>
        <input
          type="text"
          placeholder="Enter name to update"
          className="form-control w-50 ms-5" onChange={e => setName(e.target.value)}
        />
        <button className="btn btn-info" onClick={() => dispatch({ type: 'UPDATE_NAME', payload: nameValue })}>Update Name</button>
      </div>

      <div className="d-flex my-3">
        <h2>Age: {age}</h2>
        <input
          type="text"
          placeholder="Enter name to update"
          className="form-control w-50 ms-5" onChange={e => setAge(e.target.value)}
        />
        <button className="btn btn-info" onClick={() => dispatch({type: 'UPDATE_AGE', payload: ageValue})}>Update Age</button>
      </div>
    </div>
  );
};

export default Person;
