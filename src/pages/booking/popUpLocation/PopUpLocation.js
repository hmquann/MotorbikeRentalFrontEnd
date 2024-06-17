import React, { useState } from "react";
import "./PopUpLocation.css";

const sharedClasses = {
  textZinc: "text-zinc-900 dark:text-zinc-100",
  textZincLight: "text-zinc-600 dark:text-zinc-400",
  textZincLighter: "text-zinc-500 dark:text-zinc-500",
  green: "text-green-500",
  greenHover: "hover:text-green-600",
  bgGreen: "bg-green-500",
  bgGreenHover: "hover:bg-green-600",
};

const PopUpLocation = ({ onClose, onSelectLocation }) => {
  const [selectedOption, setSelectedOption] = useState("pickup-location");
  const [customLocation, setCustomLocation] = useState(""); // State to store custom location input
  const handleSubmitForm = (e) => {
    e.preventDefault();
    let location;
    if (selectedOption === "pickup-location") {
      location = "Quận Bình Thạnh, TP. Hồ Chí Minh";
    } else if (selectedOption === "map-location") {
      location = customLocation;
    } else if (selectedOption === "airport-location") {
      location = "Tân Sơn Nhất";
    }

    localStorage.setItem("location", location);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="popup-location-form">
        <form
          onSubmit={handleSubmitForm}
          className="w-600 h-400 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${sharedClasses.textZinc}`}>
              Địa điểm giao nhận xe
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={`${sharedClasses.green} ${sharedClasses.greenHover}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/1 md:pl-4">
              <div className="mb-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer mb-2 border-green-500">
                  <input
                    type="radio"
                    name="pickup-location"
                    value="pickup-location"
                    className={`form-radio ${sharedClasses.green}`}
                    checked={selectedOption === "pickup-location"}
                    onChange={() => setSelectedOption("pickup-location")}
                  />
                  <div className="ml-3">
                    <p
                      className={sharedClasses.textZinc}
                      style={{ fontWeight: "bold" }}
                    >
                      Nhận xe tại vị trí xe
                    </p>
                    <p className={sharedClasses.textZincLight}>
                      Quận Bình Thạnh, TP. Hồ Chí Minh
                    </p>
                    <p
                      className={sharedClasses.textZincLighter}
                      style={{ fontStyle: "italic", opacity: 0.7 }}
                    >
                      Bạn sẽ nhận và trả xe tại vị trí xe (địa chỉ cụ thể sẽ
                      được hiển thị sau khi đặt cọc)
                    </p>
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer mb-2">
                  <input
                    type="radio"
                    name="pickup-location"
                    value="map-location"
                    className={`form-radio ${sharedClasses.green}`}
                    checked={selectedOption === "map-location"}
                    onChange={() => setSelectedOption("map-location")}
                  />
                  <div className="ml-3">
                    <p
                      className={sharedClasses.textZinc}
                      style={{ fontWeight: "bold" }}
                    >
                      Nhận xe tại vị trí của bạn
                    </p>
                    <input
                      type="text"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      className="w-full px-3 py-2 mt-1 border border-zinc-300 rounded shadow-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="pickup-location"
                    value="airport-location"
                    className={`form-radio ${sharedClasses.green}`}
                    checked={selectedOption === "airport-location"}
                    onChange={() => setSelectedOption("airport-location")}
                  />
                  <div className="ml-3">
                    <p
                      className={sharedClasses.textZinc}
                      style={{ fontWeight: "bold" }}
                    >
                      Giao xe sân bay
                    </p>
                    <p className={sharedClasses.textZincLight}>Tân Sơn Nhất</p>
                  </div>
                </label>
              </div>
              <button
                type="button"
                onClick={handleSubmitForm}
                className={`w-full ${sharedClasses.bgGreen} text-white py-2 rounded-lg ${sharedClasses.bgGreenHover}`}
              >
                Thay đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUpLocation;
