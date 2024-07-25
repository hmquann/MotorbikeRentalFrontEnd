import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";


const DiscountDetailModal = ({fetchVoucher, showModalDetail, setShowModalDetail, voucher, isDetailView }) => {
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
    quantity: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorsMess, setErrorsMess] = useState("");

  useEffect(() => {
    if (voucher) {
      setFormData({ ...voucher });
      setIsEditing(false); 
    }
  }, [voucher]);

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
    } else if (new Date(formData.startDate) > new Date(formData.expirationDate)) {
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
      } else if (formData.discountPercent < 0 || formData.discountPercent > 100) {
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
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDetailView && !isEditing) {
      setShowModalDetail(false);
      return;
    }
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    if (isEditing) {
        const response = await axios.patch(`http://localhost:8080/api/discounts/updateDiscount/${voucher.id}`, formData)
        .then((response) =>{
          fetchVoucher();
          setIsEditing(false); 
        })
       .catch ((error) => {
        if (error.response.status === 400) {
          setErrorsMess("Khuyến mãi đẫ tồn tại");
          setTimeout(() => {
            setErrorsMess("");
          }, 3000);
        }
      });
    } else { 
    setShowModalDetail(false);
    }
  };
  useEffect(() => {
    if (voucher) {
      setErrorsMess(""); 
      setErrors({});
    }
  }, [voucher]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    if (isEditing) {
      setIsEditing(false); 
    } else {
      setShowModalDetail(false);
    }
  };

  if (!showModalDetail) return null;

  return (
    <Modal show={showModalDetail} onHide={() => setShowModalDetail(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title>Chi tiết khuyến mãi</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <form className="space-y-4 p-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-wrapper">
            <FloatingLabel controlId="floatingName" label="Tên">
            <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isDetailView && !isEditing} 
                required
                isInvalid={!!errors.name}
              />
              </FloatingLabel>
                {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </div>
            <div>
            <FloatingLabel controlId="floatingCode" label="Code">
              <Form.Control
                type="text"
                placeholder="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                disabled={isDetailView && !isEditing} 
                isInvalid={!!errors.code}
                required
              />
                 </FloatingLabel>
                 {errors.code && (
                <span className="text-red-500 text-sm">{errors.code}</span>
              )}
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
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
              disabled={isDetailView && !isEditing} 
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
                disabled={isDetailView && !isEditing} 
              >
                <option value="PERCENTAGE">Phần trăm</option>
                <option value="FIXED_MONEY">Khoản tiền cố định</option>
              </Form.Select>
              {errors.voucherType && (
                <p className="text-red-500 text-sm">{errors.voucherType}</p>
              )}
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
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleChange}
                  disabled={isDetailView && !isEditing} 
                  min="1"
                  max="100"
                  isInvalid={!!errors.discountPercent}
                />
                {errors.discountPercent && (
                  <p className="text-red-500 text-sm">{errors.discountPercent}</p>
                )}
                </FloatingLabel>
              </div>
            )}
            {formData.voucherType === "PERCENTAGE" && (
              <div>
               <FloatingLabel
                  controlId="floatingMaxDiscountMoney"
                  label="Số tiền khuyến mãi"
                >
                  <Form.Control
                  type="number"
                  name="maxDiscountMoney"
                  value={formData.maxDiscountMoney}
                  onChange={handleChange}
                  disabled={isDetailView && !isEditing} 
                  isInvalid={!!errors.maxDiscountMoney}
                />
                 {errors.maxDiscountMoney && (
                  <p className="text-red-500 text-sm">{errors.maxDiscountMoney}</p>
                )}
                </FloatingLabel>
              </div>
            )}
            {formData.voucherType === "FIXED_MONEY" && (
              <div>
                 <FloatingLabel
                  controlId="floatingDiscountMoney"
                  label="Số tiền khuyến mãi"
                >
                <Form.Control
                  type="number"
                  name="discountMoney"
                  value={formData.discountMoney}
                  onChange={handleChange}
                  disabled={isDetailView && !isEditing} 
                  isInvalid={!!errors.discountMoney}
                />
                 {errors.discountMoney && (
                  <p className="text-red-500 text-sm">{errors.discountMoney}</p>
                )}
                </FloatingLabel>
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
                disabled={isDetailView && !isEditing} 
                isInvalid={!!errors.startDate}
              />
               {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
              </FloatingLabel>
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
                disabled={isDetailView && !isEditing} 
                isInvalid={!!errors.expirationDate}
              />
               {errors.expirationDate && (
                <p className="text-red-500 text-sm">{errors.expirationDate}</p>
              )}
              </FloatingLabel>
            </div>
          </div>
          <div>
          <FloatingLabel controlId="floatingQuantity" label="Số lượng">
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              disabled={isDetailView && !isEditing} 
              isInvalid={!!errors.quantity}
              min="1"
            />
             {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
              </FloatingLabel>
          </div>
          {errorsMess && (
            <div className="text-red-500 mb-2 font-bold text-center">
              {errorsMess}
            </div>
          )}
        
        </form>
        </Modal.Body>
        <Modal.Footer>
        <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="hover:bg-red-700 bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Đóng
            </button>
            {isDetailView && !isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="hover:bg-yellow-600 bg-yellow-500 text-white px-4 py-2 rounded-lg"
              >
                Chỉnh sửa
              </button>
            )}
            {!isDetailView || isEditing ? (
              <button
                type="submit"
                onClick={handleSubmit}
                className="hover:bg-blue-700 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Lưu
              </button>
            ) : null}
          </div>
        </Modal.Footer>
        </Modal>

  );
};

export default DiscountDetailModal;
