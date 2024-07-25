import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import Avatar from "./Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCaretDown, faUser } from "@fortawesome/free-solid-svg-icons";
import NotificationDropdown from "./NotificationDropdown";

const Header = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Khai báo state cho username
  const avatarClasses = "w-10 h-10 rounded-full border-2 border-yellow-400";
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDataString = localStorage.getItem("user");
  
    // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
    const userData = JSON.parse(userDataString);

    // Lấy ra username từ đối tượng userData
    userData
      ? setUsername(userData.firstName + " " + userData.lastName)
      : setUsername("");
    setIsLoggedIn(!!token);
  }, [location]);

  // const handleLogout = () => {
  //   setShowLogoutModal(true);
  // };
  const handleAccount = () => {
    navigate("/menu");
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("");
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
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
              // <Nav.Link onClick={handleLogout} className="nav-link">
              //   Logout
              // </Nav.Link>
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
                <Nav.Link as={Link} to="/register" className="nav-link">
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="nav-link">
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </nav>
      </header>
    </>
  );
};

export default Header;
