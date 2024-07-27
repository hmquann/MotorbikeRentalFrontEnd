import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";



const Login = () => {
  const apiLogin = "http://localhost:8080/api/auth/signin";
  const containerClasses = "bg-gray-50 font-[sans-serif]";
  const contentClasses =
    "min-h-screen flex flex-col items-center justify-center py-6 px-4";
  const formClasses = "max-w-md w-full p-8 rounded-2xl bg-white shadow";
  const inputClasses =
    "w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600";
  const buttonClasses =
    "w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none";
  const errorClasses = "text-red-500 mt-2 ml-1";

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
      const response = await axios.post(apiLogin, credentials, {
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
      };
      localStorage.setItem("user", JSON.stringify(userInfor));
      localStorage.setItem("token", data.token);
      if (data.roles && data.roles.length > 0) {
        localStorage.setItem("roles", JSON.stringify(data.roles));
      } else {
        console.error("No roles found in the response:", data.roles);
      }

      if (data.roles.includes("ADMIN")) {
        navigate("/dashboard");
      } else if (data.roles && data.roles.includes("USER", "LESSOR")) {
        navigate("/homepage");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          setError("Hãy kiểm tra lại tài khoản hoặc mật khẩu.");
        } else if (status === 403) {
          setError("Your account has been locked");
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
    <div className={containerClasses}>
      <div className={contentClasses}>
        <div className="max-w-md w-full">
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
           <FontAwesomeIcon icon={faUser}  className="w-4 h-4 absolute right-4" />
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
                 <FontAwesomeIcon icon={faLock}  className="w-4 h-4 absolute right-4" />
              
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-4">
                <div className="text-sm">
                  <Link
                    to="/forgotpassword"
                    className="text-green-500 no-underline hover:underline ml-1 whitespace-nowrap font-semibold"
                  >
                    Quên mật khẩu?
                  </Link>
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
                <Link
                  to="/register"
                  className="text-green-500 no-underline hover:underline ml-1 whitespace-nowrap font-semibold"
                >
                  Đăng ký ở đây
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
