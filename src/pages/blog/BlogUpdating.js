import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import UploadAdapter from "./UploadAdapter";
import styled from "styled-components";

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

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e53e3e;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #c53030;
  }
`;

const BlogUpdating = ({ blog, onUpdate, onClose, onSuccess }) => {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const userId = userData.userId;

  const handleUpdate = async () => {
    const updatedBlogData = { title, content, userId };

    try {
      const response = await axios.put(
        `https://rentalmotorbikewebapp.azurewebsites.net/api/blogs/updateBlog/${blog.id}`,
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
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <EditorWrapper>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          data={content}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
        />
      </EditorWrapper>
      <SaveButton onClick={handleUpdate}>Update Blog</SaveButton>
    </BlogUpdatingWrapper>
  );
};

export default BlogUpdating;
