import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import Avatar from "./Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import NotificationDropdown from "./NotificationDropdown";
import Login from "../login/Login";
import Register from "../register/Register";
import Forgotpassword from "../forgotpassword/Forgotpassword"; // Import Forgotpassword component

const Header = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State for Forgotpassword modal
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // State for username
  const avatarClasses = "w-10 h-10 rounded-full border-2 border-yellow-400";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDataString = localStorage.getItem("user");

    // Parse JSON string to JavaScript object
    const userData = JSON.parse(userDataString);

    // Get username from userData object
    userData ? setUsername(userData.firstName + " " + userData.lastName) : setUsername("");
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
    setShowLoginModal(true);
  };
  
  const handleRegisterOpen = () => {
    setShowRegister(true);
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsLoggedIn(true);
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
        <nav className="flex space-x-4">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="" className="nav-link">
              About MiMOTOR
            </Nav.Link>
            <Nav.Link as={Link} to="/privacy" className="nav-link">
              Privacy
            </Nav.Link>
            <Nav.Link as={Link} to="/registermotorbike" className="nav-link">
              Become Lessor
            </Nav.Link>
            <NotificationDropdown />
            {isLoggedIn ? (
              <div
                className="flex items-center cursor-pointer"
                onClick={handleAccount}
              >
                <img
                  className={avatarClasses}
                  src="https://kenhmuabanxehoi.net/uploads/truong-the-vinh_1680594107/halinh2.jpg"
                  alt="User Avatar"
                />
                <span className="text-green-500 mr-2">{username}</span>
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className="text-green-500 ml-1"
                />
              </div>
            ) : (
              <>
                <Nav.Link as={Link} onClick={handleRegisterOpen} className="nav-link">
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="#" className="nav-link" onClick={handleLoginOpen}>
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
