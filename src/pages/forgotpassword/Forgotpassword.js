import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "./PopUpSuccess";

const modalOverlayClasses =
  "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50";
const modalContentClasses =
  "bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 w-80";
const buttonClasses =
  "text-zinc-500 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-100";
const inputClasses =
  "w-full p-2 mb-4 bg-zinc-200 rounded-lg light:bg-zinc-700 dark:text-zinc-200-dark";
const submitButtonClasses =
  "w-full p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600";

const Forgotpassword = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    navigate("/login"); // Điều hướng đến trang chủ hoặc trang bạn muốn sau khi đóng modal
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (e) => {
    if (!email.trim()) {
      setError("Email cannot be empty.");
      setLoading(false);
      return;
    }
    e.preventDefault();
    setLoading(true);

    axios
      .post("http://localhost:8080/password/forgot", null, {
        params: { email: email },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setShowPopup(true); // Hiển thị popup khi thành công
        setTimeout(() => {
          setShowPopup(false); // Ẩn popup sau 3 giây
          navigate("/login"); //chuyển sang trang login sau khi thông báo
        }, 3000);
        // Xử lý phản hồi thành công
      })
      .catch((error) => {
        console.error(error);
        setError(error.response.data);
        // Xử lý lỗi
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!isOpen) return null;
  return (
    <div className={modalOverlayClasses}>
      <div className={modalContentClasses}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100-dark">
            Forgotten Password
          </h2>
          <button
            onClick={handleClose}
            className={`text-zinc-400 dark:text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-500 ${buttonClasses}`}
          >
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            onChange={handleChange}
            placeholder="Enter your email"
            className={inputClasses}
          />

          <button type="submit" className={submitButtonClasses}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </form>
        {showPopup && (
          <Popup message="Your request sent successfully! Please check your email!" />
        )}
      </div>
    </div>
  );
};

export default Forgotpassword;
