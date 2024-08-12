import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import UploadAdapter from "./UploadAdapter";
import styled from "styled-components";
import apiClient from "../../axiosConfig";

const BlogUpdatingWrapper = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative; /* Added for positioning the close button */
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

const BlogUpdating = ({ blog, onUpdate, onClose, onSuccess }) => {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
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

  const handleUpdate = async () => {
    // Validate form
    if (!validateForm()) {
      return; // If there are validation errors, do not proceed
    }

    const updatedBlogData = { title, content, userId };

    try {
      const response = await apiClient.put(
        `/api/blogs/updateBlog/${blog.id}`,
        updatedBlogData
      );
      console.log("Blog updated:", response.data);
      onUpdate(); // Callback to refresh blog list
      onSuccess("Bạn đã cập nhật blog thành công"); // Callback to show success message
      // Reset form after updating
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error updating blog:", error);
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
    <BlogUpdatingWrapper>
      <TitleInput
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (e.target.value.trim()) {
            setTitleError("");
          }
        }}
        placeholder="Title"
      />
      {titleError && <ErrorText>{titleError}</ErrorText>}
      <EditorWrapper>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          data={content}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
            if (/<img[^>]*src=[^>]+>/i.test(data)) {
              setContentError("");
            }
          }}
        />
      </EditorWrapper>
      {contentError && <ErrorText>{contentError}</ErrorText>}
      <SaveButton onClick={handleUpdate}>Cập nhật</SaveButton>
    </BlogUpdatingWrapper>
  );
};

export default BlogUpdating;
