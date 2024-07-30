import {
  faCalendarDays,
  faUser,
  faClock,
  faMoneyBillTransfer,
  faMotorcycle,
  faCircleXmark,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { format } from "date-fns";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import PopUpConfirm from "./PopUpConfirm";
import PopUpSuccess from "./PopUpSuccess";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "../booking/FeedbackModal";

const BookingCard = ({ booking }) => {
  const [motorbikeName, setMotorbikeName] = useState();
  const [lessorName, setLessorName] = useState();
  const [urlImage, setUrlImage] = useState();
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);

  const [messageConfirm, setMessageConfirm] = useState();
  const [showPopUp, setShowPopUp] = useState(false);
  const [showPopupSuccess, setShowPopupSuccess] = useState(false);
  const [action, setAction] = useState("");
  const navigate = useNavigate();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const statusDetails = {
    PENDING: { text: "Chờ duyệt", icon: faClock, color: "text-orange-500" },
    PENDING_DEPOSIT: {
      text: "Chờ đặt cọc",
      icon: faClock,
      color: "text-orange-500",
    },
    DEPOSIT_MADE: {
      text: "Đã đặt cọc",
      icon: faMoneyBillTransfer,
      color: "text-green-500",
    },
    DONE: {
      text: "Đã hoàn thành",
      icon: faCircleCheck,
      color: "text-green-500",
    },
    RENTING: {
      text: "Đang trong chuyến",
      icon: faMotorcycle,
      color: "text-green-500",
    },
    CANCELED: {
      text: "Đã hủy",
      icon: faCircleXmark,
      color: "text-red-500",
    },
    REJECTED: {
      text: "Đã từ chối",
      icon: faCircleXmark,
      color: "text-red-500",
    },
  };
  const openFeedback = () => {
    setShowFeedbackModal(true);
  };

  const closeFeedback = () => {
    setShowFeedbackModal(false);
  };

  const [motorbike, setMotorbike] = useState();
  useEffect(() => {
    const fetcMotorbike = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/motorbike/${booking.motorbikeId}`
        );
        setMotorbikeName(
          `${response.data.model.modelName} ${response.data.yearOfManufacture}`
        );
        setLessorName(
          `${response.data.user.firstName} ${response.data.user.lastName}`
        );
        setUrlImage(response.data.motorbikeImages[0].url);

        const response1 = await axios.get(
          `http://localhost:8080/api/motorbike/existMotorbikeByUserId/${booking.motorbikeId}/${userData.userId}`
        );
        setMotorbike(response1.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetcMotorbike();
  }, [booking.motorbikeId, userData.userId]);

  const openBookingDetail = () => {
    localStorage.setItem("booking", JSON.stringify(booking));
    window.open("/bookingDetail", "_blank");
  };

  const openManageBooking = () => {
    localStorage.setItem("booking", JSON.stringify(booking));
    window.open("/manageBooking", "_blank");
  };

  const handleAction = (actionType) => {
    switch (actionType) {
      case "accept":
        setMessageConfirm("Bạn có chắc chắn muốn duyệt chuyến này?");
        setAction("PENDING_DEPOSIT");
        break;
      case "renting":
        setMessageConfirm("Bạn có chắc chắn muốn giao xe?");
        setAction("RENTING");
        break;
      case "done":
        setMessageConfirm("Bạn có chắc chắn chuyến đi đã hoàn thành?");
        setAction("DONE");
        break;
      case "deposit_made":
        setMessageConfirm("Bạn có chắc chắn muốn đặt cọc?");
        setAction("DEPOSIT_MADE");
        break;
      default:
        return;
    }
    setShowPopUp(true);
  };

  const handleConfirm = async () => {
    try {
      const url = `http://localhost:8080/api/booking/changeStatus/${booking.bookingId}/${action}`;
      await axios.put(url);
      setShowPopUp(false);
      setShowPopupSuccess(true); // Show success popup
      setTimeout(() => {
        setShowPopupSuccess(false); // Hide success popup after 3 seconds
        window.location.reload(); // Navigate to myBooking page
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const { text, icon, color } = statusDetails[booking.status] || {};

  return booking.userId === 1 ? null : (
    <div
      className="bg-card p-4 rounded-lg mb-4 border border-gray-300"
      style={{ backgroundColor: "white" }}
    >
      <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
        <span className={`text-sm text-muted-foreground ${color}`}>
          <FontAwesomeIcon icon={icon} style={{ color }} /> {text}
        </span>
        <span>{dayjs(booking.bookingTime).format("HH:mm, DD/MM/YYYY")}</span>
      </div>
      <div className="flex">
        <div className="flex-1">
          <div className="flex mb-4">
            <img
              className="object-cover rounded-t-lg"
              style={{ height: "200px", width: "350px" }}
              src={urlImage}
              alt="Motorbike"
            />
            <div className="pl-4">
              <h2 className="text-xl font-bold mb-2">{motorbikeName}</h2>
              <div className="flex items-center mb-2 text-gray-600">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  size="lg"
                  color="gray"
                ></FontAwesomeIcon>
                <span>
                  &nbsp;&nbsp;Start date:{" "}
                  {format(new Date(booking.startDate), "Pp")}
                </span>
              </div>
              <div className="flex items-center mb-2 text-gray-600">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  size="lg"
                  color="gray"
                ></FontAwesomeIcon>
                <span>
                  &nbsp;&nbsp;End date:{" "}
                  {format(new Date(booking.endDate), "Pp")}
                </span>
              </div>
              <div className="flex items-center mb-2 text-gray-600">
                <FontAwesomeIcon icon={faUser} size="lg"></FontAwesomeIcon>
                <span>&nbsp;&nbsp;{lessorName}</span>
              </div>
              <div className="font-bold text-lg">
                Total price: {booking.totalPrice.toLocaleString("vi-VN")} vnd
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start ml-4">
          {motorbike ? (
            <>
              {booking.status === "PENDING" && (
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center hover:scale-105"
                  style={{ backgroundColor: "#5fcf86" }}
                  onClick={() => handleAction("accept")}
                >
                  Chấp nhận
                </button>
              )}
              {booking.status === "DEPOSIT_MADE" && (
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center hover:scale-105"
                  style={{ backgroundColor: "#5fcf86" }}
                  onClick={() => handleAction("renting")}
                >
                  Giao xe
                </button>
              )}
              {booking.status === "RENTING" && (
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center hover:scale-105"
                  style={{ backgroundColor: "#5fcf86" }}
                  onClick={() => handleAction("done")}
                >
                  Hoàn thành
                </button>
              )}
              <button
                className="bg-green-500 text-white py-2 px-4 rounded w-full text-center hover:scale-105"
                style={{ backgroundColor: "#5fcf86" }}
                onClick={openManageBooking}
              >
                Xem chi tiết
              </button>
            </>
          ) : (
            <>
              {booking.status === "DONE" && (
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center hover:scale-105"
                  style={{ backgroundColor: "#5fcf86" }}
                  onClick={openFeedback}
                >
                  Đánh giá
                </button>
              )}
              {booking.status === "PENDING_DEPOSIT" && (
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center hover:scale-105"
                  style={{ backgroundColor: "#5fcf86" }}
                  onClick={() => handleAction("deposit_made")}
                >
                  Đặt cọc
                </button>
              )}
              <button
                className="bg-green-500 text-white py-2 px-4 rounded w-full text-center hover:scale-105"
                style={{ backgroundColor: "#5fcf86" }}
                onClick={openBookingDetail}
              >
                Xem chi tiết
              </button>
            </>
          )}
          <FeedbackModal
            show={showFeedbackModal}
            onHide={closeFeedback}
            bookingId={booking.bookingId}
            onFeedbackSubmitted={() => setFeedbackSent(true)}
          />
        </div>
      </div>
      {showPopUp && (
        <PopUpConfirm
          show={showPopUp}
          message={messageConfirm}
          onConfirm={handleConfirm}
          onCancel={() => setShowPopUp(false)}
        />
      )}
      {showPopupSuccess && (
       <PopUpSuccess
       show={showPopupSuccess}
       onHide={() => setShowPopupSuccess(false)}
       message="Bạn đã cập nhật thành công trạng thái chuyến !"
       />
      )}
    </div>
  );
};

export default BookingCard;
