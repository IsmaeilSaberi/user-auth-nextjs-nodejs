"use client";
import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
const parser = new DOMParser();

const RichTextEditor = ({ dValue, setLongDesc }) => {
  const editor = useRef(null);
  const htmlContent = parser.parseFromString(dValue ? dValue : "", "text/html")
    .body.textContent;
  const [content, setContent] = useState(htmlContent);

  return (
    <JoditEditor
      ref={editor}
      value={content}
      tabIndex={1} // tabIndex of textarea
      onBlur={(newContent) => {
        setContent(newContent);
        setLongDesc(newContent);
      }} // preferred to use only this option to update the content for performance reasons
    />
  );
};

export default RichTextEditor;
