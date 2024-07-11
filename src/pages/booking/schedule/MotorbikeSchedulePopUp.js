import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const sharedClasses = {
  flex: 'flex',
  justifyBetween: 'justify-between',
  itemsCenter: 'items-center',
  textZinc300: 'text-zinc-300',
  textZinc500: 'text-zinc-500',
  zinc700: 'text-zinc-700',
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
  overlay: 'fixed inset-0 bg-black bg-opacity-50 z-50',
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

  const handleSubmit = () => {
    if (!endDate) {
      setTimeError("End date is required.");
      return;
    }

    if (!isStartBeforeEnd(startDate, receiveTime, endDate, returnTime)) {
      setTimeError("Receive date must be less than return date");
      return;
    }
    const startDateTime = parseDateTime(startDate, receiveTime);
    
    const endDateTime = parseDateTime(endDate, returnTime);
    console.log(startDateTime+endDateTime)
    if (!checkTimeDifference(endDateTime)) {
      setTimeError("Return date and time must be at least 6 hours from now.");
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
      <div className={sharedClasses.popupContainer}>
        <button className={sharedClasses.closeButton} onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
           <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
        <h2 className={`text-center ${sharedClasses.textLg} ${sharedClasses.fontSemiBold} ${sharedClasses.mb4}`}>Rent Car Time</h2>

        <DatePicker
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />

        <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter} ${sharedClasses.mb4}`}>
          <div className="flex-1">
            <label className={sharedClasses.zinc700}>Receive Time</label>
            <select name="receiveTime" onChange={handleTimeChange} value={receiveTime}
              className={`${sharedClasses.block} ${sharedClasses.wFull} ${sharedClasses.m1} ${sharedClasses.borderZinc300} ${sharedClasses.rounded} ${sharedClasses.zinc700}`}>
              {timePickUp.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div className={sharedClasses.p2}>
            <img aria-hidden="true" alt="arrow" src="https://placehold.co/24x24" />
          </div>
          <div className="flex-1">
            <label className={sharedClasses.zinc700}>Return Time</label>
            <select name="returnTime" onChange={handleTimeChange} value={returnTime}
              className={`${sharedClasses.block} ${sharedClasses.wFull} ${sharedClasses.m1} ${sharedClasses.borderZinc300} ${sharedClasses.rounded} ${sharedClasses.zinc700}`}>
              {timePickUp.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={`${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter}`}>
          <div>
            <p>{receiveTime}, {startDate.toLocaleDateString()} - {returnTime}, {endDate ? endDate.toLocaleDateString() : ''}</p>
            <p className={sharedClasses.textZinc500}>Số ngày thuê: {calculateDaysDifference(startDate, receiveTime, endDate, returnTime)} days</p>
            {timeError && <p className={sharedClasses.red500}>{timeError}</p>}
          </div>
        </div>

        <button className={`w-full mt-4 ${sharedClasses.green500} ${sharedClasses.textWhite} ${sharedClasses.p2} ${sharedClasses.rounded}`} onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default MotorbikeSchedulePopUp;
