import { faCalendarDays, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";

const BookingCard = ({ booking }) => {
  const [motorbikeList, setMotorbikeList] = useState([]);
  const statusColors = {
    PENDING: "text-orange-500",
    ACCEPTED: "text-green-500",
    DONE: "text-green-500",
    DENIED: "text-red-500",
    CANCELED: "text-red-500"
  };


  return (
    <div
      className="bg-card p-4 rounded-lg mb-4 border border-gray-300"
      style={{ backgroundColor: "white" }}
    >
      <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
        <span className={`text-sm text-muted-foreground ${statusColors[booking.status]}`}>{booking.status}</span>
      </div>
      <div className="flex">
        <img
          src="https://placehold.co/100x100"
          alt="Car image"
          className="rounded-lg w-36 h-36 object-cover mr-4"
        />
        <div>
          <h2 className="text-xl font-bold mb-2">{booking.name}</h2>
          <div className="flex items-center mb-2 text-gray-600">
            <FontAwesomeIcon icon={faCalendarDays} size="lg" color="gray"></FontAwesomeIcon>
            <span>&nbsp;&nbsp;Bắt đầu: {booking.start}</span>
          </div>
          <div className="flex items-center mb-2 text-gray-600">
          <FontAwesomeIcon icon={faCalendarDays} size="lg" color="gray"></FontAwesomeIcon>
            <span>&nbsp;&nbsp;Kết thúc: {booking.end}</span>
          </div>
          <div className="flex items-center mb-2 text-gray-600">
            <FontAwesomeIcon icon={faUser} size="lg"></FontAwesomeIcon>
            <span>&nbsp;&nbsp;{booking.owner}</span>
          </div>
          <div className="font-bold text-lg">Tổng tiền: {booking.total}</div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
