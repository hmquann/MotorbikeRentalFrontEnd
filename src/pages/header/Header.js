// src/components/pages/header/Header.js
import React, { useState, useEffect } from "react";
import { Modal, Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Avatar from "./Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faCaretDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDataString = localStorage.getItem("user");
    const userData = JSON.parse(userDataString);
    userData
      ? setUsername(userData.firstName + " " + userData.lastName)
      : setUsername("");
    setIsLoggedIn(!!token);
  }, [location]);
  const roles = localStorage.getItem("roles");
  const admin = roles && roles.includes("ADMIN");

  const handleAccount = () => {
    navigate("/menu/profile");
    setIsMenuOpen(false);
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

  const handleLoginOpen = (e) => {
    e.preventDefault();
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
      navigate("/menu/dashboardForAdmin");
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // const handleConfirmLogout = () => {
  //   localStorage.clear();
  //   navigate("/homepage");
  //   setShowLogoutModal(false);
  // };

  // const handleCancelLogout = () => {
  //   setShowLogoutModal(false);
  // };
  return (
    <>
      <header className="flex align-baseline justify-between lg:mx-28 items-center p-4 ">
        <div className="flex items-center">
          <Nav.Link as={Link} to="/homepage">
            <img
              className="w-24"
              src="/image/logo.png
            "
              alt="Logo"
            />
          </Nav.Link>
        </div>
        <nav className="hidden md:flex space-x-4 items-center">
          <Nav className="ml-auto">
            {!admin && (
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
            )}
            {!admin && (
              <Nav.Link
                as={Link}
                to="/registermotorbike"
                style={{
                  color: "#000" /* text-black */,
                  fontSize: "0.875rem" /* text-sm */,
                  fontWeight: "700" /* font-bold */,
                  fontFamily: '"Manrope", sans-serif' /* font-manrope */,
                  borderRight: isLoggedIn
                    ? "none"
                    : "1px solid #d8dae5" /* border-r-2 */,
                  height: "34px",
                }}
              >
                Trở thành chủ xe
              </Nav.Link>
            )}

            {isLoggedIn ? (
              <>
                {!admin && (
                  <Nav.Link
                    as={Link}
                    to="/menu/myBooking"
                    style={{
                      color: "#000" /* text-black */,
                      fontSize: "0.875rem" /* text-sm */,
                      fontWeight: "700" /* font-bold */,
                      fontFamily: '"Manrope", sans-serif' /* font-manrope */,
                      borderRight: isLoggedIn
                        ? "1px solid #d8dae5"
                        : "none" /* border-r-2 */,
                      height: "34px",
                    }}
                  >
                    Chuyến của tôi
                  </Nav.Link>
                )}

                <NotificationDropdown />
                <img
                  src="https://n1-cstg.mioto.vn/m/avatars/avatar-0.png"
                  className="w-10 h-10 rounded-full mr-3"
                />
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
                    border: "1px solid black",
                  }}
                  className="hover:bg-zinc-200"
                  onClick={(e) => handleLoginOpen(e)}
                >
                  Đăng nhập
                </Nav.Link>
              </>
            )}
          </Nav>
        </nav>
        <div className="md:hidden flex items-center space-x-4">
          <NotificationDropdown />
          <button className="text-black text-lg" onClick={handleMenuToggle}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </header>

      <div
        className={`fixed top-0 left-0 w-full h-full p-4 flex flex-col items-center justify-center bg-zinc-100 z-50 transition-transform duration-300 transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 text-lg"
          onClick={handleMenuToggle}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="bg-white w-full flex flex-col items-center justify-center p-4 rounded-xl gap-2">
          {isLoggedIn ? (
            <>
              <div
                className="flex items-center text-center cursor-pointer"
                onClick={handleAccount}
              >
                <img
                  src="https://n1-cstg.mioto.vn/m/avatars/avatar-0.png"
                  className="w-20 h-20 rounded-full mb-4"
                  alt="User Avatar"
                />
                <p className="font-manrope font-bold text-lg ml-8">
                  {username}
                </p>
              </div>
              <div className="w-full border-b border-b-gray-300"></div>
              <Nav.Link
                as={Link}
                to=""
                className="text-black text-lg font-bold font-manrope"
                onClick={handleMenuClose}
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  padding: 10,
                }}
              >
                Về MiMotor
              </Nav.Link>
              <div className="w-full border-b border-b-gray-300"></div>
              <Nav.Link
                as={Link}
                to="/registermotorbike"
                className="text-black text-xl font-extrabold font-manrope"
                onClick={handleMenuClose}
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  padding: 10,
                }}
              >
                Trở thành chủ xe
              </Nav.Link>
              <div className="w-full border-b border-b-gray-300"></div>
              <Nav.Link
                as={Link}
                to="/menu/myBooking"
                className="text-black text-lg font-bold font-manrope hover:text-green-600"
                onClick={handleMenuClose}
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  padding: 10,
                }}
              >
                Chuyến của tôi
              </Nav.Link>
              <div className="w-full border-b border-b-gray-300"></div>
              <Nav.Link
                as={Link}
                to="/logout"
                className="text-red-500 text-lg font-bold font-manrope"
                onClick={handleLogout}
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  padding: 10,
                  color: "red",
                }}
              >
                Đăng xuất
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                as={Link}
                to=""
                className="text-black text-lg font-bold font-manrope"
                onClick={handleMenuClose}
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  padding: 10,
                }}
              >
                Về MiMotor
              </Nav.Link>
              <div className="w-full border-b border-b-gray-300"></div>
              <Nav.Link
                as={Link}
                to="/registermotorbike"
                className="text-black text-xl font-extrabold font-manrope"
                onClick={handleMenuClose}
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  padding: 10,
                }}
              >
                Trở thành chủ xe
              </Nav.Link>

              <div className="w-full border-b border-b-gray-300"></div>
              <Nav.Link
                as={Link}
                className="text-red-500 text-lg font-bold font-manrope"
                onClick={handleShowLogin}
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  padding: 10,
                }}
              >
                Đăng nhập
              </Nav.Link>
              <div className="w-full border-b border-b-gray-300"></div>
              <Nav.Link
                as={Link}
                to="/logout"
                className="text-red-500 text-lg font-bold font-manrope"
                onClick={handleRegisterOpen}
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  padding: 10,
                }}
              >
                Đăng ký
              </Nav.Link>
            </>
          )}
        </div>
      </div>

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
      <Modal show={showLogoutModal} onHide={handleCancelLogout}>
        <div className="p-8 rounded bg-gray-50 font-[sans-serif]">
          <h1 className="text-gray-800 text-center text-2xl font-bold">
            Đăng xuất
          </h1>
          <p className="text-gray-800 text-sm mt-4 text-center">
            Bạn có chắc muốn đăng xuất khỏi tài khoản?
          </p>
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={handleConfirmLogout}
              className="py-2 px-4 text-sm w-32 tracking-wide rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none transition hover:scale-105"
            >
              Đăng xuất
            </button>
            <button
              type="button"
              onClick={handleCancelLogout}
              className="py-2 px-4 text-sm w-32 tracking-wide rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none ml-2 transition hover:scale-105"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;
