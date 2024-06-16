import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    // localStorage.removeItem("token");
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
          <span className="ml-2 text-xl font-bold text-zinc-800 dark:text-dark">
            MiMOTORBIKE
          </span>
        </div>
        <nav className="flex space-x-4">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="" className="nav-link">
              About MiMOTORBIKE
            </Nav.Link>
            <Nav.Link as={Link} to="/privacy" className="nav-link">
              Privacy
            </Nav.Link>
            <Nav.Link as={Link} to="/registermotorbike" className="nav-link">
              Become Lessor
            </Nav.Link>
            {isLoggedIn ? (
              <Nav.Link onClick={handleLogout} className="nav-link">
                Logout
              </Nav.Link>
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
    </>
  );
};

export default Header;
