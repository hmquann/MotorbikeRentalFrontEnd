import React, { useState, useEffect } from "react";
// import "./PopUpLocation.css";

const sharedClasses = {
  textZinc: "text-zinc-900 dark:text-zinc-100",
  textZincLight: "text-zinc-600 dark:text-zinc-400",
  textZincLighter: "text-zinc-500 dark:text-zinc-500",
  green: "text-green-500",
  greenHover: "hover:text-green-600",
  bgGreen: "bg-green-500",
  bgGreenHover: "hover:bg-green-600",
};

const PopUpLocation = ({ onClose, onSelectLocation, onChangeLocation }) => {
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
  };

  const handleAddressChange = (e) => {
    setAddressDetail(e.target.value);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    let location;

    if (selectedOption === "pickup-location") {
      location = selectedLocation; // Use onSelectLocation directly
      console.log("cáoidjoqie18u398u12039u1023u123");
    } else if (selectedOption === "map-location") {
      const province = provinces.find(
        (d) => d.province_id === selectedProvince
      )?.province_name;
      const district = districts.find(
        (d) => d.district_id === selectedDistrict
      )?.district_name;
      const ward = wards.find((d) => d.ward_id === selectedWard)?.ward_name;
      location = `${addressDetail}, ${ward}, ${district}, ${province}`;
    } else if (selectedOption === "airport-location") {
      location = "aaaaaaaaaaaaaaaa";
    }

    // Call the onSelectLocation callback to send location data
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
