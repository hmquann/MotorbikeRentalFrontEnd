import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from "react-bootstrap";
import apiClient from "../../axiosConfig";

const inputClasses =
  "mt-1 block w-full p-2 border border-zinc-300 rounded-md text-black font-medium";
const labelClasses = "block text-md text-slate-500 ";

const ViewModel = ({ showModal, setShowModal, modelId }) => {
  const [modelData, setModelData] = useState({
    modelName: "",
    cylinderCapacity: "",
    fuelType: "",
    fuelConsumption: "",
    modelType: "",
    brand: {
      brandId: "",
      brandName:""
    },
  });

  useEffect(() => {
    if (modelId && showModal) {
      const fetchModelDetails = async () => {
        try {
          const response = await apiClient.get(
            `/api/model/${modelId}`
          );
          setModelData(response.data);
        } catch (error) {
          console.error("Error fetching model details", error);
        }
      };

      fetchModelDetails();
    }
  }, [modelId, showModal]);
  const modelTypeMap = {
    'XeSo': 'Xe Số',
    'XeTayGa': 'Xe Tay Ga',
    'XeConTay': 'Xe Côn Tay',
    'XeDien': 'Xe Điện'
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" className="font-manrope" >
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết mẫu xe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="input-wrapper">
              <label className={labelClasses}>Tên mẫu</label>
              <Form.Control
                type="text"
                name="modelName"
                value={modelData.modelName}
                readOnly
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Dung tích xi lanh</label>
              <Form.Control
                type="text"
                name="cylinderCapacity"
                value={modelData.cylinderCapacity}
                readOnly
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Nhiên liệu tiêu hao</label>
              <Form.Control
                type="text"
                name="fuelConsumption"
                value={modelData.fuelConsumption}
                readOnly
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Loại nhiên liệu</label>
              <Form.Control
                type="text"
                name="fuelType"
                value={modelData.fuelType}
                readOnly
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Loại xe</label>
              <Form.Control
                type="text"
                name="modelType"
                value={modelTypeMap[modelData.modelType]}
                readOnly
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Thương hiệu</label>
            <Form.Control
              type="text"
              name="brandName"
              value={modelData.brand?.brandName}
              readOnly
              className={inputClasses}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={() => setShowModal(false)} className="px-4 py-2 hover:bg-red-700 bg-red-600 text-white rounded-lg mr-2 transition hover:scale-105">
          Đóng
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewModel;
