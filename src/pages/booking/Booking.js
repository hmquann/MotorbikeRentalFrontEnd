import "./Booking.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  faArrowRight,
  faGasPump,
  faOilCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import RentalDocument from "./rentaldocument/RentalDocument";
import PopUpLocation from "./popUpLocation/PopUpLocation";
import MotorbikeSchedulePopUp from "./schedule/MotorbikeSchedulePopUp";
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
  w2_3: "w-2/3",
  w1_3: "w-1/3",
  gridCols2: "grid-cols-2",
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
};

const FeatureItem = ({ icon, altText, title, description }) => (
  <div className="flex items-center">
    <FontAwesomeIcon icon={icon} className="text-green-600 text-xl mr-2" />
    <div>
      <p className="text-zinc-500 font-bold">{title}</p>
      <p className="text-lg">
        {description}
        {title === "con"}l/100km
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
  const receiveData = location.state.selectedMotorbike;
  console.log(receiveData);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const[schedulePopUp,setSchedulePopUp]=useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [totalPrice, setTotalPrice] = useState("745000");
  const [rentalDays, setRentalDays] = useState(1);
  const handleClosePopup = () => {
    setShowPopUp(false);
  };
  const handleOpenPopup=()=>{
    setShowPopUp(true)
  }
  const handleOpenSchedulePopup=()=>{
    console.log("yes")
    setSchedulePopUp(true)
  }
  const handleCloseSchedulePopup=()=>{
    setSchedulePopUp(false)
  }
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setShowPopUp(false);
  };

  const validateDates = () => {
    const now = new Date();
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);

    if (pickup < now) {
      alert("Ngày nhận xe không được nhỏ hơn ngày hiện tại.");
      return false;
    }

    if (
      pickup.toDateString() === now.toDateString() &&
      pickup.getHours() < now.getHours()
    ) {
      alert("Giờ nhận xe không được nhỏ hơn giờ hiện tại.");
      return false;
    }

    if (returnD <= pickup) {
      alert("Ngày trả xe phải lớn hơn ngày nhận xe.");
      return false;
    }

    return true;
  };

  const calculateRentalDays = () => {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const differenceInTime = returnD - pickup;
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Làm tròn lên
    setRentalDays(differenceInDays);
    return differenceInDays;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!validateDates()) {
      return;
    }

    const days = calculateRentalDays();
    const pricePerDay = 745000;
    setTotalPrice(days * pricePerDay);

    const formData = {
      pickupDate,
      returnDate,
      selectedLocation,
      promoCode,
      totalPrice: days * pricePerDay,
    };
    console.log(formData);
  };

  useEffect(() => {
    if (pickupDate && returnDate) {
      const days = calculateRentalDays();
      const pricePerDay = 745000;
      setTotalPrice(days * pricePerDay);
    }
  }, [pickupDate, returnDate]);

  const [gettedLocation, setGettedLocation] = useState(
    getAddress(receiveData.motorbikeAddress)
  );
  useEffect(() => {
    if (gettedLocation === null) {
      setGettedLocation("");
    } else {
      setGettedLocation(localStorage.getItem("location"));
    }
  }, [localStorage.getItem("location")]);
  console.log(gettedLocation);

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() - offset);
    return now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
  };

  const minDateTime = getCurrentDateTimeLocal();

  return (
    <div>
      <div class="cover-car">
        <div class="m-container">
          <div class="cover-car-container">
            <div class="main-img">
              <div class="cover-car-item">
                <img
                  loading="lazy"
                  alt="Cho thuê xe tự lái HYUNDAI ACCENT 2023"
                  src="https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/hyundai_accent_2023/p/g/2023/08/15/10/9WcwKNkI5l_idM3Sc6mROA.jpg"
                />
              </div>
            </div>
            <div class="sub-img">
              <div class="cover-car-item">
                <img
                  loading="lazy"
                  src="https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/hyundai_accent_2023/p/g/2023/08/15/10/Bh22riPP6nuyNg0fn1vEoQ.jpg"
                  alt="Cho thuê xe tự lái HYUNDAI ACCENT 2023"
                />
              </div>
              <div class="cover-car-item">
                <img
                  loading="lazy"
                  src="https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/hyundai_accent_2023/p/g/2023/08/15/10/_0hT6bXTiGZE5REyYIaOuw.jpg"
                  alt="Cho thuê xe tự lái HYUNDAI ACCENT 2023"
                />
              </div>
              <div class="cover-car-item">
                <img
                  loading="lazy"
                  src="https://n1-pstg.mioto.vn/cho_thue_xe_o_to_tu_lai_thue_xe_du_lich_hochiminh/hyundai_accent_2023/p/g/2023/08/15/10/AoU8CbiPvkLutBOel1iVNA.jpg"
                  alt="Cho thuê xe tự lái HYUNDAI ACCENT 2023"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${sharedClasses.p4} ${sharedClasses.maxW7xl} mx-auto`}>
        <div className="flex justify-between">
          {/* Left Column - 60% width */}
          <div
            className={`${sharedClasses.w2_3} ${sharedClasses.p4} ${sharedClasses.rounded}`}
          >
            {/* Header Section */}
            <div
              className={`flex flex-col md:flex-row justify-between items-start md:items-center ${sharedClasses.mb4}`}
            >
              <div>
                <h1 className={`text-2xl ${sharedClasses.fontBold}`}>
                  {receiveData.model.modelName}
                </h1>
                <div
                  className={`flex ${sharedClasses.itemsCenter} ${sharedClasses.textSm} ${sharedClasses.textZinc500} ${sharedClasses.mb2}`}
                >
                  <span className="mr-2"></span>
                  <span className="mr-2">{receiveData.tripCount}</span>
                  <span>{receiveData.motorbikeAddress}</span>
                </div>
                <div
                  className={`flex ${sharedClasses.spaceX2} ${sharedClasses.mt2}`}
                >
                  <span
                    className={`${sharedClasses.bgBlue100} ${sharedClasses.textBlue800} ${sharedClasses.px2} ${sharedClasses.py1} ${sharedClasses.rounded}`}
                  >
                    {receiveData.delivery ? "Giao xe tận nơi" : ""}
                  </span>
                </div>
              </div>
              <div
                className={`flex ${sharedClasses.spaceX2} ${sharedClasses.mt4} md:${sharedClasses.mt0}`}
              ></div>
            </div>

            {/* Features Section */}
            <div
              className={`${sharedClasses.grid} ${sharedClasses.gridCols2} ${sharedClasses.gap4} ${sharedClasses.mb4}`}
            >
              <FeatureItem
                icon={faGasPump}
                altText="fuel"
                title="Fuel"
                description={receiveData.model.fuelType}
              />
              <FeatureItem
                icon={faOilCan}
                altText="consumption"
                title="Fuel consumption"
                description={receiveData.model.fuelConsumption}
              />
            </div>

            {/* Description Section */}
            <div className={`${sharedClasses.mb4}`}>
              <h2
                className={`text-xl ${sharedClasses.fontSemibold} ${sharedClasses.mb2}`}
              >
                Description
              </h2>
              <p
                className={`${sharedClasses.textZinc700} ${sharedClasses.mb4}`}
              >
                Cho thuê xe Ciaz 2021 số tự động
                <br />5 chỗ ngồi rộng rãi sạch sẽ
                <br />
                Trang bị camera hành trình trước sau
                <br />
                Màn hình giải trí android kết nối 4g
                <br />
                Có bảo hiểm đầy đủ
                <br />
                Chủ xe thân thiện hỗ trợ nhiệt tình
              </p>
            </div>

            {/* Other amenities section */}
            <div
              className={`${sharedClasses.grid} ${sharedClasses.gridCols4} ${sharedClasses.gap4}`}
            >
              {/* Other amenities go here */}
            </div>
            <RentalDocument />
          </div>

          {/* Right Column - 40% width */}
          <div
            className={`${sharedClasses.w1_3} bg-zinc-100 ${sharedClasses.p4} ${sharedClasses.rounded}`}
          >
            <form onSubmit={handleFormSubmit}>
              {/* Rental Section */}
              <h2
                className={`text-xl ${sharedClasses.fontSemibold} ${sharedClasses.mb4}`}
              >
                {receiveData.price / 1000}K /day
              </h2>
              <div className={sharedClasses.mb4}>                       
                <div className="grid grid-cols-2 gap-4 mb-4" >
                  <div className="border border-red-500 p-4 rounded-lg" onClick={handleOpenSchedulePopup}>
                    <p className="text-zinc-700 dark:text-zinc-300">Nhận xe</p>
                    <p className="text-zinc-700 dark:text-zinc-300 text-zinc-900 dark:text-white font-semibold">
                      20/06/2024
                    </p>
                    <p className="text-zinc-900 dark:text-white">21:00</p>
                  </div>
                  <div className="border border-red-500 p-4 rounded-lg" onClick={handleOpenSchedulePopup}>
                    <p className="text-zinc-700 dark:text-zinc-300">Trả xe</p>
                    <p className="text-zinc-700 dark:text-zinc-300 text-zinc-900 dark:text-white font-semibold">
                      23/06/2024
                    </p>
                    <p className="text-zinc-900 dark:text-white">20:00</p>
                  </div>
                 
                    <MotorbikeSchedulePopUp isOpen={schedulePopUp} onClose={() => setSchedulePopUp(false)} />
                </div>
              </div>
              <div className={sharedClasses.mb4}>
                <label
                  className={`block text-sm font-medium ${sharedClasses.textZinc700}`}
                >
                  Vehicle return time
                </label>
                <input
                  type="datetime-local"
                  className={`mt-1 ${sharedClasses.block} w-full ${sharedClasses.borderZinc300} ${sharedClasses.rounded} ${sharedClasses.shadowSm}`}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={pickupDate || minDateTime}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Pick up location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border border-zinc-300 rounded shadow-sm focus:outline-none focus:border-zinc-500`}
                    value={gettedLocation}
                    readOnly
                    onClick={() => setShowPopUp(true)}
                  />
                  {showPopUp && (
                    <PopUpLocation onClose={() => setShowPopUp(false)} />
                  )}
                </div>
              </div>

              <div className={`flex justify-between ${sharedClasses.mb2}`}>
                <span>Price:</span>
                <span>{receiveData.price}đ/ ngày</span>
              </div>
              <div className={`flex justify-between ${sharedClasses.mb2}`}>
                <span>Total Price:</span>
                <span>
                  {receiveData.price}đ x {rentalDays} ngày
                </span>
              </div>
              <div
                className={`flex justify-between ${sharedClasses.mb4} hover:${sharedClasses.cursorPointer}`}
              >
                <span>Mã khuyến mãi</span>
                <span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </div>
              <div className={`flex justify-between ${sharedClasses.mb1}`}>
                <span>Total:</span>
                <span>{totalPrice}đ</span>
              </div>
              <button
                type="submit"
                className={`${sharedClasses.mt4} ${sharedClasses.wFull} ${sharedClasses.bgGreen500} ${sharedClasses.textWhite} ${sharedClasses.py2} ${sharedClasses.rounded}`}
              >
                RENT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
