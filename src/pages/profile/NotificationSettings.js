import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import apiClient from "../../axiosConfig";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Define reusable Tailwind classes
const switchWrapperClasses = "flex items-center justify-between mb-4";
const switchClasses = "relative inline-block w-14 h-8 cursor-pointer";
const sliderClasses =
  "absolute inset-0 bg-gray-300 rounded-full transition duration-200 ease-in-out";
const sliderCheckedClasses = "bg-green-500";
const sliderBeforeClasses =
  "absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ease-in-out";
const sliderBeforeCheckedClasses = "transform translate-x-6";
const applyButtonClasses =
  "w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white mt-4";
const confirmButtonClasses = "bg-red-500 text-white px-4 py-2 rounded-lg mr-2";
const cancelButtonClasses = "bg-gray-300 text-black px-4 py-2 rounded-lg";
const overlayClasses =
  "fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center";
const confirmationModalClasses = "relative z-40 w-full max-w-md";

const NotificationSettings = ({ show, handleClose, onSuccess }) => {
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const userId = userData ? userData.userId : null;

  // Initialize state with user data
  const [notifications, setNotifications] = useState({
    systemNoti: userData ? userData.systemNoti : true,
    emailNoti: userData ? userData.emailNoti : true,
    minimizeNoti: userData ? userData.minimizeNoti : true,
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggle = (type) => {
    if (notifications[type]) {
      setPendingChange(type);
      setShowConfirm(true);
    } else {
      setNotifications((prevNotifications) => ({
        ...prevNotifications,
        [type]: !prevNotifications[type],
      }));
    }
  };

  const handleConfirm = () => {
    if (pendingChange) {
      setNotifications((prevNotifications) => ({
        ...prevNotifications,
        [pendingChange]: !prevNotifications[pendingChange],
      }));
      setShowConfirm(false);
      setPendingChange(null);
    }
  };

  useEffect(() => {
    console.log(notifications.systemNoti);
    console.log(notifications.emailNoti);
    console.log(notifications.minimizeNoti);
  }, [notifications]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const response = await apiClient.put(
        `/api/user/changeNotifications/${userId}`,
        {
          systemNoti: notifications.systemNoti,
          emailNoti: notifications.emailNoti,
          minimizeNoti: notifications.minimizeNoti,
        }
      );
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      localStorage.clear();
      window.location.href = "/homepage";
    }
  };

  return (
    <>
      {/* Main Modal for Notification Settings */}
      <Modal show={show} onHide={handleClose} className="font-manrope">
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10">
              <CircularProgress color="inherit" />
            </div>
          )}
          <div>
            <Modal.Header closeButton>
              <Modal.Title className="text-xl text-green-600">
                Thiết lập thông báo
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group
                  controlId="formOnlineNotifications"
                  className={switchWrapperClasses}
                >
                  <Form.Label className="text-base font-medium text-gray-700">
                    Thông báo trực tuyến
                  </Form.Label>
                  <div
                    className={switchClasses}
                    onClick={() => handleToggle("systemNoti")}
                  >
                    <span
                      className={`${sliderClasses} ${
                        notifications.systemNoti ? sliderCheckedClasses : ""
                      }`}
                    >
                      <span
                        className={`${sliderBeforeClasses} ${
                          notifications.systemNoti
                            ? sliderBeforeCheckedClasses
                            : ""
                        }`}
                      ></span>
                    </span>
                  </div>
                </Form.Group>

                <Form.Group
                  controlId="formEmailNotifications"
                  className={switchWrapperClasses}
                >
                  <Form.Label className="text-base font-medium text-gray-700">
                    Thông báo email
                  </Form.Label>
                  <div
                    className={switchClasses}
                    onClick={() => handleToggle("emailNoti")}
                  >
                    <span
                      className={`${sliderClasses} ${
                        notifications.emailNoti ? sliderCheckedClasses : ""
                      }`}
                    >
                      <span
                        className={`${sliderBeforeClasses} ${
                          notifications.emailNoti
                            ? sliderBeforeCheckedClasses
                            : ""
                        }`}
                      ></span>
                    </span>
                  </div>
                </Form.Group>
                <div className="flex justify-center mt-4">
                  <button onClick={handleSave} className={applyButtonClasses}>
                    Áp dụng
                  </button>
                </div>
              </Form>
            </Modal.Body>
          </div>
        </div>
      </Modal>

      {/* Confirmation PopUp Modal */}
      {showConfirm && (
        <div className={overlayClasses}>
          <div className={confirmationModalClasses}>
            <Modal
              show={showConfirm}
              onHide={() => setShowConfirm(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title className="text-xl">Xác nhận</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Bạn đang yêu cầu ngừng dịch vụ nhận thông báo{" "}
                  {pendingChange === "systemNoti"
                    ? "từ hệ thống"
                    : pendingChange === "emailNoti"
                    ? "email"
                    : "cửa sổ nhỏ"}
                  . Bạn có chắc chắn không?
                </p>
              </Modal.Body>
              <Modal.Footer>
                <button
                  className={cancelButtonClasses}
                  onClick={() => setShowConfirm(false)}
                >
                  Hủy bỏ
                </button>
                <button
                  className={confirmButtonClasses}
                  onClick={handleConfirm}
                >
                  Xác nhận
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSettings;
