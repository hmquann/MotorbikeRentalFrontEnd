import React, { useState, useEffect } from "react";
import axios from "axios";
import MapboxSelectLocationPopUp from "../../filter/MapboxSelectLocation";

const sharedClasses = {
  textZinc: "text-zinc-900 dark:text-zinc-100",
  textZincLight: "text-zinc-600 dark:text-zinc-400",
  textZincLighter: "text-zinc-500 dark:text-zinc-500",
  black: "text-black-500",
  redHover: "hover:text-red-600",
  bgGreen: "bg-green-500",
  bgGreenHover: "hover:bg-green-600",
};

const PopUpLocation = ({
  onClose,
  onSelectLocation,
  onChangeLocation,
  receiveData,
}) => {
  const [selectedOption, setSelectedOption] = useState("pickup-location");
  const [customLocation, setCustomLocation] = useState(null); // Updated to hold coordinates
  const motorbikeCoords = {
    longitude: receiveData.longitude,
    latitude: receiveData.latitude,
  };

  // State management for location selection
  const [selectedLocation, setSelectedLocation] = useState(onSelectLocation);
  const [openMapboxSearch, setOpenMapBoxSearch] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  // State for distance and delivery fee
  const [distance, setDistance] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const handleSelectLocation = (location) => {
    console.log("Selected Location:", location);
    setSelectedLocation(location);
    setCustomLocation({
      long: location.long,
      lat: location.lat,
      place_name: location.place_name,
    });
  };

  const checkDistance = async (addressOne, addressTwo) => {
    console.log(customLocation);
    if (!addressOne || !addressTwo) {
      console.error("Invalid addresses provided.");
      return;
    }

    const startCoord = `${addressOne.longitude},${addressOne.latitude}`;
    const endCoord = `${addressTwo.longitude},${addressTwo.latitude}`;
    const apiKey =
      "pk.eyJ1Ijoibmd1eWVua2llbjAyIiwiYSI6ImNseDNpem83bjByM3cyaXF4NTZqOWFhZWIifQ.pVT0I74tSdI290kImTlphQ";
    const apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoord};${endCoord}?access_token=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      if (
        response.status === 200 &&
        response.data &&
        response.data.routes &&
        response.data.routes.length > 0
      ) {
        const distance = response.data.routes[0].distance / 1000; // Convert from meters to kilometers
        console.log(`Distance is: ${distance} km`);
        setDistance(distance.toFixed(1));
        return distance;
      } else {
        throw new Error("Invalid response or no routes found.");
      }
    } catch (error) {
      console.error("Error making Axios request:", error);
    }
  };

  useEffect(() => {
    if (distance > receiveData.freeShipLimit) {
      setDeliveryFee(distance * receiveData.deliveryFee);
    } else {
      setDeliveryFee(0);
    }
  }, [distance]);

  const updateCustomLocation = async () => {
    if (selectedOption === "map-location" && customLocation) {
      console.log(motorbikeCoords)
      console.log({
        longitude: customLocation.long,
        latitude: customLocation.lat,
      })
      const calculatedDistance = await checkDistance(
        motorbikeCoords,
        {
          longitude: customLocation.long,
          latitude: customLocation.lat,
        } // Use customLocation directly
      );
      if (calculatedDistance > receiveData.freeShipLimit) {
        setDeliveryFee(calculatedDistance * receiveData.deliveryFee);
      } else {
        setDeliveryFee(0);
      }
    }
  };

  useEffect(() => {
    if (selectedOption === "map-location" && customLocation) {
      updateCustomLocation();
    }
  }, [customLocation]);

  const handleSubmitForm = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (selectedOption === "map-location" && !customLocation) {
      setFormError("Vui lòng chọn địa điểm trên bản đồ.");
      return; // Stop form submission
    }

    setFormError(""); // Clear any existing error

    let location;

    if (selectedOption === "pickup-location") {
      location = selectedLocation; // Use onSelectLocation directly
    } else if (selectedOption === "map-location") {
      location = customLocation.place_name;
    }

    // Call the onChangeLocation callback to send location data
    console.log(location);
    onChangeLocation(location);
    onClose(); // Close the popup after selection
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    if (option === "map-location") {
      setOpenMapBoxSearch(true);
    } else {
      setOpenMapBoxSearch(false);
    }
  };

  return (
    <div className="fixed top-0 z-50 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="popup-location-form">
        <form
          onSubmit={handleSubmitForm}
          className="w-600 h-400 bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${sharedClasses.textZinc}`}>
              Chọn địa điểm giao nhận xe
            </h2>

            <button
              type="button"
              onClick={onClose}
              className={`${sharedClasses.black} ${sharedClasses.redHover}`}
            >
              {/* Optional: Add close icon or text here */}X
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
                    className={`form-radio ${sharedClasses.black}`}
                    checked={selectedOption === "pickup-location"}
                    onChange={() => handleOptionChange("pickup-location")}
                  />
                  <div className="ml-3">
                    <p
                      className={sharedClasses.textZinc}
                      style={{ fontWeight: "bold" }}
                    >
                      Giao nhận tại vị trí xe
                    </p>
                    <p className={sharedClasses.textZincLight}>
                      {onSelectLocation}
                    </p>
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer mb-2">
                  <input
                    type="radio"
                    name="map-location"
                    value="map-location"
                    className={`form-radio ${sharedClasses.black}`}
                    checked={selectedOption === "map-location"}
                    onChange={() => handleOptionChange("map-location")}
                  />
                  <div className="ml-3 w-full">
                    <button 
                      type="button"
                      onClick={() => setOpenMapBoxSearch(true)}
                      className="text-zinc-500"
                    > <p
                    className={sharedClasses.textZinc}
                    style={{ fontWeight: "bold" }}
                  >
                     Chọn địa điểm trên bản đồ
                  </p>
                  <p className={sharedClasses.textZincLight}>
                  {customLocation?(customLocation.place_name):""}
                    </p>
                    
                    </button>
                  </div>
                </label>
              </div>
            </div>
          </div>
          {formError && <div className="text-red-500 mb-4">{formError}</div>}
          {selectedOption === "map-location" && customLocation && (
            <div>
              <p>Khoảng cách giao nhận xe: {distance} km</p>
              <p>Miễn phí giao nhận xe trong: {receiveData.freeShipLimit} km</p>
              <p>
                Phí giao nhận xe 2 chiều: {deliveryFee.toLocaleString("vi-VN")}{" "}
                đ
              </p>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 mr-2 ${sharedClasses.textZincLighter} rounded hover:${sharedClasses.textZincLight}`}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-4 py-2 ${sharedClasses.bgGreen} ${sharedClasses.bgGreenHover} text-white rounded`}
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
      <MapboxSelectLocationPopUp
        open={openMapboxSearch}
        onClose={() => setOpenMapBoxSearch(false)}
        onSelect={handleSelectLocation}
      />
    </div>
  );
};

export default PopUpLocation;
