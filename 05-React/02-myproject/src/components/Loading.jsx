import React from "react";

const Loading = () => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center text-3xl opacity-80 bg-blue-300">
      <div
        className="spinner-border"
        style={{width: "6rem", height: "6rem"}}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
