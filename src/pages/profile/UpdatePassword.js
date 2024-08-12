import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import apiClient from "../../axiosConfig";
import PopupMessage from "./PopupMessage";

const UpdatePassword = ({ show, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [renewPassword, setRenewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [repasswordError, setRepasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");

  const validatePassword = (password) => {
    return !(
      password.length < 8 ||
      password.length > 20 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    );
  };

  const handleChangeOldPassWord = (e) => {
    setOldPasswordError("");
    setError("");
    const oldPasswordValue = e.target.value;
    setOldPassword(oldPasswordValue);
    if (!validatePassword(oldPasswordValue)) {
      setOldPasswordError(
        "Mật khẩu phải bao gồm từ 8-20 kí tự bao gồm cả chữ số và chữ in hoa"
      );
    } else {
      setOldPasswordError("");
      setOldPassword(oldPasswordValue);
    }
  };

  const handleChangeNewPassWord = (e) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);
    if (!validatePassword(newPasswordValue)) {
      setPasswordError(
        "Mật khẩu phải bao gồm từ 8-20 kí tự bao gồm cả chữ số và chữ in hoa"
      );
    } else {
      setPasswordError("");
    }
    if (newPasswordValue !== renewPassword) {
      setRepasswordError("Mật khẩu không trùng khớp");
    } else {
      setRepasswordError("");
    }
  };

  const handleChangeRenewPassword = (e) => {
    const renewPasswordValue = e.target.value;
    setRenewPassword(renewPasswordValue);
    if (renewPasswordValue !== newPassword) {
      setRepasswordError("Mật khẩu không trùng khớp");
    } else {
      setRepasswordError("");
    }
  };

  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const token = userData.token;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (renewPassword !== newPassword) {
      setError("Mật khẩu không trùng khớp");
      return;
    }
    if (!newPassword || newPassword.trim() === "") {
      setError("Vui lòng điền đầy đủ các trường!");
      return;
    }
    setLoading(true);

    apiClient
      .post(
        "/password/change",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          token: token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          handleClose(); // Close the modal
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        setOldPasswordError(error.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} className="font-manrope">
      <Modal.Header closeButton>
        <Modal.Title>Đổi mật khẩu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formOldPassword">
            <Form.Label>Nhập mật khẩu hiện tại</Form.Label>
            <Form.Control
              type="password"
              value={oldPassword}
              onChange={handleChangeOldPassWord}
              isInvalid={!!oldPasswordError}
              className="px-3 py-2"
            />
            <Form.Control.Feedback type="invalid">
              {oldPasswordError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formNewPassword">
            <Form.Label>Nhập mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={handleChangeNewPassWord}
              isInvalid={!!passwordError}
              className="px-3 py-2"
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formRenewPassword">
            <Form.Label>Xác thực lại mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              value={renewPassword}
              onChange={handleChangeRenewPassword}
              isInvalid={!!repasswordError}
              className="px-3 py-2"
            />
            <Form.Control.Feedback type="invalid">
              {repasswordError}
            </Form.Control.Feedback>
          </Form.Group>
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
          <button
            type="submit"
            className="w-full mt-3 py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-green-600 hover:bg-green-700 transition hover:scale-105"
          >
            {loading ? "Đang xác nhận..." : "Đổi mật khẩu"}
          </button>
        </Form>
        {showPopup && (
          <PopupMessage
            show={showPopup}
            onHide={() => setShowPopup(false)}
            message="Bạn đã thay đổi mật khẩu thành công"
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UpdatePassword;
