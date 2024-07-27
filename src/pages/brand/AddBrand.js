import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const AddBrand = ({ showModal, setShowModal, onBrandCreated }) => {
  const [brandName, setBrandName] = useState("");
  const [brandOrigin, setBrandOrigin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleModalClose();
      } else if (e.key === "Enter") {
        handleCreateBrand();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [brandName, brandOrigin]);

  const handleModalClose = () => {
    setShowModal(false);
    setBrandName("");
    setBrandOrigin("");
    setError("");
  };

  const handleCreateBrand = async () => {
    if (!brandName.trim() || !brandOrigin.trim()) {
      setError("Hãy điền đủ thông tin.");
      return;
    }

    try {
      const response = await axios.post(
        "https://rentalmotorbikewebapp.azurewebsites.net/api/brand/createBrand",
        {
          brandName,
          origin: brandOrigin,
        }
      );
      if (response.status === 200) {
        onBrandCreated();
        handleModalClose();
      }
    } catch (error) {
      setError("Thương hiệu đã tồn tại");
    }
  };

  return (
    <Modal show={showModal} onHide={handleModalClose} backdrop="static" keyboard={false}>
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
              value={brandOrigin}
              onChange={(e) => setBrandOrigin(e.target.value)}
            />
          </FloatingLabel>
          {error && <div className="text-red-500 mb-2 font-bold text-center">{error}</div>}
        </form>
      </Modal.Body>
      <Modal.Footer>
      <button  className="px-4 py-2 hover:bg-red-700 bg-red-600 text-white rounded-lg mr-2" onClick={handleModalClose}>
          Đóng
        </button>
        <button  className="px-4 py-2 hover:bg-blue-700 bg-blue-600 text-white rounded-lg" onClick={handleCreateBrand}>
          Lưu
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBrand;
