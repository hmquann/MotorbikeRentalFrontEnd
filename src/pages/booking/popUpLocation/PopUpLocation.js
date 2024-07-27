import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const sharedClasses = {
  textZinc: "text-zinc-900 dark:text-zinc-100",
  textZincLight: "text-zinc-600 dark:text-zinc-400",
  textZincLighter: "text-zinc-500 dark:text-zinc-500",
  green: "text-green-500",
  greenHover: "hover:text-green-600",
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
  const [customLocation, setCustomLocation] = useState(""); // State to store custom location input

  // State management for location selection
  const [selectedLocation, setSelectedLocation] = useState(onSelectLocation);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  // State for distance and delivery fee
  const [distance, setDistance] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  // State for custom location coordinates
  const [customCoords, setCustomCoords] = useState(null);

  useEffect(() => {
    fetch("https://vapi.vnappmob.com/api/province/")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.results) {
          setProvinces(data.results);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);
    fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.results) {
          setDistricts(data.results);
          setWards([]);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    fetch(`https://vapi.vnappmob.com/api/province/ward/${districtId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length === 0) {
          setWards([]); // Clear wards if no wards are available
        }
        if (data && data.results) {
          setWards(data.results);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleWardChange = (event) => {
    const wardId = event.target.value;
    setSelectedWard(wardId);
    updateCustomLocation();
  };

  const handleAddressChange = (e) => {
    setAddressDetail(e.target.value);
    updateCustomLocation();
  };
  const [addressDetailData, setAddressDetailData] = useState();
  useEffect(() => {
    console.log(addressDetail);
    setAddressDetailData(addressDetail);
    updateCustomLocation();
  }, [addressDetail]);
  const fetchGeocodeData = async (address) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=pk.eyJ1Ijoibmd1eWVua2llbjAyIiwiYSI6ImNseDNpem83bjByM3cyaXF4NTZqOWFhZWIifQ.pVT0I74tSdI290kImTlphQ`
      );

      if (response.status === 200 && response.data) {
        const coordinates = response.data.features[0].geometry.coordinates;
        return { longitude: coordinates[0], latitude: coordinates[1] };
      } else {
        throw new Error("Invalid response status or data.");
      }
    } catch (error) {
      console.error("Error making Axios request:", error);
      return null;
    }
  };

  const checkDistance = async (addressOne, addressTwo) => {
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
        const distance = response.data.routes[0].distance / 1000;
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
    const province = provinces.find(
      (d) => d.province_id === selectedProvince
    )?.province_name;
    const district = districts.find(
      (d) => d.district_id === selectedDistrict
    )?.district_name;
    const ward = wards.find((d) => d.ward_id === selectedWard)?.ward_name;
    const location = `${addressDetailData}, ${ward}, ${district}, ${province}`;
    console.log(location);
    setCustomLocation(location);

    if (selectedOption === "map-location") {
      const customCoords = await fetchGeocodeData(location);
      setCustomCoords(customCoords);
      const motorbikeCoords = await fetchGeocodeData(onSelectLocation);
      const calculatedDistance = await checkDistance(
        motorbikeCoords,
        customCoords
      );
      if (calculatedDistance > receiveData.freeShipLimit) {
        setDeliveryFee(calculatedDistance * receiveData.deliveryFee);
      } else {
        setDeliveryFee(0);
      }
    }
  };

  const handleDistance = () => {};
  const handleDeliveryFee = () => {};

  const handleSubmitForm = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (selectedOption === "map-location") {
      if (
        !selectedProvince ||
        !selectedDistrict ||
        !selectedWard ||
        !addressDetail
      ) {
        setFormError("Vui lòng nhập đầy đủ thông tin địa chỉ.");
        return; // Stop form submission
      }
    }

    setFormError(""); // Clear any existing error

    let location;

    if (selectedOption === "pickup-location") {
      location = selectedLocation; // Use onSelectLocation directly
    } else if (selectedOption === "map-location") {
      location = customLocation;
    }

    // Call the onSelectLocation callback to send location data
    console.log(location);
    onChangeLocation(location);
    onClose(); // Close the popup after selection
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
              Chọn địa điểm giao nhận xe
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={`${sharedClasses.green} ${sharedClasses.greenHover}`}
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
                    className={`form-radio ${sharedClasses.green}`}
                    checked={selectedOption === "pickup-location"}
                    onChange={() => setSelectedOption("pickup-location")}
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
                    name="pickup-location"
                    value="map-location"
                    className={`form-radio ${sharedClasses.green}`}
                    checked={selectedOption === "map-location"}
                    onChange={() => setSelectedOption("map-location")}
                  />
                  <div className="ml-3 w-full">
                    <p
                      className={sharedClasses.textZinc}
                      style={{ fontWeight: "bold" }}
                    >
                      Nhận xe tại vị trí của bạn
                    </p>
                    <div className="flex flex-wrap gap-6 mb-6">
                      <div className="flex-1">
                        <select
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          id="provinces"
                          name="province"
                          value={selectedProvince}
                          onChange={handleProvinceChange}
                          disabled={selectedOption !== "map-location"}
                        >
                          <option value="">Tỉnh/ Thành phố</option>
                          {provinces.map((province) => (
                            <option
                              key={province.province_id}
                              value={province.province_id}
                            >
                              {province.province_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <select
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={selectedDistrict}
                          name="district"
                          onChange={handleDistrictChange}
                          disabled={
                            selectedOption !== "map-location" ||
                            !selectedProvince
                          }
                        >
                          <option value="">Quận/ Huyện</option>
                          {districts.map((district) => (
                            <option
                              key={district.district_id}
                              value={district.district_id}
                            >
                              {district.district_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <select
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={selectedWard}
                          name="ward"
                          onChange={handleWardChange}
                          disabled={
                            selectedOption !== "map-location" ||
                            !selectedDistrict
                          }
                          id="wards"
                        >
                          <option value="">Phường/ Xã</option>
                          {wards.map((ward) => (
                            <option key={ward.ward_id} value={ward.ward_id}>
                              {ward.ward_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        name="addressDetail"
                        value={addressDetail}
                        onChange={handleAddressChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="VD: Số 1 đường A"
                        disabled={selectedOption !== "map-location"}
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          {formError && <div className="text-red-500 mb-4">{formError}</div>}
          {selectedOption === "map-location" && (
            <div>
              <p>Khoảng cách giao nhận xe: {distance} km</p>
              <p>Phí giao nhận xe: {deliveryFee.toLocaleString("vi-VN")}đ</p>
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
    </div>
  );
};

export default PopUpLocation;
