import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateVoucher.css";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const CreateVoucherModal = ({ showModal, setShowModal, onDiscountCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    voucherType: "PERCENTAGE",
    discountPercent: "",
    maxDiscountMoney: "",
    discountMoney: "",
    startDate: "",
    expirationDate: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});
  const [errorsMess, setErrorsMess] = useState("");

  useEffect(() => {
    if (formData.voucherType === "PERCENTAGE") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        discountMoney: "",
      }));
    } else if (formData.voucherType === "FIXED_MONEY") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        discountPercent: "",
        maxDiscountMoney: "",
      }));
    }
  }, [formData.voucherType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if (!value.trim()) {
      switch (name) {
        case "name":
          newErrors[name] = "Hãy điền tên";
          break;
        case "code":
          newErrors[name] = "Hãy điền mã khuyến mãi";
          break;
        case "discountPercent":
          newErrors[name] = "Hãy điền phần trăm khuyến mãi";
          break;
        case "maxDiscountMoney":
          newErrors[name] = "Hãy điền số tiền khuyến mãi";
          break;
        case "discountMoney":
          newErrors[name] = "Hãy điền số tiền khuyến mãi";
          break;
        case "startDate":
          newErrors[name] = "Hãy điền ngày bắt đầu";
          break;
        case "expirationDate":
          newErrors[name] = "Hãy điền ngày hết hạn";
          break;
        case "quantity":
          newErrors[name] = "Hãy điền số lượng";
          break;
        default:
          newErrors[name] = `Hãy điền ${name}`;
      }
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Hãy điền tên";
    }

    if (!formData.code) {
      newErrors.code = "Hãy điền mã code";
    }

    if (!formData.voucherType) {
      newErrors.voucherType = "Hãy chọn loại khuyến mãi";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Hãy chọn ngày bắt đầu";
    } else if (
      new Date(formData.startDate) > new Date(formData.expirationDate)
    ) {
      newErrors.startDate = "Ngày bắt đầu phải trước ngày hết hạn";
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = "Hãy chọn ngày hết hạn";
    }

    if (!formData.quantity) {
      newErrors.quantity = "Hãy điền số lượng";
    } else if (formData.quantity <= 0) {
      newErrors.quantity = "Số lưọng phải lớn hơn 0";
    }

    if (formData.voucherType === "PERCENTAGE") {
      if (!formData.discountPercent) {
        newErrors.discountPercent = "Hãy điền phần trăm khuyến mãi";
      } else if (
        formData.discountPercent < 0 ||
        formData.discountPercent > 100
      ) {
        newErrors.discountPercent = "Phần trăm khuyến mãi chỉ từ 0 đến 100";
      }
      if (!formData.maxDiscountMoney) {
        newErrors.maxDiscountMoney = "Hãy điền số tiền khuyến mãi";
      } else if (formData.maxDiscountMoney < 0) {
        newErrors.maxDiscountMoney = "Số tiền khuyến mãi phải lớn hơn 0";
      }
    }

    if (formData.voucherType === "FIXED_MONEY") {
      if (!formData.discountMoney) {
        newErrors.discountMoney = "Hãy điền số tiền khuyến mãi";
      } else if (formData.discountMoney < 0) {
        newErrors.discountMoney = "Số tiền khuyến mãi phải lớn hơn 0";
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    axios
      .post("http://localhost:8080/api/discounts/addDiscount", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setFormData({
          name: "",
          code: "",
          description: "",
          voucherType: "PERCENTAGE",
          discountPercent: "",
          maxDiscountMoney: "",
          discountMoney: "",
          startDate: "",
          expirationDate: "",
          quantity: "",
        });
        setErrors({});
        setShowModal(false);
        onDiscountCreated();
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setErrorsMess("Mã khuyến mãi đã tồn tại");
        }
        console.error("There was an error creating the discount!", error);
      });
  };

  if (!showModal) {
    return null;
  }

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm khuyến mãi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="space-y-4 p-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-wrapper">
              <FloatingLabel controlId="floatingName" label="Tên">
                <Form.Control
                  type="text"
                  placeholder="Tên"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.name}
                />
              </FloatingLabel>
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </div>
            <div>
              <FloatingLabel controlId="floatingCode" label="Code">
                <Form.Control
                  type="text"
                  placeholder="Code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  isInvalid={!!errors.code}
                />
              </FloatingLabel>
              {errors.code && (
                <span className="text-red-500 text-sm">{errors.code}</span>
              )}
            </div>
          </div>
          <div>
            <FloatingLabel controlId="floatingDescription" label="Mô tả">
              <Form.Control
                as="textarea"
                placeholder="Description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              />
            </FloatingLabel>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FloatingLabel
                controlId="floatingVoucherType"
                label="Loại khuyến mãi"
              >
                <Form.Select
                  name="voucherType"
                  value={formData.voucherType}
                  onChange={handleChange}
                >
                  <option value="PERCENTAGE">Phần trăm</option>
                  <option value="FIXED_MONEY">Khoản tiền cố định</option>
                </Form.Select>
              </FloatingLabel>
            </div>
            {formData.voucherType === "PERCENTAGE" && (
              <div>
                <FloatingLabel
                  controlId="floatingDiscountPercent"
                  label="Phần trăm khuyến mãi"
                >
                  <Form.Control
                    type="number"
                    placeholder="Discount Percent"
                    name="discountPercent"
                    value={formData.discountPercent}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    isInvalid={!!errors.discountPercent}
                  />
                </FloatingLabel>
                {errors.discountPercent && (
                  <span className="text-red-500 text-sm">
                    {errors.discountPercent}
                  </span>
                )}
              </div>
            )}
            {formData.voucherType === "PERCENTAGE" && (
              <div>
                <FloatingLabel
                  controlId="floatingMaxDiscountMoney"
                  label="Số tiền khuyến mãi"
                >
                  <Form.Control
                    placeholder="Max Discount Money"
                    type="number"
                    name="maxDiscountMoney"
                    value={formData.maxDiscountMoney}
                    onChange={handleChange}
                    isInvalid={!!errors.maxDiscountMoney}
                  />
                </FloatingLabel>
                {errors.maxDiscountMoney && (
                  <span className="text-red-500 text-sm">
                    {errors.maxDiscountMoney}
                  </span>
                )}
              </div>
            )}
            {formData.voucherType === "FIXED_MONEY" && (
              <div>
                <FloatingLabel
                  controlId="floatingDiscountMoney"
                  label="Số tiền khuyến mãi"
                >
                  <Form.Control
                    placeholder="Discount Money"
                    type="number"
                    name="discountMoney"
                    value={formData.discountMoney}
                    onChange={handleChange}
                    isInvalid={!!errors.discountMoney}
                  />
                </FloatingLabel>
                {errors.discountMoney && (
                  <span className="text-red-500 text-sm">
                    {errors.discountMoney}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FloatingLabel controlId="floatingStartDate" label="Ngày bắt đầu">
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  isInvalid={!!errors.startDate}
                />
              </FloatingLabel>
              {errors.startDate && (
                <span className="text-red-500 text-sm">{errors.startDate}</span>
              )}
            </div>
            <div>
              <FloatingLabel
                controlId="floatingExpirationDate"
                label="Ngày hết hạn"
              >
                <Form.Control
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  isInvalid={!!errors.expirationDate}
                />
              </FloatingLabel>
              {errors.expirationDate && (
                <span className="text-red-500 text-sm">
                  {errors.expirationDate}
                </span>
              )}
            </div>
          </div>
          <div>
            <FloatingLabel controlId="floatingQuantity" label="Số lượng">
              <Form.Control
                placeholder="Quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                isInvalid={!!errors.quantity}
              />
            </FloatingLabel>
            {errors.quantity && (
              <span className="text-red-500 text-sm">{errors.quantity}</span>
            )}
          </div>
          {errorsMess && (
            <div className="text-red-500 font-bold text-center">
              {errorsMess}
            </div>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="hover:bg-red-700 bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Đóng
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="hover:bg-blue-700 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Lưu
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateVoucherModal;
