import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css";
import axios from "axios";

const sharedClasses = {
  flex: "flex",
  justifyBetween: "justify-between",
  itemsCenter: "items-center",
  textZinc300: "text-zinc-300",
  textZinc500: "text-zinc-500",
  zinc700: "text-zinc-700",
  zinc100: "bg-zinc-100",
  zinc200: "bg-green-200",
  green600: "text-green-600",
  red500: "text-red-500",
  white: "text-white",
  green500: "bg-green-500",
  rounded: "rounded-lg",
  shadow: "shadow",
  p4: "p-4",
  p2: "p-2",
  m1: "mt-1",
  block: "block",
  wFull: "w-full",
  borderZinc300: "border-zinc-300",
  grid: "grid",
  gridCols2: "grid-cols-2",
  gap4: "gap-4",
  mb4: "mb-4",
  mxAuto: "mx-auto",
  maxWlg: "max-w-lg",
  doubleMaxWlg: "max-w-[64rem]",
  textCenter: "text-center",
  text2xl: "text-2xl",
  fontBold: "font-bold",
  textLg: "text-lg",
  fontSemiBold: "font-semibold",
  zinc500: "text-zinc-500",
  overlay: "fixed inset-0 bg-black bg-opacity-50 z-50",
  popupContainer:
    "relative bg-white rounded-lg shadow p-4 max-w-[32rem] mx-auto",
  closeButton: "absolute top-2 right-2 text-black cursor-pointer",
};

const generateTimeSlots = () => {
  const timeSlots = [];
  let hours = 0;
  let minutes = 0;
  while (hours < 24) {
    const timeSlot = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    timeSlots.push(timeSlot);
    minutes += 30;
    if (minutes >= 60) {
      minutes = 0;
      hours += 1;
    }
  }
  return timeSlots;
};




const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
const ManageSchedulePopUp = ({ isOpen, onClose, motorbikeId }) => {
  console.log(motorbikeId);
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [receiveTime, setReceiveTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("12:00");
  const [disableDateRanges, setDisableDateRanges] = useState([]);
  const [listSchedule, setListSchedule] = useState([]);
  const [endTime,setEndTime]=useState(null);
  const[error,setError]=useState();
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDateTime(start);
    setEndDate(end);
  };

  const fetchScheduleMotorbike = async (motorbikeId) => {
    try {
      const response = await axios.get(
        `https://rentalmotorbikewebapp.azurewebsites.net/booking/listSchedule/${motorbikeId}`
      );
      console.log(response.data);
      setListSchedule(response.data);

      // Chuyển đổi chuỗi ngày thành đối tượng Date
      const parsedDateRanges = response.data.map((range) => ({
        startDate: new Date(range.startDate),
        endDate: new Date(range.endTime),
      }));

      setDisableDateRanges(parsedDateRanges);
    } catch (error) {
      console.error("Error fetching schedule details", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchScheduleMotorbike(motorbikeId);
    }
  }, [isOpen, motorbikeId]);

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    if (name === "receiveTime") {
      setReceiveTime(value);
    }
    if (name === "returnTime") {
      setReturnTime(value);
    }
  };

  // Hàm kiểm tra ngày có nằm trong khoảng thời gian bị vô hiệu hóa hay không
  const isDateDisabled = (date) => {
    // Ngày hiện tại
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return true;
    }

    return disableDateRanges.some((range) => {
      const start = new Date(range.startDate);
      const end = new Date(range.endDate);
      start.setHours(0, 0, 0, 0); // Chỉ so sánh ngày
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    });
  };

  const dayClassName = (date) => {
    const start = new Date(startDateTime);
    const end = new Date(endDate);
    const current = new Date(date);

    // Đặt giờ cho start và end để so sánh chỉ ngày
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    current.setHours(0, 0, 0, 0);

    const isSelectedRange = current >= start && current <= end;

    if (isDateDisabled(current)) {
      return "disabled-day";
    } else if (isSelectedRange) {
      return "selected-day-range";
    }
    return undefined;
  };

  const dayProps = (date) => {
    if (isDateDisabled(date)) {
      return {
        title: "Ngày này không khả dụng",
      };
    }
    return {};
  };

  const handleSubmit = () => {
    const startDate = startDateTime ? formatDate(startDateTime) : null;
    const endTime = endDate ? formatDate(endDate) : startDate;
    if(startDate===null||endTime===null){
      setError("Hãy chọn ngày hợp lệ")
    }
    else{
      setError("");
    try {
      // Chuyển đổi startDate và endDate thành chuỗi định dạng ISO
      // Tạo đối tượng dữ liệu để gửi
      const data = {
        startDate,
        endTime
      };
      console.log(data)
      // Gửi dữ liệu đến backend
      const response =axios.post(`https://rentalmotorbikewebapp.azurewebsites.net/booking/markBusyDays/${motorbikeId}`, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      // Xử lý phản hồi từ backend
      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Error sending date range:", error);
    }
    onClose();
  }
  };

  if (!isOpen) return null;

  return (
    <div className={sharedClasses.overlay}>
      <div className={sharedClasses.popupContainer}>
        <button className={sharedClasses.closeButton} onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <h2
          className={`text-center ${sharedClasses.textLg} ${sharedClasses.fontSemiBold} ${sharedClasses.mb4}`}
        >
          Chọn thời gian xe của bạn không thể cho thuê
        </h2>

        <DatePicker
          className="justify-content"
          selected={startDateTime}
          onChange={onChange}
          startDate={startDateTime}
          endDate={endDate}
          selectsRange
          inline
          dayClassName={dayClassName}
          dayProps={dayProps} // Thêm thuộc tính này
          filterDate={(date) => !isDateDisabled(date)} // Disable các ngày cụ thể
        />
         {error && <div className="text-red-500">{error}</div>} 
        <button
          className={`w-full mt-4 ${sharedClasses.green500} ${sharedClasses.textWhite} ${sharedClasses.p2} ${sharedClasses.rounded}`}
          onClick={handleSubmit}
        >
        Đánh dấu lịch đã chọn
        </button>
      </div>
    </div>
  );
};

export default ManageSchedulePopUp;
