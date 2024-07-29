import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const AddBrand = ({ showModal, setShowModal, onBrandCreated }) => {
  const [formData, setFormData] = useState({
    brandName: "",
    brandOrigin: "",
  });

  const [errors, setErrors] = useState({
    brandName: "",
    brandOrigin: "",
  });


  const handleModalClose = () => {
    setShowModal(false);
    setFormData({
      brandName: "",
      brandOrigin: "",
    });
    setErrors({
      brandName: "",
      brandOrigin: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/;

    if (!regex.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Không được chứa ký tự đặc biệt.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCreateBrand = async () => {
    if (!formData.brandName.trim() || !formData.brandOrigin.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: "Hãy điền đủ thông tin.",
      }));
      return;
    }

    if (errors.brandName || errors.brandOrigin) {
      return; 
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/brand/createBrand",
        {
          brandName: formData.brandName,
          origin: formData.brandOrigin,
        }
      );
      if (response.status === 200) {
        onBrandCreated();
        handleModalClose();
      }
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: "Thương hiệu đã tồn tại",
      }));
    }
  };

  return (
    <Modal show={showModal} onHide={handleModalClose} backdrop="static" >
      <Modal.Header closeButton>
        <Modal.Title>Thêm thương hiệu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <FloatingLabel
            controlId="floatingBrandName"
            label="Tên thương hiệu"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Tên thương hiệu"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              isInvalid={!!errors.brandName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.brandName}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingBrandOrigin"
            label="Xuất xứ"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Xuất xứ"
              name="brandOrigin"
              value={formData.brandOrigin}
              onChange={handleChange}
              isInvalid={!!errors.brandOrigin}
            />
            <Form.Control.Feedback type="invalid">
              {errors.brandOrigin}
            </Form.Control.Feedback>
          </FloatingLabel>
          {errors.form && <div className="text-red-500 mb-2 font-bold text-center">{errors.form}</div>}
        </form>
      </Modal.Body>
      <Modal.Footer>
      <button  className="px-4 py-2 hover:bg-red-700 bg-red-600 text-white rounded-lg mr-2 transition hover:scale-105" onClick={handleModalClose}>
          Đóng
        </button>
        <button  className="px-4 py-2 hover:bg-blue-700 bg-blue-600 text-white rounded-lg transition hover:scale-105" onClick={handleCreateBrand}>

          Lưu
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBrand;
