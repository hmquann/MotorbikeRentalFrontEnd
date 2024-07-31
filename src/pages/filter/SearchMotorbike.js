import React, { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import MotorbikeSchedulePopUp from '../booking/schedule/MotorbikeSchedulePopUp';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import MapboxSearchPopUp from './MapboxSearchPopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot,faCalendarDays} from '@fortawesome/free-solid-svg-icons';


const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}, ${day}/${month}/${year}`;
};

const extractSecondAndThirdLastElements = (str) => {
  const parts = str.split(',');
  if (parts.length < 3) return ''; // Nếu chuỗi không có đủ phần tử, trả về chuỗi rỗng
  const secondLastElement = parts[parts.length - 3].trim();
  const thirdLastElement = parts[parts.length - 2].trim();
  return `${secondLastElement}, ${thirdLastElement}`;
};

const SearchMotorbike = () => {
  const navigate = useNavigate();

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
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Math.ceil(now.getHours()) + 1, 0);
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
    const filterList = {
      startDate: dayjs(rentalStartTime).format('YYYY-MM-DDTHH:mm:ss'),
      endDate: dayjs(rentalEndTime).format('YYYY-MM-DDTHH:mm:ss'),
      address: rentalAddress,
    };

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/motorbike/filter', filterList, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Data sent successfully:', response.data);
      const listMotor = response.data;
      navigate('/filter', { state: { filterList, listMotor } });
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestError = (error) => {
    if (error.response) {
      console.error('Error response:', error.response);
      console.error('Status code:', error.response.status);
      console.error('Data:', error.response.data);

      if (error.response.status === 404) {
        setError('Error 404: Not Found. The requested resource could not be found.');
      } else if (error.response.status === 409) {
        setError(error.response.data);
      } else {
        setError(`Error ${error.response.status}: ${error.response.data.message || 'An error occurred.'}`);
      }
    } else if (error.request) {
      console.error('Error request:', error.request);
      setError('No response received. Please check your network connection.');
    } else {
      console.error('Error message:', error.message);
      setError('An error occurred. Please try again.');
    }
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setRentalAddress(extractSecondAndThirdLastElements(location.place_name));
    setOpenMapBoxSearch(false);
  };

  return (
    <div>
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>

          <div onClick={() => setOpenMapBoxSearch(true)}>
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
          <FontAwesomeIcon icon={faLocationDot} size="sm" style={{color: "#9ea0a3",}} /> Địa điểm
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-black dark:text-white">{rentalAddress ? rentalAddress : "Chọn địa điểm"}</span>
            </div>
          </div>
          <MapboxSearchPopUp open={openMapboxSearch} onClose={() => setOpenMapBoxSearch(false)} onSelect={handleSelectLocation} />
        </div>

        <div className="flex items-center space-x-2">
          <div onClick={()=>setSchedulePopUp(true)}>
            <span className="text-zinc-600 dark:text-zinc-300">
            <FontAwesomeIcon icon={faCalendarDays} size="sm" style={{color: "#9ea0a3",}} /> Thời gian thuê
            </span>
            <div className="flex items-center space-x-1">
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
                  d="M8 7v-1a1 1 0 112 0v1h4v-1a1 1 0 112 0v1h3a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3zM6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h.01M10 16h.01M14 16h.01M18 16h.01"
                />
              </svg>
              <span className="text-black dark:text-white">
                {format(rentalStartTime, 'HH:mm, dd/MM/yyyy')} -{' '}
                {format(rentalEndTime, 'HH:mm, dd/MM/yyyy')}
              </span>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <MotorbikeSchedulePopUp isOpen={schedulePopUp} onClose={() => setSchedulePopUp(false)} onSubmit={handlePopUpSubmit} />
          </div>
        </div>

        <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleSearchMotor} >
          {loading ? "Đang tìm kiếm..." : "Tìm xe"}
        </button>
      </div>
    </div>
  );
};

export default SearchMotorbike;
