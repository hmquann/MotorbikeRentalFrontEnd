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
  const [motorbikeList, setMotorbikeList] = useState(listMotor);
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

  const modelTypeMap = {
    'XeSo': 'Xe Số',
    'XeTayGa': 'Xe Tay Ga',
    'XeConTay': 'Xe Côn Tay',
    'XeDien': 'Xe Điện',
    'XeGanMay' : 'Xe Gắn Máy'
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
              <div className="relative flex items-center">
            <div className="grid gap-4 w-full h-full cursor-pointer overflow-hidden ">
                  <div 
                    key={motorbike.id} 
                    className="bg-white p-4 flex flex-col rounded-xl border" 
                    onClick={() => handleViewDetail(motorbike.id)}
                  >
                    <div className='flex flex-col w-full gap-4 rounded-xl'>
                      <img
                        className="w-full h-48 object-cover rounded-xl"
                        src={motorbike.motorbikeImages[0].url || '/default-image.jpg'}
                        alt={motorbike.name}
                      />
                      <div className="">
                        <div className="flex items-center mb-2">
                          <button className="bg-blue-100 px-2 inline-flex leading-7 font-base rounded-full text-xs">
                             {modelTypeMap[motorbike.model.modelType]}
                          </button>
                          <button className="bg-green-100 px-2 inline-flex leading-7 font-base rounded-full text-xs ml-1">
                            {motorbike.delivery ? "Giao xe tận nơi" : ""}
                          </button>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{motorbike.model.modelName}</h3>
                        <div className="text-gray-500">
                          <FontAwesomeIcon icon={faLocationDot} className='mr-2' />
                          <span className="">{motorbike.motorbikeAddress}</span>
                          <span className="float-right">km</span>
                        </div>
                        <hr />
                        <div className='flex justify-between'>
                          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                            {motorbike.tripCount > 0 ? (
                              <>
                              <FontAwesomeIcon icon={faStar} style={{color :"#FFD43B"}} />
                              <span className="px-2">•</span>
                              <div class="text-green-600">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_3535_118649)">
                        <path
                          d="M15.0938 1.82812C15.0938 1.59553 15.283 1.40625 15.5156 1.40625H17.9531C18.1858 1.40625 18.375 1.59553 18.375 1.82812V4.34133H19.7812V1.82812C19.7812 0.820078 18.9612 0 17.9531 0H15.5156C14.5076 0 13.6875 0.820078 13.6875 1.82812V4.34133H15.0938V1.82812Z"
                          fill="#5FCF86"
                        ></path>
                        <path
                          d="M8.54709 22.5937C8.23987 22.1164 8.0625 21.5512 8.0625 20.9531V10.4116H1.64062C0.735984 10.4116 0 11.1476 0 12.0522V20.9531C0 21.7782 0.612234 22.4626 1.40625 22.5767V23.2967C1.40625 23.685 1.72106 23.9998 2.10938 23.9998C2.49769 23.9998 2.8125 23.685 2.8125 23.2967V22.5937H8.54709V22.5937ZM2.8125 12.9897C2.8125 12.6014 3.12731 12.2866 3.51562 12.2866C3.90394 12.2866 4.21875 12.6014 4.21875 12.9897V20.0156C4.21875 20.4039 3.90394 20.7187 3.51562 20.7187C3.12731 20.7187 2.8125 20.4039 2.8125 20.0156V12.9897Z"
                          fill="#5FCF86"
                        ></path>
                        <path
                          d="M6.5625 7.89844C6.5625 7.66584 6.75178 7.47656 6.98438 7.47656H8.0625V7.3882C8.0625 6.91641 8.17031 6.46936 8.36259 6.07031H6.98438C5.97633 6.07031 5.15625 6.89039 5.15625 7.89844V9.00539H6.5625V7.89844Z"
                          fill="#5FCF86"
                        ></path>
                        <path
                          d="M22.3594 5.74756H11.1094C10.2047 5.74756 9.46875 6.48354 9.46875 7.38818V20.9531C9.46875 21.7782 10.081 22.4626 10.875 22.5767V23.2967C10.875 23.685 11.1898 23.9998 11.5781 23.9998C11.9664 23.9998 12.2812 23.685 12.2812 23.2967V22.5937H21.1875V23.2967C21.1875 23.685 21.5023 23.9998 21.8906 23.9998C22.2789 23.9998 22.5938 23.685 22.5938 23.2967V22.5767C23.3877 22.4626 24 21.7782 24 20.9531V7.38818C24 6.4835 23.264 5.74756 22.3594 5.74756ZM13.6875 20.0156C13.6875 20.4039 13.3727 20.7187 12.9844 20.7187C12.5961 20.7187 12.2812 20.4039 12.2812 20.0156V8.32568C12.2812 7.93737 12.5961 7.62256 12.9844 7.62256C13.3727 7.62256 13.6875 7.93737 13.6875 8.32568V20.0156ZM20.4844 20.7187C20.0961 20.7187 19.7812 20.4039 19.7812 20.0156V8.32568C19.7812 7.93737 20.0961 7.62256 20.4844 7.62256C20.8727 7.62256 21.1875 7.93737 21.1875 8.32568V20.0156C21.1875 20.4039 20.8727 20.7187 20.4844 20.7187Z"
                          fill="#5FCF86"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_3535_118649">
                          <rect width="24" height="24" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                              <span className="px-1">{motorbike.tripCount} chuyến</span>
                              </>
                            )                         
                            : "Chưa có chuyến"}
                          </div>
                          <div className='flex'>
                            <div className="text-lg text-right font-semibold text-green-500 mb-2">{motorbike.price.toLocaleString()}</div>
                            <span className='text-lg'>/ ngày</span>
                          </div>
                        </div>
                      </div>
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
