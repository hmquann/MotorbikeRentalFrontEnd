import React, { useEffect, useState } from "react";
import axios from "axios";

const DepositCountdown = ({
  depositTime,
  onOneHourLeft,
  onTimeExpired,
  depositNoti,
  depositCanceled,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  useEffect(() => {
    if (depositTime) {
      const depositDate = new Date(depositTime);
      const expirationTime = new Date(
        depositDate.getTime() + 6 * 60 * 60 * 1000
      );

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

          if (hours < 1 && depositNoti) {
            if (onOneHourLeft) onOneHourLeft();
          }
        } else {
          if (depositCanceled) {
            setTimeRemaining(null);
            if (onTimeExpired) {
              onTimeExpired();
            }
          }
        }
      };

      updateCountdown();
      const intervalId = setInterval(updateCountdown, 1000);

      return () => clearInterval(intervalId);
    }
  }, [depositTime, onOneHourLeft, onTimeExpired, depositNoti, depositCanceled]);

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
