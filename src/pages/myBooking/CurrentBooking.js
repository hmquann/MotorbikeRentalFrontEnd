import React, { useState, useEffect } from "react";
import BookingCard from "./BookingCard";
import axios from "axios";

const CurrentBooking = () => {
  const [bookings, setBookings] = useState([]);
  const userDataString = localStorage.getItem("user");

  // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
  const userData = JSON.parse(userDataString);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // check license
      const response = await axios.get(
        `http://localhost:8080/api/license/getLicenseByUserId/${userData.userId}`
      );
      setBookings(response.data)
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
};

export default CurrentBooking;
