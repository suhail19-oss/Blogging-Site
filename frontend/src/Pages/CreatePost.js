import React, { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");

  async function createNewPost(ev) {
    ev.preventDefault();

    if (!title || !summary || !content) {
      return setError("Title, summary, and content are required.");
    }

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (files && files.length > 0) {
      data.set("file", files[0]);
    }

    try {
      const response = await fetch("http://localhost:4000/post", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post.");
      }

      setRedirect(true);
    } catch (err) {
      setError(err.message);
      console.error("Error creating post:", err);
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
        required
      />
      <input 
        type="file" 
        onChange={(ev) => setFiles(ev.target.files)} 
        accept="image/*"
      />

      <Editor value={content} onChange={setContent} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button style={{ marginTop: "5px" }}>Create the Post</button>
    </form>
  );
}
