import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker, TimePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const DateTimeRange = ({
  onDateRangeChange,
  onReceiveTimeChange,
  onReturnTimeChange,
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
  useEffect(() => {
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
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateRangePicker"]}>
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          localeText={{ start: "Receive Date", end: "Return Date" }}
          minDate={minDate}
        />
        <div style={{ display: "flex", gap: "16px" }}>
          <TimePicker
            label="Receive Time"
            value={dateTimeReceive.time}
            onChange={handleReceiveTimeChange}
          />
          <TimePicker
            label="Return Time"
            value={dateTimeReturn.time}
            onChange={handleReturnTimeChange}
          />
        </div>
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default DateTimeRange;
