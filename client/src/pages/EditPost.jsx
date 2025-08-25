import React from 'react'
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router";


const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["link", "image", "video"],
    [{ color: [] }, { background: [] }],
  ],
  clipboard: {
    matchVisual: false,
  },
};

export const EditPost = () => {
  const { id } = useParams();
  const { quill, quillRef } = useQuill({ modules });
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [cover, setcover] = useState(null);
  const [redirect, setRedirect] = useState(false);

  // track quill changes
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setContent(quill.root.innerHTML);
      });
    }
  }, [quill]);

  // fetch post
  useEffect(() => {
    fetch("/api/post/" + id)
      .then((res) => res.json())
      .then((postInfo) => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
        setcover(postInfo.cover);

        if (quill) {
          quill.clipboard.dangerouslyPasteHTML(postInfo.content || "");
        }
      })
      .catch((err) => console.error("Failed to fetch post:", err));
  }, [id, quill]);

  // update post
  const updatePost = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.set("id", id);
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (file) {
      data.set("file", file);
    }

    const response = await fetch("/api/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  };

  // redirect only once
  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form onSubmit={updatePost} className="p-4">

      <h1 className="text-xl font-bold mb-4">Create Post</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block border p-2 w-full mb-2"
      />

      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className="block border p-2 w-full mb-2"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block mb-2"
      />

      {/* Quill Editor */}
      <div
        ref={quillRef}
        style={{ height: "200px", background: "#fff" }}
        className="mb-4"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update Post
      </button>
    </form>
  );
}
