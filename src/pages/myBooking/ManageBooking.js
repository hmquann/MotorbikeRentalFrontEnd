import { faCalendarDays, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import RentalDocument from "../booking/rentaldocument/RentalDocument";
import PopUpConfirm from "./PopUpConfirm";
import { useNavigate } from "react-router-dom";
import PopUpSuccess from "./PopUpSuccess";
import apiClient from "../../axiosConfig";
import { CircularProgress } from "@mui/material";
import PopUpReasonManage from "./PopUpReasonManage";
import { FaMotorcycle } from "react-icons/fa";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import FeedbackList from "../booking/FeedbackList";
import MapModal from "./MapModal";

const statusTranslations = {
  PENDING: "Chờ duyệt",
  PENDING_DEPOSIT: "Chờ đặt cọc",
  DEPOSIT_MADE: "Đã đặt cọc",
  DONE: "Hoàn thành",
  RENTING: "Đang trong chuyến",
  CANCELED: "Đã hủy",
  REJECTED: "Đã từ chối",
};

const statusStyles = {
  PENDING: {
    bg: "bg-orange-200",
    text: "text-orange-600",
    icon: "fa-regular fa-clock",
  },
  PENDING_DEPOSIT: {
    bg: "bg-orange-200",
    text: "text-orange-600",
    icon: "fa-regular fa-clock",
  },
  DEPOSIT_MADE: {
    bg: "bg-green-200",
    text: "text-green-600",
    icon: "fa-solid fa-money-bill-transfer",
  },
  DONE: {
    bg: "bg-green-200",
    text: "text-green-600",
    icon: "fa-solid fa-money-bill-transfer",
  },
  RENTING: {
    bg: "bg-green-200",
    text: "text-green-600",
    icon: "fa-solid fa-motorcycle",
  },
  REJECTED: {
    bg: "bg-red-200",
    text: "text-red-600",
    icon: "fa-regular fa-circle-xmark",
  },
  CANCELED: {
    bg: "bg-red-200",
    text: "text-red-600",
    icon: "fa-regular fa-circle-xmark",
  },
};

export default function Widget() {
  const booking = JSON.parse(localStorage.getItem("booking"));
  const [motorbikeName, setMotorbikeName] = useState();
  const [lessorName, setLessorName] = useState();
  const [urlImage, setUrlImage] = useState();
  const [motorbikePlate, setMotorbikePlate] = useState();
  const [motorbikeDeliveryFee, setMotorbikeDeliveryFee] = useState();
  const [motorbikeOvertimeFee, setMotorbikeOvertimeFee] = useState();
  const [showPopUpReason, setShowPopUpReason] = useState(false);
  const [lessorId, setLessorId] = useState();
  const [renterId, setRenterId] = useState();
  const [renterName, setRenterName] = useState();
  const [renterPhone, setRenterPhone] = useState();
  const [pricePerDay, setPricePerDay] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [action, setAction] = useState("");
  const [showPopupSuccess, setShowPopupSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [renter, setRenter] = useState();
  const [lessor, setLessor] = useState();
  const [motorbike, setMotorbike] = useState();
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
  const navigate = useNavigate();
  const [motorbikeLocation, setMotorbikeLocation] = useState();
  const [motorbikeOvertimeLimit, setMotorbikeOvertimeLimit] = useState();
  const [viewMap, setViewMap] = useState(false);
  useEffect(() => {
    const fetchMotorbike = async () => {
      try {
        const response = await apiClient.get(
          `/api/motorbike/${booking.motorbikeId}`
        );
        console.log(response.data);
        setMotorbikeName(
          `${response.data.model.modelName} ${response.data.yearOfManufacture}`
        );
        setMotorbike(response.data);
        setMotorbikeDeliveryFee(`${response.data.deliveryFee}`);
        setMotorbikeOvertimeFee(`${response.data.overtimeFee}`);
        setMotorbikeOvertimeLimit(`${response.data.overtimeLimit}`);
        console.log(motorbikeOvertimeFee);
        setMotorbikePlate(`${response.data.motorbikePlate}`);
        setLessorName(
          `${response.data.user.firstName} ${response.data.user.lastName}`
        );
        setMotorbikeLocation({
          longitude: response.data.longitude,
          latitude: response.data.latitude,
        });
        setLessor(response.data.user);
        setUrlImage(response.data.motorbikeImages[0].url);
        setLessorId(response.data.user.userId);

        const response2 = await apiClient.get(`/api/user/${booking.renterId}`);
        console.log(response2.data);
        setRenterName(response2.data.firstName + " " + response2.data.lastName);
        setRenter(response2.data);
        setRenterId(response2.data.id);
        console.log(response2.data.id);
        setRenterPhone(response2.data.phone);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMotorbike();
  }, [booking.motorbikeId, booking.renterId]);

  const statusStyle = statusStyles[booking.status];

  const handleChatting = () => {
    try {
      const response4 = apiClient.post("/api/chatting/create", {
        emailUser1: lessor.email,
        emailUser2: renter.email,
      });
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/menu/chatting");
    }
  };
  const handleClick = (userId) => {
    navigate(`/userCard/${userId}`);
  };

  const handleAction = (actionType) => {
    if (actionType === "reject") {
      setShowPopUpReason(true);
    } else {
      setPopupContent(
        actionType === "accept"
          ? "Bạn có chắc chắn muốn duyệt chuyến này?"
          : actionType === "reject"
          ? "Bạn có chắc chắn muốn từ chối chuyến này?"
          : actionType === "deliver"
          ? "Bạn có chắc chắn muốn giao xe cho chuyến này?"
          : "Bạn có chắc chắn muốn hoàn thành chuyến này?"
      );
      setAction(actionType);
      setShowPopup(true);
    }
  };

  const handleSendReason = async (
    reason,
    isLessThanTwoDays,
    isMoreThanTwoDays
  ) => {
    setShowPopUpReason(false);
    const now = new Date();
    setLoading(true);
    try {
      if (renter.emailNoti) {
        const response3 = apiClient.post(
          "/api/booking/sendEmailRejectBooking",
          {
            renterName: renterName,
            renterEmail: renter.email,
            motorbikeName:
              motorbike.model.modelName + " " + motorbike.yearOfManufacture,
            motorbikePlate: motorbike.motorbikePlate,
            bookingTime: dayjs(booking.bookingTime).format(
              "YYYY-MM-DDTHH:mm:ss"
            ),
            startDate: dayjs(booking.startDate).format("YYYY-MM-DDTHH:mm:ss"),
            endDate: dayjs(booking.endDate).format("YYYY-MM-DDTHH:mm:ss"),
            totalPrice: booking.totalPrice,
            receiveLocation: booking.receiveLocation,
            reason: reason,
          }
        );
      }
      if (emailNoti) {
        const response5 = apiClient.post(
          "/api/booking/sendEmailRejectBookingForLessor",
          {
            lessorName: userName,
            lessorEmail: userEmail,
            renterName: renterName,
            motorbikeName:
              motorbike.model.modelName + " " + motorbike.yearOfManufacture,
            motorbikePlate: motorbike.motorbikePlate,
            bookingTime: dayjs(booking.bookingTime).format(
              "YYYY-MM-DDTHH:mm:ss"
            ),
            startDate: dayjs(booking.startDate).format("YYYY-MM-DDTHH:mm:ss"),
            endDate: dayjs(booking.endDate).format("YYYY-MM-DDTHH:mm:ss"),
            totalPrice: booking.totalPrice,
            receiveLocation: booking.receiveLocation,
            reason: reason,
          }
        );
      }
      if (systemNoti) {
        await setDoc(doc(collection(db, "notifications")), {
          userId: userId,
          message: JSON.stringify({
            title:
              '<strong style="color: rgb(197 34 34)">Từ chối thuê xe</strong>',
            content: `Bạn đã từ chối thuê xe <strong>${motorbike.model.modelName} ${motorbike.yearOfManufacture}</strong>, biển số <strong>${motorbike.motorbikePlate}</strong> với lí do <strong>${reason}</strong>.`,
          }),
          timestamp: now,
          seen: false,
        });
      }
      if (renter.systemNoti) {
        await setDoc(doc(collection(db, "notifications")), {
          userId: booking.renterId,
          message: JSON.stringify({
            title:
              '<strong style="color: rgb(197 34 34)">Từ chối thuê xe</strong>',
            content: `<strong>${userName}</strong> đã từ chối thuê xe <strong>${motorbike.model.modelName} ${motorbike.yearOfManufacture}</strong>, biển số <strong>${motorbike.motorbikePlate}</strong> của bạn với lí do <strong>${reason}</strong>.`,
          }),
          timestamp: now,
          seen: false,
        });
      }
      let status = "REJECTED";
      const url = `/api/booking/changeStatus/${booking.bookingId}/${status}`;
      await apiClient.put(url);
      const changeNoti = await apiClient.post(
        `/api/booking/changeDepositNotification/${booking.bookingId}`
      );
      const changeCanceled = await apiClient.post(
        `/api/booking/changeDepositCanceled/${booking.bookingId}`
      );

      const admin = await apiClient.get("api/user/getAdmin");
      const adminId = admin.data.id;
      const refundMoneyUrl = `/api/payment/refund`;
      const amount = (booking.totalPrice * 50) / 100;
      const amount65 = (booking.totalPrice * 65) / 100;
      const amount35 = (booking.totalPrice * 35) / 100;
      const amount30 = (((booking.totalPrice * 50) / 100) * 30) / 100;
      const amount130 = (((booking.totalPrice * 50) / 100) * 30) / 100;
      const amountFull = booking.totalPrice;
      if (isLessThanTwoDays) {
        await apiClient.post(refundMoneyUrl, null, {
          params: {
            senderId: adminId,
            receiverId: renterId,
            amount: amountFull,
            motorbikeName: motorbikeName,
            motorbikePlate: motorbikePlate,
          },
        });
      }
      if (isMoreThanTwoDays) {
        await apiClient.post(refundMoneyUrl, null, {
          params: {
            senderId: adminId,
            receiverId: renterId,
            amount: amount65,
            motorbikeName: motorbikeName,
            motorbikePlate: motorbikePlate,
          },
        });
        await apiClient.post(refundMoneyUrl, null, {
          params: {
            senderId: adminId,
            receiverId: lessorId,
            amount: amount35,
            motorbikeName: motorbikeName,
            motorbikePlate: motorbikePlate,
          },
        });
      }
      if (!isMoreThanTwoDays && !isLessThanTwoDays) {
        await apiClient.post(refundMoneyUrl, null, {
          params: {
            senderId: adminId,
            receiverId: renterId,
            amount: amount,
            motorbikeName: motorbikeName,
            motorbikePlate: motorbikePlate,
          },
        });
        await apiClient.post(refundMoneyUrl, null, {
          params: {
            senderId: adminId,
            receiverId: lessorId,
            amount: amount,
            motorbikeName: motorbikeName,
            motorbikePlate: motorbikePlate,
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setShowPopupSuccess(true);
    }
  };
  const handleConfirm = async () => {
    setShowPopup(false);
    setLoading(true);
    const formattedStartDate = dayjs(booking.startDate).format(
      "HH:mm DD/MM/YYYY"
    );
    const formattedEndDate = dayjs(booking.endDate).format("HH:mm DD/MM/YYYY");
    setLoading(true);
    const now = new Date();
    try {
      let status;
      if (action === "accept") {
        status = "PENDING_DEPOSIT";
      } else if (action === "reject") {
        status = booking.status === "PENDING_DEPOSIT" ? "REJECTED" : "REJECTED";
      } else if (action === "deliver") {
        status = "RENTING";
      } else if (action === "complete") {
        status = "DONE";
      }
      const url = `/api/booking/changeStatus/${booking.bookingId}/${status}`;
      await apiClient.put(url);

      if (status === "REJECTED") {
        setShowPopUpReason(true);
        // await setDoc(doc(collection(db, "notifications")), {
        //   userId: userId,
        //   message: JSON.stringify({
        //     title: '<strong style="color: red">Từ chối cho thuê</strong>',
        //     content: `Bạn đã từ chối việc đặt xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong>.`,
        //   }),
        //   timestamp: now,
        //   seen: false,
        // });
        // await setDoc(doc(collection(db, "notifications")), {
        //   userId: booking.renterId,
        //   message: JSON.stringify({
        //     title: '<strong style="color: red">Từ chối cho thuê</strong>',
        //     content: `Chủ xe <strong>${userName}</strong> đã từ chối việc đặt xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong>.`,
        //   }),
        //   timestamp: now,
        //   seen: false,
        // });
      } else if (status === "PENDING_DEPOSIT") {
        if (systemNoti) {
          await setDoc(doc(collection(db, "notifications")), {
            userId: userId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Bạn đã duyệt đơn thuê xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong>, thời gian thuê xe từ <strong>${formattedStartDate}</strong> đến <strong>${formattedEndDate}</strong>`,
            }),
            timestamp: now,
            seen: false,
          });
        }
        if (renter.systemNoti) {
          await setDoc(doc(collection(db, "notifications")), {
            userId: booking.renterId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Chủ xe ${userName} đã duyệt đơn thuê xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong>, thời gian thuê xe từ <strong>${formattedStartDate}</strong> đến <strong>${formattedEndDate}</strong>. Bạn hãy đặt cọc chuyến xe này để hoàn tất thủ tục đặt xe. `,
            }),
            timestamp: now,
            seen: false,
          });
        }
        if (emailNoti) {
          const response3 = apiClient.post(
            "/api/booking/sendEmailApproveBookingForLessor",
            {
              lessorName: userName,
              lessorEmail: userEmail,
              renterName: renterName,
              motorbikeName:
                motorbike.model.modelName + " " + motorbike.yearOfManufacture,
              motorbikePlate: motorbike.motorbikePlate,
              bookingTime: dayjs(booking.bookingTime).format(
                "YYYY-MM-DDTHH:mm:ss"
              ),
              startDate: dayjs(booking.startDate).format("YYYY-MM-DDTHH:mm:ss"),
              endDate: dayjs(booking.endDate).format("YYYY-MM-DDTHH:mm:ss"),
              totalPrice: booking.totalPrice,
              receiveLocation: booking.receiveLocation,
            }
          );
        }
        if (renter.emailNoti) {
          const response5 = apiClient.post(
            "/api/booking/sendEmailApproveBooking",
            {
              renterName: renterName,
              renterEmail: renter.email,
              motorbikeName:
                motorbike.model.modelName + " " + motorbike.yearOfManufacture,
              motorbikePlate: motorbike.motorbikePlate,
              bookingTime: dayjs(booking.bookingTime).format(
                "YYYY-MM-DDTHH:mm:ss"
              ),
              startDate: dayjs(booking.startDate).format("YYYY-MM-DDTHH:mm:ss"),
              endDate: dayjs(booking.endDate).format("YYYY-MM-DDTHH:mm:ss"),
              totalPrice: booking.totalPrice,
              receiveLocation: booking.receiveLocation,
            }
          );
        }
      } else if (status === "RENTING") {
        if (systemNoti) {
          await setDoc(doc(collection(db, "notifications")), {
            userId: userId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong> đã được giao thành công.`,
            }),
            timestamp: now,
            seen: false,
          });
        }
        if (renter.systemNoti) {
          await setDoc(doc(collection(db, "notifications")), {
            userId: booking.renterId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong> đã được giao thành công. Chúc bạn có một chuyến đi vui vẻ.`,
            }),
            timestamp: now,
            seen: false,
          });
        }
        if (emailNoti) {
          const response3 = apiClient.post(
            "/api/booking/sendEmailRentingBookingForLessor",
            {
              lessorName: userName,
              lessorEmail: userEmail,
              renterName: renterName,
              motorbikeName:
                motorbike.model.modelName + " " + motorbike.yearOfManufacture,
              motorbikePlate: motorbike.motorbikePlate,
              bookingTime: dayjs(booking.bookingTime).format(
                "YYYY-MM-DDTHH:mm:ss"
              ),
              startDate: dayjs(booking.startDate).format("YYYY-MM-DDTHH:mm:ss"),
              endDate: dayjs(booking.endDate).format("YYYY-MM-DDTHH:mm:ss"),
              totalPrice: booking.totalPrice,
              receiveLocation: booking.receiveLocation,
            }
          );
        }
        if (renter.emailNoti) {
          const response5 = apiClient.post(
            "/api/booking/sendEmailRentingBooking",
            {
              renterName: renterName,
              renterEmail: renter.email,
              motorbikeName:
                motorbike.model.modelName + " " + motorbike.yearOfManufacture,
              motorbikePlate: motorbike.motorbikePlate,
              bookingTime: dayjs(booking.bookingTime).format(
                "YYYY-MM-DDTHH:mm:ss"
              ),
              startDate: dayjs(booking.startDate).format("YYYY-MM-DDTHH:mm:ss"),
              endDate: dayjs(booking.endDate).format("YYYY-MM-DDTHH:mm:ss"),
              totalPrice: booking.totalPrice,
              receiveLocation: booking.receiveLocation,
            }
          );
        }
      } else if (status === "DONE") {
        if (systemNoti) {
          await setDoc(doc(collection(db, "notifications")), {
            userId: userId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Chuyến đi với xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong> đã hoàn thành.`,
            }),
            timestamp: now,
            seen: false,
          });
        }
        if (renter.systemNoti) {
          await setDoc(doc(collection(db, "notifications")), {
            userId: booking.renterId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Chuyến đi với xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong> đã hoàn thành. Bạn có thể đánh giá chuyến ở phần lịch sử chuyến.`,
            }),
            timestamp: now,
            seen: false,
          });
        }
        if (emailNoti) {
          const response3 = apiClient.post(
            "/api/booking/sendEmailDoneBookingForLessor",
            {
              lessorName: userName,
              lessorEmail: userEmail,
              renterName: renterName,
              motorbikeName:
                motorbike.model.modelName + " " + motorbike.yearOfManufacture,
              motorbikePlate: motorbike.motorbikePlate,
              bookingTime: dayjs(booking.bookingTime).format(
                "YYYY-MM-DDTHH:mm:ss"
              ),
              startDate: dayjs(booking.startDate).format("YYYY-MM-DDTHH:mm:ss"),
              endDate: dayjs(booking.endDate).format("YYYY-MM-DDTHH:mm:ss"),
              totalPrice: booking.totalPrice,
              receiveLocation: booking.receiveLocation,
            }
          );
        }
        if (renter.emailNoti) {
          const response5 = apiClient.post(
            "/api/booking/sendEmailDoneBooking",
            {
              renterName: renterName,
              renterEmail: renter.email,
              motorbikeName:
                motorbike.model.modelName + " " + motorbike.yearOfManufacture,
              motorbikePlate: motorbike.motorbikePlate,
              bookingTime: dayjs(booking.bookingTime).format(
                "YYYY-MM-DDTHH:mm:ss"
              ),
              startDate: dayjs(booking.startDate).format("YYYY-MM-DDTHH:mm:ss"),
              endDate: dayjs(booking.endDate).format("YYYY-MM-DDTHH:mm:ss"),
              totalPrice: booking.totalPrice,
              receiveLocation: booking.receiveLocation,
            }
          );
        }
      }
      // setShowPopup(false);
      // setShowPopupSuccess(true); // Show success popup
      // setTimeout(() => {
      //   setShowPopupSuccess(false); // Hide success popup after 3 seconds
      //   navigate("/menu/myBooking"); // Navigate to myBooking page
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
    navigate("/menu/myBooking");
  };

  const handleViewMap = (e) => {
    e.preventDefault();
    setViewMap(true);
  };
  const handleCloseModal = () => {
    setViewMap(false);
  };

  return (
    <div className="relative">
      {loading && (
        <>
          <div className="absolute inset-0 bg-white bg-opacity-75 z-10"></div>
          <div
            className="absolute inset-0 flex justify-center"
            style={{ top: "30%" }}
          >
            <CircularProgress size={80} color="inherit" />
          </div>
        </>
      )}
      <div className="p-12 bg-gray font-manrope">
        <div
          className={`${statusStyle.bg} ${statusStyle.text} p-4 rounded-lg flex items-center mb-6`}
        >
          <FontAwesomeIcon icon={statusStyles.icon} className="mr-2" />
          <span>{statusTranslations[booking.status]}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              <img
                className="object-cover rounded-lg md:mr-4 mb-4 md:mb-0"
                style={{ height: "200px", width: "350px" }}
                src={urlImage}
                alt="Motorbike"
              />
              <div>
                <h2 className="text-2xl font-bold">{motorbikeName}</h2>
                <a
                  href="#"
                  className="text-blue-500 underline"
                  onClick={handleViewMap}
                >
                  Xem lộ trình
                </a>
                <p className="text-gray-600">{booking.receiveLocation}</p>
              </div>
            </div>
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-gray-500">
                    {" "}
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      size="lg"
                      color="gray"
                    />{" "}
                    Bắt đầu thuê xe
                  </h4>
                  <p className="text-gray-700">
                    {dayjs(booking.startDate).format("HH:mm - DD/MM/YYYY")}
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-500">
                    {" "}
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      size="lg"
                      color="gray"
                    />{" "}
                    Kết thúc thuê xe
                  </h4>
                  <p className="text-gray-700">
                    {dayjs(booking.endDate).format("HH:mm - DD/MM/YYYY")}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Điều khoản</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Quy định khác:</li>
                <li>Không sử dụng xe vào mục đích phi pháp, trái pháp luật.</li>
                <li>
                  Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật.
                </li>
                <li>Không sử dụng xe thuê để cầm cố, thế chấp.</li>
                <li>Không chở hàng cấm, hàng hóa có mùi trong xe.</li>
                <li>Không chở hàng quá cước hoặc quá tải.</li>
                <li>Không hút thuốc trong xe.</li>
                <li>
                  Không chở hàng cấm, hàng hóa có mùi trong xe, khách hàng vi
                  phạm sẽ bị phạt vệ sinh xe sạch sẽ hoặc gửi phụ thu phí vệ
                  sinh xe.
                </li>
                <li>
                  Trân trọng cảm ơn, chúc quý khách hàng có những chuyến đi
                  tuyệt vời!
                </li>
              </ul>
            </div>
            <hr className="my-3 border-gray-800"></hr>
            <div className="font-manrope">
              <h6 className="text-2xl font-semibold mb-4">
                Chính sách huỷ chuyến
              </h6>
              <div className="flex flex-col border border-gray-300 rounded-t-lg overflow-hidden">
                <div className="flex font-semibold border-b border-gray-100">
                  <div className="w-4/12 pl-6 items-center py-3 flex text-left border-r border-gray-300">
                    Thời điểm hủy chuyến
                  </div>
                  <div className="w-4/12 p-2 flex items-center justify-center border-r border-gray-300">
                    Khách thuê hủy chuyến
                  </div>
                  <div className="w-4/12 p-2 flex items-center justify-center">
                    Chủ xe hủy chuyến
                  </div>
                </div>
                <div className="flex border-t border-gray-300">
                  <div className="flex items-center w-4/12 pl-6 font-semibold text-left border-r border-gray-300">
                    Trong vòng 1h sau giữ chỗ
                  </div>
                  <div className="w-4/12 p-2 flex flex-col justify-center items-center border-r border-gray-300">
                    <i className="fas fa-check text-green-600 text-2xl mb-1"></i>
                    <svg
                      class="w-6 h-6 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.25 2C6.74 2 2.25 6.49 2.25 12C2.25 17.51 6.74 22 12.25 22C17.76 22 22.25 17.51 22.25 12C22.25 6.49 17.76 2 12.25 2ZM15.84 10.59L12.32 14.11C12.17 14.26 11.98 14.33 11.79 14.33C11.6 14.33 11.4 14.26 11.26 14.11L9.5 12.35C9.2 12.06 9.2 11.58 9.5 11.29C9.79 11 10.27 11 10.56 11.29L11.79 12.52L14.78 9.53C15.07 9.24 15.54 9.24 15.84 9.53C16.13 9.82 16.13 10.3 15.84 10.59Z"
                        fill="#12B76A"
                      />
                    </svg>

                    <span className="text-green-500">
                      Hoàn tiền giữ chỗ 100%
                    </span>
                  </div>
                  <div className="w-4/12 p-4 flex flex-col items-center">
                    <i className="fas fa-check text-green-600 text-2xl mb-1"></i>
                    <svg
                      class="w-6 h-6 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.25 2C6.74 2 2.25 6.49 2.25 12C2.25 17.51 6.74 22 12.25 22C17.76 22 22.25 17.51 22.25 12C22.25 6.49 17.76 2 12.25 2ZM15.84 10.59L12.32 14.11C12.17 14.26 11.98 14.33 11.79 14.33C11.6 14.33 11.4 14.26 11.26 14.11L9.5 12.35C9.2 12.06 9.2 11.58 9.5 11.29C9.79 11 10.27 11 10.56 11.29L11.79 12.52L14.78 9.53C15.07 9.24 15.54 9.24 15.84 9.53C16.13 9.82 16.13 10.3 15.84 10.59Z"
                        fill="#12B76A"
                      />
                    </svg>
                    <span className="text-green-500">Không tốn phí</span>
                    {/* <span className="text-gray-600">
                      (Đánh giá hệ thống 3*)
                    </span> */}
                  </div>
                </div>
                <div className="flex border-t border-gray-300">
                  <div className="flex items-center w-4/12 pl-6 font-semibold text-left border-r border-gray-300">
                    Trước chuyến đi &gt;2 ngày
                  </div>
                  <div className="w-4/12 p-2 flex flex-col justify-center items-center border-r border-gray-300">
                    <i className="fas fa-check text-green-600 text-2xl mb-1"></i>
                    <svg
                      class="w-6 h-6 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.25 2C6.74 2 2.25 6.49 2.25 12C2.25 17.51 6.74 22 12.25 22C17.76 22 22.25 17.51 22.25 12C22.25 6.49 17.76 2 12.25 2ZM15.84 10.59L12.32 14.11C12.17 14.26 11.98 14.33 11.79 14.33C11.6 14.33 11.4 14.26 11.26 14.11L9.5 12.35C9.2 12.06 9.2 11.58 9.5 11.29C9.79 11 10.27 11 10.56 11.29L11.79 12.52L14.78 9.53C15.07 9.24 15.54 9.24 15.84 9.53C16.13 9.82 16.13 10.3 15.84 10.59Z"
                        fill="#12B76A"
                      />
                    </svg>
                    <span className="text-yellow-600">
                      Hoàn tiền giữ chỗ 70%
                    </span>
                  </div>
                  <div className="w-4/12 p-4 flex flex-col items-center">
                    <i className="fas fa-times text-red-600 text-2xl mb-1"></i>
                    <svg
                      class="w-6 h-6 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.25 2C6.74 2 2.25 6.49 2.25 12C2.25 17.51 6.74 22 12.25 22C17.76 22 22.25 17.51 22.25 12C22.25 6.49 17.76 2 12.25 2ZM15.84 10.59L12.32 14.11C12.17 14.26 11.98 14.33 11.79 14.33C11.6 14.33 11.4 14.26 11.26 14.11L9.5 12.35C9.2 12.06 9.2 11.58 9.5 11.29C9.79 11 10.27 11 10.56 11.29L11.79 12.52L14.78 9.53C15.07 9.24 15.54 9.24 15.84 9.53C16.13 9.82 16.13 10.3 15.84 10.59Z"
                        fill="#12B76A"
                      />
                    </svg>
                    <span className="text-yellow-600">Đền 30% tiền cọc</span>
                    {/* <span className="text-gray-600">
                      (Đánh giá hệ thống 3*)
                    </span> */}
                  </div>
                </div>
                <div className="flex border-t border-gray-300">
                  <div className="flex items-center w-4/12 pl-6 font-semibold text-left border-r border-gray-300">
                    Trong vòng 2 ngày trước chuyến đi
                  </div>
                  <div className="w-4/12 p-2 flex flex-col justify-center items-center border-r border-gray-300">
                    <i className="fas fa-times text-red-600 text-2xl mb-1"></i>
                    <svg
                      class="w-6 h-6 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.25 2C6.74 2 2.25 6.49 2.25 12C2.25 17.51 6.74 22 12.25 22C17.76 22 22.25 17.51 22.25 12C22.25 6.49 17.76 2 12.25 2ZM14.67 13.39C14.97 13.69 14.96 14.16 14.67 14.45C14.52 14.59 14.33 14.67 14.14 14.67C13.95 14.67 13.75 14.59 13.61 14.44L12.25 13.07L10.9 14.44C10.75 14.59 10.56 14.67 10.36 14.67C10.17 14.67 9.98 14.59 9.84 14.45C9.54 14.16 9.53999 13.69 9.82999 13.39L11.2 12L9.82999 10.61C9.53999 10.32 9.54 9.84 9.84 9.55C10.13 9.26 10.61 9.26 10.9 9.55L12.25 10.92L13.61 9.55C13.9 9.26 14.38 9.26 14.67 9.55C14.96 9.84 14.96 10.32 14.67 10.61L13.3 12L14.67 13.39Z"
                        fill="#F04438"
                      />
                    </svg>
                    <span className="text-red-500">
                      Không hoàn tiền giữ chỗ
                    </span>
                  </div>
                  <div className="w-4/12 p-4 flex flex-col items-center">
                    <i className="fas fa-times text-red-600 text-2xl mb-1"></i>
                    <svg
                      class="w-6 h-6 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.25 2C6.74 2 2.25 6.49 2.25 12C2.25 17.51 6.74 22 12.25 22C17.76 22 22.25 17.51 22.25 12C22.25 6.49 17.76 2 12.25 2ZM14.67 13.39C14.97 13.69 14.96 14.16 14.67 14.45C14.52 14.59 14.33 14.67 14.14 14.67C13.95 14.67 13.75 14.59 13.61 14.44L12.25 13.07L10.9 14.44C10.75 14.59 10.56 14.67 10.36 14.67C10.17 14.67 9.98 14.59 9.84 14.45C9.54 14.16 9.53999 13.69 9.82999 13.39L11.2 12L9.82999 10.61C9.53999 10.32 9.54 9.84 9.84 9.55C10.13 9.26 10.61 9.26 10.9 9.55L12.25 10.92L13.61 9.55C13.9 9.26 14.38 9.26 14.67 9.55C14.96 9.84 14.96 10.32 14.67 10.61L13.3 12L14.67 13.39Z"
                        fill="#F04438"
                      />
                    </svg>
                    <span className="text-red-500">Đền 100% tiền cọc</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-zinc-800 flex items-center space-x-4 mt-5">
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleClick(booking.renterId)}
              >
                <h2 className="text-sm font-semibold mb-2">Khách thuê</h2>
                <img
                  src="https://n1-cstg.mioto.vn/m/avatars/avatar-2.png"
                  alt="User profile picture"
                  className="w-16 h-16 rounded-full"
                />
              </div>
              <div className="flex-1">
                <div
                  className="flex items-center justify-between rounded-lg"
                  onClick={handleChatting}
                >
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {renterName}
                    &nbsp;&nbsp;&nbsp;
                    <span
                      style={{
                        border: "1px solid #ee4d2d",
                        padding: "2px 5px",
                        borderRadius: "10px",
                        display: "inline-flex",
                        alignItems: "center",
                        cursor: "pointer",
                        color: "#ee4d2d",
                        fontSize: "0.875rem",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faMessage}
                        color="#ee4d2d"
                        style={{ marginRight: "5px", fontSize: "0.875rem" }}
                      />
                      Liên hệ
                    </span>
                  </h2>
                </div>
                <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center">
                    {/* <FaMotorcycle className="w-6 h-6" /> */}
                    <span className="ml-2">
                      {/* {renter.totalTripCount > 0
                        ? renter.totalTripCount
                        : "Chưa có"}{" "}
                      chuyến */}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* <FeedbackList motorbikeId={booking.motorbikeId} /> */}
          </div>
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <div className="flex items-center mb-6">
                <img
                  src="https://n1-cstg.mioto.vn/m/avatars/avatar-0.png"
                  alt="User avatar"
                  className="w-14 h-14 rounded-full mr-4 mb-3"
                />
                <div>
                  <h4 className="font-semibold">{renterName}</h4>
                  <h6 className="font-semibold">{renterPhone}</h6>
                  <p className="text-gray-500">Khách thuê</p>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-gray-500">
                  <FontAwesomeIcon icon={faMapPin} /> Địa điểm giao nhận xe
                </h4>
                <p className="text-gray-700">{booking.receiveLocation}</p>
              </div>
              <div className="mb-6">
                <h4 className="text-gray-500">
                  Tổng tiền: {booking.totalPrice.toLocaleString("vi-VN")}vnd
                </h4>
              </div>
              <div className="flex p-1 mt-6 justify-center">
                {booking.status === "PENDING" && (
                  <>
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded mb-2 mr-4 w-full text-center transition hover:scale-105"
                      onClick={() => handleAction("reject")}
                    >
                      Từ chối
                    </button>
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:scale-105"
                      onClick={() => handleAction("accept")}
                    >
                      Chấp nhận
                    </button>
                  </>
                )}
                {booking.status === "PENDING_DEPOSIT" && (
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:scale-105"
                    onClick={() => handleAction("reject")}
                  >
                    Hủy chuyến
                  </button>
                )}
                {booking.status === "DEPOSIT_MADE" && (
                  <>
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded mb-2 mr-4 w-full text-center transition hover:scale-105"
                      onClick={() => handleAction("reject")}
                    >
                      Hủy chuyến
                    </button>
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:scale-105"
                      onClick={() => handleAction("deliver")}
                    >
                      Giao xe
                    </button>
                  </>
                )}
                {booking.status === "RENTING" && (
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:scale-105"
                    onClick={() => handleAction("complete")}
                  >
                    Hoàn thành
                  </button>
                )}
              </div>

              {showPopup && (
                <PopUpConfirm
                  show={showPopup}
                  message={popupContent}
                  onConfirm={handleConfirm}
                  onCancel={() => setShowPopup(false)}
                />
              )}
              {showPopupSuccess && (
                <PopUpSuccess
                  show={showPopupSuccess}
                  onHide={handlePopUpSuccess}
                  message="Bạn đã cập nhật thành công trạng thái chuyến !"
                />
              )}
              <PopUpReasonManage
                show={showPopUpReason}
                onHide={() => setShowPopUpReason(false)}
                onSend={handleSendReason}
                bookingId={booking.bookingId}
                bookingTotalPrice={booking.totalPrice}
              />
              {viewMap && (
                <MapModal
                  isOpen={viewMap}
                  onClose={handleCloseModal}
                  startLocation={[
                    motorbikeLocation.longitude,
                    motorbikeLocation.latitude,
                  ]}
                  endLocation={[booking.longitude, booking.latitude]}
                />
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold mb-4">
                Phụ phí có thể phát sinh
              </h4>
              <ul className="list-none text-gray-700">
                {motorbikeDeliveryFee && (
                  <li>
                    Phụ phí giao nhận xe tận nơi:{" "}
                    <strong>{motorbikeDeliveryFee} đ/km</strong>{" "}
                  </li>
                )}
                <li>
                  Phụ phí quá giờ: <strong>{motorbikeOvertimeFee} đ/giờ</strong>
                </li>
                <li>
                  Giới hạn quá giờ:{" "}
                  <strong>{motorbikeOvertimeLimit} giờ</strong>(sẽ tính thêm 1
                  ngày thuê mới nếu quá giới hạn này)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
