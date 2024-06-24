import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const apiLogin = "http://localhost:8080/api/auth/signin";
  const containerClasses =
    "flex items-center justify-center min-h-screen bg-gray-100 light:bg-zinc-900";
  const contentClasses =
    "bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 w-full max-w-md";
  const inputClasses =
    "w-full p-2 border border-gray-300 rounded bg-zinc-200 white:bg-zinc-700 text-zinc-900 dark:text-zinc-100-dark";
  const buttonClasses = "text-zinc-500 dark:text-zinc-400";
  const linkClasses = "hover:underline";
  const submitButtonClasses = "w-full bg-green-500 text-white p-2 rounded";

  const [credentials, setCredentials] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

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
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("balance", data.balance);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.roles.length > 0) {
        localStorage.setItem("roles", JSON.stringify(data.roles));
      } else {
        console.error("No roles found in the response:", data.roles);
      }
      setIsLoggedIn(true);
      if (data.roles.includes("ADMIN")) {
        navigate("/dashboard");
      } else if (data.roles && data.roles.includes("USER")) {
        navigate("/homepage");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          setError("Please check your username and password.");
        } else if (status === 403) {
          setIsLocked(true);
          setError("Your account has been locked");
        } else {
          setError(data.message || "Something went wrong");
        }
      } else if (error.request) {
        // Request was made but no response received
        setError("No response received from the server.");
      } else {
        // Something else happened while setting up the request
        setError("Error setting up the request.");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      navigate("/homepage");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100-dark">
            Login
          </h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email or PhoneNumber"
            className={inputClasses}
            onChange={handleChange}
            value={credentials.emailOrPhone}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={inputClasses}
            onChange={handleChange}
            value={credentials.password}
          />
          <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
            <Link to="/register/form" className={linkClasses}>
              Register
            </Link>
            <Link to="/forgotpassword" className={linkClasses}>
              Forgotten Password?
            </Link>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <button className={submitButtonClasses}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
