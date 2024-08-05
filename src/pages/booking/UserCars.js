import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Box, Grid, CircularProgress, Button } from '@mui/material';
import apiClient from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import image from "../../assets/images/2.png"

const UserCars = ({ userId }) => {
  const [motorbikes, setMotorbikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMotorbike, setSelectedMotorbike] = useState(null);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMotorbikes = async () => {
      try {
        const response = await apiClient.get(`/api/motorbike/${userId}/motorbikes`);
        setMotorbikes(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMotorbikes();
  }, [userId]);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box display="flex" justifyContent="center" mt={4}>Error: {error}</Box>;
  }

//   if (motorbikes.length === 0) {
//     return <Box display="flex" justifyContent="center" mt={4}>No cars found</Box>;
//   }

  const handleViewDetail = async (id) => {
    try {
      const response = await apiClient(`/api/motorbike/${id}`);
      const selectedBike = response.data;
      setSelectedMotorbike(selectedBike);
      localStorage.setItem("selectedMotorbike", JSON.stringify(selectedBike));
      navigate("/booking");
    } catch (error) {
      console.error("Error fetching motorbike details:", error);
    }
  };
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < motorbikes.length - 2 ? prevIndex + 1 : prevIndex));
  };


  return (
    <div className="flex flex-col bg-white py-6 px-8 rounded-lg font-manrope ">
    <h2 className="text-lg font-semibold mb-4">Danh sách xe</h2>
    {motorbikes.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <img src={image} alt="No cars found" className="w-64 h-64 ml-10" />
          <p className="text-center mt-4 text-lg font-bold text-zinc-600">Không tìm thấy xe nào.</p>
        </div>
      ) : (
    <div className="relative flex items-center">
      {currentIndex > 0 && (
        <button onClick={handlePrev} className="absolute -left-2 z-10 p-2 bg-gray-200 rounded-full">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      )}
    <div className="grid gap-4 w-full h-full cursor-pointer overflow-hidden grid-cols-1 sm:grid-cols-2">
        {motorbikes.slice(currentIndex, currentIndex + 2).map((motorbike) => (
          <div 
            key={motorbike.id} 
            className="bg-white p-4 flex flex-col rounded-xl border" 
            onClick={() => handleViewDetail(motorbike.id)}
          >
            <div className='flex flex-col w-full gap-4 rounded-xl'>
              <img
                className="w-full h-48 object-cover rounded-xl"
                src={motorbike.motorbikeImages[0].url || '/default-image.jpg'}
                alt={motorbike.name}
              />
              <div className="">
                <div className="flex items-center mb-2">
                  <button className="bg-blue-300 px-2 inline-flex leading-7 font-base rounded-full text-xs">
                    {motorbike.model.modelType}
                  </button>
                  <button className="bg-green-300 px-2 inline-flex leading-7 font-base rounded-full text-xs ml-1">
                    {motorbike.delivery ? "Giao xe tận nơi" : "Không giao xe"}
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{motorbike.model.modelName}</h3>
                <div className="text-gray-500">
                  <FontAwesomeIcon icon={faLocationDot} className='mr-2' />
                  <span>{motorbike.motorbikeAddress}</span>
                </div>
                <hr />
                <div className='flex justify-between'>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                    <span>{motorbike.tripCount} chuyến</span>
                  </div>
                  <div className='flex'>
                    <div className="text-lg text-right font-semibold text-green-500 mb-2">{motorbike.price.toLocaleString()}</div>
                    <span className='text-lg'>/ ngày</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {currentIndex < motorbikes.length - 2 && (
        <button onClick={handleNext} className="absolute -right-2 z-10 p-2 bg-gray-200 rounded-full">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      )}
    </div>
       )}
  </div>
    
  );
};

export default UserCars;
