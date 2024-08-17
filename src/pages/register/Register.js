
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import apiClient from "../../axiosConfig";


const inputClasses = "w-full text-gray-800 font-semibold text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
const Register = ({ show, handleClose, showLogin }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
    gender: "",
  });

  const [repassword, setRepassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gender, setGender] = useState(true);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [repasswordError, setRepasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [lastNameError, setlastNameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [genderError, setGenderError] = useState("");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (show) {
      setFormData({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        password: "",
        gender: "",
      });
      setRepassword("");
      setFirstNameError(null);
      setlastNameError(null);
      setEmailError(null);
      setPhoneError(null);
      setPasswordError(null);
      setRepasswordError(null);
    }
  }, [show]);
  const validateName = (name) => {
    return /^[\p{L}\s]+$/u.test(name);
};
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePassword = (password) => {
    return !(
      password.length < 8 ||
      password.length > 20 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstname") {
      if (!validateName(value)) {
        setFirstNameError("Họ không hợp lệ");
      } else {
        setFirstNameError("");
      }
    }
    if (name === "lastname") {
      if (!validateName(value)) {
        setlastNameError("Tên không hợp lệ");
      } else {
        setlastNameError("");
      }
    }
    if (name === "password") {
      if (!validatePassword(value)) {
        setPasswordError(
          "Mật khẩu phải có từ 8-20 kí tự bao gồm cả số và chữ in hoa"
        );
      } else {
        setPasswordError("");
      }
    }
    if (name === "phone") {
      if (!validatePhoneNumber(value)) {
        setPhoneError("Số điện thoại phải bao gồm 10 chữ số");
      } else {
        setPhoneError("");
      }
    }
    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("Email không hợp lệ");
      } else {
        setEmailError("");
      }
    }
    if (name === "password" || name === "repassword") {
      if (name === "password") {
        setFormData({
          ...formData,
          [name]: value,
        });
      } else {
        setRepassword(value);
      }
      if (name === "repassword" && formData.password !== value) {
        setRepasswordError("Mật khẩu không trùng khớp");
      } else if (name === "password" && repassword && value !== repassword) {
        setRepasswordError("Mật khẩu không trùng khớp");
      } else {
        setRepasswordError("");
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      firstNameError ||
      lastNameError ||
      phoneError ||
      emailError ||
      repasswordError ||
      passwordError
    ) {
      setError("Please correct the errors before submitting.");
      setLoading(false);
      return;
    }

    for (let key in formData) {
      if (formData[key] === "") {
        setError("Please fill all fields before submitting.");
        setLoading(false);
        return;
      }
    }
    apiClient
      .post(
        "/api/auth/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      .then((response) => {
        console.log("Data sent successfully:", response.data);
        setShowPopup(true);
        setShowForm(false);
        setTimeout(() => {
          setShowPopup(false);
          handleClose();
          navigate("/homepage");
        }, 3000);
        setLoading(false);
      })
      .catch((error) => {
        console.log(formData);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error response:", error.response);
          console.error("Status code:", error.response.status);
          console.error("Data:", error.response.data);

          if (error.response.status === 404) {
            setError(
              "Error 404: Not Found. The requested resource could not be found."
            );
          } else if (error.response.status === 409) {
            const translateErrorMessage = (message) => {
              switch (message) {
                case "Email existed":
                  return "Email đã tồn tại";
                case "Phone existed":
                  return "Số điện thoại đã tồn tại";
                default:
                  return "Đã xảy ra lỗi. Vui lòng thử lại.";
              }
            };
            const translatedMessage = translateErrorMessage(
              error.response.data
            );
            setError(translatedMessage);
          } else {
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
          setError(
            "No response received. Please check your network connection."
          );
        }
        setLoading(false);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <div className="p-8 rounded bg-gray-50 font-manrope">
        {showForm && (
          <>
            <h2 className="text-gray-800 text-center text-2xl font-bold">
              Đăng ký
            </h2>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-gray-800 text-sm font-semibold mb-2 block">
                  Họ
                </label>
                <input
                  name="firstname"
                  type="text"
                  required
                  className={inputClasses}
                  placeholder="Nhập họ"
                  value={formData.firstname}
                  onChange={handleChange}
                />
                {firstNameError && (
                  <div className="text-red-500">{firstNameError}</div>
                )}
              </div>
              <div>
                <label className="text-gray-800 text-sm font-semibold mb-2 block">
                  Tên
                </label>
                <input
                  name="lastname"
                  type="text"
                  required
                  className={inputClasses}
                  placeholder="Nhập tên"
                  value={formData.lastname}
                  onChange={handleChange}
                />
                {lastNameError && (
                  <div className="text-red-500">{lastNameError}</div>
                )}
              </div>
              <div>
                <label className="text-gray-800 text-sm font-semibold mb-2 block">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  className={inputClasses}
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {phoneError && <div className="text-red-500">{phoneError}</div>}
              </div>
              <div>
                <label className="text-gray-800 text-sm font-semibold mb-2 block">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className={inputClasses}
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {emailError && <div className="text-red-500">{emailError}</div>}
              </div>
              <div>
                <label className="text-gray-800 text-sm font-semibold mb-2 block">
                  Giới tính
                </label>
                <select
                  name="gender"
                  required
                  className={inputClasses}
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>
              </div>
              <div>
                <label className="text-gray-800 text-sm font-semibold mb-2 block">
                  Mật khẩu
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className={inputClasses}
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                />
                {passwordError && (
                  <div className="text-red-500">{passwordError}</div>
                )}
              </div>
              <div>
                <label className="text-gray-800 text-sm font-semibold mb-2 block">
                  Nhập lại mật khẩu
                </label>
                <input
                  name="repassword"
                  type="password"
                  required
                  className={inputClasses}
                  placeholder="Nhập lại mật khẩu"
                  value={repassword}
                  onChange={handleChange}
                />
                {repasswordError && (
                  <div className="text-red-500">{repasswordError}</div>
                )}
              </div>
              <div className="!mt-8">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none transition hover:scale-105"
                >
                  Đăng ký
                </button>
              </div>
              {error && (
                <div className="text-red-500 font-bold text-center">
                  {error}
                </div>
              )}
              <p className="text-gray-800 text-sm !mt-8 text-center">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={showLogin}
                  className="text-green-500 no-underline hover:underline ml-1 whitespace-nowrap font-semibold"
                >
                  Đăng nhập tại đây
                </button>
              </p>
            </form>
          </>
        )}
        {showPopup && (
          <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
            <div className="p-8 rounded bg-gray-50 font-[sans-serif]">
              <h2 className="text-gray-800 text-center text-2xl font-bold">
                Đăng ký thành công!
              </h2>
              <p className="text-gray-800 text-sm mt-4 text-center">
                Hãy kiểm tra Email của bạn để xác thực tài khoản
              </p>
              <div className="text-center mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowPopup(false);
                    handleClose();
                  }}
                  className="py-2 px-4 text-sm tracking-wide rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                >
                  OK
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Modal>
  );
};

export default Register;
