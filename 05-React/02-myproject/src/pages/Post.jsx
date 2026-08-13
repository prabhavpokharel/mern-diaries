import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ImageGenerate from "./ImageGenerate";

const Post = () => {
  const params = useParams();
  const id = params.id;

  // OR
  // const {id} = useParams()

  let [post, setPost] = useState({});
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="w-1/2 p-5 mx-auto my-5 shadow-lg">
      <h2>Post ID : {id}</h2>
      <h2>Title : {post.title}</h2>
      <h3>{post.body}</h3>
      <ImageGenerate/>
    </div>
  );
};

export default Post;
