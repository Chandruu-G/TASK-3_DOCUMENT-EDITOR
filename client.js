import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["code-block"],
];

const socket = io("http://localhost:4000");

function App() {
  const [editorValue, setEditorValue] = useState("");
  const quillRef = useRef();

  useEffect(() => {
    if (!socket) return;

    socket.on("receive-changes", (delta) => {
      quillRef.current.getEditor().updateContents(delta);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (content, delta, source) => {
    if (source !== "user") return;
    socket.emit("send-changes", delta);
    setEditorValue(content);
  };

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h2>📝 Real-Time Collaborative Editor</h2>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={{ toolbar: TOOLBAR_OPTIONS }}
        placeholder="Start typing..."
        style={{ height: "400px" }}
      />
    </div>
  );
}

export default App;
