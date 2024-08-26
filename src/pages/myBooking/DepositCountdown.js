import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "../../axiosConfig";

const DepositCountdown = ({ bookingId, onOneHourLeft, onTimeExpired }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [depositTime, setDepositTime] = useState();
  const [depositNoti, setDepositNoti] = useState();
  const [depositCanceled, setDepositCanceled] = useState();
  const [bookingStatus, setBookingStatus] = useState();
  useEffect(() => {
    const fetchBookingDeposit = async () => {
      try {
        const response = await apiClient.get(
          `/api/booking/getBookingDepositByBookingId/${bookingId}`,
          { headers: { "Cache-Control": "no-cache" } }
        );
        console.log(response);
        setDepositTime(response.data.depositTime);
        setDepositNoti(response.data.depositNoti);
        setDepositCanceled(response.data.depositCanceled);
      } catch (error) {
        console.error("Error fetching booking deposit:", error);
      }
    };

    fetchBookingDeposit();

    const intervalId = setInterval(fetchBookingDeposit, 1000); // Call API every second

    return () => clearInterval(intervalId);
  }, [bookingId]);
  useEffect(() => {
    if (depositTime) {
      if (!depositCanceled && !depositNoti) {
        setTimeRemaining(null);
        return;
      }
      const depositDate = new Date(depositTime);
      const expirationTime = new Date(
        depositDate.getTime() + 6 * 60 * 60 * 1000
        //depositDate.getTime() + 3 * 60 * 1000
      );
      // 3' đếm ngược
      // 1' là thông báo
      // hết giờ là hủy chuyến
      const updateCountdown = () => {
        const now = new Date();
        const timeDiff = expirationTime - now;

        if (timeDiff > 0) {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setTimeRemaining({ hours, minutes, seconds });

          //if (minutes < 1 && depositNoti) {
            if (hours < 1 && depositNoti) {
            onOneHourLeft();
            setDepositNoti(false);
          }
        } else {
          if (depositCanceled) {
            setTimeRemaining(null);
            onTimeExpired();
            setDepositCanceled(false);
          }
        }
      };

      updateCountdown();
      const intervalId = setInterval(updateCountdown, 1000);

      return () => clearInterval(intervalId);
    }
  }, [
    bookingId,
    onOneHourLeft,
    onTimeExpired,
    depositCanceled,
    depositNoti,
    depositTime,
  ]);

  return (
    <div>
      {timeRemaining && (
        <i className="text-red-500 text-xs">
          Hạn đặt cọc còn lại: {timeRemaining.hours} giờ {timeRemaining.minutes}{" "}
          phút {timeRemaining.seconds} giây
        </i>
      )}
    </div>
  );
};

export default DepositCountdown;
