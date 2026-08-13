import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DataFetch = () => {
  let [posts, setPosts] = useState([]);
  let [length, setLength] = useState(20);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.slice(0, length)));
  }, [length]);
  return (
    <div className="p-5 shadow-lg">
      {posts.map((post, i) => {
        return (
          <div key={i}>
            <h3>
              <Link to={`/post/${post.id}`}>
                {post.id}. {post.title}
              </Link>
            </h3>
          </div>
        );
      })}
      {length < 100 ? (
        <>
          <p>All data loaded.</p>
          <button
            className="btn btn-primary"
            onClick={() => setLength(length + 20)}
          >
            Show More
          </button>
        </>
      ) : (
        <button className="btn btn-primary" disabled>
          Show More
        </button>
      )}
      {length > 20 ? (
        <button
          className="btn btn-danger"
          onClick={() => setLength(length - 20)}
        >
          Show Less
        </button>
      ) : (
        <button className="btn btn-danger" disabled>
          Show Less
        </button>
      )}
    </div>
  );
};

export default DataFetch;
