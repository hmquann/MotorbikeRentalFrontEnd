import React, { useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import "./Menu.css";
import ChatMessage from "../chatting/ChatMessage";

const Menu = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    // setIsLoggedIn(false);
    navigate("/login");
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="menu">
      <div className="menu-left">
        <ul>
          <li>
            <NavLink
              to="/menu"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Employee
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chatmessage"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Chatting
            </NavLink>
          </li>
          <li>
            <NavLink onClick={handleLogout} className="nav-link">
              Logout
            </NavLink>
          </li>
          {/* Add more menu items as needed */}
        </ul>
      </div>
      <div className="menu-right">
        <Routes>
          <Route path="/chatmessage" element={<ChatMessage />} />
          {/* code chatting room here */}
        </Routes>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white  dark:bg-zinc-800 rounded-lg p-4 shadow-md">
            <p className="text-lg text-zinc-800 light:text-zinc-200">
              Are you sure you want to log out?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleConfirmLogout}
                className="bg-green-500 hover:bg-green-600 text-white mr-2 px-4 py-2 rounded-lg "
              >
                Yes
              </button>
              <button
                onClick={handleCancelLogout}
                className="bg-zinc-500 hover:bg-zinc-600 dark:bg-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
