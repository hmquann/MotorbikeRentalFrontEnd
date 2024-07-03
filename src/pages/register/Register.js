import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Popup from "../forgotpassword/PopUpSuccess";

const Register = () => {
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
  const validateName = (name) => {
    return /^[a-zA-Z]+$/.test(name);
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
        setFirstNameError("First name must only have alphabet characters.");
      } else {
        setFirstNameError("");
      }
    }
    if (name === "lastname") {
      if (!validateName(value)) {
        setlastNameError("Last name must only have alphabet characters.");
      } else {
        setlastNameError("");
      }
    }
    if (name === "password") {
      if (!validatePassword(value)) {
        setPasswordError(
          "Password length 8-20 characters and contains upper character and number."
        );
      } else {
        setPasswordError("");
      }
    }
    if (name === "phone") {
      if (!validatePhoneNumber(value)) {
        setPhoneError("Invalid phone number. It should be 10 digits.");
      } else {
        setPhoneError("");
      }
    }
    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("Invalid email format.");
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
        setRepasswordError("Passwords do not match.");
      } else if (name === "password" && repassword && value !== repassword) {
        setRepasswordError("Passwords do not match.");
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
    axios
      .post("http://localhost:8080/api/auth/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        setShowPopup(true); // Hiển thị popup khi thành công
        setTimeout(() => {
          setShowPopup(false); // Ẩn popup sau 3 giây
          navigate("/login"); //chuyển sang trang login sau khi thông báo
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
            setError(error.response.data);
          } else {
            setError(
              `Error ${error.response.status}: ${
                error.response.data.message || "An error occurred."
              }`
            );
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {firstNameError && (
            <div className="text-red-500">{firstNameError}</div>
          )}
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {lastNameError && <div className="text-red-500">{lastNameError}</div>}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {phoneError && <div className="text-red-500">{phoneError}</div>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {emailError && <div className="text-red-500">{emailError}</div>}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {passwordError && <div className="text-red-500">{passwordError}</div>}
          <input
            type="password"
            name="repassword"
            placeholder="Confirm Password"
            value={repassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {repasswordError && (
            <div className="text-red-500">{repasswordError}</div>
          )}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value=""> Gender</option>
            <option value="true">Male</option>
            <option value="false">Female</option>
          </select>
          {/* {genderError && <div className="text-red-500">{genderError}</div>} */}
          <button
            type="submit"
            className="w-full p-3 bg-teal-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 hover:bg-teal-600"
            disabled={loading}
          >
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

export default Register;
