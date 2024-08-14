import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../axiosConfig";

const Login = ({
  show,
  handleClose,
  onLoginSuccess,
  showRegister,
  showForgotPassword,
}) => {
  const apiLogin = "/api/auth/signin";
  const formClasses = "p-8 rounded bg-gray-50 font-manrope";
  const inputClasses =
    "w-full text-gray-800 font-semibold text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600";
  const buttonClasses =
    "w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none transition hover:scale-105";
  const errorClasses = "text-red-500 text-center font-bold";

  const [credentials, setCredentials] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post(apiLogin, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;

      console.log(response.data);
      const userInfor = {
        token: data.userToken,
        userId: data.id,
        roles: data.roles,
        balance: data.balance,
        gender: data.isGender,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        totalTrip: data.totalTripCount,
        emailNoti: data.emailNoti,
        systemNoti: data.systemNoti,
        minimizeNoti: data.minimizeNoti,
      };
      localStorage.setItem("user", JSON.stringify(userInfor));
      localStorage.setItem("token", data.token);
      if (data.roles && data.roles.length > 0) {
        localStorage.setItem("roles", JSON.stringify(data.roles));
      } else {
        console.error("No roles found in the response:", data.roles);
      }

      // if (data.roles && data.roles.includes("ADMIN")) {
      //   navigate("/menu/dashboard");
      // } else if (data.roles && data.roles.includes("USER", "LESSOR")) {
      //   navigate("/homepage");
      // }
      onLoginSuccess(userInfor);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          setError("Hãy kiểm tra lại tài khoản hoặc mật khẩu");
        } else if (status === 403) {
          setError("Tài khoản của bạn chưa được kích hoạt");
        } else {
          setError(data.message || "Something went wrong");
        }
      } else if (error.request) {
        setError("No response received from the server.");
      } else {
        setError("Error setting up the request.");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      navigate("/homepage");
    }
  }, [navigate]);

  return (
    <Modal show={show} onHide={handleClose}>
      <div>
        <div>
          <div>
            <div className={formClasses}>
              <h2 className="text-gray-800 text-center text-2xl font-bold">
                Đăng nhập
              </h2>
              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-gray-800 text-sm font-semibold mb-2 block">
                    Email/Số điện thoại
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="emailOrPhone"
                      type="text"
                      required
                      className={inputClasses}
                      placeholder="Nhập Email hoặc Số điện thoại"
                      value={credentials.emailOrPhone}
                      onChange={handleChange}
                    />
                    <FontAwesomeIcon
                      icon={faUser}
                      className="w-4 h-4 absolute right-4"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-800 text-sm font-semibold mb-2 block">
                    Mật khẩu
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type="password"
                      required
                      className={inputClasses}
                      placeholder="Nhập mật khẩu"
                      value={credentials.password}
                      onChange={handleChange}
                    />
                    <FontAwesomeIcon
                      icon={faLock}
                      className="w-4 h-4 absolute right-4"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-4">
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={showForgotPassword}
                      className="text-green-500 no-underline hover:underline ml-1 whitespace-nowrap font-semibold"
                    >
                      Quên mật khẩu
                    </button>
                  </div>
                </div>

                <div className="!mt-8">
                  <button type="submit" className={buttonClasses}>
                    Đăng nhập
                  </button>
                </div>
                {error && <div className={errorClasses}>{error}</div>}
                <p className="text-gray-800 text-sm !mt-8 text-center">
                  Bạn chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={showRegister}
                    className="text-green-500 no-underline hover:underline ml-1 whitespace-nowrap font-semibold"
                  >
                    Đăng ký ở đây
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Login;
