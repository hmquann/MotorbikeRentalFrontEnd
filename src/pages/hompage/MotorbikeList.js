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
        const handleViewDetail=()=>{

        }
  return (
    <div className="p-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {motorbikeList.map((motorbike, index) => (
  <div key={index} className={cardClasses}>
    <div className="bg-zinc-300  h-64 rounded-md mb-4 flex items-center justify-center">
      {/* <img src="https://img.tinxe.vn/resize/1000x-/2023/01/09/uU7VvIGZ/hew0hooi3tuxxgldlro8-541c.png" alt="Motorbike" className="w-full h-full object-cover round-md" /> */}
    </div>
    <div className="flex justify-between items-center mb-2">
      <span className={`text-red-400 ${badgeClasses}`}>-16%</span>
      <span className={`text-orange-300 ${badgeClasses}`}></span>
    </div>
    <h2 className="text-center text-sm font-semibold mb-2">{motorbike.name}</h2>
    <div className="flex justify-around">
      <button className={buttonClasses}>Btn</button>
      <button className={buttonClasses}>Type</button>
      <button className={buttonClasses}>{motorbike.price}</button>
    </div>
  </div>
))}
        </div>
      </div>
  );
};

export default MotorbikeList;
