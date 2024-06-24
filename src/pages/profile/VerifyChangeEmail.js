import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PopupMessage from "./PopupMessage";

const VerifyChangeEmail = () => {
  const [showPopup, setShowPopup] = useState(true);
  const { token, newEmail } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(token);
    if (token !== null) {
      axios
        .post(`http://localhost:8080/updateEmail/${token}/${newEmail}`)
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
        <PopupMessage message="Your account's email has been successfully changed!" />
      )}
    </div>
  );
};

export default VerifyChangeEmail;
