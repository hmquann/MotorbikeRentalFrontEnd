import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const EditBrand = ({
  showModal,
  setShowModal,
  brandToEdit,
  onBrandUpdated,
}) => {
  const [formData, setFormData] = useState({
    brandName: "",
    origin: "",
  });

  const [errors, setErrors] = useState({
    brandName: "",
    origin: "",
  });

  useEffect(() => {
    if (brandToEdit) {
      setFormData({
        brandName: brandToEdit.brandName || "",
        origin: brandToEdit.origin || "",
      });
      setErrors({
        brandName: "",
        origin: "",
      });
    }
  }, [brandToEdit]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.brandName.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        brandName: "Vui lòng điền tên thương hiệu",
      }));
      return;
    }
    if (!formData.origin.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        origin: "Vui lòng điền xuất xứ",
      }));
      return;
    }
    if (errors.brandName || errors.origin) {
      return; 
    }

    try {
      const updatedBrand = {
        ...brandToEdit,
        brandName: formData.brandName,
        origin: formData.origin,
      };

      await axios.patch(
        `http://localhost:8080/api/brand/updateBrand/${brandToEdit.brandId}`,
        updatedBrand
      );

      onBrandUpdated();
      setShowModal(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            form: "Thương hiệu đã tồn tại",
          }));
        }
      } else if (error.request) {
        console.error("Error connecting to server:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <Modal show={showModal} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
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
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              isInvalid={!!errors.origin}
            />
            <Form.Control.Feedback type="invalid">
              {errors.origin}
            </Form.Control.Feedback>
          </FloatingLabel>
          {errors.form && (
            <div className="text-red-500 mb-2 font-bold text-center">
              {errors.form}
            </div>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 hover:bg-red-700 bg-red-600 text-white rounded-lg mr-2"
        >
          Hủy
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 hover:bg-blue-700 bg-blue-600 text-white rounded-lg"
        >
          Lưu
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditBrand;
