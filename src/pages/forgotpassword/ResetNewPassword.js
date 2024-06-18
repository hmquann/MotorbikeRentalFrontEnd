import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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

const PasswordResetForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [renewPassword, setRenewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repasswordError, setRepasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { token } = useParams();
  const [showPopup, setShowPopup] = useState(false);

  const validatePassword = (password) => {
    return !(
      password.length < 8 ||
      password.length > 20 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    );
  };

  const handleChangeNewPassWord = (e) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);
    if (!validatePassword(newPasswordValue)) {
      setPasswordError(
        "Password length 8-20 characters and contains upper character and number."
      );
    } else {
      setPasswordError("");
      setNewPassword(newPasswordValue); // Cập nhật giá trị của newPassword
    }
  };

  const handleChangeRenewPassword = (e) => {
    const renewPasswordValue = e.target.value;
    setRenewPassword(renewPasswordValue); // Cập nhật giá trị của renewPassword
    if (renewPasswordValue !== newPassword) {
      setRepasswordError("Password does not match!");
    } else {
      setRepasswordError("");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate("/login"); // Điều hướng đến trang login sau khi đóng modal
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!newPassword.trim()) {
      setError("Password cannot be empty.");
      setLoading(false);
      return;
    }

    if (repasswordError || passwordError) {
      setError("Please correct the errors before submitting.");
      setLoading(false);
      return;
    }

    axios
      .post(
        `http://localhost:8080/password/reset/${token}`,
        {
          password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setShowPopup(true); // Hiển thị popup khi thành công
        setTimeout(() => {
          setShowPopup(false); // Ẩn popup sau 3 giây
          navigate("/login"); //chuyển sang trang login sau khi thông báo
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        setError("An error occurred. Please try again.");
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
            Reset Password
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
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={handleChangeNewPassWord}
            className={inputClasses}
          />
          {passwordError && <div className="text-red-500">{passwordError}</div>}
          <input
            type="password"
            placeholder="Confirm new password"
            onChange={handleChangeRenewPassword}
            value={renewPassword}
            className={inputClasses}
          />
          {repasswordError && (
            <div className="text-red-500">{repasswordError}</div>
          )}
          <button type="submit" className={submitButtonClasses}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </form>
        {showPopup && <Popup message="Password changed successfully!" />}
      </div>
    </div>
  );
};

export default PasswordResetForm;
