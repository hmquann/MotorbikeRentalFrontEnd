import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomDatePicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-solid-svg-icons";
const sharedClasses = {
  flex: 'flex',
  justifyBetween: 'justify-between',
  itemsCenter: 'items-center',
  textZinc300: 'text-zinc-300',
  textZinc500: 'text-zinc-500',
  zinc700: 'text-zinc-700 font-bold',
  zinc100: 'bg-zinc-100',
  zinc200: 'bg-green-200',
  green600: 'text-green-600',
  red500: 'text-red-500',
  white: 'text-white',
  green500: 'bg-green-500',
  rounded: 'rounded-lg',
  shadow: 'shadow',
  p4: 'p-4',
  p2: 'p-2',
  m1: 'mt-1',
  block: 'block',
  wFull: 'w-full',
  borderZinc300: 'border-zinc-300',
  grid: 'grid',
  gridCols2: 'grid-cols-2',
  gap4: 'gap-4',
  mb4: 'mb-4',
  mxAuto: 'mx-auto',
  maxWlg: 'max-w-lg',
  doubleMaxWlg: 'max-w-[64rem]',
  textCenter: 'text-center',
  text2xl: 'text-2xl',
  fontBold: 'font-bold',
  textLg: 'text-lg',
  fontSemiBold: 'font-semibold',
  zinc500: 'text-zinc-500',
  overlay: 'fixed inset-0 bg-black bg-opacity-50 z-50 font-manrope pt-10',
  popupContainer: 'relative bg-white rounded-lg shadow p-4 max-w-[32rem] mx-auto',
  closeButton: 'absolute top-2 right-2 text-black cursor-pointer',
};

const generateTimeSlots = () => {
  const timeSlots = [];
  let hours = 0;
  let minutes = 0;
  while (hours < 24) {
    const timeSlot = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    timeSlots.push(timeSlot);
    minutes += 30;
    if (minutes >= 60) {
      minutes = 0;
      hours += 1;
    }
  }

  return timeSlots;
};

const parseDateTime = (date, time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

const isStartBeforeEnd = (startDate, receiveTime, endDate, returnTime) => {
  const startDateTime = parseDateTime(startDate, receiveTime);
  const endDateTime = parseDateTime(endDate, returnTime);
  return startDateTime < endDateTime;
};

const checkTimeDifference = (newDate) => {
  const currentDate = new Date();
  const timeDifference = (newDate - currentDate) / (1000 * 60 * 60); // hours
  return timeDifference >= 6; // Must be at least 6 hours
};

const calculateDaysDifference = (startDate, receiveTime, endDate, returnTime) => {
  const startDateTime = parseDateTime(startDate, receiveTime);
  const endDateTime = parseDateTime(endDate, returnTime);
  const timeDiff = endDateTime - startDateTime;
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24); // Convert to days
  return Math.ceil(daysDiff); // Round up
};

const MotorbikeSchedulePopUp = ({ isOpen, onClose, onSubmit }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [receiveTime, setReceiveTime] = useState('10:00');
  const [returnTime, setReturnTime] = useState('12:00');
  const [timeError, setTimeError] = useState("");
  const timePickUp = generateTimeSlots();
  registerLocale('vi', vi);
  setDefaultLocale('vi');
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    if (name === "receiveTime") {
      setReceiveTime(value);
    }
    if (name === "returnTime") {
      setReturnTime(value);
    }
  };
  const isDateDisabled = (date) => {
    const today = new Date(); // Get the current date
    today.setHours(0, 0, 0, 0); // Set time to the start of the day
    
    // Disable if the date is before today or is in the list of disabled dates
    return date < today
  };

  const dayClassName = (date) => {
    return isDateDisabled(date) ? 'disabled-day' : undefined;
  };
  const handleSubmit = () => {
    if (!endDate) {
      setEndDate(startDate);
      return;
    }

    if (!isStartBeforeEnd(startDate, receiveTime, endDate, returnTime)) {
      setTimeError("Thời gian nhận xe phải trước thời gian trả xe");
      return;
    }
    const startDateTime = parseDateTime(startDate, receiveTime);
    
    const endDateTime = parseDateTime(endDate, returnTime);
    console.log(startDateTime+endDateTime)
    if (!checkTimeDifference(endDateTime)) {
      setTimeError("Thời gian nhận và trả xe phải ít nhất 6 giờ");
      return;
    }
    
    onSubmit({ startDateTime, endDateTime })
    setTimeError(""); // Clear any existing errors
    // Handle valid form submission logic here
    // Close the pop-up after successful submission
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className={sharedClasses.overlay}>
    <div className={`${sharedClasses.popupContainer} flex flex-col justify-center items-center p-4 max-w-sm mx-auto`}>
      <button className={`${sharedClasses.closeButton} self-end`} onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>
      <h2 className={`text-center ${sharedClasses.textLg} ${sharedClasses.fontSemiBold} mb-2 text-black`}>Chọn thời gian thuê xe</h2>
  
      <div className="flex justify-center my-2 w-full">
  <DatePicker
    className="w-full max-w-md"
    selected={startDate}
    onChange={onChange}
    startDate={startDate}
    endDate={endDate}
    selectsRange
    inline
    locale="vi"
    dayClassName={dayClassName}
    filterDate={(date) => !isDateDisabled(date)}
  />
</div>
  
      <div className={`grid grid-cols-2 gap-2 mb-2 w-full`}>
      <div>
        <label className={sharedClasses.zinc700}>Nhận xe</label>
        <div className="flex items-center border rounded-full border-zinc-300">
          <FontAwesomeIcon icon={faClock} className="p-1" />
          <select
            name="receiveTime"
            onChange={handleTimeChange}
            value={receiveTime}
            className={`w-full p-1 ${sharedClasses.zinc700} border-none rounded-full`}
          >
            {timePickUp.map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={sharedClasses.zinc700}>Trả xe</label>
        <div className="flex items-center border rounded-full border-zinc-300">
          <FontAwesomeIcon icon={faClock} className="p-1" />
          <select
            name="returnTime"
            onChange={handleTimeChange}
            value={returnTime}
            className={`w-full p-1 ${sharedClasses.zinc700} border-none rounded-full`}
          >
            {timePickUp.map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  
      <div className="border-t border-gray-300 pt-2 w-full bg-white-100">
        <div className="text-center">
          <p className="text-black text-sm">Thời gian thuê: {receiveTime}, {startDate.toLocaleDateString()} - {returnTime}, {endDate ? endDate.toLocaleDateString() : ''}</p>
        </div>
        <div className="text-center mt-1">
          <p className="text-sm text-gray-500">
            {endDate ? `Số ngày thuê: ${calculateDaysDifference(startDate, receiveTime, endDate, returnTime)} ngày` : "Số ngày thuê: 0 ngày"}
          </p>
          {timeError && <p className="text-sm text-red-500">{timeError}</p>}
        </div>
      </div>
  
      <button className={`w-6/12 mt-2 hover:bg-green-600 transition-shadow hover:shadow-2xl ${sharedClasses.green500} ${sharedClasses.white} ${sharedClasses.p2} ${sharedClasses.rounded}`} onClick={handleSubmit}>
        Áp dụng
      </button>
    </div>
  </div>
  );
};

export default MotorbikeSchedulePopUp;
