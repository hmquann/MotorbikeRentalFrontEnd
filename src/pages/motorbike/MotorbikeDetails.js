import React, { useEffect, useState } from "react";
import ModalImage from "react-modal-image";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import ManageSchedulePopUp from '../booking/schedule/ManageSchedulePopUp';
import apiClient from "../../axiosConfig";
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
      const response = await apiClient.post(`/api/motorbike/updateMotorbike/${motorbike.id}`, updateForm);
      console.log('Data sent successfully', response.data);
      // You can handle success actions here
    } catch (error) {
      console.error('Error sending data', error);
      // You can handle error actions here
    }
  };

  if (!motorbike) return null;

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết mẫu xe</Modal.Title>
        <svg onClick={() => setIsUpdate(!isUpdate)}
          className="h-10 w-10 text-blue-500"
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
              <ManageSchedulePopUp isOpen={schedulePopUp} onClose={() => setSchedulePopUp(false)} motorbikeId={motorbike.id} />
      </Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Group>
            <Form.Label>Mẫu xe</Form.Label>
            <Form.Control
              type="text"
              id="name"
              name="name"
              placeholder="Enter motorbike name"
              value={motorbike.model.modelName}
              readOnly
            />

          </Form.Group>
          <Form.Group>
            <Form.Label>Biển xe</Form.Label>
            <Form.Control
              type="text"
              id="plate"
              name="plate"
              placeholder="Enter motorbike plate"
              value={motorbike.motorbikePlate}
              readOnly
            />

          </Form.Group>
          <Form.Group>
            <Form.Label>Giá thuê theo ngày</Form.Label>
            <Form.Control
              type="text"
              id="price"
              name="price"
              placeholder="Enter price"
              value={updateForm.price}
              readOnly={!isUpdate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Phí vượt thời gian</Form.Label>
            <Form.Control
              type="text"
              id="overtimeFee"
              name="overtimeFee"
              placeholder="Enter overtime fee"
              value={updateForm.overtimeFee}
              readOnly={!isUpdate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Giới hạn vượt thời gian</Form.Label>
            <Form.Control
              type="text"
              id="overtimeLimit"
              name="overtimeLimit"
              placeholder="Enter overtime limit"
              value={updateForm.overtimeLimit}
              readOnly={!isUpdate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Số chuyến</Form.Label>
            <Form.Control
              type="text"
              id="tripCount"
              name="tripCount"
              placeholder="Enter trip count"
              value={motorbike.tripCount}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Giao xe tận nơi</Form.Label>
            <Form.Control
              type="text"
              id="delivery"
              name="delivery"
              placeholder="Enter delivery status"
              value={updateForm.delivery ? "Yes" : "No"}
              readOnly={!isUpdate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Phí vận chuyển</Form.Label>
            <Form.Control
              type="text"
              id="deliveryFee"
              name="deliveryFee"
              placeholder="Enter delivery fee"
              value={updateForm.deliveryFee}
              readOnly={!isUpdate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Điều kiện ràng buộc thuê xe</Form.Label>
            <Form.Control
              type="text"
              id="constraintMotorbike"
              name="constraintMotorbike"
              placeholder="Enter motorbike constraints"
              value={updateForm.constraintMotorbike}
              readOnly={!isUpdate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Địa chỉ xe</Form.Label>
            <FloatingLabel
              controlId="floatingTextarea"
              label="Enter motorbike address"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                id="motorbikeAddress"
                name="motorbikeAddress"
                placeholder="Enter motorbike address"
                value={motorbike.motorbikeAddress}
                readOnly
                rows={3}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="col-span-1 sm:col-span-2">
            <Form.Label>Hình ảnh</Form.Label>
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
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {isUpdate && (
          <Button variant="primary" className="transition hover:scale-105" onClick={handleSubmit}>
            Cập nhật
          </Button>
        )}
        <Button variant="secondary" className="transition hover:scale-105" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MotorbikeDetails;
