import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import apiClient from "../../axiosConfig";

// Define reusable Tailwind classes
const overlayClasses = "fixed inset-0 z-30 flex items-center justify-center";
const popupClasses =
  "relative z-40 w-full max-w-md bg-white rounded-lg shadow-lg p-6";
const headerClasses = "text-xl text-green-600 font-bold mb-4";
const labelClasses = "block text-base font-medium text-gray-700 mb-2";
const radioContainerClasses = "flex flex-col mb-4";
const radioClasses = "mb-2 flex items-center";
const buttonContainerClasses = "flex justify-end space-x-2 mt-4"; // Adjust for spacing between buttons
const applyButtonClasses =
  "bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-white";
const cancelButtonClasses = "bg-gray-300 text-black px-4 py-2 rounded-lg";
const textboxClasses = "mt-2 p-2 border border-gray-300 rounded-lg w-full";
const errorTextClasses = "text-red-500 mt-1 text-sm";

const PopUpReason = ({
  show,
  onHide,
  onSend,
  bookingId,
  bookingTotalPrice,
  onWithinOneHour,
  onMoreThanTwoDays,
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState(""); // New state for form validation
  const [depositTime, setDepositTime] = useState();
  const [startDateTime, setStartDateTime] = useState();
  const [message, setMessage] = useState();
  const [isWithinOneHour, setIsWithinOneHour] = useState(false);
  const [isMoreThanTwoDays, setIsMoreThanTwoDays] = useState(false);
  const [isLessThanTwoDays, setIsLessThanTwoDays] = useState(false);
  const [bookingStatus, setBookingStatus] = useState();
  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        try {
          const response = await apiClient.get(
            `/api/booking/getBookingDepositByBookingId/${bookingId}`,
            { headers: { "Cache-Control": "no-cache" } }
          );
          setBookingStatus(response.data.bookingStatus);
          const respone2 = await apiClient.get(
            `/api/booking/getStartDateTimeByBookingId/${bookingId}`
          );
          setDepositTime(response.data.depositTime);
          setStartDateTime(respone2.data);
        } catch (error) {
          console.error("Error fetching booking details:", error);
        }
      };

      fetchData();
    }
  }, [show, bookingId]);

  useEffect(() => {

    if (bookingStatus === "PENDING_DEPOSIT") {
      setMessage(
        "Tính đến thời điểm hiện tại chuyến đang là đặt cọc đơn phương nên bạn sẽ được hoàn toàn bộ tiền cọc theo <a href='/privacy/general' target='_blank'>Điều khoản và chính sách</a> của chúng tôi."
      );
    } else if (show && depositTime) {
      const depositDate = new Date(depositTime);
      console.log(depositDate);
      const now = new Date();
      console.log(now);
      const timeDiff = now - depositDate; // Thời gian chênh lệch giữa depositTime và hiện tại

      // Kiểm tra nếu thời gian chênh lệch <= 1 giờ
      if (timeDiff <= 1 * 60 * 60 * 1000) {
        setIsWithinOneHour(true);
        const bookingDeposit100 = (bookingTotalPrice * 50) / 100;
        setMessage(
          "Tính đến thời điểm hiện tại là chưa quá 1 giờ so với thời gian đặt cọc nên bạn sẽ được hoàn lại " +
            bookingDeposit100.toLocaleString("vi-VN") +
            "đ (100% tiền cọc)  theo <a href='/privacy/general' target='_blank'>Điều khoản và chính sách</a> của chúng tôi."
        );
        // Thực hiện các hành động khác nếu cần
      } else {
        const startDate = new Date(startDateTime);
        const timeDiff2 = startDate - now;
        console.log(startDate);
        console.log(now);
        console.log(timeDiff2);
        const bookingDeposit70 = (((bookingTotalPrice * 50) / 100) * 70) / 100;
        if (timeDiff2 > 2 * 24 * 60 * 60 * 1000) {
          setIsMoreThanTwoDays(true);
          setMessage(
            "Tính đến thời điểm hiện tại thời gian là lớn hơn 2 ngày trước chuyến đi nên bạn sẽ được hoàn lại " +
              bookingDeposit70.toLocaleString("vi-VN") +
              "đ (70% tiền cọc) theo <a href='/privacy/general' target='_blank'>Điều khoản và chính sách</a> của chúng tôi."
          );
        } else {
          setIsMoreThanTwoDays(false);
          setIsLessThanTwoDays(true);
          setMessage(
            "Tính đến thời điểm hiện tại thời gian là trong vòng 2 ngày trước chuyến đi nên bạn sẽ không được hoàn lại tiền cọc theo <a href='/privacy/general' target='_blank'>Điều khoản và chính sách</a> của chúng tôi."
          );
        }
        setIsWithinOneHour(false);
      }
    }
  }, [show, depositTime]);

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setSelectedReason(value);
    if (value !== "Khác") {
      setOtherReason(""); // Clear otherReason if not "Khác"
      setError(""); // Clear error message when switching reason
      setFormError(""); // Clear form error message
    }
  };

  const handleOtherReasonChange = (event) => {
    setOtherReason(event.target.value);
    if (event.target.value.trim()) {
      setError(""); // Clear error message when typing
    }
  };

  const handleSend = () => {
    if (!selectedReason) {
      setFormError("Vui lòng chọn một lý do.");
      return;
    }
    if (selectedReason === "Khác" && !otherReason.trim()) {
      setError("Vui lòng nhập lý do khác.");
      return;
    }
    setFormError(""); // Clear form error if everything is valid
    onSend(
      selectedReason === "Khác" ? otherReason : selectedReason,
      isWithinOneHour,
      isMoreThanTwoDays,
      isLessThanTwoDays
    );
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered className="font-manrope">
      <div className={overlayClasses}>
        <div className={popupClasses}>
          <h2 className={headerClasses}>Lý do hủy chuyến</h2>
          <div className={radioContainerClasses}>
            {[
              "Trùng lịch bận",
              "Muốn đổi xe khác",
              "Muốn đổi ngày khác",
              "Muốn đổi địa điểm khác",
              "Khác",
            ].map((reason, index) => (
              <div key={index} className={radioClasses}>
                <input
                  type="radio"
                  id={`reason-${index}`}
                  name="reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
                <label
                  htmlFor={`reason-${index}`}
                  className="text-base text-gray-700"
                >
                  {reason}
                </label>
              </div>
            ))}
            {selectedReason === "Khác" && (
              <>
                <textarea
                  value={otherReason}
                  onChange={handleOtherReasonChange}
                  placeholder="Nhập lý do khác..."
                  className={textboxClasses}
                />
                {error && <div className={errorTextClasses}>{error}</div>}
              </>
            )}
            {formError && <div className={errorTextClasses}>{formError}</div>}{" "}
            {/* Display form error */}
          </div>
          {message && (
            <div className="text-sm font-bold">
              <span dangerouslySetInnerHTML={{ __html: message }}></span>
            </div>
          )}
          <div className={buttonContainerClasses}>
            <button onClick={onHide} className={cancelButtonClasses}>
              Hủy bỏ
            </button>
            <button onClick={handleSend} className={applyButtonClasses}>
              Gửi
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PopUpReason;
