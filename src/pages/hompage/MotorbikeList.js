import React, { useState, useEffect } from "react";
import axios from "axios";
import Filter from "../filter/Filter";
import { useNavigate } from "react-router";
import apiClient from "../../axiosConfig";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendarDays,
  faStar,
  faSuitcase,
} from "@fortawesome/free-solid-svg-icons";
// Define CSS classes
const cardClasses =
  "max-w-lg mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden";
const badgeClasses =
  "bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded";
const buttonClasses = "bg-white bg-opacity-50 p-1 rounded-full";
const avatarClasses = "w-10 h-10 rounded-full border-2 border-yellow-400";

const MotorbikeList = ({ listMotor, showDistance, searchLongitude, searchLatitude }) => {
  console.log(listMotor)
  const navigate = useNavigate();
  const [motorbikeList, setMotorbikeList] = useState([]);
  const [locaList, setLocaList] = useState([]);
  const [selectedMotorbike, setSelectedMotorbike] = useState(null);
  const [distanceList, setDistanceList] = useState([]);
  const accessToken = "pk.eyJ1Ijoibmd1eWVua2llbjAyIiwiYSI6ImNseDNpem83bjByM3cyaXF4NTZqOWFhZWIifQ.pVT0I74tSdI290kImTlphQ";

  useEffect(() => {
    if (listMotor) {
      const updatedMotorbikeList = listMotor;
      setMotorbikeList(updatedMotorbikeList);

      if (Array.isArray(updatedMotorbikeList) && updatedMotorbikeList.length !== 0) {
        const newLocaList = updatedMotorbikeList.map(motor => [motor.longitude, motor.latitude]);
        setLocaList(newLocaList);
      }
    }
  }, [listMotor]);

  useEffect(() => {
    if (locaList.length > 0) {
      fetchDistances();
    }
  }, [locaList]);

  const fetchDistances = async () => {
    const origin = [searchLongitude, searchLatitude];
    console.log( origin);
    console.log( locaList);

    const coordinates = [origin, ...locaList];
    const coordinatesString = coordinates.map(coord => coord.join(',')).join(';');
    console.log(coordinatesString)
    try {
      const response = await axios.get(`https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordinatesString}?access_token=${accessToken}`);
      
      if (response.status === 200) {
        console.log('API Response:', response.data);
        setDistanceList(response.data.distances);
        console.log('Khoảng cách:', response.data.distances);
      } else {
        console.error('Lỗi: Trạng thái hoặc dữ liệu phản hồi không hợp lệ.');
      }
    } catch (error) {
      console.error('Lỗi khi thực hiện yêu cầu Axios:', error);
    }
  };

  const formatNumber = (numberString) => {
    const number = parseInt(numberString, 10);
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getAddress = (inputString) => {
    if (typeof inputString !== "string" || inputString.trim() === "") {
      return "";
    }
    const parts = inputString.split(",").map((part) => part.trim());
    return parts.length > 2 ? parts.slice(2).join(", ") : parts.join(", ");
  };

  const handleViewDetail = async (id) => {
    try {
      const response = await apiClient(`/api/motorbike/${id}`);
      const selectedBike = response.data;
      setSelectedMotorbike(selectedBike);
      localStorage.setItem("selectedMotorbike", JSON.stringify(selectedBike));
      navigate("/booking");
    } catch (error) {
      console.error("Error fetching motorbike details:", error);
    }
  };
  return (
    <div>
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.isArray(motorbikeList) && motorbikeList.length === 0 ? (
            <div className="col-span-full text-center text-zinc-500 dark:text-zinc-400">
              Không tìm thấy xe phù hợp.
            </div>
          ) : (
            Array.isArray(motorbikeList) &&
            motorbikeList.map((motorbike) => (
              <div
                key={motorbike.id}
                className="relative p-4 bg-white rounded-lg shadow-md dark:bg-zinc-800"
                onClick={() => handleViewDetail(motorbike.id)}
              >
                <div className="relative">
                  <img
                    className="w-full h-64 object-cover rounded-t-lg"
                    src={
                      motorbike.motorbikeImages
                        ? motorbike.motorbikeImages[0]?.url
                        : "https://kenhmuabanxehoi.net/uploads/truong-the-vinh_1680594107/halinh2.jpg"
                    }
                    alt="Motorbike"
                  />
                  <div className="absolute top-2 left-2 space-y-1">
                    {/* Thêm các badges ở đây nếu cần */}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      src="https://kenhmuabanxehoi.net/uploads/truong-the-vinh_1680594107/halinh2.jpg"
                      alt="User Avatar"
                    />
                    <div className="ml-2">
                      <span className="block text-sm font-semibold text-green-600 dark:text-green-400">
                        {motorbike.model.modelName}
                      </span>
                      <span className="block text-xs text-zinc-500 dark:text-zinc-400"></span>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white"></h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 inline-flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      size="sm"
                      style={{ color: "#0f0000" }}
                    />
                    <span>{getAddress(motorbike.motorbikeAddress)}</span>
                  </p>
                  <div className="flex items-center justify-between">
                    {motorbike.tripCount > 0 && (
                      <div className="flex items-center text-yellow-500">
                        <FontAwesomeIcon
                          icon={faStar}
                          style={{ color: "#FFD43B" }}
                        />
                        <span className="text-sm">5.0</span>
                      </div>
                    )}
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center">
                      <span>
                        {motorbike.tripCount == 0 ? (
                          "Chưa có "
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={faSuitcase}
                              style={{ color: "#63E6BE" }}
                            />
                            {motorbike.tripCount}
                          </>
                        )}{" "}
                        chuyến
                      </span>
                    </div>
                    <div>
                      <span className="text-green-500 font-semibold">
                        {formatNumber(motorbike.price)}
                      </span>{" "}
                      VND/ngày
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MotorbikeList;
