import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../forgotpassword/PopUpSuccess";

const RegisterSuccess = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { token } = useParams("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(token);
    if (token !== null) {
      axios
        .get(`http://localhost:8080/verify/${token}`)
        .then((response) => {
          console.log("User:", response.data);
          setShowPopup(true); // Hiển thị popup khi thành công
          setTimeout(() => {
            setShowPopup(false); // Ẩn popup sau 3 giây
            navigate("/login"); //chuyển sang trang login sau khi thông báo
          }, 3000);
        })
        .catch((error) => {
          console.error("Error:", error);
          // Xử lý lỗi ở đây
        });
    }
  }, [navigate, token]);

  return (
    <div>
      {showPopup && (
        <Popup message="Your account has been successfully verified!" />
      )}
    </div>
  );
};

export default RegisterSuccess;
