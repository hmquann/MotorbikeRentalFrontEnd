import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const PopUpFilter = ({ onClose, onApply, activeTab }) => {
  const [sort, setSort] = useState("sortByBookingTimeDesc");
  const [tripType, setTripType] = useState("all");
  const [status, setStatus] = useState("all");
  const [startTime, setStartTime] = useState(dayjs().format("YYYY-MM-DD"));
  const [endTime, setEndTime] = useState(dayjs().format("YYYY-MM-DD"));
  const [error, setError] = useState(null);

  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);

  const handleReset = () => {
    setSort("sortByBookingTimeDesc");
    setTripType("all");
    setStatus("all");
    setStartTime(dayjs().format("YYYY-MM-DD"));
    setEndTime(dayjs().format("YYYY-MM-DD"));
    setError(null);
  };

  const handleStartDateChange = (newValue) => {
    const formattedDate = newValue
      ? newValue.format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
    if (dayjs(formattedDate).isAfter(endTime)) {
      setError("End date cannot be earlier than start date");
    } else {
      setStartTime(formattedDate);
      setError(null);
    }
  };

  const handleEndDateChange = (newValue) => {
    const formattedDate = newValue
      ? newValue.format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
    if (dayjs(formattedDate).isBefore(startTime)) {
      setError("End date cannot be earlier than start date");
    } else {
      setEndTime(formattedDate);
      setError(null);
    }
  };

  useEffect(() => {
    if (dayjs(startTime).isAfter(endTime)) {
      setError("End date cannot be earlier than start date");
    }
    if (!dayjs(startTime).isAfter(endTime)) {
      setError(null);
    }
  }, [startTime, endTime]);

  const handleApply = () => {
    if (error !== null || error !== "") {
      const formDataApply = {
        sort,
        tripType,
        status,
        startTime: dayjs(startTime).format("YYYY-MM-DDTHH:mm:ss"),
        endTime: dayjs(endTime).format("YYYY-MM-DDTHH:mm:ss"),
        userId: userData.userId,
      };
      onApply(formDataApply);
      onClose();
    }
  };

  const getStatusOptions = () => {
    if (activeTab === "current") {
      return [
        { value: "PENDING", label: "Chờ duyệt" },
        { value: "PENDING_DEPOSIT", label: "Chờ đặt cọc" },
        { value: "DEPOSIT_MADE", label: "Đã đặt cọc" },
        { value: "RENTING", label: "Đang thuê" },
      ];
    } else if (activeTab === "past") {
      return [
        { value: "REJECTED", label: "Đã từ chối" },
        { value: "DONE", label: "Đã hoàn thành" },
        { value: "CANCELED", label: "Đã hủy" },
      ];
    } else {
      return [];
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Bộ lọc</h2>
          <button className="text-muted-foreground" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sắp xếp</label>
            <select
              className="form-select w-full border border-border rounded-lg p-2"
              defaultValue="sortByBookingTimeDesc"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="sortByBookingTimeDesc">
                Ưu tiên thời gian đặt gần nhất
              </option>
              <option value="sortByBookingTimeAsc">
                Ưu tiên thời gian đặt xa nhất
              </option>
              <option value="sortByEndDate">
                Ưu tiên thời gian kết thúc chuyến
              </option>
              <option value="sortByStartDate">
                Ưu tiên thời gian bắt đầu chuyến
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Loại chuyến
            </label>
            <select
              className="form-select w-full border border-border rounded-lg p-2"
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="renter">Chuyến thuê</option>
              <option value="lessor">Chuyến cho thuê</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              className="form-select w-full border border-border rounded-lg p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {getStatusOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="space-y-4">
              <DemoContainer
                components={["DesktopDatePicker", "DesktopDatePicker"]}
              >
                <div>
                  <DemoItem
                    label={
                      <span style={{ fontWeight: "bold" }}>Ngày bắt đầu</span>
                    }
                  >
                    <DesktopDatePicker
                      value={dayjs(startTime)}
                      onChange={handleStartDateChange}
                    />
                  </DemoItem>
                </div>
                <div>
                  <DemoItem
                    label={
                      <span style={{ fontWeight: "bold" }}>Ngày kết thúc</span>
                    }
                  >
                    <DesktopDatePicker
                      value={dayjs(endTime)}
                      onChange={handleEndDateChange}
                    />
                  </DemoItem>
                </div>
              </DemoContainer>
            </div>
          </LocalizationProvider>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex justify-between items-center mt-6">
          <button className="text-destructive-foreground" onClick={handleReset}>
            Xóa bộ lọc
          </button>
          <button
            className="text-white px-4 py-2 rounded-lg"
            style={{ backgroundColor: "#79d799" }}
            onClick={handleApply}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpFilter;
