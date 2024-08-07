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
  const [renterName, setRenterName] = useState();
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
        console.log(motorbikeOvertimeFee);
        setMotorbikePlate(`${response.data.motorbikePlate}`);
        setLessorName(
          `${response.data.user.firstName} ${response.data.user.lastName}`
        );
        setLessor(response.data.user);
        setUrlImage(response.data.motorbikeImages[0].url);
        setLessorId(response.data.user.userId);

        const response2 = await apiClient.get(`/api/user/${booking.renterId}`);
        console.log(response2.data);
        setRenterName(response2.data.firstName + " " + response2.data.lastName);
        setRenter(response2.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMotorbike();
  }, [booking.motorbikeId]);

  const statusStyle = statusStyles[booking.status];

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

  const handleSendReason = async (reason) => {
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
              <h3 className="text-lg font-semibold">Tài sản thế chấp</h3>
              <p className="text-gray-700">
                15 triệu (tiền mặt/chuyển khoản cho chủ xe khi nhận xe) hoặc Xe
                máy (kèm cà vẹt gốc) giá trị 15 triệu
              </p>
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
                  className="w-14 h-14 rounded-full mr-4 mb-3"
                />
                <div>
                  <h4 className="font-semibold">{renterName}</h4>
                  <p className="text-gray-500">Khách thuê</p>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-gray-500">
                  <FontAwesomeIcon icon={faMapPin} /> Địa điểm giao nhận xe
                </h4>
                <p className="text-gray-700">{booking.receiveLocation}</p>
                <a href="#" className="text-blue-500 underline">
                  Xem bản đồ
                </a>
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
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-lg font-semibold mb-4">
                Phụ phí có thể phát sinh
              </h4>
              <ul className="list-none text-gray-700">
                <li>
                  Phụ phí giao nhận xe tận nơi:{" "}
                  <strong>{motorbikeDeliveryFee}vnd/km</strong>{" "}
                </li>
                <li>
                  Phụ phí quá giờ: <strong>{motorbikeOvertimeFee}vnd/km</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
