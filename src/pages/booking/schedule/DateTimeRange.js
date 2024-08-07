import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker, TimePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import apiClient from "../../../axiosConfig";

const DateTimeRange = ({
  onDateRangeChange,
  onReceiveTimeChange,
  onReturnTimeChange,
  motorbikeId,
}) => {
  const [dateTimeReceive, setDateTimeReceive] = useState({
    date: "",
    time: dayjs(),
  });

  const [dateTimeReturn, setDateTimeReturn] = useState({
    date: "",
    time: dayjs().add(1, "day"), // Thêm 1 ngày vào thời gian hiện tại
  });

  const [dateRange, setDateRange] = useState([dayjs(), dayjs().add(1, "day")]);
  const [minDate, setMinDate] = useState(dayjs().add(1, "day"));
  const [disabledDates, setDisabledDates] = useState([]);

  useEffect(() => {
    const fetchDisabledDates = async () => {
      try {
        const response = await apiClient.get(
          `/api/booking/dates/motorbike/${motorbikeId}`
        );
        const bookedDates = response.data.map((date) => dayjs(date));
        setDisabledDates(bookedDates);
      } catch (error) {
        console.error("Error fetching disabled dates", error);
      }
    };

    fetchDisabledDates();
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1); // Thêm 1 ngày vào thời gian hiện tại
    const receiveDate = tomorrow.toLocaleDateString("en-GB"); // Định dạng ngày dd/mm/yyyy
    const receiveTime = dayjs(tomorrow); // Chuyển đổi thành đối tượng dayjs
    setDateTimeReceive({ date: receiveDate, time: receiveTime });

    const returnDate = new Date();
    returnDate.setDate(now.getDate() + 2); // Thêm 2 ngày vào thời gian hiện tại
    const returnTime = dayjs(returnDate); // Chuyển đổi thành đối tượng dayjs
    setDateTimeReturn({
      date: returnDate.toLocaleDateString("en-GB"),
      time: returnTime,
    });

    onDateRangeChange([receiveTime, returnTime]);
    onReceiveTimeChange(receiveTime);
    onReturnTimeChange(returnTime);

    setDateRange([receiveTime, returnTime]);
    setMinDate(dayjs(tomorrow));
  }, []);

  const handleDateRangeChange = (newValue) => {
    setDateRange(newValue);
    onDateRangeChange(newValue);
  };

  const handleReceiveTimeChange = (newTime) => {
    setDateTimeReceive((prev) => ({ ...prev, time: newTime }));
    onReceiveTimeChange(newTime);
  };

  const handleReturnTimeChange = (newTime) => {
    setDateTimeReturn((prev) => ({ ...prev, time: newTime }));
    onReturnTimeChange(newTime);
    console.log(newTime);
  };

  const disableWeekends = (date) => {
    return disabledDates.some((disabledDate) =>
      date.isSame(disabledDate, "day")
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateRangePicker"]}>
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          localeText={{ start: "Ngày nhận", end: "Ngày trả" }}
          minDate={minDate}
          shouldDisableDate={disableWeekends} // Vô hiệu hóa cuối tuần
        />
        <div style={{ display: "flex", gap: "16px" }}>
          <TimePicker
            label="Giờ nhận"
            value={dateTimeReceive.time}
            onChange={handleReceiveTimeChange}
          />
          <TimePicker
            label="Giờ trả"
            value={dateTimeReturn.time}
            onChange={handleReturnTimeChange}
          />
        </div>
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default DateTimeRange;
