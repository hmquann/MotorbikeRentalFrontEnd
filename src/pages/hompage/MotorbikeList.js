import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Filter from './Filter';

// Define CSS classes
const cardClasses = "max-w-lg mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden";
const badgeClasses = "bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded";
const buttonClasses = "bg-white bg-opacity-50 p-1 rounded-full";
const avatarClasses = "w-10 h-10 rounded-full border-2 border-yellow-400";

const MotorbikeList = () => {
    const [motorbikeList, setMotorbikeList] = useState([]);
    const [selectedMotorbike, setSelectedMotorbike] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://rentalmotorbikebe.azurewebsites.net/api/motorbike/activeMotorbikeList')
            .then(response => setMotorbikeList((response.data)))
            .catch(error => console.error('Error fetching motorbikes:', error));
    }, motorbikeList);
    
    const getAddress = (inputString) => {
        if (typeof inputString !== 'string' || inputString.trim() === '') {
            return '';
        }
        const parts = inputString.split(",").map(part => part.trim());
        return parts.length > 2 ? parts.slice(2).join(", ") : parts.join(", ");
    };

    const handleViewDetail = (id) => {
        const selectedBike = motorbikeList.find((motorbike) => motorbike.id === id);
        if (selectedBike) {
            setSelectedMotorbike(selectedBike);
            navigate("/booking", { state: { selectedMotorbike: selectedBike } });
        } else {
            console.error('Selected motorbike not found');
        }
    };

    return (
        <div>
            <div className="p-8">
                <div className="flex justify-center mt-8">
                    <Filter />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {motorbikeList.length === 0 ? (
    <div className="col-span-full text-center text-zinc-500 dark:text-zinc-400">
      No motorbikes available.
    </div>
  ) : (
    motorbikeList.map((motorbike) => (
      <div
        key={motorbike.id}
        className="relative p-4 bg-white rounded-lg shadow-md dark:bg-zinc-800"
        onClick={() => handleViewDetail(motorbike.id)}
      >
        <div className="relative">
          <img
            className="w-full h-64 object-cover rounded-t-lg"
            src="https://minhlongmoto.com/wp-content/uploads/2023/04/gia-air-blade-125-doi-moi.jpg"
            alt="Motorbike"
          />
          <div className="absolute top-2 left-2 space-y-1">
            {/* Thêm các badges ở đây nếu cần */}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center mb-2">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src="https://kenhmuabanxehoi.net/uploads/truong-the-vinh_1680594107/halinh2.jpg"
              alt="User Avatar"
            />
            <div className="ml-2">
              <span className="block text-sm font-semibold text-green-600 dark:text-green-400">{motorbike.model.modelName}</span>
              <span className="block text-xs text-zinc-500 dark:text-zinc-400"></span>
            </div>
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white"></h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 inline-flex items-center space-x-2">
            <svg
              className="h-4 w-4 text-green-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx="12" cy="11" r="3" />
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
            </svg>
            <span>{getAddress(motorbike.motorbikeAddress)}</span>
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-yellow-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927C9.469 1.64 10.531 1.64 10.951 2.927l1.286 3.95a1 1 0 00.95.69h4.2c1.18 0 1.671 1.516.72 2.196l-3.4 2.47a1 1 0 00-.36 1.118l1.286 3.95c.42 1.287-.993 2.354-2.04 1.618l-3.4-2.47a1 1 0 00-1.18 0l-3.4 2.47c-1.047.736-2.46-.331-2.04-1.618l1.286-3.95a1 1 0 00-.36-1.118l-3.4-2.47c-.95-.68-.46-2.196.72-2.196h4.2a1 1 0 00.95-.69l1.286-3.95z"></path>
              </svg>
              <span className="text-sm">5.0</span>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center">
              <svg
                className="h-4 w-4 text-green-500"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <polyline points="8 16 10 10 16 8 14 14 8 16" />
                <circle cx="12" cy="12" r="9" />
              </svg>
              <span>{motorbike.tripCount} trips</span>
            </div>
            <div>
              <span className="text-green-500 font-semibold">{motorbike.price}</span> VND/day
            </div>
          </div>
        </div>
      </div>
    ))
  )}
</div>
            </div>
        </div>
    )
}

export default MotorbikeList;
