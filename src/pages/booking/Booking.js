import "./Booking.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { FaMotorcycle } from "react-icons/fa";
import {
  faArrowRight,
  faCircleXmark,
  faGasPump,
  faOilCan,
  faX,
  faMotorcycle,
} from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import RentalDocument from "./rentaldocument/RentalDocument";
import PopUpLocation from "./popUpLocation/PopUpLocation";
import MotorbikeSchedulePopUp from "./schedule/MotorbikeSchedulePopUp";
import FeedbackList from "./FeedbackList";
import DateTimeRange from "./schedule/DateTimeRange";
import PopUpLicense from "./popUpLicense/PopUpLicense";
import dayjs from "dayjs";
import axios from "axios";
import PopUpBookingSuccess from "./PopUpBookingSuccess";
import { format } from "date-fns";
import PopUpConfirmBooking from "./popUpConfirm/PopUpConfirmBooking";
import PopUpVoucher from "./popUpVoucher/PopUpVoucher";
import Login from "../login/Login";
import PopupSuccess from "../myBooking/PopUpSuccess";
import PopUpPricePerDay from "./popUpPricePerDay/PopUpPricePerDay";
import apiClient from "../../axiosConfig";
import { useNotification } from "../../NotificationContext";
import { CircularProgress } from "@mui/material";
const sharedClasses = {
  rounded: "rounded",
  flex: "flex",
  itemsCenter: "items-center",
  textZinc500: "text-zinc-500",
  bgBlue100: "bg-blue-100",
  textBlue800: "text-blue-800",
  px2: "px-2",
  py1: "py-1",
  bgYellow100: "bg-yellow-100",
  textYellow800: "text-yellow-800",
  bgGreen100: "bg-green-100",
  textGreen800: "text-green-800",
  textSm: "text-sm",
  textLg: "text-lg",
  spaceX2: "space-x-2",
  mt2: "mt-2",
  mt4: "mt-4",
  mt1: "mt-1",
  p2: "p-2",
  roundedFull: "rounded-full",
  bgZinc200: "bg-zinc-200",
  p4: "p-4",
  maxW7xl: "max-w-7xl",
  wFull: "w-full",
  w2_3: "w-3/4",
  w1_3: "w-1/4",
  gridCols2: "grid-cols-4",
  gridCols4: "grid-cols-4",
  grid: "grid",
  gap4: "gap-4",
  block: "block",
  borderZinc300: "border-zinc-300",
  shadowSm: "shadow-sm",
  select: "select",
  textXl: "text-xl",
  fontBold: "font-bold",
  fontSemibold: "font-semibold",
  underline: "underline",
  textZinc700: "text-zinc-700",
  textGreen600: "text-green-600",
  textWhite: "text-white",
  py2: "py-2",
  bgGreen500: "bg-green-500",
  mb4: "mb-4",
  mb2: "mb-2",
  mb3: "mb-3",
  textGreen700: "text-green-700",
  textZinc300: "text-zinc-300",
  cursorPointer: "cursor-pointer",
  textZincLight: "text-zinc-600 dark:text-zinc-400",
  textZincDark: "text-zinc-900 dark:text-zinc-100",
  flexItemsCenter: "flex items-center",
};
const formatVehicleType = (description) => {
  switch (description) {
    case "XeTayGa":
      return "Xe Tay Ga";
    case "XeSo":
      return "Xe Số";
    case "XeGanMay":
      return "Xe Gắn Máy";
    case "XeDien":
      return "Xe Điện";
    case "XeConTay":
      return "Xe Côn Tay";
    default:
      return description;
  }
};
const FeatureItem = ({ icon, altText, title, description }) => (
  <div className="flex items-center">
    <FontAwesomeIcon icon={icon} className="text-green-600 text-xl mr-2" />
    <div>
      <p className="text-zinc-500 font-bold">{title}</p>
      <p className="text-lg">
        {title === "Nhiên liệu"
          ? description === "GASOLINE"
            ? "Xăng"
            : "Điện"
          : ""}
        {title === "Loại xe" ? formatVehicleType(description) : description}
        {title === "Nhiên liệu tiêu hao" ? " lít/100km" : ""}
      </p>
    </div>
  </div>
);
const Booking = () => {
  const getAddress = (inputString) => {
    if (typeof inputString !== "string" || inputString.trim() === "") {
      return "";
    }
    const parts = inputString.split(",").map((part) => part.trim());
    return parts.length > 2 ? parts.slice(2).join(", ") : parts.join(", ");
  };
  const location = useLocation();
  const selectedMotorbike = localStorage.getItem("selectedMotorbike");
  const receiveData = selectedMotorbike ? JSON.parse(selectedMotorbike) : {};
  const motorbikeId = receiveData ? receiveData.id : null;
  console.log(receiveData);

  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const userId = userData ? userData.userId : null;
  const userName = userData
    ? userData.firstName + " " + userData.lastName
    : null;
  const userEmail = userData ? userData.email : null;

  console.log(userId);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const navigate = useNavigate();
  const [showPopUpLicense, setShowPopUpLicense] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [schedulePopUp, setSchedulePopUp] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [totalPrice, setTotalPrice] = useState(receiveData.price);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [rentalDays, setRentalDays] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [showPopupSuccess, setShowPopupSuccess] = useState(false);
  const { incrementNotificationCount } = useNotification();
  const [loading, setLoading] = useState();

  const handleOpenLoginModal = () => {
    const currentPath = window.location.pathname;
    setRedirectUrl(currentPath);
    setShowLoginModal(true);
  };
console.log(receiveData)
  const [showPopUpPricePerDay, setShowPopUpPricePerDay] = useState(false);
  const motorbikeAddress ={address:receiveData.motorbikeAddress,longitude:receiveData.longitude,latitude:receiveData.latitude};

  const [gettedLocation, setGettedLocation] = useState(motorbikeAddress.address);

  const handleClosePopup = () => {
    setShowPopUp(false);
  };
  const handleOpenPopup = () => {
    setShowPopUp(true);
  };
  const handleOpenSchedulePopup = () => {
    console.log("yes");
    setSchedulePopUp(true);
  };
  const handleCloseSchedulePopup = () => {
    setSchedulePopUp(false);
  };
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setShowPopUp(false);
  };

  const handlePricePerDay = () => {
    setShowPopUpPricePerDay(true);
  };

  const handleClosePopUpPricePerDay = () => {
    setShowPopUpPricePerDay(false);
  };

  const handleChatting = () => {
    try {
      const response4 = apiClient.post("/api/chatting/create", {
        emailUser1: receiveData.user.email,
        emailUser2: userEmail,
      });
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/menu/chatting");
    }
  };

  const [dateRange, setDateRange] = useState([null, null]);
  const [receiveTime, setReceiveTime] = useState(null);
  const [returnTime, setReturnTime] = useState(null);

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const handleReceiveTimeChange = (newReceiveTime) => {
    setReceiveTime(newReceiveTime);
  };

  const handleReturnTimeChange = (newReturnTime) => {
    setReturnTime(newReturnTime);
  };

  console.log(dateRange[0]?.format("DD/MM/YYYY"));
  console.log(dateRange[1]?.format("DD/MM/YYYY"));
  console.log(receiveTime?.format("HH:mm"));
  console.log(returnTime?.format("HH:mm"));

  useEffect(() => {
    if (dateRange[0] && dateRange[1] && receiveTime && returnTime) {
      const startDateTime = dayjs(dateRange[0])
        .set("hour", receiveTime.hour())
        .set("minute", receiveTime.minute());
      const endDateTime = dayjs(dateRange[1])
        .set("hour", returnTime.hour())
        .set("minute", returnTime.minute());
      const duration = endDateTime.diff(startDateTime, "minute");

      // Tính số ngày thuê
      const days = Math.ceil(duration / (24 * 60));
      setRentalDays(days);
    }
  }, [dateRange, receiveTime, returnTime]);

  console.log(motorbikeAddress);

  const [addressData, setAddressData] = useState([
    { id: 1, address: receiveData.motorbikeAddress },
    {
      id: 2,
      address: "",
    },
  ]);

  const handleChangeLocation = (location) => {
    console.log(location)
    setGettedLocation(location);
  };
  console.log(gettedLocation);

  const [distance, setDistance] = useState(0);
  const [newAddressData, setNewAddressData] = useState([]);
  const [showPopUpVoucher, setShowPopUpVoucher] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await apiClient.get(
          `/api/discounts/getListDiscountByUser/${userId}`
        );
        setDiscounts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    fetchDiscounts();
  }, []);

  const handleVoucher = () => {
    setShowPopUpVoucher(true);
  };

  const handleCloseVoucher = () => {
    setShowPopUpVoucher(false);
  };
  const [discount, setDiscount] = useState();
  const handleDiscountValue = (value) => {
    setDiscount(value);
  };
  const formatDiscountMoney = (discountMoney) => {
    if (typeof discountMoney === "number") {
      return "-" + discountMoney.toLocaleString("vi-VN") + "đ";
    }
    return discountMoney; // giữ nguyên nếu không phải là số
  };

  const handleCancelDiscount = () => {
    setDiscount(null);
  };

  useEffect(() => {
    setTotalPrice(rentalDays * receiveData.price + deliveryFee);
    if (discount) {
      if (typeof discount.discountMoney === "number") {
        setTotalPrice(
          rentalDays * receiveData.price + deliveryFee - discount.discountMoney
        );
        console.log(totalPrice, discount.discountMoney);
      } else {
        setTotalPrice(
          ((rentalDays * receiveData.price + deliveryFee) *
            (100 - discount.discountMoney)) /
            100
        );
      }
    }
  }, [rentalDays, deliveryFee, discount]);

  const [showPopupBooking, setShowPopupBooking] = useState(false);

  const [messageLicense, setMessageLicense] = useState("");
  const [buttonLicense, setButtonLicense] = useState("");
  const [buttonBackHomePage, setButtonBackHomePage] = useState("Chọn xe khác");
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      handleOpenLoginModal();
      return;
    }

    if (receiveData.userId === userId) {
      setMessageLicense("Bạn không thể tự đặt xe của chính bạn.");
      setButtonLicense(null);
      setButtonBackHomePage("Chọn xe khác");
      setShowPopUpLicense(true);

      return; // Prevent further execution if this condition is met
    }
    e.preventDefault();
    try {
      // check license
      const response1 = await apiClient.get(
        `/api/license/getLicenseByUserId/${userId}`
      );

      if (
        response1.data === null ||
        response1.data === "" ||
        response1.data.status !== "APPROVED"
      ) {
        setShowPopUpLicense(true);
        setMessageLicense(
          "GPLX của bạn chưa được duyệt. Bạn vui lòng cập nhật hoặc đợi duyệt GPLX."
        );
        setButtonLicense("Cập nhật");
      } else {
        // Kiểm tra xem giấy phép lái xe có hợp lệ hay không
        if (
          response1.data.licenseType === "A" &&
          receiveData.model.cylinderCapacity > 150
        ) {
          setShowPopUpLicense(true);
          setMessageLicense(
            "Xe này yêu cầu bằng A1. Bạn vui lòng cập nhật GPLX để có thể đặt xe."
          );
          setButtonLicense("Cập nhật");
        } else {
          setShowConfirmPopup(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        console.log("Response headers:", error.response.headers);
        if (error.response.status === 404) {
          setShowPopUpLicense(true);
          setMessageLicense(
            "GPLX chưa có. Bạn cần xác thực GPLX để có thể đặt xe."
          );
          setButtonLicense("Xác thực");
        } else {
          setShowPopUpLicense(true);
          setMessageLicense("An error occurred. Please try again later.");
          setButtonLicense("OK");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.log("Request data:", error.request);
        setShowPopUpLicense(true);
        setMessageLicense("No response from server. Please try again later.");
        setButtonLicense("OK");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error message:", error.message);
        setShowPopUpLicense(true);
        setMessageLicense("An error occurred. Please try again later.");
        setButtonLicense("OK");
      }
    }
  };
  const getRoomId = (user1, user2) => {
    if (!user1 || !user2) return null;
    return [user1, user2].sort().join("_");
  };

  const handleConfirmBooking = async (e) => {
    const roomId = getRoomId(userEmail, receiveData.user.email);
    try {
      setLoading(true);
      e.preventDefault();
      if (discount) {
        const deleteDiscount = apiClient.delete(
          `/api/discounts/deleteDiscountByIdAndUserId/${userId}/${discount.id}`
        );
      }

      const response2 = await apiClient
        .post("/api/booking/create", {
          renterId: userId,
          motorbikeId: receiveData.id,
          startDate: dayjs(dateRange[0]).format("YYYY-MM-DDTHH:mm:ss"),
          endDate: dayjs(dateRange[1]).format("YYYY-MM-DDTHH:mm:ss"),
          bookingTime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
          totalPrice: totalPrice,
          receiveLocation: gettedLocation.address,
          longitude:gettedLocation.longitude,
          latitude:gettedLocation.latitude,
        })
        .then(async () => {
          setShowPopupSuccess(true); // Hiển thị popup khi thành công
          const response3 = apiClient.post(
            "/api/booking/sendEmailSuccessBooking",
            {
              renterName: userName,
              renterEmail: userEmail,
              motorbikeName:
                receiveData.model.modelName +
                " " +
                receiveData.yearOfManufacture,
              motorbikePlate: receiveData.motorbikePlate,
              bookingTime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
              startDate: dayjs(dateRange[0]).format("YYYY-MM-DDTHH:mm:ss"),
              endDate: dayjs(dateRange[1]).format("YYYY-MM-DDTHH:mm:ss"),
              totalPrice: totalPrice,
              receiveLocation: gettedLocation,
            }
          );

          const response4 = apiClient.post("/api/chatting/create", {
            emailUser1: receiveData.user.email,
            emailUser2: userEmail,
          });

          const now = new Date();

          await setDoc(doc(collection(db, "notifications")), {
            userId: userId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: `Yêu cầu đặt xe <strong>${receiveData.motorbikePlate}</strong> của bạn đã được gửi.`,
            }),
            timestamp: now,
            seen: false,
          });

          await setDoc(doc(collection(db, "notifications")), {
            userId: receiveData.userId,
            message: JSON.stringify({
              title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
              content: ` <strong>${userName}</strong> đã đặt xe <strong>${receiveData.motorbikePlate}</strong> của bạn.`,
            }),
            timestamp: now,
            seen: false,
          });

          await addDoc(collection(db, `rooms/${roomId}/messages`), {
            createdAt: new Date(),
            content:
              "Cảm ơn bạn đã đặt xe, chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất!",
            userEmail: receiveData.user.email,
            seen: false,
          });

          // setShowPopupBooking(true); // Hiển thị popup khi thành công
          // setTimeout(() => {
          //   setShowPopupSuccess(false); // Ẩn popup sau 3 giây
          //   navigate("/menu/myBooking"); //chuyển sang trang mybooking sau khi thông báo
          // }, 3000);
        });
      console.log("okeee");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setShowPopupBooking(true);
    }
  };

  const handleShowPopupSuccess = () => {
    setShowPopupSuccess(false);
    navigate("/menu/myBooking");
  };

  const handleCancelBooking = () => {
    setShowConfirmPopup(false);
  };

  const handleLoginSuccess = (userInfor) => {
    localStorage.setItem("user", JSON.stringify(userInfor));
    setShowLoginModal(false);
    window.location.reload(); // Reload page to keep the current state
  };

  useEffect(() => {
    if (userId) {
      setShowLoginModal(false);
    }
  }, [userId]);

  const handleClick = (userId) => {
    navigate(`/userCard/${userId}`);
  };
  return (
    <div className="relative w-full my-auto font-manrope">
      <div>
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
      </div>
        <div class="cover-car">
          <div class="m-container ">
            <div class="cover-car-container">
              <div class="main-img">
                <div class="cover-car-item">
                  <img
                    loading="lazy"
                    alt={receiveData.model.modelName}
                    src={receiveData.motorbikeImages[0].url}
                  />
                </div>
              </div>
              <div class="sub-img ">
                <div class="cover-car-item">
                  <img
                    loading="lazy"
                    src={receiveData.motorbikeImages[1].url}
                    alt={receiveData.model.modelName}
                  />
                </div>
                <div class="cover-car-item">
                  <img
                    loading="lazy"
                    src={receiveData.motorbikeImages[2].url}
                    alt={receiveData.model.modelName}
                  />
                </div>
                <div class="cover-car-item">
                  <img
                    loading="lazy"
                    src={receiveData.motorbikeImages[3].url}
                    alt={receiveData.model.modelName}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative ">
        <div className="m-container flex flex-col md:flex-row gap-4">
            {/* Left Column - 60% width */}
            <div
              
            >
              {/* Header Section */}
              <div className="">
              <div
                className="content-detail"
              >
                <div className="mb-9">
                <div>
                <h1 className="font-bold text-2xl md:text-4xl">
                    {receiveData.model.modelName +
                      " " +
                      receiveData.yearOfManufacture}
                  </h1>
                  <div
                   className="flex items-center flex-wrap"
                  > 
                  <FontAwesomeIcon icon={faMotorcycle} />
                    <span className="ml-2">{receiveData.tripCount} chuyến</span>
                    <span class="px-1 py-0">•</span>
                    <span>{receiveData.motorbikeAddress}</span>
                  </div>
                  <div
                    className={`flex ${sharedClasses.spaceX2} ${sharedClasses.mt2}`}
                  >
                      <span
                      className={`${sharedClasses.bgGreen100} rounded-xl mr-2 ${sharedClasses.px2} ${sharedClasses.py1}`}
                    >
                      {receiveData.model.modelType}
                    </span>
                    <span
                      className={`${sharedClasses.bgBlue100} rounded-xl  ${sharedClasses.px2} ${sharedClasses.py1} `}
                    >
                      {receiveData.delivery ? "Giao xe tận nơi" : ""}
                    </span>
                  </div>
                </div>
                </div>
                <div
                  className={`flex ${sharedClasses.spaceX2} ${sharedClasses.mt4} md:${sharedClasses.mt0}`}
                ></div>
              </div>
              <div
              className="flex flex-col float-right md:flex-row gap-6 mb-20 w-2/6"
            >
              <form onSubmit={handleFormSubmit}>
                {/* Rental Section */}
                <div className="relative py-4 px-6 rounded-lg bg-sky-50">
                <div className="mb-4">
                  <h2 className={`text-4xl font-extrabold mb-4`}>
                    {receiveData.price / 1000}K/ngày
                  </h2>
                </div>

                <div className="relative flex mb-3">
                  <DateTimeRange
                    onDateRangeChange={handleDateRangeChange}
                    onReceiveTimeChange={handleReceiveTimeChange}
                    onReturnTimeChange={handleReturnTimeChange}
                  ></DateTimeRange>
                </div>

                <div className="relative flex flex-col gap-2 p-3 border border-gray-100 bg-white rounded-lg mb-3 ">
                  <label className="block text-sm font-medium text-zinc-700">
                    Địa điểm giao nhận xe
                  </label>
                  <div className="pr-8">
                    
                    <input
                      type="text"
                      className={`w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold cursor-pointer`}
                      value={gettedLocation}
                      readOnly
                      onClick={() => setShowPopUp(true)}
                    />
                  </div>
                </div>
                <div className="w-full border-b border-b-zinc-300"></div>                
                <div className="flex flex-col gap-2 pt-4">
                <div
                  className="flex justify-between"
                >
                  <span>
                    Đơn giá{" "}
                    <span style={{ cursor: "pointer" }}>
                      <FontAwesomeIcon
                        onClick={handlePricePerDay}
                        icon={faCircleQuestion}
                      ></FontAwesomeIcon>
                    </span>{" "}
                  </span>
                  <span className="font-semibold">
                    {receiveData.price.toLocaleString("vi-VN")}đ/ ngày
                  </span>
                </div>
                <div
                     className="flex justify-between"
                >
                  <span>Phí giao nhận xe</span>
                  <span className="font-semibold">
                    {deliveryFee.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div
                      className="flex justify-between"
                >
                  <span>Tổng cộng</span>
                  <span className="font-semibold">
                    {receiveData.price.toLocaleString("vi-VN")}đ x {rentalDays}{" "}
                    ngày
                  </span>
                </div>
                <div className="w-full border-b border-b-zinc-300"></div>
                {discount ? (
                  <div
                    className="flex justify-between pl-0 gap-2"
                  >
                    <span>
                      Mã{" "}
                      <span className="font-semibold text-green-300">
                        {discount.name}
                      </span>
                      &nbsp;
                      <FontAwesomeIcon
                        className="text-red-600 cursor-pointer"
                        icon={faCircleXmark}
                        onClick={handleCancelDiscount}
                      ></FontAwesomeIcon>
                    </span>
                    <span className="font-semibold">
                      {formatDiscountMoney(discount.discountMoney)}
                    </span>
                  </div>
                ) : (
                  <div
                    className="flex justify-between pl-0 gap-2"
                    style={{ cursor: "pointer" }}
                    onClick={handleVoucher}
                  >
                    <span>Mã khuyến mãi</span>
                    <span>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </span>
                  </div>
                )}
                  <div className="w-full border-b border-b-zinc-300"></div>
                <div
                  className="flex justify-between items-center py-2"
                >
                  <span className="text-base font-extrabold">Thành tiền</span>
                  <span className="text-base font-extrabold">{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                </div>
                <button
                  type="submit"
                  className="py-4 px-6 relative justify-center inline-flex items-center font-bold rounded-lg w-100 bg-green-500 hover:bg-green-600 text-white"
                >
                  CHỌN THUÊ
                </button>
                </div>
              </form>
              </div>

                <div className="content-detail">
                <div className="w-full border-b border-b-zinc-400"></div>
              {/* Features Section */}
              <div
                className="flex flex-col my-6"
              >
                <h6 className="mb-6 font-semibold text-xl">Đặc điểm</h6>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FeatureItem
                  icon={faGasPump}
                  altText="fuel"
                  title="Nhiên liệu"
                  description=""
                  class="flex items-center"
                />
                <FeatureItem
                  icon={faMotorcycle}
                  altText="modelType"
                  title="Loại xe"
                  description={receiveData.model.modelType}
                />
                <FeatureItem
                  icon={faOilCan}
                  altText="consumption"
                  title="Nhiên liệu tiêu hao"
                  description={receiveData.model.fuelConsumption}
                />
                </div>
              </div>
              <div className="w-full border-b border-b-zinc-400 mb-6"></div>
              {/* <RentalDocument /> */}
              {/* Other amenities section */}
              <div
                className={`${sharedClasses.grid} ${sharedClasses.gridCols4} ${sharedClasses.gap4}`}
              >
                {/* Other amenities go here */}
              </div>
              <RentalDocument />
              <hr className="my-3 border-gray-800"></hr>
              <div className="p-4 bg-white dark:bg-zinc-800  flex items-center space-x-4 cursor-pointer" onClick={() => handleClick(receiveData.user.id)}>
                <div className="flex flex-col items-center mb-4">
                  <h2 className="text-sm font-semibold mb-2">
                    Chủ xe
                  </h2>
                  <img
                    src="https://n1-cstg.mioto.vn/m/avatars/avatar-2.png"
                    alt="User profile picture"
                    className="w-16 h-16 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <h2
                    className={`text-lg font-semibold ${sharedClasses.textZincDark}`}
                  >
                    {receiveData.user.firstName +
                      " " +
                      receiveData.user.lastName}
                  </h2>
                  <div
                    className={`${sharedClasses.flexItemsCenter} space-x-2 ${sharedClasses.textZincLight}`}
                  >
                    <span className={sharedClasses.flexItemsCenter}>
                      <FaMotorcycle className="w-6 h-6" />
                    <span className="ml-2">
                      {receiveData.user.totalTripCount>0?receiveData.user.totalTripCount:"Chưa có"} chuyến
                    </span>
                  </span>  
                  </div>
                </div>
              </div>
              {motorbikeId && <FeedbackList motorbikeId={motorbikeId} />}
            </div>
            </div>
            </div>
            </div>
               </div>

            {/* Right Column - 40% width */}
          
              {showConfirmPopup && (
                <PopUpConfirmBooking
                  motorbikeDetails={receiveData}
                  bookingDetails={{
                    startDate: dayjs(dateRange[0]).format(
                      "YYYY-MM-DDTHH:mm:ss"
                    ),
                    endDate: dayjs(dateRange[1]).format("YYYY-MM-DDTHH:mm:ss"),
                    receiveLocation: gettedLocation,
                    totalPrice: totalPrice,
                  }}
                  onConfirm={handleConfirmBooking}
                  onCancel={handleCancelBooking}
                />
              )}
              {showPopUpLicense && (
                <PopUpLicense
                  onClose={() => setShowPopUpLicense(false)}
                  messageLicense={messageLicense}
                  buttonLicense={buttonLicense}
                  buttonBackHomePage="Chọn xe khác"
                />
              )}
              {showPopupSuccess && (
                <PopupSuccess
                  show={showPopupSuccess}
                  onHide={handleShowPopupSuccess}
                  message="Yêu cầu đặt xe của bạn đã được gửi đi !"
                />
              )}
              {showPopUp && (
                <PopUpLocation
                  onClose={() => setShowPopUp(false)}
                  onSelectLocation={motorbikeAddress}
                  onChangeLocation={handleChangeLocation}
                  shipFee={(deliFee)=>setDeliveryFee(deliFee)}
                  receiveData={receiveData}
                />
              )}
              {showPopUpVoucher && (
                <PopUpVoucher
                  onCloseVoucher={handleCloseVoucher}
                  discounts={discounts}
                  discountValue={handleDiscountValue}
                ></PopUpVoucher>
              )}
              {showLoginModal && (
                <Login
                  show={showLoginModal}
                  handleClose={() => setShowLoginModal(false)}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
              {showPopUpPricePerDay && (
                <PopUpPricePerDay
                  onClose={handleClosePopUpPricePerDay}
                ></PopUpPricePerDay>
              )}
         
  
     
    </div>
  );
};

export default Booking;
