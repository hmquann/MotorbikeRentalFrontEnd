import React, { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import MotorbikeSchedulePopUp from "../booking/schedule/MotorbikeSchedulePopUp";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import MapboxSearchPopUp from "./MapboxSearchPopUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../axiosConfig";

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}, ${day}/${month}/${year}`;
};

const extractSecondAndThirdLastElements = (str) => {
  const parts = str.split(",");
  if (parts.length < 3) return ""; // Nếu chuỗi không có đủ phần tử, trả về chuỗi rỗng
  const secondLastElement = parts[parts.length - 3].trim();
  const thirdLastElement = parts[parts.length - 2].trim();
  return `${secondLastElement}, ${thirdLastElement}`;
};

const SearchMotorbike = () => {
  const navigate = useNavigate();
  const[searchError,setSearchError]=useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rentalStartTime, setRentalStartTime] = useState(new Date());
  const [rentalEndTime, setRentalEndTime] = useState(addDays(new Date(), 1));
  const [rentalAddress, setRentalAddress] = useState("");
  const [schedulePopUp, setSchedulePopUp] = useState(false);
  const [openMapboxSearch, setOpenMapBoxSearch] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getCurrentTime = () => {
      const now = new Date();
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        Math.ceil(now.getHours()) + 1,
        0
      );
      const end = addDays(start, 1);

      setRentalStartTime(start);
      setRentalEndTime(end);
    };

    getCurrentTime();
  }, []);

  const handlePopUpSubmit = (data) => {
    setRentalStartTime(data.startDateTime);
    setRentalEndTime(data.endDateTime);
  };
  const handleSearchMotor = async () => {
    if(!rentalStartTime||!rentalEndTime||!rentalAddress){
      setSearchError("Vui lòng điền đầy đủ thông tin thuê")
    }
    else{
      setSearchError("")
    const filterList = {
      startDate: dayjs(rentalStartTime).format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(rentalEndTime).format("YYYY-MM-DDTHH:mm:ss"),
      address: rentalAddress,
    };
    setLoading(true);
    try {
      const response = await apiClient.post('/api/motorbike/filter', filterList, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Data sent successfully:', response.data);
      const listMotor = response.data;
      navigate("/filter", { state: { filterList, listMotor } });
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };
}

  const handleRequestError = (error) => {
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
    } else {
      console.error("Error message:", error.message);
      setError("An error occurred. Please try again.");
    }
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setRentalAddress(extractSecondAndThirdLastElements(location.place_name));
    setOpenMapBoxSearch(false);
  };

  return (
    <div  className="bg-white relative pt-4 px-3 rounded-2xl mx-auto bottom-16 shadow-md max-w-full lg:max-w-5xl">
      <div className="flex flex-col md:flex-row justify-evenly">
      <div className="flex flex-col max-w-full md:max-w-80 mb-4 md:mb-0">

            <div className="flex items-center mb-2">
              <div class="mr-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2.75C8.31 2.75 5.3 5.76 5.3 9.45C5.3 14.03 11.3 20.77 11.55 21.05C11.79 21.32 12.21 21.32 12.45 21.05C12.71 20.77 18.7 14.03 18.7 9.45C18.7 5.76 15.69 2.75 12 2.75Z"
                    stroke="#767676"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M12.3849 11.7852C13.6776 11.5795 14.5587 10.3647 14.3529 9.07204C14.1472 7.77936 12.9325 6.89824 11.6398 7.104C10.3471 7.30976 9.46597 8.52449 9.67173 9.81717C9.87749 11.1099 11.0922 11.991 12.3849 11.7852Z"
                    stroke="#767676"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
              <span className="text-base font-medium text-gray-500">Địa điểm</span>
            </div>
      
          <div
            className="flex items-center w-full"
            onClick={() => setOpenMapBoxSearch(true)}
          >
          <div className="flex ml-10 text-base pr-6 cursor-pointer leading-7">
            <span className="text-black font-bold dark:text-white" >
              {rentalAddress ? rentalAddress : "Chọn địa điểm"} 
            </span>
          </div>
          </div>
          <MapboxSearchPopUp
            open={openMapboxSearch}
            onClose={() => setOpenMapBoxSearch(false)}
            onSelect={handleSelectLocation}
          />
        </div>
        <div className="border-r border-gray-400 mb-4 md:mb-0 mx-4 md:mx-8" />
        <div className="flex flex-col ">
            <div className="flex items-center mb-2">
              <div class="mr-4 flex">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.86 4.81V2.75"
                    stroke="#767676"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M17.14 4.81V2.75"
                    stroke="#767676"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M18.05 3.78003H5.95C4.18 3.78003 2.75 5.21003 2.75 6.98003V18.06C2.75 19.83 4.18 21.26 5.95 21.26H18.06C19.83 21.26 21.26 19.83 21.26 18.06V6.98003C21.25 5.21003 19.82 3.78003 18.05 3.78003Z"
                    stroke="#767676"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M2.75 7.8999H21.25"
                    stroke="#767676"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M18 12C18.5523 12 19 11.5523 19 11C19 10.4477 18.5523 10 18 10C17.4477 10 17 10.4477 17 11C17 11.5523 17.4477 12 18 12Z"
                    fill="#767676"
                  ></path>
                  <path
                    d="M14 12C14.5523 12 15 11.5523 15 11C15 10.4477 14.5523 10 14 10C13.4477 10 13 10.4477 13 11C13 11.5523 13.4477 12 14 12Z"
                    fill="#767676"
                  ></path>
                  <path
                    d="M10 12C10.5523 12 11 11.5523 11 11C11 10.4477 10.5523 10 10 10C9.44772 10 9 10.4477 9 11C9 11.5523 9.44772 12 10 12Z"
                    fill="#767676"
                  ></path>
                  <path
                    d="M6 12C6.55228 12 7 11.5523 7 11C7 10.4477 6.55228 10 6 10C5.44772 10 5 10.4477 5 11C5 11.5523 5.44772 12 6 12Z"
                    fill="#767676"
                  ></path>
                  <path
                    d="M18 15.49C18.5523 15.49 19 15.0423 19 14.49C19 13.9377 18.5523 13.49 18 13.49C17.4477 13.49 17 13.9377 17 14.49C17 15.0423 17.4477 15.49 18 15.49Z"
                    fill="#767676"
                  ></path>
                  <path
                    d="M14 15.49C14.5523 15.49 15 15.0423 15 14.49C15 13.9377 14.5523 13.49 14 13.49C13.4477 13.49 13 13.9377 13 14.49C13 15.0423 13.4477 15.49 14 15.49Z"
                    fill="#767676"
                  ></path>
                  <path
                    d="M10 15.49C10.5523 15.49 11 15.0423 11 14.49C11 13.9377 10.5523 13.49 10 13.49C9.44772 13.49 9 13.9377 9 14.49C9 15.0423 9.44772 15.49 10 15.49Z"
                    fill="#767676"
                  ></path>
                  <path
                    d="M6 15.49C6.55228 15.49 7 15.0423 7 14.49C7 13.9377 6.55228 13.49 6 13.49C5.44772 13.49 5 13.9377 5 14.49C5 15.0423 5.44772 15.49 6 15.49Z"
                    fill="#767676"
                  ></path>
                  <path
                    d="M14 18.97C14.5523 18.97 15 18.5223 15 17.97C15 17.4177 14.5523 16.97 14 16.97C13.4477 16.97 13 17.4177 13 17.97C13 18.5223 13.4477 18.97 14 18.97Z"
                    fill="#767676"
                  ></path>
                  <path
                    d="M10 18.97C10.5523 18.97 11 18.5223 11 17.97C11 17.4177 10.5523 16.97 10 16.97C9.44772 16.97 9 17.4177 9 17.97C9 18.5223 9.44772 18.97 10 18.97Z"
                    fill="#767676"
                  ></path>
                  <path
                    d="M6 18.97C6.55228 18.97 7 18.5223 7 17.97C7 17.4177 6.55228 16.97 6 16.97C5.44772 16.97 5 17.4177 5 17.97C5 18.5223 5.44772 18.97 6 18.97Z"
                    fill="#767676"
                  ></path>
                </svg>
               
              </div>
              <span className="text-base font-medium text-gray-500">Thời gian thuê</span>
            </div>
            <div onClick={() => setSchedulePopUp(true)}>
            <div className="flex items-center ml-10 font-bold cursor-pointer">
              <span className="text-black dark:text-white">
                {format(rentalStartTime, "HH:mm, dd/MM/yyyy")} -{" "}
                {format(rentalEndTime, "HH:mm, dd/MM/yyyy")}
              </span>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <MotorbikeSchedulePopUp
              isOpen={schedulePopUp}
              onClose={() => setSchedulePopUp(false)}
              onSubmit={handlePopUpSubmit}
            />
          </div>
        </div>

        <button
          className="bg-green-500 text-white h-14 w-20 ml-10 justify-center items-center flex rounded-lg hover:bg-green-600 transition hover:scale-105"
          onClick={handleSearchMotor}
        >
          {loading ? "Đang tìm kiếm..." : "Tìm xe"}
        </button>
        
      </div>
      {searchError && <div className="text-red-500 font-bold text-center">{searchError}</div>}
    </div>
  );
};

export default SearchMotorbike;
