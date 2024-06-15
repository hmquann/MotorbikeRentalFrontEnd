import React, { useState } from 'react';
import { useEffect } from "react";
import axios from "axios";
const cardClasses = 'bg-green-200 p-4 rounded-lg shadow-md';
const badgeClasses = 'text-xs px-2 py-1 rounded-full';
const buttonClasses = 'bg-white text-zinc-700 py-1 px-2 rounded-full shadow';

const MotorbikeList = () => {
    const[motorbikeList,setMotorbikeList]=useState([]);
    useEffect(() => {
        axios.get('http://localhost:8080/motorbike/motorbikeList')
            .then(response => setMotorbikeList(response.data))
            .catch(error => console.error('Error fetching models:', error));
        }, []);
        console.log(motorbikeList)
  return (
    <div className="p-8">
        <h1 className="text-center text-2xl font-semibold mb-8 text-zinc-900 dark:text-zinc-100">
          Moto for you
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className={cardClasses}>
              <div className="bg-zinc-300 h-32 rounded-md mb-4 flex items-center justify-center shadow-inner">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Motorbike"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-red-400 ${badgeClasses}`}>-16%</span>
                <span className={`text-green-500 ${badgeClasses}`}>$ Price</span>
              </div>
              <h2 className="text-center text-lg font-semibold mb-2 text-zinc-800 dark:text-zinc-100">
                Name
              </h2>
              <div className="flex justify-around">
                <button className={buttonClasses}>Btn</button>
                <button className={buttonClasses}>Type</button>
                <button className={buttonClasses}>Price</button>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default MotorbikeList;
