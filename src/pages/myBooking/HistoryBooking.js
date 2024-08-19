import React, { useState, useEffect } from "react";
import BookingCard from "./BookingCard";
import apiClient from "../../axiosConfig";
import NoBooking from "./NoBooking";
import { Stack, Pagination } from "@mui/material";
const HistoryBooking = ({ filters }) => {
  const [bookings, setBookings] = useState([]);
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiClient.post("/api/booking/filter", {
          tripType: filters.tripType,
          userId: filters.userId,
          status: filters.status,
          sort: filters.sort,
          startTime: filters.startTime,
          endTime: filters.endTime,
        });
        const pastBookings = response.data.filter((booking) =>
          ["REJECTED", "DONE", "CANCELED"].includes(booking.status)
        );
        setBookings(pastBookings);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchBookings();
  }, [filters]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedBookings = bookings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      {paginatedBookings.length === 0 ? (
        <NoBooking />
      ) : (
        paginatedBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))
      )}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
      >
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(bookings.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            color="success"
          />
        </Stack>
      </div>
    </div>
  );
};

export default HistoryBooking;
