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
import DateTimeRange from "./schedule/DateTimeRange";
import PopUpLicense from "./popUpLicense/PopUpLicense";
import dayjs from "dayjs";
import axios from "axios";
import PopUpBookingSuccess from "./PopUpBookingSuccess";
import { format } from "date-fns";
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
        {title === "Fuel" ? "" : "l/100km"}
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

  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const userId = userData.userId;

  const [selectedLocation, setSelectedLocation] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const navigate = useNavigate();
  const [showPopUpLicense, setShowPopUpLicense] = useState(false);
  const [schedulePopUp, setSchedulePopUp] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [totalPrice, setTotalPrice] = useState(receiveData.price);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [rentalDays, setRentalDays] = useState(1);
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
  const motorbikeAddress = receiveData.motorbikeAddress;
  console.log(motorbikeAddress);

  const [addressData, setAddressData] = useState([
    { id: 1, address: receiveData.motorbikeAddress },
    {
      id: 2,
      address: "",
    },
  ]);
  const [gettedLocation, setGettedLocation] = useState();
  useEffect(() => {
    if (gettedLocation === null) {
      setGettedLocation("");
    } else {
      setGettedLocation(localStorage.getItem("location"));
      setAddressData((prevAddressData) =>
        prevAddressData.map((item) =>
          item.id === 2
            ? { ...item, address: localStorage.getItem("location") }
            : item
        )
      );
    }
  }, [localStorage.getItem("location")]);
  console.log(gettedLocation);

  const [distance, setDistance] = useState();
  const [newAddressData, setNewAddressData] = useState([]);

  useEffect(() => {
    const fetchGeocodeData = async () => {
      try {
        const promises = addressData.map(async (addressItem) => {
          try {
            const response = await axios.get(
              `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
                addressItem.address
              )}&access_token=pk.eyJ1Ijoibmd1eWVua2llbjAyIiwiYSI6ImNseDNpem83bjByM3cyaXF4NTZqOWFhZWIifQ.pVT0I74tSdI290kImTlphQ`
            );

            if (response.status === 200 && response.data) {
              const coordinates =
                response.data.features[0].geometry.coordinates;

              return {
                ...addressItem,
                longitude: coordinates[0],
                latitude: coordinates[1],
              };
            } else {
              console.error("Error: Invalid response status or data.");
              return null;
            }
          } catch (error) {
            console.error("Error making Axios request:", error);
            return null;
          }
        });

        const results = await Promise.all(promises);
        const validResults = results.filter((address) => address !== null);

        setNewAddressData(validResults); // Cập nhật `newAddressData`
        console.log(validResults);
      } catch (error) {
        console.error("Error fetching geocode data:", error);
      }
    };

    fetchGeocodeData();
  }, [addressData]);
  const checkDistance = (addressOne, addressTwo) => {
    if (!addressOne || !addressTwo) {
      console.error("Invalid addresses provided.");
      return;
    }

    if (
      addressOne.longitude === undefined ||
      addressOne.latitude === undefined ||
      addressTwo.longitude === undefined ||
      addressTwo.latitude === undefined
    ) {
      console.error("Address coordinates are missing.");
      return;
    }

    const apiKey =
      "pk.eyJ1Ijoibmd1eWVua2llbjAyIiwiYSI6ImNseDNpem83bjByM3cyaXF4NTZqOWFhZWIifQ.pVT0I74tSdI290kImTlphQ";
    const startCoord = `${addressOne.longitude},${addressOne.latitude}`;
    const endCoord = `${addressTwo.longitude},${addressTwo.latitude}`;
    const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoord};${endCoord}?approaches=unrestricted;curb&access_token=${apiKey}`;

    axios
      .get(apiUrl)
      .then((response) => {
        if (
          response.status === 200 &&
          response.data &&
          response.data.routes &&
          response.data.routes.length > 0
        ) {
          const distance = response.data.routes[0].distance / 1000; // Đổi đơn vị từ mét sang km
          console.log(`Distance is: ${distance} km`);
          setDistance(distance.toFixed(1));
        } else {
          console.error("Error: Invalid response or no routes found.");
        }
      })
      .catch((error) => {
        console.error("Error making Axios request:", error);
      });
  };
  useEffect(() => {
    if (newAddressData.length >= 2) {
      checkDistance(newAddressData[0], newAddressData[1]);
    }
  }, [newAddressData]);
  console.log(distance);
  useEffect(() => {
    if (distance > receiveData.freeShipLimit) {
      setDeliveryFee(distance * receiveData.deliveryFee);
    }
  }, [distance]);

  useEffect(() => {
    setTotalPrice(rentalDays * receiveData.price + deliveryFee);
  }, [rentalDays, deliveryFee]);

  const [showPopupBooking, setShowPopupBooking] = useState(false);

  const [messageLicense, setMessageLicense] = useState("");
  const [buttonLicense, setButtonLicense] = useState("");
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // check license
      const response1 = await axios.get(
        `http://localhost:8080/api/license/getLicenseByUserId/${userId}`
      );
      console.log(response1);
      // check api license thanh cong hay khong thanh cong
      if (response1.status !== 200) {
        throw new Error("API license failed");
      }

      if (response1.data === null || response1.data === "") {
        setShowPopUpLicense(true);
        setMessageLicense(
          "You need to verify your driver's license to be able to book a motorbike!"
        );
        setButtonLicense("VERIFY");
      } else {
        //kiem tra xem giay phep lai xe co hop le hay khong
        //truong hop khong hop le
        if (
          response1.data.licenseType === "A1" &&
          receiveData.licenseType === "A2"
        ) {
          console.log(112312313131313131312313);
          setShowPopUpLicense(true);
          setMessageLicense(
            "This motorbike requires an A2 license. Please update your driver's license."
          );
          setButtonLicense("UPDATE");
        }
        //truong hop hop le
        else {
          const response2 = await axios
            .post("http://localhost:8080/api/booking/create", {
              renterId: userId,
              motorbikeId: receiveData.id,
              startDate: dayjs(dateRange[0]).format("YYYY-MM-DDTHH:mm:ss"),
              endDate: dayjs(dateRange[1]).format("YYYY-MM-DDTHH:mm:ss"),
              totalPrice: totalPrice,
              receiveLocation: gettedLocation,
            })
            .then((response2) => {
              setShowPopupBooking(true); // Hiển thị popup khi thành công
              setTimeout(() => {
                setShowPopupBooking(false); // Ẩn popup sau 3 giây
                navigate("/login"); //chuyển sang trang login sau khi thông báo
              }, 3000);
            });

          if (response2.status !== 200) {
            throw new Error("API booking failed");
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
                  src={receiveData.motorbikeImages[0].url}
                />
              </div>
            </div>
            <div class="sub-img">
              <div class="cover-car-item">
                <img
                  loading="lazy"
                  src={receiveData.motorbikeImages[1].url}
                  alt="Cho thuê xe tự lái HYUNDAI ACCENT 2023"
                />
              </div>
              <div class="cover-car-item">
                <img
                  loading="lazy"
                  src={receiveData.motorbikeImages[2].url}
                  alt="Cho thuê xe tự lái HYUNDAI ACCENT 2023"
                />
              </div>
              <div class="cover-car-item">
                <img
                  loading="lazy"
                  src={receiveData.motorbikeImages[3].url}
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
                Trang bị camera hành trình trước sau
                <br />
                Có bảo hiểm đầy đủ
                <br />
                Chủ xe thân thiện hỗ trợ nhiệt tình
              </p>
            </div>
            <RentalDocument />
            {/* Other amenities section */}
            <div
              className={`${sharedClasses.grid} ${sharedClasses.gridCols4} ${sharedClasses.gap4}`}
            >
              {/* Other amenities go here */}
            </div>
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

              <div className="mb-3">
                <DateTimeRange
                  onDateRangeChange={handleDateRangeChange}
                  onReceiveTimeChange={handleReceiveTimeChange}
                  onReturnTimeChange={handleReturnTimeChange}
                ></DateTimeRange>
              </div>

              <div className="mb-3">
                <label className="block text-lg  text-zinc-700 mb-1">
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
                    <PopUpLocation
                      onClose={() => setShowPopUp(false)}
                      onSelectLocation={motorbikeAddress}
                    />
                  )}
                </div>
              </div>

              <div
                className={`flex justify-between text-lg ${sharedClasses.mb2}`}
              >
                <span>Price</span>
                <span>{receiveData.price} vnd/ day</span>
              </div>
              <div
                className={`flex justify-between text-lg ${sharedClasses.mb2}`}
              >
                <span>Total price</span>
                <span>
                  {receiveData.price} vnd x {rentalDays} day
                </span>
              </div>
              <div
                className={`flex justify-between text-lg ${sharedClasses.mb2}`}
              >
                <span>Delivery fee</span>
                <span>{deliveryFee} vnd</span>
              </div>
              <div
                className={`flex justify-between text-lg ${sharedClasses.mb4} hover:${sharedClasses.cursorPointer}`}
              >
                <span>Voucher</span>
                <span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </div>
              <div
                className={`flex justify-between text-lg ${sharedClasses.mb1}`}
              >
                <span>Total</span>
                <span>{totalPrice} vnd</span>
              </div>
              <button
                type="submit"
                className={`text-lg ${sharedClasses.mt4} ${sharedClasses.wFull} ${sharedClasses.bgGreen500} ${sharedClasses.textWhite} ${sharedClasses.py2} ${sharedClasses.rounded}`}
              >
                RENT
              </button>
            </form>
            {showPopUpLicense && (
              <PopUpLicense
                onClose={() => setShowPopUpLicense(false)}
                messageLicense={messageLicense}
                buttonLicense={buttonLicense}
              />
            )}
            {showPopupBooking && (
              <PopUpBookingSuccess message="Your request booking sent successfully!" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
