import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import './DatePicker.css'; // Import your custom CSS
import { format, parseISO } from 'date-fns';
import apiClient from '../../../axiosConfig';

const sharedClasses = {
  overlay: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center",
  popupContainer: "relative bg-white rounded-lg shadow p-4 max-w-[32rem] w-full",
  closeButton: "absolute top-2 right-2 text-black cursor-pointer",
  green500: "bg-green-500",
  textWhite: "text-white",
  p2: "p-2",
  rounded: "rounded-lg",
  mb4: "mb-4",
};

const ManageSchedulePopUp = ({ isOpen, onClose, motorbikeId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [busyDates, setBusyDates] = useState([]);
  const [error, setError] = useState('');

  const fetchScheduleMotorbike = async (motorbikeId) => {
    try {
      const response = await apiClient.get(`/api/schedules/motorbike/${motorbikeId}`);
      const parsedDates = response.data.map((event) => parseISO(event.date));
      setBusyDates(parsedDates);
    } catch (error) {
      console.error('Error fetching schedule details', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchScheduleMotorbike(motorbikeId);
    }
  }, [isOpen, motorbikeId]);

  const handleSubmit = async () => {
    if (!selectedDate) {
      setError('Hãy chọn ngày hợp lệ');
      return;
    }

    setError('');
    try {
      const response = await apiClient.post(`/api/booking/markBusyDays`, null, {
        params: {
          motorbikeId,
          date: format(selectedDate, 'yyyy-MM-dd'),
        },
      });

      const updatedSchedule = response.data;
      if (updatedSchedule.status === 'BUSY') {
        setBusyDates([...busyDates, selectedDate]);
      } else {
        setBusyDates(busyDates.filter((date) => format(date, 'yyyy-MM-dd') !== format(selectedDate, 'yyyy-MM-dd')));
      }

      console.log('Response from backend:', updatedSchedule);
      setSelectedDate(null);
      onClose();
    } catch (error) {
      console.error('Error toggling busy date:', error);
    }
  };

  const isBusyDate = (date) => busyDates.some((busyDate) => format(busyDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

  const dayClassName = (date) => {
    if (isBusyDate(date)) {
      return 'react-datepicker__day--highlighted-busy';
    }
    return undefined;
  };

  if (!isOpen) return null;

  return (
    <div className={sharedClasses.overlay}>
      <div className={sharedClasses.popupContainer}>
        <button className={sharedClasses.closeButton} onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className={`text-center ${sharedClasses.mb4}`}>Chọn ngày xe của bạn không thể cho thuê</h2>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          inline
          dayClassName={(date) => dayClassName(date)}
        />
        {error && <div className="text-red-500">{error}</div>}
        <button
          className={`w-full mt-4 ${sharedClasses.green500} ${sharedClasses.textWhite} ${sharedClasses.p2} ${sharedClasses.rounded}`}
          onClick={handleSubmit}
        >
          Đánh dấu ngày đã chọn
        </button>
      </div>
    </div>
  );
};

export default ManageSchedulePopUp;
