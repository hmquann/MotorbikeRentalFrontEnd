import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import UploadAdapter from "./UploadAdapter";
import styled from "styled-components";
import apiClient from "../../axiosConfig";

const BlogEditorWrapper = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const TitleInput = styled.input`
  width: 100%;
  margin-bottom: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1.125rem;
`;

const EditorWrapper = styled.div`
  margin-bottom: 16px;
  height: 256px;
  overflow-y: auto;
  .ck-editor__editable_inline {
    height: 100% !important;
    overflow-y: auto;
  }
`;

const SaveButton = styled.button`
  background-color: #38a169;
  color: white;
  padding: 10px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2f855a;
  }
`;

const ErrorText = styled.p`
  color: red;
  margin: 8px 0;
`;

const BlogEditor = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const userId = userData.userId;

  const validateForm = () => {
    let hasError = false;

    // Reset errors
    setTitleError("");
    setContentError("");

    // Validate title
    if (!title.trim()) {
      setTitleError("Bạn phải nhập đầy đủ các thông tin.");
      hasError = true;
    }

    // Validate content
    if (!/<img[^>]*src=[^>]+>/i.test(content)) {
      setContentError("Phần nội dung Blog phải có ít nhất 1 ảnh.");
      hasError = true;
    }

    return !hasError; // Return true if no errors
  };

  const handleSave = async () => {
    // Validate form
    if (!validateForm()) {
      return; // If there are validation errors, do not proceed
    }

    const blogData = { title, content, userId };

    try {
      const response = await apiClient.post(
        "/api/blogs/createBlog",
        blogData
      );
      console.log("Blog saved:", response.data);
      onSave(); // Callback to refresh blog list and show success popup
      // Reset form after saving
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.trim()) {
      setTitleError("");
    }
  };

  const handleContentChange = (event, editor) => {
    const newContent = editor.getData();
    setContent(newContent);
    if (/<img[^>]*src=[^>]+>/i.test(newContent)) {
      setContentError("");
    }
  };

  const editorConfiguration = {
    extraPlugins: [MyCustomUploadAdapterPlugin],
  };

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new UploadAdapter(loader);
    };
  }

  return (
    <BlogEditorWrapper>
      <TitleInput
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Tiêu đề"
      />
      {titleError && <ErrorText>{titleError}</ErrorText>}
      <EditorWrapper>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          data={content}
          onChange={handleContentChange}
        />
      </EditorWrapper>
      {contentError && <ErrorText>{contentError}</ErrorText>}
      <SaveButton onClick={handleSave}>Lưu Blogs</SaveButton>
    </BlogEditorWrapper>
  );
};

export default BlogEditor;
