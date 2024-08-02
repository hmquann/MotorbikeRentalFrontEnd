import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiClient from "../../axiosConfig";
import PopupMessage from "./PopupMessage";

const ChangeEmail = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email không được để trống");
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient
      .post(
        "/api/auth/changeEmail",
        {
          userId: userData.userId,
          newEmail: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setShowPopup(true); // Show popup on success
        setTimeout(() => {
          setShowPopup(false); // Hide popup after 3 seconds // Redirect to login after popup
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        setError(translations[error.response.data]);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const translations = {
    "Email existed": "Email này đã tồn tại. Vui lòng thử lại",
    // Add other translations here
  };

  return (
    <Modal show={show} onHide={handleClose} className="font-manrope">
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Control
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Email mới"
              className="mb-2 py-2 px-3"
            />
            {error && (
              <Form.Text className="text-danger ml-1 text-xl mb-1 font-semibold" >
                {error}
              </Form.Text>
            )}
          </Form.Group>
          <button
            type="submit"
            className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-green-600 hover:bg-green-700 transition hover:scale-105"
          >
            {loading ? "Đang xử lý..." : "Cập nhật"}
          </button>
        </Form>
        {showPopup && (
          <PopupMessage
            show={showPopup}
            onHide={() => setShowPopup(false)}
            message="Yêu cầu thay đổi đã được gửi đến Email của bạn. Vui lòng xác nhận"
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ChangeEmail;
