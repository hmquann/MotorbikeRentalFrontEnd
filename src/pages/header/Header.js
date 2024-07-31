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
  const avatarClasses = "w-10 h-10 rounded-full border-2 border-yellow-400";

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
    navigate("/menu");
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
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <Nav.Link as={Link} to="/homepage">
            <img className={avatarClasses} src="./image/logo.jpg" alt="Logo" />
          </Nav.Link>
        </div>
        <nav className="flex space-x-4 items-center">
          <Nav className="ml-auto flex items-center space-x-4">
            <Nav.Link as={Link} to="" className="nav-link">
              About MiMOTOR
            </Nav.Link>
            <Nav.Link as={Link} to="/privacy" className="nav-link">
              Privacy
            </Nav.Link>
            <Nav.Link as={Link} to="/registermotorbike" className="nav-link">
              Become Lessor
            </Nav.Link>
            {isLoggedIn ? (
              <div className="relative flex items-center">
                <NotificationDropdown />
              </div>
            ) : (
              ""
            )}

            {isLoggedIn ? (
              <div
                className="flex items-center cursor-pointer space-x-2"
                onClick={handleAccount}
              >
                <img
                  className={avatarClasses}
                  src="https://kenhmuabanxehoi.net/uploads/truong-the-vinh_1680594107/halinh2.jpg"
                  alt="User Avatar"
                />
                <span className="text-green-500">{username}</span>
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className="text-green-500 ml-1"
                />
              </div>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  onClick={handleRegisterOpen}
                  className="nav-link"
                >
                  Register
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="#"
                  className="nav-link"
                  onClick={handleLoginOpen}
                >
                  Login
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
