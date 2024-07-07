import React, { useState,useEffect } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import "./Menu.css";
import Profile from "../profile/Profile";

import UserWallet from "../wallet/UserWallet";
import ApproveMotorbikeRegistration from "../motorbike/ApproveMotorbikeRegistration ";
import BrandList from "../brand/BrandList";
import ModelList from "../modelMotorbike/ModelList";

import ApproveLicense from "../license/ApproveLicense";


import { Message } from "../chatting/Message";
import UserData from "../dashboard/UserData";
import ChatApp from "../chatapp/ChatApp";


const Menu = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const roles = localStorage.getItem('roles'); 
    console.log(roles)
    setUserRole(roles);
  }, []);
 
  const isAdmin = userRole.includes("ADMIN")
  const isLessor = userRole.includes("LESSOR")
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    navigate("/homepage");
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="menu bg-zinc-100">
      <div className="menu-left">
        <ul>
          <li>
            <NavLink
              to="#"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu/profile"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              My Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu/wallet"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Wallet
            </NavLink>
          </li>
          {isAdmin && (
            <>
            <li>
            <NavLink
              to="/menu/brand"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Manage Brand
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu/chatApp"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Chatting
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu/approveLicense"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Approve License
              </NavLink>
          </li>
          <li>
                <NavLink
              to="/menu/model"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Manage Model
              </NavLink>

              </li>
              <li>
              <NavLink

              to="/menu/userData"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              User Management

            </NavLink>
          </li>
            </>
          )}
           {(isAdmin || isLessor) && (
          <li>
            <NavLink
              to="/menu/approveMotorbike"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Motorbike Status
            </NavLink>
          </li>
           )}

          
          <li>
            <NavLink onClick={handleLogout} className="nav-link">
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="menu-right mt-4">
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/chatApp" element={<ChatApp   />} />
          <Route path="/wallet" element={<UserWallet />} />
          {isAdmin && (
            <>
               <Route path="/brand" element={<BrandList />} />
               <Route path="/model" element={<ModelList />} />
               <Route path="/approveLicense" element={<ApproveLicense/>} />
               <Route path="/userData" element={<UserData />} />

            </>
          )}
          <Route path="/approveMotorbike" element={<ApproveMotorbikeRegistration />} />
          {/* code chatting room here */}
        </Routes>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-md">
            <p className="text-lg text-zinc-800 light:text-zinc-200">
              Are you sure you want to log out?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleConfirmLogout}
                className="bg-green-500 hover:bg-green-600 text-white mr-2 px-4 py-2 rounded-lg"
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
