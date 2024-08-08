import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import image from "../../assets/images/2.png";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const UserCars = ({ userId }) => {
  const [motorbikes, setMotorbikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleViewDetail = async (id) => {
    try {
      const response = await apiClient(`/api/motorbike/${id}`);
      const selectedBike = response.data;
      localStorage.setItem("selectedMotorbike", JSON.stringify(selectedBike));
      navigate("/booking");
    } catch (error) {
      console.error("Error fetching motorbike details:", error);
    }
  };

  return (
    <div className="flex flex-col bg-white py-6 px-8 rounded-lg font-manrope">
      <h2 className="text-lg font-semibold mb-4">Danh sách xe</h2>
      {motorbikes.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <img src={image} alt="No cars found" className="w-64 h-64 ml-10" />
          <p className="text-center mt-4 text-lg font-bold text-zinc-600">Không tìm thấy xe nào.</p>
        </div>
      ) : (
        <Box className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={2}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            autoplay={{ delay: 7000 }}
            loop
          >
            {motorbikes.map((motorbike) => (
              <SwiperSlide key={motorbike.id}>
                <div 
                  className="bg-white p-4 flex flex-col rounded-xl border cursor-pointer"
                  onClick={() => handleViewDetail(motorbike.id)}
                >
                  <img
                    className="w-full h-48 object-cover rounded-xl"
                    src={motorbike.motorbikeImages[0].url || '/default-image.jpg'}
                    alt={motorbike.name}
                  />
                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <button className="bg-blue-300 px-2 inline-flex leading-7 font-base rounded-full text-xs">
                        {motorbike.model.modelType}
                      </button>
                      <button className="bg-green-300 px-2 inline-flex leading-7 font-base rounded-full text-xs ml-1">
                        {motorbike.delivery ? "Giao xe tận nơi" : "Không giao xe"}
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{motorbike.model.modelName}</h3>
                    <div className="text-gray-500">
                      <FontAwesomeIcon icon={faLocationDot} className='mr-2' />
                      <span>{motorbike.motorbikeAddress}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between mt-2">
                      <div className="text-gray-500">
                        <span>{motorbike.tripCount} chuyến</span>
                      </div>
                      <div className="text-lg text-right font-semibold text-green-500">
                        {motorbike.price.toLocaleString()} / ngày
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Nút điều hướng */}
          <div className="swiper-button-prev p-6 rounded-full bg-gray-200 absolute left-0 top-1/2 transform -translate-y-1/2">
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <div className="swiper-button-next p-6 rounded-full bg-gray-200 absolute right-0 top-1/2 transform -translate-y-1/2">
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </Box>
      )}
    </div>
  );
};

export default UserCars;
