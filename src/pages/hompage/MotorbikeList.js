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

const MotorbikeList = (listMotor) => {
  const navigate = useNavigate();
  console.log(listMotor);
  const [motorbikeList, setMotorbikeList] = useState(listMotor.listMotor);
  const [selectedMotorbike, setSelectedMotorbike] = useState(null);
  useEffect(() => {
    if (listMotor.listMotor) {
      setMotorbikeList(listMotor.listMotor);
    }
  }, [listMotor.listMotor]);
  function formatNumber(numberString) {
    // Convert the string to a number, in case it isn't already
    const number = parseInt(numberString, 10);

    // Convert the number back to a string and use regex to format it with dots
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
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
          {motorbikeList.length === 0 ? (
            <div className="col-span-full text-center text-zinc-500 dark:text-zinc-400">
              Không tìm thấy xe phù hợp.
            </div>
          ) : (
            motorbikeList.map((motorbike) => (
              <div
              key={motorbike.id}
              className="relative p-4 bg-white rounded-lg shadow-md dark:bg-zinc-800"
              onClick={() => handleViewDetail(motorbike.id)}
            >
              <div className="relative">
                <img
                  className="w-full h-64 object-cover rounded-t-lg"
                  src={motorbike.motorbikeImages[0].url}
                  alt="Motorbike"
                />
                <img
                  className="w-12 h-12 rounded-full object-cover absolute top-1/2 left-2 transform -translate-y-1/2 border-2 border-white dark:border-zinc-800"
                  src="https://kenhmuabanxehoi.net/uploads/truong-the-vinh_1680594107/halinh2.jpg"
                  alt="User Avatar"
                />
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className="block text-xl font-semibold text-green-400 dark:text-green-400">
                    <span className="mr-2 ">{motorbike.model.modelName}</span>
                    <span>{motorbike.yearOfManufacture}</span>
                  </span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 inline-flex items-center space-x-2">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    size="sm"
                    style={{ color: "#0f0000" }}
                  />
                  <span>{getAddress(motorbike.motorbikeAddress)}</span>
                </p>
                <hr className="my-2 border-gray-300 dark:border-zinc-600" />
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
                      {motorbike.tripCount === 0 ? (
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
                    <span className="text-green-400 font-semibold text-xl">
                      {motorbike.price / 1000}
                    </span>
                    K/ngày
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
