import React from "react";
import { useDispatch, useSelector } from "react-redux";

const CounterRedux = () => {
  const count = useSelector((store) => store.count);

  const dispatch = useDispatch();

  const increaseCount = () => {
    dispatch({ type: "INCREASE_COUNT" });
  };

  return (
    <div className="flex h-[80vh] justify-center items-center flex-col">
      <h2>Count: {count}</h2>
      <div className="btn-group">
        <button
          className="btn btn-warning"
          onClick={() => dispatch({ type: "DECREASE_COUNT" })}
        >
          -
        </button>
        <button
          className="btn btn-danger"
          onClick={() => dispatch({ type: "RESET_COUNT" })}
        >
          RESET
        </button>
        <button className="btn btn-success" onClick={increaseCount}>
          +
        </button>
      </div>
    </div>
  );
};

export default CounterRedux;
