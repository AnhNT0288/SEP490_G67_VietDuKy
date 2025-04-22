import React, { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/TextEditor.css";
import { LuUndo2, LuRedo2 } from "react-icons/lu";

const TextEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  // Hàm xử lý Undo
  const handleUndo = () => {
    if (quillRef.current) {
      quillRef.current.getEditor().history.undo();
    }
  };

  // Hàm xử lý Redo
  const handleRedo = () => {
    if (quillRef.current) {
      quillRef.current.getEditor().history.redo();
    }
  };

  return (
    <div className="text-editor w-full bg-white">
      {/* Custom Toolbar */}
      <div id="custom-toolbar">
        <button className="ql-undo" onClick={handleUndo}>
          <LuUndo2 />
        </button>
        <button className="ql-redo" onClick={handleRedo}>
          <LuRedo2 />
        </button>
        <select className="ql-header">
          <option value="1" />
          <option value="2" />
          <option selected />
        </select>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-blockquote" />
        <button className="ql-code-block" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video" />
        <button className="ql-align" />
        <button className="ql-clean" />
      </div>

      {/* Quill Editor */}
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={{
          toolbar: {
            container: "#custom-toolbar",
          },
        }}
        placeholder="Nhập nội dung bài viết của bạn..."
        theme="snow"
      />
    </div>
  );
};

export default TextEditor;
