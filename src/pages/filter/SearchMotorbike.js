import React, { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import MotorbikeSchedulePopUp from '../booking/schedule/MotorbikeSchedulePopUp';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}, ${day}/${month}/${year}`;
};

const SearchMotorbike = () => {
  const navigate = useNavigate();
    const[addressPopUp,setAddressPopUp]=useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [rentalStartTime, setRentalStartTime] = useState(new Date());
    const [rentalEndTime, setRentalEndTime] = useState(addDays(new Date(), 1));
    const[rentalAddress,setRentalAddress]=useState("");
    const[schedulePopUp,setSchedulePopUp]=useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [error, setError] = useState(null);
    const[loading,setLoading]=useState(false);
    const handleOpenSchedulePopup=()=>{
      setSchedulePopUp(true)
    }
    useEffect(() => {
      fetch("https://vapi.vnappmob.com/api/province/")
        .then(response => response.json())
        .then(data => {
          console.log('API response:', data); 
          if (data && data.results) {
            setProvinces(data.results); // Điều chỉnh theo cấu trúc dữ liệu thực tế
          } else {
            throw new Error('Invalid data format');
          } 
        })
        .catch(error => {
          setError(error);
        });
    }, []);
    const handleProvinceChange = (event) => {
      const provinceId = event.target.value;
      setSelectedProvince(provinceId);
      // Fetch districts based on selected province
      fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)
        .then((response) => response.json())
        .then((data) => {
  
          if (data && data.results) {           
            setDistricts(data.results);
          } else {
            throw new Error("Invalid data format");
          }
        })
        .catch((error) => {
          setError(error);
        });
    };
    const handleDistrictChange=(event)=>{
      const districtId = event.target.value;
      setSelectedDistrict(districtId);
    }
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


  const handlePopUpSubmit = (data) => {
    // Handle data submission to destination page
    setRentalStartTime(data.startDateTime);
    setRentalEndTime(data.endDateTime);

    // Perform any further actions here
  };
  const handleAddressSubmit=()=>{
    console.log(selectedDistrict)
    console.log(selectedProvince);
    const province = provinces.find(d => d.province_id === selectedProvince).province_name;
    const district = districts.find(d => d.district_id === selectedDistrict).district_name;
  setRentalAddress(district+","+province);
  console.log(rentalAddress)
  setAddressPopUp(false)
  }
    const handleSearchMotor = async () => {
      
      const filterList = {
        startDate:dayjs(rentalStartTime).format('YYYY-MM-DDTHH:mm:ss'),
        endDate: dayjs(rentalEndTime).format('YYYY-MM-DDTHH:mm:ss'),
        address: rentalAddress,
      };
  
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:8080/api/motorbike/filter', filterList, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Data sent successfully:', response.data);
        const listMotor=response.data;
        navigate('/filter', { state: { filterList,listMotor } });
      } catch (error) {
        handleRequestError(error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleRequestError = (error) => {
      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Status code:', error.response.status);
        console.error('Data:', error.response.data);
  
        if (error.response.status === 404) {
          setError('Error 404: Not Found. The requested resource could not be found.');
        } else if (error.response.status === 409) {
          setError(error.response.data);
        } else {
          setError(`Error ${error.response.status}: ${error.response.data.message || 'An error occurred.'}`);
        }
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response received. Please check your network connection.');
      } else {
        console.error('Error message:', error.message);
        setError('An error occurred. Please try again.');
      }
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

          <div onClick={()=>setAddressPopUp(true)}>
            <span className="text-zinc-500 dark:text-zinc-400 text-sm"> Địa điểm
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-black dark:text-white">{rentalAddress?rentalAddress:"Chọn địa điểm"}</span>
            </div>
          </div>
          {addressPopUp && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div name="province"
              value={selectedProvince}
              onChange={handleProvinceChange}>
            <label className="block text-sm font-medium text-gray-700">Thành phố</label>
            <select className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-sm ">
            <option value="" className="text-gray-700 bg-white">Chọn thành phố</option>
              {provinces.map((province) => (
                <option  className="text-gray-700 bg-white" key={province.province_id} value={province.province_id}>
                  {province.province_name}
                </option>
              ))}
            </select>
          </div>
          <div  name="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              >
            <label className="block text-sm font-medium text-gray-700">Quận / Huyện</label>
            <select className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-sm">
            <option className="text-gray-700 bg-white" value="">Select District</option>
              {districts.map((district) => (
                <option className="text-gray-700 bg-white" key={district.district_id} value={district.district_id}>
                  {district.district_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="bg-gray-500 text-white rounded px-3 py-1"
            onClick={() => setAddressPopUp(false)}
          >
            Hủy
          </button>
          <button
            className="bg-blue-500 text-white rounded px-3 py-1"
            onClick={handleAddressSubmit}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </div>
)}

       

        <div className="flex items-center space-x-2" >
          <div onClick={(handleOpenSchedulePopup)}>
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
          <div className="flex justify-center mt-8">
          <MotorbikeSchedulePopUp isOpen={schedulePopUp} onClose={() => setSchedulePopUp(false)} onSubmit={handlePopUpSubmit} />
          </div>
          
        </div>

        <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleSearchMotor} >
        {loading ? "Đang tìm kiếm..." : "Tìm xe"}
        </button>
        
      </div>

      
    </div>
    </div>
  );
};

export default SearchMotorbike;
