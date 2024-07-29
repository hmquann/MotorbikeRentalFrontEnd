import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../forgotpassword/PopUpSuccess";
import apiClient from "../../axiosConfig";

const RegisterSuccess = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { token } = useParams("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(token);
    if (token !== null) {
      apiClient
        .get(`/verify/${token}`)
        .then((response) => {
          console.log("User:", response.data);
          setShowPopup(true); 
          setTimeout(() => {
            setShowPopup(false); 
            navigate("/homepage"); 
          }, 3000);
        })
        .catch((error) => {
          console.error("Error:", error);
          // Xử lý lỗi ở đây
        });
    }
  }, [navigate, token]);

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/homepage');
  };

  return (
    <div>
      <Popup 
        show={showPopup}
        onHide={handleClosePopup}
        message="Tài khoản của bạn đã được xác nhận!"
      />
    </div>
  );
};

export default RegisterSuccess;
