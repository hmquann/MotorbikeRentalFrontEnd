import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "./PopUpSuccess";
import { Modal } from "react-bootstrap";
import PopupSuccess from "./PopUpSuccess";

const modalContentClasses =
  "p-8 rounded bg-gray-50 font-[sans-serif]";
const buttonClasses =
  "text-zinc-500 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-100";
const inputClasses =
  "w-full p-2 mb-4 bg-zinc-200 rounded-lg light:bg-zinc-700 dark:text-zinc-200-dark";
const submitButtonClasses =
  "w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none";

const Forgotpassword = ({ show, handleClose, showLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email cannot be empty.");
      setLoading(false);
      return;
    }
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
        setShowPopup(true); 
        setTimeout(() => {
          setShowPopup(false); 
          handleClose(); 
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        setError(error.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!show) return null;

 
  return (
    <Modal show={show} onHide={handleClose}>
      {showPopup ? (
        <PopupSuccess
          show={showPopup}
          onHide={() => {
            setShowPopup(false);
            handleClose();
          }}
          message="Yêu cầu đổi mật khẩu đã gửi thành công! Hãy kiểm tra email của bạn"
        />
      ) : (
        <>
          <div >
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Quên mật khẩu</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Bạn đã nhớ mật khẩu?
                  <button
              type="button"
              onClick={showLogin}
              className="text-green-500 no-underline hover:underline ml-1 whitespace-nowrap font-semibold"
            >
              Đăng nhập tại đây
            </button>
                </p>
              </div>
              <div className="mt-5">
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold ml-1 mb-2 dark:text-white">Email của bạn</label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                          required
                          aria-describedby="email-error"
                          value={email}
                          onChange={handleChange}
                        />
                      </div>
                      {error && (
                        <p className="text-xs text-red-600 mt-2" id="email-error">{error}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                       className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none transition hover:scale-105"
                    >
                      {loading ? "Đang xác nhận..." : "Đổi mật khẩu"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default Forgotpassword;
