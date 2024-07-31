import React, { useState, useEffect } from "react";
import BookingCard from "./BookingCard";
import apiClient from "../../axiosConfig";
import NoBooking from "./NoBooking";

const CurrentBooking = ({ filters }) => {
  const [bookings, setBookings] = useState([]);
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiClient.post(
          "/api/booking/filter",
          {
            tripType: filters.tripType,
            userId: filters.userId,
            status: filters.status,
            sort: filters.sort,
            startTime: filters.startTime,
            endTime: filters.endTime,
          }
        );
        const currentBookings = response.data.filter((booking) =>
          ["PENDING", "PENDING_DEPOSIT", "DEPOSIT_MADE", "RENTING"].includes(
            booking.status
          )
        );
        setBookings(currentBookings);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchBookings();
  }, [filters]);

  return (
    <div>
      {bookings.length === 0 ? (
        <NoBooking />
      ) : (
        bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))
      )}
    </div>
  );
};

export default CurrentBooking;
