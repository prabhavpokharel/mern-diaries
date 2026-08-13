import React, { useState } from "react";
import Loading from "../components/Loading";

const ImageGenerate = () => {
  let [prompt, setPrompt] = useState("");
  let [output, setOutput] = useState(null);

  let [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const url = "https://chatgpt-42.p.rapidapi.com/texttoimage";
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: { prompt },
        width: 512,
        height: 512,
      }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => setOutput(data.generated_image))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // try {
    //     const response = await fetch(url, options);
    //     const result = await response.text();
    //     console.log(result);
    // } catch (error) {
    //     console.error(error);
    // }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="my-10">
      <input
        type="text"
        className="form-control"
        placeholder="Enter your text here to generate image."
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="btn-primary btn-sm form-control h-[5vh] text-white mt-2"
        onClick={handleSubmit}
      >
        Generate
      </button>

    {output && <img src={output} alt="" className="w-full" />}
    </div>
  );
};

export default ImageGenerate;
