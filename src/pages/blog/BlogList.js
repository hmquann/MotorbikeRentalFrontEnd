import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";
import BlogEditor from "./BlogEditor";
import { useNavigate } from "react-router-dom"; // Adjust the import path as necessary
import PopUpSuccess from "./PopUpSuccess";
import apiClient from "../../axiosConfig";


const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await apiClient.get(
        "/api/blogs/getAllBlogs"
      );
      const sortedBlogs = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (showCreateBlog) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [showCreateBlog]);

  const handleSave = () => {
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      window.location.reload();
    }, 3000);
    setShowCreateBlog(false); // Close the blog editor modal
  };

  return (
    <div className="max-w-5xl mx-auto p-4 font-manrope">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          onClick={() => setShowCreateBlog(true)}
        >
          + Tạo Blog
        </button>
      </div>
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} onUpdate={fetchBlogs} />
      ))}
      {showCreateBlog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <button
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300"
              onClick={() => setShowCreateBlog(false)}
            >
              Đóng
            </button>
            <BlogEditor onSave={handleSave} />
          </div>
        </div>
      )}
      {showSuccessPopup && (
        <PopUpSuccess message="Bạn đã tạo thành công blog mới" />
      )}
    </div>
  );
};

export default BlogList;
