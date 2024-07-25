import React, { useEffect, useState } from "react";
import ModalImage from "react-modal-image";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import ManageSchedulePopUp from '../booking/schedule/ManageSchedulePopUp';
const inputClasses = "w-full px-3 py-2 mt-1 rounded-md bg-input text-primary-foreground";
const labelClasses = "block text-sm font-medium";
const buttonClasses = "px-4 py-2 rounded";

const MotorbikeDetails = ({ motorbike, onClose }) => {
  const [userRole, setUserRole] = useState([]);
  const [userId, setUserId] = useState('');
  const [schedulePopUp, setSchedulePopUp] = useState(false);

  const handleOpenSchedulePopup = () => {
    setSchedulePopUp(true);
  };

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem('roles'));
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    setUserRole(role);
    setUserId(userId);
  }, []);

  const isLessor = userRole.includes('LESSOR');
  const [updateForm, setUpdateForm] = useState({
    price: '',
    overtimeFee: '',
    overtimeLimit: '',
    delivery: '',
    freeShipLimit: '',
    deliveryFee: '',
    constraintMotorbike: ''
  });

  useEffect(() => {
    if (motorbike) {
      setUpdateForm({
        price: motorbike.price,
        overtimeFee: motorbike.overtimeFee,
        overtimeLimit: motorbike.overtimeLimit,
        delivery: motorbike.delivery,
        freeShipLimit: motorbike.freeShipLimit,
        deliveryFee: motorbike.deliveryFee,
        constraintMotorbike: motorbike.constraintMotorbike
      });
    }
  }, [motorbike]);

  const [isUpdate, setIsUpdate] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm({
      ...updateForm,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/motorbike/updateMotorbike/${motorbike.id}`, updateForm);
      console.log('Data sent successfully', response.data);
      // You can handle success actions here
    } catch (error) {
      console.error('Error sending data', error);
      // You can handle error actions here
    }
  };

  if (!motorbike) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-zinc-200 text-primary-foreground p-4 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Motorbike Details</h2>
          {isLessor && (
            <div className="flex items-center">
              <svg
                onClick={() => setIsUpdate(!isUpdate)}
                className="h-10 w-10 text-blue-500 cursor-pointer"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                <line x1="16" y1="5" x2="19" y2="8" />
              </svg>
              <svg onClick={handleOpenSchedulePopup}
              class="h-10 w-10 text-green-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> 
               <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="4" y="5" width="16" height="16" rx="2" />
                <line x1="16" y1="3" x2="16" y2="7" />  <line x1="8" y1="3" x2="8" y2="7" />  
              <line x1="4" y1="11" x2="20" y2="11" />  <rect x="8" y="15" width="2" height="2" /></svg>
            
            </div>
            
          )}
          <ManageSchedulePopUp isOpen={schedulePopUp} onClose={() => setSchedulePopUp(false)} motorbikeId={motorbike.id} />
          
        </div>        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelClasses}>
              Mẫu xe
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter motorbike name"
              className={inputClasses}
              value={motorbike.model.modelName}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="plate" className={labelClasses}>
              Biển số xe
            </label>
            <input
              type="text"
              id="plate"
              name="plate"
              placeholder="Enter motorbike plate"
              className={inputClasses}
              value={motorbike.motorbikePlate}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="price" className={labelClasses}>
              Giá thuê theo ngày
            </label>
            <input
              type="text"
              id="price"
              name="price"
              placeholder="Enterprice"
              className={inputClasses}
              value={updateForm.price}
              readOnly={!isUpdate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="overtimeFee" className={labelClasses}>
              Phí vượt thời gian
            </label>
            <input
              type="text"
              id="overtimeFee"
              name="overtimeFee"
              placeholder="Enter overtime fee"
              className={inputClasses}
              value={updateForm.overtimeFee}
              readOnly={!isUpdate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="overtimeLimit" className={labelClasses}>
              Giới hạn vượt thời gian
            </label>
            <input
              type="text"
              id="overtimeLimit"
              name="overtimeLimit"
              placeholder="Enter overtime limit"
              className={inputClasses}
              value={updateForm.overtimeLimit}
              readOnly={!isUpdate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="tripCount" className={labelClasses}>
              Số chuyến
            </label>
            <input
              type="text"
              id="tripCount"
              name="tripCount"
              placeholder="Enter trip count"
              className={inputClasses}
              value={motorbike.tripCount}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="delivery" className={labelClasses}>
              Giao xe tận nơi
            </label>
            <input
              type="text"
              id="delivery"
              name="delivery"
              placeholder="Enter delivery status"
              className={inputClasses}
              value={updateForm.delivery ? "Yes" : "No"}
              readOnly={!isUpdate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="deliveryFee" className={labelClasses}>
              Phí vận chuyển
            </label>
            <input
              type="text"
              id="deliveryFee"
              name="deliveryFee"
              placeholder="Enter delivery fee"
              className={inputClasses}
              value={updateForm.deliveryFee}
              readOnly={!isUpdate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="constraintMotorbike" className={labelClasses}>
              Điều kiện ràng buộc thuê xe
            </label>
            <input
              type="text"
              id="constraintMotorbike"
              name="constraintMotorbike"
              placeholder="Enter motorbike constraints"
              className={inputClasses}
              value={updateForm.constraintMotorbike}
              readOnly={!isUpdate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="motorbikeAddress" className={labelClasses}>
              Địa chỉ Xe
            </label>
            <textarea
              id="motorbikeAddress"
              name="motorbikeAddress"
              placeholder="Enter motorbike address"
              className={`${inputClasses} resize-none`}
              value={motorbike.motorbikeAddress}
              readOnly
              rows={3}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="motorbikeImages" className={labelClasses}>
              Hình ảnh
            </label>
            <div className="flex flex-wrap items-center mt-1">
              {motorbike.motorbikeImages.map((image, index) => (
                <ModalImage
                  key={index}
                  small={image.url}
                  large={image.url}
                  alt={`Motorbike image ${index + 1}`}
                  className="w-28 h-28 object-cover rounded-md mr-2 mb-2"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
  {isUpdate && (
    <button
      onClick={handleSubmit}
      className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
    >
      Update
    </button>
  )}
  <button
    onClick={onClose}
    className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
  >
    Close
  </button>
</div>
      </div>
    </div>
  );
};
export default MotorbikeDetails;
