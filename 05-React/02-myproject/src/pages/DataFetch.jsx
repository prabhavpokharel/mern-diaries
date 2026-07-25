import React, { useEffect, useState } from "react";

const DataFetch = () => {
  let [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);
  return (
    <div>
      {posts.map((post) => {
        return (
          <div className="p-5 shadow-lg" key={post.id}>
            <h3>{post.title}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default DataFetch;
