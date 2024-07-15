import React, { useEffect, useState } from 'react';
import BookingCard from './BookingCard'; // Reuse the BookingCard component

const HistoryBooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Replace with your API call to get trip history
    fetch('/api/trip-history')
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error('Error fetching trip history:', error));
  }, []);

  return (
    <div>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
};

export default HistoryBooking;