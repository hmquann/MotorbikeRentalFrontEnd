import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import PopUpDelete from "./PopUpDelete"; // Adjust the import path as necessary
import axios from "axios";
import PopUpSuccess from "./PopUpSuccess";
import BlogUpdating from "./BlogUpdating"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom"; // Ensure this import is correct
import apiClient from "../../axiosConfig";

const BlogCard = ({ blog, onUpdate }) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const openEditBlog = () => {
    setShowUpdatePopup(true);
  };

  const deleteBlog = () => {
    apiClient
      .delete(`/api/blogs/deleteBlog/${blog.id}`)
      .then((response) => {
        setSuccessMessage("This blog deleted successfully!");
        setShowDeletePopup(false);
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false); // Hide popup after 3 seconds
          window.location.reload(); // Reload the page
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        setShowDeletePopup(false);
      });
    console.log("Delete Blog:", blog);
  };

  const extractFirstImage = (content) => {
    const imgTagMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgTagMatch ? imgTagMatch[1] : null;
  };

  const firstImage = extractFirstImage(blog.content);

  const handleUpdateSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
    setShowUpdatePopup(false);
  };

  const goToBlogDetail = () => {
    navigate(`/blog/${blog.id}`);
  };

  return (
    <div
      className="bg-card p-4 rounded-lg mb-4 border border-gray-300"
      style={{ backgroundColor: "white" }}
    >
      <div
        className="flex justify-between items-center mb-2"
        style={{ justifyContent: "end" }}
      >
        <span>{dayjs(blog.createdAt).format("HH:mm, DD/MM/YYYY")}</span>
      </div>
      <div className="flex">
        {firstImage && (
          <img
            src={firstImage}
            alt="Blog"
            className="w-1/3 object-cover mr-4 cursor-pointer"
            onClick={goToBlogDetail}
            style={{ cursor: "pointer" }}
          />
        )}
        <div className="flex-1">
          <h2
            className="text-xl font-bold mb-2 cursor-pointer"
            onClick={goToBlogDetail}
            style={{ cursor: "pointer", color: "gray" }}
          >
            {blog.title}
          </h2>
          <div
            className="mb-4 cursor-pointer"
            onClick={goToBlogDetail}
            style={{ cursor: "pointer" }}
            dangerouslySetInnerHTML={{
              __html:
                blog.content.length > 240
                  ? `${blog.content.substring(0, 240)}...`
                  : blog.content,
            }}
          />
        </div>
        <div className="flex flex-col justify-center ml-4 space-y-2">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            onClick={openEditBlog}
          >
            <FontAwesomeIcon icon={faEdit} />
            &nbsp;Edit
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
            onClick={() => setShowDeletePopup(true)}
          >
            <FontAwesomeIcon icon={faTrash} />
            &nbsp;Delete
          </button>
        </div>
      </div>
      {showDeletePopup && (
        <PopUpDelete
          onDelete={deleteBlog}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}
      {showSuccessPopup && <PopUpSuccess message={successMessage} />}
      {showUpdatePopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <button
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300"
              onClick={() => setShowUpdatePopup(false)}
            >
              Close
            </button>
            <BlogUpdating
              blog={blog}
              onUpdate={onUpdate}
              onSuccess={handleUpdateSuccess}
              onClose={() => setShowUpdatePopup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
