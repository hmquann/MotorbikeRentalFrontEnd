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
        return bookedDates;
      } catch (error) {
        console.error("Error fetching disabled dates", error);
        return [];
      }
    };
  
    const findNextAvailableDates = (disabledDates) => {
      let startDate = dayjs();
  
      while (true) {
        const isStartDateDisabled = disabledDates.some((disabledDate) =>
          startDate.isSame(disabledDate, "day")
        );
        const nextDate = startDate.add(1, "day");
        const isNextDateDisabled = disabledDates.some((disabledDate) =>
          nextDate.isSame(disabledDate, "day")
        );
  
        if (!isStartDateDisabled && !isNextDateDisabled) {
          return [startDate, nextDate];
        }
  
        startDate = startDate.add(1, "day");
      }
    };
  
    const initDates = async () => {
      const bookedDates = await fetchDisabledDates();
  
      const [availableNow, availableTomorrow] = findNextAvailableDates(bookedDates);
  
      const receiveDate = availableNow.format("DD/MM/YYYY");
      const receiveTime = availableNow;
  
      const returnDate = availableTomorrow.format("DD/MM/YYYY");
      const returnTime = availableTomorrow;
  
      setDateTimeReceive({ date: receiveDate, time: receiveTime });
      setDateTimeReturn({ date: returnDate, time: returnTime });
  
      onDateRangeChange([receiveTime, returnTime]);
      onReceiveTimeChange(receiveTime);
      onReturnTimeChange(returnTime);
  
      setDateRange([receiveTime, returnTime]);
      setMinDate(availableNow);
    };
  
    initDates();
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
