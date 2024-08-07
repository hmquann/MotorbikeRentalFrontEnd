import { faCalendarDays, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import RentalDocument from "../booking/rentaldocument/RentalDocument";
import PopUpConfirm from "./PopUpConfirm";
import { useNavigate } from "react-router-dom";
import PopUpSuccess from "./PopUpSuccess";
import apiClient from "../../axiosConfig";
import { CircularProgress, LinearProgress } from "@mui/material";
import { styled } from "@mui/system";
import FeedbackModal from "../booking/FeedbackModal";
import PopUpReason from "./PopUpReason";

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
  const [motorbikePlate, setMotorbikePlate] = useState();
  const [lessorName, setLessorName] = useState();
  const [renterName, setRenterName] = useState();
  const [motorbikeDeliveryFee, setMotorbikeDeliveryFee] = useState();
  const [motorbikeOvertimeFee, setMotorbikeOvertimeFee] = useState();
  const [urlImage, setUrlImage] = useState();
  const [lessorId, setLessorId] = useState();
  const [motorbike, setMotorbike] = useState();
  const [pricePerDay, setPricePerDay] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [action, setAction] = useState("");
  const [lessor, setLessor] = useState("");
  const [showPopupSuccess, setShowPopupSuccess] = useState(false);
  const [showPopUpReason, setShowPopUpReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [reason, setReason] = useState("");
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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const navigate = useNavigate();

  const CustomLinearProgress = styled(LinearProgress)(
    ({ bgColor, barColor }) => ({
      backgroundColor: bgColor, // dynamically set the background color
      "& .MuiLinearProgress-bar": {
        backgroundColor: barColor, // dynamically set the bar color
      },
    })
  );

  useEffect(() => {
    const fetchMotorbike = async () => {
      try {
        const response = await apiClient.get(
          `/api/motorbike/${booking.motorbikeId}`
        );
        console.log(response.data);
        setMotorbike(response.data);
        setMotorbikeName(
          `${response.data.model.modelName} ${response.data.yearOfManufacture}`
        );
        setMotorbikePlate(`${response.data.motorbikePlate}`);
        setLessorName(
          `${response.data.user.firstName} ${response.data.user.lastName}`
        );
        setLessor(response.data.user);
        setMotorbikeDeliveryFee(`${response.data.deliveryFee}`);
        setMotorbikeOvertimeFee(`${response.data.overtimeFee}`);
        setUrlImage(response.data.motorbikeImages[0].url);
        setLessorId(response.data.user.id);
        console.log(lessorId);
        const response2 = await apiClient.get(`/api/user/${booking.renterId}`);
        console.log(response2.data.firstName + " " + response2.data.lastName);
        setRenterName(response2.data.firstName + " " + response2.data.lastName);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMotorbike();
  }, [booking.motorbikeId]);

  const statusStyle = statusStyles[booking.status];

  const handleAction = (actionType) => {
    if (actionType === "canceled") {
      setShowPopUpReason(true);
      console.log(booking.status);
    } else {
      setPopupContent(
        actionType === "accept"
          ? "Bạn có chắc chắn muốn duyệt chuyến này?"
          : actionType === "deposit_made"
          ? `Bạn có chắc chắn muốn thanh toán ${(
              (booking.totalPrice * 30) /
              100
            ).toLocaleString("vi-VN")}đ tiền cọc?`
          : ""
      );
      setAction(actionType);
      setShowPopup(true); // Hiển thị popup xác nhận
    }
  };

  const openFeedback = () => {
    setShowFeedbackModal(true);
  };

  const closeFeedback = () => {
    setShowFeedbackModal(false);
  };

  const handleSendReason = async (reason) => {
    setShowPopUpReason(false);
    setSelectedReason(reason);
    const now = new Date();
    setLoading(true);
    try {
      if (emailNoti) {
        const response3 = apiClient.post(
          "/api/booking/sendEmailCancelBooking",
          {
            renterName: userName,
            renterEmail: userEmail,
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
      if (lessor.emailNoti) {
        const response5 = apiClient.post(
          "/api/booking/sendEmailCancelBookingForLessor",
          {
            lessorName: lessor.firstName + " " + lessor.lastName,
            lessorEmail: lessor.email,
            renterName: userName,
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
            title: '<strong style="color: rgb(197 34 34)">Hủy thuê xe</strong>',
            content: `Bạn đã hủy thuê xe <strong>${motorbike.model.modelName} ${motorbike.yearOfManufacture}</strong>, biển số <strong>${motorbike.motorbikePlate}</strong> với lí do <strong>${reason}</strong>.`,
          }),
          timestamp: now,
          seen: false,
        });
      }
      if (lessor.systemNoti) {
        await setDoc(doc(collection(db, "notifications")), {
          userId: lessor.id,
          message: JSON.stringify({
            title: '<strong style="color: rgb(197 34 34)">Hủy thuê xe</strong>',
            content: `<strong>${userName}</strong> đã hủy thuê xe <strong>${motorbike.model.modelName} ${motorbike.yearOfManufacture}</strong>, biển số <strong>${motorbike.motorbikePlate}</strong> của bạn với lí do <strong>${reason}</strong>.`,
          }),
          timestamp: now,
          seen: false,
        });
      }
      let status = "CANCELED";
      const url = `/api/booking/changeStatus/${booking.bookingId}/${status}`;
      await apiClient.put(url);

      if(booking.status === "DEPOSIT_MADE"){
        
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
    const now = new Date();
    try {
      let status;
      if (action === "canceled") {
        status = "CANCELED";
      } else if (action === "deposit_made") {
        status = "DEPOSIT_MADE";
      } else if (action === "complete") {
        status = "DONE";
      }
      const url = `/api/booking/changeStatus/${booking.bookingId}/${status}`;
      await apiClient.put(url);
      if (status === "CANCELED" && booking.status === "DEPOSIT_PENDING") {
        // await setDoc(doc(collection(db, "notifications")), {
        //   userId: userId,
        //   message: JSON.stringify({
        //     title: '<strong style="color: red">Hủy đặt xe</strong>',
        //     content: `Bạn đã hủy việc đặt xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong>.`,
        //   }),
        //   timestamp: now,
        //   seen: false,
        // });
        // await setDoc(doc(collection(db, "notifications")), {
        //   userId: lessorId,
        //   message: JSON.stringify({
        //     title: '<strong style="color: red">Hủy đặt xe</strong>',
        //     content: `Khách thuê <strong>${renterName}</strong> đã hủy việc đặt xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong>.`,
        //   }),
        //   timestamp: now,
        //   seen: false,
        // });
      } else if (status === "DEPOSIT_MADE") {
        if (systemNoti) {
          await setDoc(doc(collection(db, "notifications")), {
            userId: userId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Bạn đã thanh toán tiền cọc cho xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong>. Hãy theo dõi lịch của chuyến để nhận xe đúng hẹn.`,
            }),
            timestamp: now,
            seen: false,
          });
        }
        if (lessor.systemNoti) {
          await setDoc(doc(collection(db, "notifications")), {
            userId: lessorId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Khách thuê <strong>${renterName}</strong> đã thanh toán tiền cọc cho xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong>. Hãy theo dõi lịch của chuyến để giao xe đúng hẹn.`,
            }),
            timestamp: now,
            seen: false,
          });
        }
        if (emailNoti) {
          const response3 = apiClient.post(
            "/api/booking/sendEmailDepositMadeBooking",
            {
              renterName: userName,
              renterEmail: userEmail,
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
        if (lessor.emailNoti) {
          const response5 = apiClient.post(
            "/api/booking/sendEmailDepositMadeBookingForLessor",
            {
              lessorName: lessor.firstName + " " + lessor.lastName,
              lessorEmail: lessor.email,
              renterName: userName,
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
        const adminData = await apiClient.get("api/user/getAdmin");
        const adminDataId = adminData.data.id;
        const renterId = userData.userId;
        const amount = (booking.totalPrice * 30) / 100;
        const subtractMoneyUrl = `/api/payment/subtract`;
        const addMoneyUrl = `/api/payment/add`;
        await apiClient.post(subtractMoneyUrl, null, {
          params: { id: renterId, amount: amount },
        });
        await apiClient.post(addMoneyUrl, null, {
          params: { id: adminDataId, amount: amount },
        });
      } else if (status === "DONE") {
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
        if(systemNoti){
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
        if(lessor.systemNoti){
          await setDoc(doc(collection(db, "notifications")), {
            userId: booking.renterId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Chuyến đi với xe <strong>${motorbikeName}</strong>, biển số <strong>${motorbikePlate}</strong> đã hoàn thành.`,
            }),
            timestamp: now,
            seen: false,
          });    
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
      <div className="p-12 bg-gray-100 font-manrope">
        <div
          className={`${statusStyle.bg} ${statusStyle.text} p-4 rounded-lg flex items-center mb-6`}
        >
          <FontAwesomeIcon icon={statusStyle.icon} className="mr-2" />
          <span>{statusTranslations[booking.status]}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              <img
                src={urlImage}
                alt="User avatar"
                className="w-14 h-14 rounded-full mr-4 mb-3"
              />
              <div>
                <h2 className="text-2xl font-bold">{motorbikeName}</h2>
                <a href="#" className="text-blue-500 underline">
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
            <RentalDocument></RentalDocument>

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
            <div>
              <h3 className="text-lg font-bold">Chính sách huỷ chuyến</h3>
              <table className="w-full border border-muted-foreground text-sm">
                <thead>
                  <tr>
                    <th className="border border-muted-foreground p-2">
                      Thời Gian Hủy Chuyến
                    </th>
                    <th className="border border-muted-foreground p-2">
                      Khách Thuê Hủy Chuyến
                    </th>
                    <th className="border border-muted-foreground p-2">
                      Chủ Xe Hủy Chuyến
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-muted-foreground p-2">
                      Trong Vòng 1h Từ Lúc Đặt Cọc
                    </td>
                    <td className="border border-muted-foreground p-2 text-green-600">
                      Hoàn tiền cọc 100%
                    </td>
                    <td className="border border-muted-foreground p-2 text-green-600">
                      Không mất phí
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-muted-foreground p-2">
                      Trước Chuyến Đi 2 Ngày
                    </td>
                    <td className="border border-muted-foreground p-2 text-yellow-600">
                      Hoàn tiền cọc 70%
                    </td>
                    <td className="border border-muted-foreground p-2 text-yellow-600">
                      Đền tiền 30%
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-muted-foreground p-2">
                      Trong Vòng 2 Ngày Trước Chuyến Đi
                    </td>
                    <td className="border border-muted-foreground p-2 text-red-600">
                      Không hoàn tiền
                    </td>
                    <td className="border border-muted-foreground p-2 text-red-600">
                      Đền tiền 100%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <div className="flex items-center mb-6">
                <img
                  src="https://n1-cstg.mioto.vn/m/avatars/avatar-0.png"
                  alt="User avatar"
                  className="w-12 h-12 rounded-full mr-4"
                />

                <div className="mr-6">
                  <h4 className="font-semibold">{lessorName}</h4>
                  <p className="text-gray-500">Chủ xe</p>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-gray-500">
                  <FontAwesomeIcon icon={faMapPin}></FontAwesomeIcon> Địa điểm
                  giao nhận xe
                </h4>
                <p className="text-gray-700">{booking.receiveLocation}</p>
                <a href="#" className="text-blue-500 underline">
                  Xem bản đồ
                </a>
              </div>
              <div className="mb-6">
                <h5 className="text-gray-500">
                  Tổng tiền:{" "}
                  <span className="font-bold">
                    {booking.totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </h5>
              </div>
              <div className="mb-6">
                <h5 className="text-gray-500">
                  Đặt cọc qua ứng dụng:{" "}
                  <span className="font-bold">
                    {((booking.totalPrice * 30) / 100).toLocaleString("vi-VN")}đ
                  </span>
                </h5>
              </div>
              <div className="mb-6">
                <h5 className="text-gray-500">
                  Thanh toán khi nhận xe:{" "}
                  <span className="font-bold">
                    {((booking.totalPrice * 70) / 100).toLocaleString("vi-VN")}đ
                  </span>
                </h5>
              </div>
              <div className="flex p-1 mt-6 justify-center">
                {booking.status === "PENDING" && (
                  <>
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded mb-2 mr-4 w-full text-center"
                      onClick={() => handleAction("canceled")}
                    >
                      Hủy chuyến
                    </button>
                  </>
                )}
                {booking.status === "PENDING_DEPOSIT" && (
                  <>
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded mb-2 mr-4 w-full text-center"
                      onClick={() => handleAction("canceled")}
                    >
                      Hủy chuyến
                    </button>
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center"
                      onClick={() => handleAction("deposit_made")}
                    >
                      Đặt cọc
                    </button>
                  </>
                )}

                {booking.status === "DEPOSIT_MADE" && (
                  <>
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded mb-2 mr-4 w-full text-center"
                      onClick={() => handleAction("canceled")}
                    >
                      Hủy chuyến
                    </button>
                  </>
                )}

                {booking.status === "DONE" && (
                  <button
                    onClick={openFeedback}
                    className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:scale-105"
                  >
                    Đánh giá
                  </button>
                )}
              </div>

              {showPopup && (
                <PopUpConfirm
                  show={showPopup}
                  message={popupContent}
                  onConfirm={handleConfirm}
                  onCancel={() => setShowPopup(false)}
                  onLoading={true}
                />
              )}
              {showPopupSuccess && (
                <PopUpSuccess
                  show={showPopupSuccess}
                  onHide={handlePopUpSuccess}
                  message="Bạn đã cập nhật thành công trạng thái chuyến !"
                />
              )}
              <PopUpReason
                show={showPopUpReason}
                onHide={() => setShowPopUpReason(false)}
                onSend={handleSendReason}
              />
              <FeedbackModal
                show={showFeedbackModal}
                onHide={closeFeedback}
                bookingId={booking.bookingId}
                onFeedbackSubmitted={() => setFeedbackSent(true)}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold mb-4">
                Phụ phí có thể phát sinh
              </h4>
              <ul className="list-none text-gray-700">
                <li>
                  Phụ phí giao nhận xe tận nơi:{" "}
                  <strong>{motorbikeDeliveryFee}đ/km</strong>{" "}
                </li>
                <li>
                  Phụ phí quá giờ: <strong>{motorbikeOvertimeFee}đ/km</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
