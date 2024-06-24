import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "./PopupMessage";

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

const UpdatePassword = ({ onClose, isOpen }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [renewPassword, setRenewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [repasswordError, setRepasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");

  const handleClose = () => {
    onClose();
  };
  const validatePassword = (password) => {
    return !(
      password.length < 8 ||
      password.length > 20 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    );
  };

  const handleChangeOldPassWord = (e) => {
    setOldPasswordError("");
    setError("");
    const oldPasswordValue = e.target.value;
    setOldPassword(oldPasswordValue);
    if (!validatePassword(oldPasswordValue)) {
      setOldPasswordError(
        "Password length 8-20 characters and contains upper character and number."
      );
    } else {
      setOldPasswordError("");
      setOldPassword(oldPasswordValue); // Cập nhật giá trị của newPassword
    }
  };

  const handleChangeNewPassWord = (e) => {
    if (newPassword !== renewPassword) {
      setRepasswordError("Password does not match");
    }
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

  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const token = userData.token;
  const handleSubmit = (e) => {
    if (renewPassword !== newPassword) {
      setError("Password should not be empty!");
      return;
    }
    if (!newPassword || newPassword.trim() === "") {
      setError("Password should not be empty!");
      return;
    }
    console.log(333333);
    e.preventDefault();
    setLoading(true);

    axios
      .post(
        "http://localhost:8080/password/change",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          token: token,
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
          localStorage.clear();
        }, 3000);
        // Xử lý phản hồi thành công
      })
      .catch((error) => {
        console.error(error);
        setOldPasswordError(error.response.data);
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
            Change Password
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
          <label>Enter old password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={handleChangeOldPassWord}
            className={inputClasses}
          />
          {oldPasswordError && (
            <div className="text-red-500">{oldPasswordError}</div>
          )}
          <label>Enter new password</label>
          <input
            type="password"
            value={newPassword}
            onChange={handleChangeNewPassWord}
            className={inputClasses}
          />
          {passwordError && <div className="text-red-500">{passwordError}</div>}
          <label>Enter renew password</label>
          <input
            type="password"
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
        {showPopup && (
          <Popup message="Your request sent successfully! Please check your email!" />
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;
