import {
  faCalendarDays,
  faUser,
  faClock,
  faMoneyBillTransfer,
  faMotorcycle,
  faCircleXmark,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { format } from "date-fns";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import PopUpConfirm from "./PopUpConfirm";
import PopUpSuccess from "./PopUpSuccess";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "../booking/FeedbackModal";
import apiClient from "../../axiosConfig";
import { CircularProgress, LinearProgress } from "@mui/material";

const BookingCard = ({ booking }) => {
  const [motorbikeName, setMotorbikeName] = useState();
  const [motorbikePlate, setMotorbikePlate] = useState();
  const [lessorName, setLessorName] = useState();
  const [lessorId, setLessorId] = useState();
  const [renterName, setRenterName] = useState();
  const [renterIdNoti, setRenterIdNoti] = useState();
  const [renterSystemNoti, setRenterSystemNoti] = useState();
  const [renterEmailNoti, setRenterEmailNoti] = useState();
  const [renterMinimizeNoti, setRenterMinimizeNoti] = useState();
  const [urlImage, setUrlImage] = useState();
  const [messageConfirm, setMessageConfirm] = useState();
  const [showPopUp, setShowPopUp] = useState(false);
  const [showPopupSuccess, setShowPopupSuccess] = useState(false);
  const [action, setAction] = useState("");
  const navigate = useNavigate();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const userId = userData ? userData.userId : null;
  const userName = userData
    ? userData.firstName + " " + userData.lastName
    : null;
  const userEmail = userData ? userData.email : null;
  const emailNoti = userData ? userData.emailNoti : null;
  const systemNoti = userData ? userData.systemNoti : null;
  const minimizeNoti = userData ? userData.minimizeNoti : null;

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
        const response = await apiClient.get(
          `/api/motorbike/${booking.motorbikeId}`
        );
        setMotorbikeName(
          `${response.data.model.modelName} ${response.data.yearOfManufacture}`
        );
        setLessorName(
          `${response.data.user.firstName} ${response.data.user.lastName}`
        );
        setMotorbikePlate(`${response.data.motorbikePlate}`);
        setLessorId(response.data.user.id);
        setUrlImage(response.data.motorbikeImages[0].url);
        console.log(lessorId);
        const response1 = await apiClient.get(
          `/api/motorbike/existMotorbikeByUserId/${booking.motorbikeId}/${userData.userId}`
        );
        setMotorbike(response1.data);

        const response2 = await apiClient.get(`/api/user/${booking.renterId}`);
        console.log(response2);
        setRenterIdNoti(booking.renterId);
        setRenterName(`${response2.data.firstName} ${response2.data.lastName}`);
        setRenterSystemNoti(response2.systemNoti);
        console.log(response2);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetcMotorbike();
  }, [booking.motorbikeId, userData.userId, booking.id]);

  const openBookingDetail = () => {
    localStorage.setItem("booking", JSON.stringify(booking));
    window.open("/bookingDetail", "_blank");
  };

  const openManageBooking = () => {
    localStorage.setItem("booking", JSON.stringify(booking));
    window.open("/manageBooking", "_blank");
  };

  const handleAction = async (actionType) => {
    console.log(lessorId);
    console.log(lessorName);
    console.log(renterName);
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
        const response2 = await apiClient.get(`/api/user/${booking.renterId}`);
        console.log(response2.data.firstName + " " + response2.data.lastName);
        setRenterName(response2.data.firstName + " " + response2.data.lastName);
        setMessageConfirm(
          `Bạn có chắc chắn muốn thanh toán ${(
            (booking.totalPrice * 30) /
            100
          ).toLocaleString("vi-VN")}đ tiền cọc?`
        );
        setAction("DEPOSIT_MADE");
        break;
      default:
        return;
    }
    setShowPopUp(true);
  };

  const handleConfirm = async () => {
    setShowPopUp(false);
    const formattedStartDate = dayjs(booking.startDate).format(
      "HH:mm DD/MM/YYYY"
    );
    const formattedEndDate = dayjs(booking.endDate).format("HH:mm DD/MM/YYYY");
    setLoading(true);
    try {
      const url = `/api/booking/changeStatus/${booking.bookingId}/${action}`;
      await apiClient.put(url);
      const now = new Date();

      switch (action) {
        case "PENDING_DEPOSIT":
          if (systemNoti) {
            await setDoc(doc(collection(db, "notifications")), {
              userId: userId,
              message: JSON.stringify({
                title:
                  '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
                content: `Bạn đã duyệt đơn thuê xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong>, thời gian thuê xe từ <strong>${formattedStartDate}</strong> đến <strong>${formattedEndDate}</strong>`,
              }),
              timestamp: now,
              seen: false,
            });
          }
          await setDoc(doc(collection(db, "notifications")), {
            userId: renterIdNoti,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Chủ xe ${lessorName} đã duyệt đơn thuê xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong>, thời gian thuê xe từ <strong>${formattedStartDate}</strong> đến <strong>${formattedEndDate}</strong>. Bạn hãy đặt cọc chuyến xe này để hoàn tất thủ tục đặt xe. `,
            }),
            timestamp: now,
            seen: false,
          });

          break;
        case "RENTING":
          await setDoc(doc(collection(db, "notifications")), {
            userId: userId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong> đã được giao thành công.`,
            }),
            timestamp: now,
            seen: false,
          });
          await setDoc(doc(collection(db, "notifications")), {
            userId: renterIdNoti,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong> đã được giao thành công. Chúc bạn có một chuyến đi vui vẻ.`,
            }),
            timestamp: now,
            seen: false,
          });
          break;
        case "DONE":
          const admin = await apiClient.get("api/user/getAdmin");
          const adminId = admin.data.id;
          const subtractMoneyUrlDone = `/api/payment/subtract`;
          const addMoneyUrlDone = `/api/payment/add`;
          const amountDone = (booking.totalPrice * 30) / 200;
          await apiClient.post(addMoneyUrlDone, null, {
            params: { id: userId, amount: amountDone },
          });
          await apiClient.post(subtractMoneyUrlDone, null, {
            params: { id: adminId, amount: amountDone },
          });
          await setDoc(doc(collection(db, "notifications")), {
            userId: userId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Chuyến đi với xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong> đã hoàn thành.`,
            }),
            timestamp: now,
            seen: false,
          });
          await setDoc(doc(collection(db, "notifications")), {
            userId: renterIdNoti,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Chuyến đi với xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong> đã hoàn thành.`,
            }),
            timestamp: now,
            seen: false,
          });
          break;
        case "DEPOSIT_MADE":
          console.log(renterName);
          console.log(lessorId);
          await setDoc(doc(collection(db, "notifications")), {
            userId: userId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Bạn đã thanh toán tiền cọc cho xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong>. Hãy theo dõi lịch của chuyến để nhận xe đúng hẹn.`,
            }),
            timestamp: now,
            seen: false,
          });
          await setDoc(doc(collection(db, "notifications")), {
            userId: lessorId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Khách thuê <strong>${renterName}</strong> đã thanh toán tiền cọc cho xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong>. Hãy theo dõi lịch của chuyến để giao xe đúng hẹn.`,
            }),
            timestamp: now,
            seen: false,
          });
          const adminData = await apiClient.get("api/user/getAdmin");
          const adminDataId = adminData.data.id;
          const renterId = userData.userId; // Replace with actual user ID if different
          const amount = (booking.totalPrice * 30) / 100; // Replace with actual amount to be subtracted
          const subtractMoneyUrl = `/api/payment/subtract`;
          const addMoneyUrl = `/api/payment/add`;
          await apiClient.post(subtractMoneyUrl, null, {
            params: { id: renterId, amount: amount, motorbikeName : motorbikeName, motorbikePlate : motorbikePlate },
          });
          await apiClient.post(addMoneyUrl, null, {
            params: { id: adminDataId, amount: amount, motorbikeName : motorbikeName, motorbikePlate : motorbikePlate },
          });
          break;
        default:
          return;
      }

      // setShowPopUp(false);
      // setShowPopupSuccess(true); // Show success popup
      // setTimeout(() => {
      //   setShowPopupSuccess(false); // Hide success popup after 3 seconds
      //   window.location.reload(); // Navigate to myBooking page
      // }, 3000);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setShowPopupSuccess(true);
    }
  };

  const handlePopUpSuccess = () => {
    setShowPopupSuccess(false);
    window.location.reload();
  };

  const { text, icon, color } = statusDetails[booking.status] || {};

  return booking.userId === 1 ? null : (
    <div className="relative">
      {/* Overlay with CircularProgress */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10">
          <CircularProgress color="inherit" />
        </div>
      )}
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
        <div className="flex flex-wrap w-full">
          <div className="flex-1 w-full md:w-2/3 lg:w-3/4">
            <div className="flex flex-col md:flex-row mb-4">
              <img
                className="object-cover rounded-lg w-full md:w-1/2"
                style={{ height: "200px" }}
                src={urlImage}
                alt="Motorbike"
              />
              <div className="pl-4 w-full md:w-1/2">
                <h2 className="text-xl font-bold mb-2">{motorbikeName}</h2>
                <div className="flex items-center mb-2 text-gray-600">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    size="lg"
                    color="gray"
                  />
                  <span className="ml-2">
                    Ngày bắt đầu: {format(new Date(booking.startDate), "Pp")}
                  </span>
                </div>
                <div className="flex items-center mb-2 text-gray-600">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    size="lg"
                    color="gray"
                  />
                  <span className="ml-2">
                    Ngày kết thúc: {format(new Date(booking.endDate), "Pp")}
                  </span>
                </div>
                <div className="flex  mb-2 text-gray-600">
                  <FontAwesomeIcon icon={faUser} size="lg" />
                  <span className="ml-2 font-extrabold">
                    Chủ xe: {lessorName}
                  </span>
                </div>
                <div className="font-bold text-lg">
                  Tổng chi phí: {booking.totalPrice.toLocaleString("vi-VN")} vnd
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-start ml-4 w-full md:w-1/3 lg:w-1/4">
            {motorbike ? (
              <>
                {booking.status === "PENDING" && (
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:bg-green-600 hover:scale-105"
                    onClick={() => handleAction("accept")}
                  >
                    Chấp nhận
                  </button>
                )}
                {booking.status === "DEPOSIT_MADE" && (
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:bg-green-600 hover:scale-105"
                    onClick={() => handleAction("renting")}
                  >
                    Giao xe
                  </button>
                )}
                {booking.status === "RENTING" && (
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:bg-green-600 hover:scale-105"
                    onClick={() => handleAction("done")}
                  >
                    Hoàn thành
                  </button>
                )}
                <button
                  className="bg-orange-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:bg-orange-600 hover:scale-105"
                  onClick={openManageBooking}
                >
                  Xem chi tiết
                </button>
              </>
            ) : (
              <>
                {booking.status === "DONE" && (
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:bg-green-600 hover:scale-105"
                    onClick={openFeedback}
                  >
                    Đánh giá
                  </button>
                )}
                {booking.status === "PENDING_DEPOSIT" && (
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:bg-green-600 hover:scale-105"
                    onClick={() => handleAction("deposit_made")}
                  >
                    Đặt cọc
                  </button>
                )}
                <button
                  className="bg-orange-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:bg-orange-600 hover:scale-105"
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
            onHide={handlePopUpSuccess}
            message="Bạn đã cập nhật thành công trạng thái chuyến !"
          />
        )}
      </div>
    </div>
  );
};

export default BookingCard;
