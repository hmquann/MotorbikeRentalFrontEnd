import React, { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';

const SearchMotorbike = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [rentalStartTime, setRentalStartTime] = useState(new Date());
    const [rentalEndTime, setRentalEndTime] = useState(addDays(new Date(), 1));
    
    useEffect(() => {
      const getCurrentTime = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Math.ceil(now.getHours()) + 1, 0);
        const end = addDays(start, 1);
    
        setRentalStartTime(start);
        setRentalEndTime(end);
      };
    
      getCurrentTime();
    }, []);

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(date);
  };

  return (
    <div>
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>

          <div>
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
              Địa điểm
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-black dark:text-white">Hồ Chí Minh</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div>
            <span className="text-zinc-600 dark:text-zinc-300">
              Thời gian thuê
            </span>
            <div className="flex items-center space-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7v-1a1 1 0 112 0v1h4v-1a1 1 0 112 0v1h3a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3zM6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h.01M10 16h.01M14 16h.01M18 16h.01"
                />
              </svg>
              <span className="text-black dark:text-white">
                {format(rentalStartTime, 'HH:mm, dd/MM/yyyy')} -{' '}
                {format(rentalEndTime, 'HH:mm, dd/MM/yyyy')}
              </span>
            </div>
          </div>
        </div>

        <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
          Tìm Xe
        </button>
      </div>

      
    </div>
  );
};

export default SearchMotorbike;
