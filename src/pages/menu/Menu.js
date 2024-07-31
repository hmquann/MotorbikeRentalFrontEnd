import React, { useState, useEffect } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import "./Menu.css";
import Profile from "../profile/Profile";
import { Modal } from "react-bootstrap";
import Dashboard from "../dashboard/Dashboard";
import UserWallet from "../wallet/UserWallet";
import ApproveMotorbikeRegistration from "../motorbike/ApproveMotorbikeRegistration ";
import BrandList from "../brand/BrandList";
import ModelList from "../modelMotorbike/ModelList";
import ApproveLicense from "../license/ApproveLicense";
import { Message } from "../chatting/Message";
import UserData from "../dashboard/UserData";
import VoucherList from "../voucher/VoucherList";
import ChatApp from "../chatapp/ChatApp";
import MyBooking from "../myBooking/MyBooking";
import BlogEditor from "../blog/BlogEditor";
import BlogList from "../blog/BlogList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";

const Menu = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false); // State for managing dropdown
  const navigate = useNavigate();

  useEffect(() => {
    const roles = localStorage.getItem("roles");
    const token = localStorage.getItem("token");

    if (token) {
      setUserRole(roles || "");
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate("/homepage");
    }
  }, [navigate]);

  const isAdmin = userRole && userRole.includes("ADMIN");
  const isLessor = userRole && userRole.includes("LESSOR");

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

  const handleManageClick = () => {
    setIsManageOpen(!isManageOpen);
  };

  return (
    <div className="menu bg-zinc-100">
      {isAuthenticated && (
        <>
      
          <div className="menu-left bg-zinc-100 font-manrope">
            <h4 className="font-bold">Xin chào bạn !</h4>
          <hr></hr>
            <ul>
            <li>
                <NavLink
                  to="/menu/profile"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Tài khoản của tôi
                </NavLink>
              </li>
              {isAdmin && (
                <li>
                  <NavLink
                    to="/menu/dashboard"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  to="/menu/myBooking"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Chuyến của tôi
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/menu/wallet"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Ví của tôi
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
              <hr></hr>
              {(isAdmin || isLessor) && (
                <li>
                  <a
                    type="button"
                    onClick={handleManageClick}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      padding: '8px 16px',
                      textDecoration: 'none',
                      color: 'inherit',
                      marginBottom : '3px'
                    }}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <span>Quản lý</span>
                    <FontAwesomeIcon icon={faList} />
                  </a>
                
                    <ol className={`sub-menu ${isManageOpen ? 'open' : ''}`}>
                      {isAdmin && (
                        <>
                          <li>
                            <NavLink
                              to="/menu/brand"
                              className={({ isActive }) =>
                                isActive ? "active" : ""
                              }
                            >
                              Quản lý thương hiệu xe
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/menu/approveLicense"
                              className={({ isActive }) =>
                                isActive ? "active" : ""
                              }
                            >
                              Quản lý bằng lái xe
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/menu/model"
                              className={({ isActive }) =>
                                isActive ? "active" : ""
                              }
                            >
                              Quản lý mẫu xe
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/menu/userData"
                              className={({ isActive }) =>
                                isActive ? "active" : ""
                              }
                            >
                              Quản lý người dùng
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/menu/blogList"
                              className={({ isActive }) =>
                                isActive ? "active" : ""
                              }
                            >
                              Quản lí blog
                            </NavLink>
                          </li>
                        </>
                      )}
                      {(isAdmin || isLessor) && (
                        <>
                          <li>
                            <NavLink
                              to="/menu/approveMotorbike"
                              className={({ isActive }) =>
                                isActive ? "active" : ""
                              }
                            >
                              {isAdmin ? "Quản lý xe" : "Xe của tôi"}
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/menu/voucher"
                              className={({ isActive }) =>
                                isActive ? "active" : ""
                              }
                            >
                              Quản lý khuyến mãi
                            </NavLink>
                          </li>
                        </>
                      )}
                    </ol>
                  
                </li>
              )}
              <hr></hr>
              <li className="flex justify-center">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-2 px-4 text-sm w-36 tracking-wide rounded-lg text-white bg-red-600 hover:bg-red-700 transition hover:scale-105"
                >
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
          <div className="menu-right">
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/myBooking" element={<MyBooking />} />
              <Route path="/chatApp" element={<ChatApp />} />
              <Route path="/wallet" element={<UserWallet />} />
              {isAdmin && (
                <>
                  <Route path="/brand" element={<BrandList />} />
                  <Route path="/model" element={<ModelList />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/approveLicense" element={<ApproveLicense />} />
                  <Route path="/userData" element={<UserData />} />
                  <Route path="/blogList" element={<BlogList />} />
                </>
              )}
              {(isAdmin || isLessor) && (
                <>
                  <Route
                    path="/approveMotorbike"
                    element={<ApproveMotorbikeRegistration />}
                  />
                  <Route path="/voucher" element={<VoucherList />} />
                </>
              )}
            </Routes>
          </div>
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
      )}
    </div>
  );
};

export default Menu;
