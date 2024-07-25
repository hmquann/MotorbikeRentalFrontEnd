import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const EditBrand = ({
  showModal,
  setShowModal,
  brandToEdit,
  onBrandUpdated,
}) => {
  const [brandName, setBrandName] = useState("");
  const [origin, setOrigin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (brandToEdit) {
      setBrandName(brandToEdit.brandName || "");
      setOrigin(brandToEdit.origin || "");
    }
  }, [brandToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!brandName.trim()) {
        setError("Vui lòng điền tên thương hiệu");
        return;
      }
      if (!origin.trim()) {
        setError("Vui lòng điền xuất xứ");
        return;
      }
      const updatedBrand = {
        ...brandToEdit,
        brandName,
        origin,
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
          setError("Thương hiệu đã tồn tại");
          console.log(error.response);
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
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingBrandOrigin"
            label="Xuất xứ"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Xuất xứ"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </FloatingLabel>
          {error && (
            <div className="text-red-500 mb-2 font-bold text-center">
              {error}
            </div>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          onClick={() => setShowModal(false)}
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
