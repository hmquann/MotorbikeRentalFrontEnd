import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../axiosConfig";
import PopupSuccess from "./PopUpSuccess";


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
        "Mât khẩu phải chứa từ 8-20 kí tự bao gồm cả chữ số và chữ in hoa"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleChangeRenewPassword = (e) => {
    const renewPasswordValue = e.target.value;
    setRenewPassword(renewPasswordValue);
    if (renewPasswordValue !== newPassword) {
      setRepasswordError("Mật khẩu không trùng khớp");
    } else {
      setRepasswordError("");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate("/homepage");
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

    apiClient
      .post(
        `/password/reset/${token}`,
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
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/homepage");
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        setError("An error occurred. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!isOpen) return null;

  return (
    <>
    {showPopup ? (
      <PopupSuccess
        show={showPopup}
        onHide={() => {
          setShowPopup(false);
          handleClose();
        }}
        message="Mật khẩu của bạn đã được đặt lại"
      />
    ) : (
      <>
    <div className="flex justify-center mt-20 font-manrope">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-800 text-center text-2xl font-bold">
            Đặt lại mật khẩu
          </h2>
          <button
            onClick={handleClose}
            className="text-zinc-400 text-3xl mb-2 dark:text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-500"
          >
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 lg:mt-5 md:space-y-5">
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Mật khẩu mới
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={newPassword}
              onChange={handleChangeNewPassWord}
              className= "w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
              required
            />
            {passwordError && <div className="text-red-500">{passwordError}</div>}
          </div>
          <div>
            <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Xác nhận lại mật khẩu
            </label>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              value={renewPassword}
              onChange={handleChangeRenewPassword}
              className= "w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
              required
            />
            {repasswordError && <div className="text-red-500">{repasswordError}</div>}
          </div>
          <button
            type="submit"
           className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none"
          >
            {loading ? "Đang xác nhận..." : "Đổi mật khẩu"}
          </button>
          {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        </form>
      </div>
    </div>
    </>
    )}
    </>
  );
};

export default PasswordResetForm;
