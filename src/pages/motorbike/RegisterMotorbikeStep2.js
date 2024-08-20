import React, { useState } from "react";
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
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ImageUploader from "./ImageUploader";
import apiClient from "../../axiosConfig";
import { CircularProgress } from "@mui/material";
import Login from "../login/Login";
const inputClasses =
  "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500";
const buttonClasses =
  "bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500";
const labelClasses = "block text-sm font-medium text-zinc-700 mb-2";
const RegisterMotorbikeStep2 = (files) => {
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const receiveData = location.state.formData;
  const modelName = location.state.modelName;
  console.log(modelName);
  const [checkDelivery, setCheckDelivery] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [formData, setFormData] = useState(receiveData);
  const [overtimeFeeError, setOvertimeFeeError] = useState();
  const [priceError, setPriceError] = useState();
  const [overtimeLimitError, setOvertimeLimitError] = useState();
  const [deliveryFeeError, setDeliveryFeeError] = useState();
  const [freeshipError, setFreeshipError] = useState();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);
  console.log(receiveData);
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

  const handleImageUpload = (files) => {
    setUploadedImages(files);
    console.log("Received images:", files);
  };

  useEffect(() => {
    fetch("https://vapi.vnappmob.com/api/province/")
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
        if (data && data.results) {
          setProvinces(data.results); // Điều chỉnh theo cấu trúc dữ liệu thực tế
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);
  const handleCheckDelivery = (event) => {
    const newCheckDelivery = event.target.checked;
    console.log(newCheckDelivery);
    setCheckDelivery(newCheckDelivery);
    setFormData({
        ...formData,
        delivery: newCheckDelivery,
    });
};
  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    const selectedProvince = provinces.find(
      (d) => d.province_id === provinceId
    );
    setSelectedProvince(provinceId);
    // Fetch districts based on selected province
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
    const selectedDistrict = districts.find(
      (d) => d.district_id === districtId
    );
    setSelectedDistrict(districtId);
    // Fetch wards based on selected district
    fetch(`https://vapi.vnappmob.com/api/province/ward/${districtId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length === 0) {
          console.log("No wards available");
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
    const selectedWard = wards.find((d) => d.ward_id === wardId);
    setSelectedWard(wardId);
  };
  const regexValueInput = (input) => {
    const numericValue = parseInt(input, 10);
    const regex = /^(?:[0-9]|[1-9][0-9]{0,5}|1000000)$/;
    return regex.test(input) && numericValue >= 0 && numericValue <= 1000000;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(formData);
    if (name === "overtimeFee") {
      if (!regexValueInput(value)) {
        setOvertimeFeeError("Hãy nhập vào 1 số");
      } else if (value === "") {
        setOvertimeFeeError("Không được bỏ trống");
      } else {
        setOvertimeFeeError("");
      }
    }
    if (name === "price") {
      console.log(value);
      if (!regexValueInput(value)) {
        setPriceError("Hãy nhập vào 1 số");
      } else if (value === "") {
        setPriceError("Không được bỏ trống");
      } else {
        setPriceError("");
      }
    }
    if (name === "overtimeLimit") {
      if (!regexValueInput(value)) {
        setOvertimeLimitError("Hãy nhập vào 1 số");
      } else if (value === "") {
        setOvertimeLimitError("Không được bỏ trống");
      } else {
        setOvertimeLimitError("");
      }
    }
    if (name === "freeshipLimit" && checkDelivery === true) {
      if (!regexValueInput(value) ) {
        setFreeshipError("Phải là 1 số");
      } else if (value === "" ) {
        setFreeshipError("Không được bỏ trống");
      } else {
        setFreeshipError("");
      }
    }
    if (name === "deliveryFee" && checkDelivery === true) {
      if (!regexValueInput(value) ) {
        setDeliveryFeeError("Phải là 1 số");
      } else if (value === "") {
        setDeliveryFeeError("Không được bỏ trống");
      } else {
        setDeliveryFeeError("");
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleAddressChange = (e) => {
    setAddressDetail(e.target.value);
  };
  const handleReturnClick = () => {
    navigate("/registermotorbike", { state: { receiveData } });
  };
  const handleOpenLoginModal = () => {
    const currentPath = window.location.pathname;
    setRedirectUrl(currentPath);
    setShowLoginModal(true);
  };
  const handleLoginSuccess = (userInfor) => {
    localStorage.setItem("user", JSON.stringify(userInfor));
    setShowLoginModal(false);
  };

  useEffect(() => {
    if (userId) {
      setShowLoginModal(false);
      handleSubmitClick();

    }
  }, [userId]);
  const handleSubmitClick = async (e) => {
    e?.preventDefault();
    if (!userId) {
      handleOpenLoginModal();
      setSpinner(false);
      return;
    }
    setSpinner(true);

    // Kiểm tra lỗi trước khi gửi dữ liệu
    if (
      priceError ||
      overtimeFeeError ||
      overtimeLimitError 
    ) {
      setError("Hoàn thành form đăng ký trước khi ấn 'Đăng ký'.");
      setSpinner(false);
      return; // Dừng hàm nếu có lỗi
    }
    if(formData.delivery==="true"){
      if(deliveryFeeError||freeshipError){
        setError("Hoàn thành form đăng ký trước khi ấn 'Đăng ký'.");
        setSpinner(false);
        return; 
      }
    }
    const province =
      provinces.find((d) => d.province_id === selectedProvince)
        ?.province_name || "";
    const district =
      districts.find((d) => d.district_id === selectedDistrict)
        ?.district_name || "";
    const ward = wards.find((d) => d.ward_id === selectedWard)?.ward_name || "";
    const address = `${addressDetail}, ${ward}, ${district}, ${province}`;

    // Tạo đối tượng FormData
    const newFormData = new FormData();
    newFormData.append("motorbikePlate", formData.motorbikePlate);
    newFormData.append("yearOfManufacture", formData.yearOfManufacture);
    newFormData.append("constraintMotorbike", formData.constraintMotorbike);
    newFormData.append("price", formData.price);
    newFormData.append("overtimeFee", formData.overtimeFee);
    newFormData.append("overtimeLimit", formData.overtimeLimit);
    newFormData.append("delivery", formData.delivery);
    newFormData.append("freeShipLimit", formData.freeshipLimit);
    newFormData.append("deliveryFee", formData.deliveryFee);
    newFormData.append("modelId", formData.modelId);
    newFormData.append("motorbikeAddress", address);
    newFormData.append(
      "userId",
      JSON.parse(localStorage.getItem("user")).userId
    );

    uploadedImages.forEach((image, index) => {
      const fileName = image.name;
      const fileExtension = fileName.split(".").pop();
      const newFileName = `image-${index}.${fileExtension}`;
      newFormData.append("motorbikeImages", image, newFileName);
    });

    try {
      // Gọi API Mapbox để lấy tọa độ
      const response = await axios.get(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
          address
        )}&access_token=pk.eyJ1Ijoibmd1eWVua2llbjAyIiwiYSI6ImNseDNpem83bjByM3cyaXF4NTZqOWFhZWIifQ.pVT0I74tSdI290kImTlphQ`
      );

      if (
        response.status === 200 &&
        response.data &&
        response.data.features.length > 0
      ) {
        const coordinates = response.data.features[0].geometry.coordinates;
        console.log(coordinates);
        newFormData.append("longitude", coordinates[0]);
        newFormData.append("latitude", coordinates[1]);
      } else {
        console.error("Error: Invalid response status or data.");
      }
    } catch (error) {
      console.error("Error making Axios request:", error);
    }

    // Gửi dữ liệu đến server
    try {
      const response = await apiClient.post(
        "/api/motorbike/register",
        newFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const now = new Date();
      if (userData.systemNoti) {
        await setDoc(doc(collection(db, "notifications")), {
          userId: userId,
          message: JSON.stringify({
            title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
            content: `Bạn đã gửi yêu cầu duyệt xe <strong>${modelName} ${newFormData.get(
              "yearOfManufacture"
            )}</strong>, biển số <strong>${newFormData.get(
              "motorbikePlate"
            )}</strong> thành công.`,
          }),
          timestamp: now,
          seen: false,
        });
      }
      const admin = await apiClient.get("api/user/getAdmin");
      const adminId = admin.data.id;
      if (admin.data.systemNoti) {
        await setDoc(doc(collection(db, "notifications")), {
          userId: adminId,
          message: JSON.stringify({
            title: '<strong style="color: rgb(34 197 94)">Thông báo</strong>',
            content: `Người dùng <strong>${userName}</strong> đã gửi yêu cầu duyệt xe <strong>${modelName} ${newFormData.get(
              "yearOfManufacture"
            )}</strong>, biển số <strong>${newFormData.get(
              "motorbikePlate"
            )}</strong>.`,
          }),
          timestamp: now,
          seen: false,
        });
      }
      console.log("Data sent successfully:", response.data);
      navigate("/homepage");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response);
        console.error("Status code:", error.response.status);
        console.error("Data:", error.response.data);

        if (error.response.status === 404) {
          setError(
            "Error 404: Not Found. The requested resource could not be found."
          );
        } else if (error.response.status === 409) {
          setError(error.response.data);
        } else {
          setError(
            `Error ${error.response.status}: ${
              error.response.data.message || "An error occurred."
            }`
          );
        }
      } else if (error.request) {
        console.error("Error request:", error.request);
        setError("No response received. Please check your network connection.");
      }
    } finally {
      setSpinner(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 flex flex-col items-center justify-center font-manrope">
      <h1 className="text-3xl font-extrabold mb-6 mt-10 font-encode">
        Đăng ký xe
      </h1>
      <div className="relative">
        {/* Overlay with CircularProgress */}
        {spinner && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10">
            <CircularProgress color="inherit" />
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl w-full">
          <div className="mb-6">
            <label className="block text-2xl font-bold text-zinc-700 mb-2">
              Đơn giá thuê mặc định
            </label>
            <p className="text-sm text-zinc-500 mb-6">
              Đơn giá áp dụng cho tất cả các ngày.
            </p>
            <input
              type="text"
              name="price"
              className={`${inputClasses} mb-3`}
              value={formData.price}
              onChange={handleChange}
            />
            {priceError && <div className="text-red-500">{priceError}</div>}
          </div>
          <div className="mb-6">
            <label className="block text-2xl font-bold text-zinc-700 mb-2">
              Địa chỉ xe
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <select
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                id="provinces"
                name="province"
                value={selectedProvince}
                onChange={handleProvinceChange}
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
              <select
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedDistrict}
                name="district"
                onChange={handleDistrictChange}
                disabled={!selectedProvince}
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
              <select
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedWard}
                name="ward"
                onChange={handleWardChange}
                disabled={!selectedDistrict}
                id="wards"
              >
                <option value="">Phường/ Xã</option>
                {wards.map((ward) => (
                  <option key={ward.ward_id} value={ward.ward_id}>
                    {ward.ward_name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Nhập địa chỉ chi tiết"
                name="addressDetail"
                value={addressDetail}
                onChange={handleAddressChange}
                disabled={!selectedWard}
                type="text"
                className="w-full p-2 border rounded mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap mb-9">
            {/* Overtime fee section */}
            <div className="w-full sm:w-1/2 pr-3 mb-6 sm:mb-0">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Phí trả xe muộn
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="overtimeFee"
                  className="w-2/3 p-2 border rounded mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.overtimeFee}
                  onChange={handleChange}
                />

                <span className="text-sm text-zinc-700">VND/giờ</span>
              </div>
              {overtimeFeeError && (
                <div className="text-red-500">{overtimeFeeError}</div>
              )}
            </div>

            {/* Overtime limit section */}
            <div className="w-full sm:w-1/2 pl-3">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Giới hạn trả xe muộn
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="overtimeLimit"
                  className="w-2/3 p-2 border rounded mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.overtimeLimit}
                  onChange={handleChange}
                />
                <span className="text-sm text-zinc-700">giờ</span>
              </div>
              {overtimeLimitError && (
                <div className="text-red-500">{overtimeLimitError}</div>
              )}
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <div className="w-full sm:w-1/2 pr-3 mb-6 sm:mb-0 flex items-center">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mr-2">
                Giao xe tận nơi
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value={checkDelivery}
                  className="sr-only peer"
                  onClick={handleCheckDelivery}
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
          <div className="flex flex-nowrap mb-6 ">
            <div className="w-full md:w-1/2 pr-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Miễn phí giao xe trong vòng
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="freeshipLimit"
                  className="w-2/3 p-2 border rounded mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.freeshipLimit}
                  disabled={!checkDelivery}
                  onChange={handleChange}
                />

                <span className="text-sm text-zinc-700">km</span>
              </div>
              {freeshipError && (
                <div className="text-red-500">{freeshipError}</div>
              )}
            </div>

            <div className="w-full md:w-1/2 pr-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Phí giao xe cho mỗi km (ngoài bán kính freeship)
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="deliveryFee"
                  className="w-2/3 p-2 border rounded mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.deliveryFee}
                  disabled={!checkDelivery}
                  onChange={handleChange}
                />
                <span className="text-sm text-zinc-700">VND/km</span>
              </div>
              {deliveryFeeError && (
                <div className="text-red-500">{deliveryFeeError}</div>
              )}
            </div>
          </div>
          <ImageUploader sendDataToParent={handleImageUpload} />

          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleReturnClick}
              className="w-6/12 py-3 mr-4 text-base font-bold text-white bg-zinc-400 rounded-lg hover:bg-zinc-500 transition hover:scale-105"
            >
              Quay lại
            </button>
            <button
              onClick={(e) => handleSubmitClick(e)}
              className="w-6/12 py-2 text-base font-bold text-white  bg-green-500 rounded-lg hover:bg-green-600 transition hover:scale-105"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <Login
          show={showLoginModal}
          handleClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default RegisterMotorbikeStep2;
