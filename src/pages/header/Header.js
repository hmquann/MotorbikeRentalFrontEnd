// src/components/pages/header/Header.js
import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Avatar from "./Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import NotificationDropdown from "./NotificationDropdown";
import { useNotification } from "../../NotificationContext";
import Login from "../login/Login";
import Register from "../register/Register";
import Forgotpassword from "../forgotpassword/Forgotpassword";

const Header = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const { notificationCount, clearNotificationCount } = useNotification();

  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // State for username

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDataString = localStorage.getItem("user");
    const userData = JSON.parse(userDataString);
    userData
      ? setUsername(userData.firstName + " " + userData.lastName)
      : setUsername("");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleAccount = () => {
    navigate("/menu/profile");
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/homepage");
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleLoginOpen = () => {
    const currentPath = window.location.pathname;
    setRedirectPath(currentPath);
    setShowLoginModal(true);
  };

  const handleRegisterOpen = () => {
    setShowRegister(true);
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
  };

  const handleLoginSuccess = (userInfo) => {
    setShowLoginModal(false);
    setIsLoggedIn(true);
    if (userInfo.roles.includes("ADMIN")) {
      navigate("/menu/dashboard");
    } else if (
      userInfo.roles.includes("USER") ||
      userInfo.roles.includes("LESSOR")
    ) {
      navigate(redirectPath || "/homepage");
    } else {
      navigate("/homepage");
    }
  };

  const handleShowRegister = () => {
    setShowLoginModal(false);
    setShowRegister(true);
  };

  const handleShowLogin = () => {
    setShowLoginModal(true);
    setShowRegister(false);
    setShowForgotPassword(false);
  };

  const handleForgotPasswordOpen = () => {
    setShowLoginModal(false);
    setShowForgotPassword(true);
  };

  return (
    <>
      <header className="flex align-baseline justify-between items-center p-4 border-b ">
        <div className="flex items-center">
          <Nav.Link as={Link} to="/homepage">
            <img className="w-24" src="/image/logo.jpg" alt="Logo" />
          </Nav.Link>
        </div>
        <nav className="flex space-x-4">
          <Nav className="ml-auto">
            <Nav.Link
              as={Link}
              to=""
              style={{
                color: "#000" /* text-black */,
                fontSize: "0.875rem" /* text-sm */,
                fontWeight: "700" /* font-bold */,
                fontFamily: '"Manrope", sans-serif' /* font-manrope */,
              }}
            >
              Về MiMotor
            </Nav.Link>
            
            <Nav.Link
              as={Link}
              to="/registermotorbike"
              style={{
                color: "#000" /* text-black */,
                fontSize: "0.875rem" /* text-sm */,
                fontWeight: "700" /* font-bold */,
                fontFamily: '"Manrope", sans-serif' /* font-manrope */,
                borderRight: "1px solid #d8dae5", /* border-r-2 */
                height : '34px',
               
                
              }}
            >
              Trở thành chủ xe
            </Nav.Link>
            {isLoggedIn ? (
              <>
                <NotificationDropdown />
                <img src="https://n1-cstg.mioto.vn/m/avatars/avatar-0.png" className="w-10 h-10 rounded-full mr-3" />
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleAccount}
                >
                  <span className="text-green-500 mr-2 font-manrope font-bold text-sm">
                    {username}
                  </span>
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    className="text-green-500 ml-1"
                  />
                </div>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  onClick={handleRegisterOpen}
                  style={{
                    color: "#000" /* text-black */,
                    fontSize: "0.875rem" /* text-sm */,
                    fontWeight: "700" /* font-bold */,
                    fontFamily: '"Manrope", sans-serif' /* font-manrope */,
                  }}
                >
                  Đăng ký
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="#"
                  style={{
                    color: "#000" /* text-black */,
                    fontSize: "0.875rem" /* text-sm */,
                    fontWeight: "700" /* font-bold */,
                    fontFamily: '"Manrope", sans-serif' /* font-manrope */,
                    borderRadius: "8px",
                    border : '1px solid black'
                  }}
                  className="hover:bg-zinc-200"
                  
                  onClick={handleLoginOpen}
                >
                  Đăng nhập
                </Nav.Link>
              </>
            )}
          </Nav>
        </nav>
      </header>

      {showLoginModal && (
        <Login
          show={showLoginModal}
          handleClose={handleLoginClose}
          onLoginSuccess={handleLoginSuccess}
          showRegister={handleShowRegister}
          showForgotPassword={handleForgotPasswordOpen}
        />
      )}
      {showRegister && (
        <Register
          show={showRegister}
          handleClose={() => setShowRegister(false)}
          showLogin={handleShowLogin}
        />
      )}
      {showForgotPassword && (
        <Forgotpassword
          show={showForgotPassword}
          handleClose={() => setShowForgotPassword(false)}
          showLogin={handleShowLogin}
        />
      )}
    </>
  );
};

export default Header;
