import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const inputClasses =
  "w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 light:bg-zinc-700 light:border-zinc-600 dark:placeholder-zinc-400 dark:text-dark";

const buttonClasses = "focus:outline-none focus:ring-2";

const Register = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    navigate("/"); // Điều hướng đến trang chủ hoặc trang bạn muốn sau khi đóng modal
  };

  if (!isOpen) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100 light:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-zinc-900 light:text-zinc-100">
            Register
          </h2>
          <button
            onClick={handleClose}
            className={`text-zinc-400 dark:text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-500 ${buttonClasses}`}
          >
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>
        <form>
          <div className="mb-4">
            <input
              type="text"
              placeholder="PhoneNumber"
              className={inputClasses}
            />
          </div>
          <div className="mb-4">
            <input type="text" placeholder="Name" className={inputClasses} />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className={inputClasses}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Confirm Password"
              className={inputClasses}
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className={`w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 ${buttonClasses} focus:ring-teal-500`}
            >
              Submit
            </button>
          </div>
        </form>
        <div className="flex justify-between">
          <button className="w-1/2 bg-blue-600 text-white py-2 rounded-lg mr-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Facebook
          </button>
          <button className="w-1/2 bg-zinc-300 text-zinc-700 py-2 rounded-lg ml-2 hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400">
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
