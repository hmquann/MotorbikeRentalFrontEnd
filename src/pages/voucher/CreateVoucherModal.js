import React, { useState } from "react";
import axios from "axios";
import './CreateVoucher.css'

const inputClasses =
  "mt-1 block w-full p-2 border border-zinc-300 rounded-md dark:text-green-800 font-medium";
const labelClasses = "block text-md font-bold text-slate-500 dark:text-neutral-300";

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
    quantity: ""
  });
  const [errors, setErrors] = useState({});
  const [errorsMess, setErrorsMess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if (!value.trim()) {
      newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.code) newErrors.code = "Code is required";
    if (!formData.voucherType) newErrors.voucherType = "Voucher Type is required";
    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.expirationDate) newErrors.expirationDate = "Expiration Date is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (formData.voucherType === "PERCENTAGE") {
      if (formData.voucherType === "PERCENTAGE" && !formData.discountMoney){
        newErrors.discountPercent = "Discount percent is required"
      }
      const discountPercent = parseInt(formData.discountPercent);
      if (isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
        newErrors.discountPercent = "Discount Percent must be between 0 and 100";
      }
    }
    if (formData.voucherType === "PERCENTAGE" && !formData.maxDiscountMoney) newErrors.maxDiscountMoney = "Max Discount Money is required";
    if (formData.voucherType === "FIXED_MONEY" && !formData.discountMoney) newErrors.discountMoney = "Discount Money is required";
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
      .post("http://localhost:8080/api/discounts/addDiscount", formData,{
        headers : {
          Authorization :  `Bearer ${localStorage.getItem("token")}`
        }
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
          quantity: ""
        });
        setErrors({});
        setShowModal(false);
        onDiscountCreated();
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setErrorsMess("Discount has been existed");
        }
        console.error("There was an error creating the discount!", error);
      });
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="form-container">
        <div className="bg-zinc-300 text-slate-600 p-2 rounded-t-lg">
          <h2 className="text-lg font-bold">Discount Details</h2>
        </div>
        <form className="space-y-4 p-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-wrapper">
              <label className={labelClasses}>Name</label>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClasses}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>
            <div>
              <label className={labelClasses}>Code</label>
              <input
                type="text"
                placeholder="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={inputClasses}
              />
              {errors.code && (
                <span className="text-red-500 text-sm">{errors.code}</span>
              )}
            </div>
          </div>
          <div>
            <label className={labelClasses}>Description</label>
            <textarea
              placeholder="Description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className={inputClasses}
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Voucher Type</label>
              <select
                name="voucherType"
                value={formData.voucherType}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_MONEY">Fixed Amount</option>
              </select>
              {errors.voucherType && (
                <p className="text-red-500 text-sm">{errors.voucherType}</p>
              )}
            </div>
            {formData.voucherType === "PERCENTAGE" && (
              <div>
                <label className={labelClasses}>Discount Percent</label>
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleChange}
                  className={inputClasses}
                />
                {errors.discountPercent && (
                  <p className="text-red-500 text-sm">{errors.discountPercent}</p>
                )}
              </div>
            )}
            {formData.voucherType === "PERCENTAGE" && (
              <div>
                <label className={labelClasses}>Max Discount Money</label>
                <input
                  type="number"
                  name="maxDiscountMoney"
                  value={formData.maxDiscountMoney}
                  onChange={handleChange}
                  className={inputClasses}
                />
                {errors.maxDiscountMoney && (
                  <p className="text-red-500 text-sm">{errors.maxDiscountMoney}</p>
                )}
              </div>
            )}
            {formData.voucherType === "FIXED_MONEY" && (
              <div>
                <label className={labelClasses}>Discount Money</label>
                <input
                  type="number"
                  name="discountMoney"
                  value={formData.discountMoney}
                  onChange={handleChange}
                  className={inputClasses}
                />
                {errors.discountMoney && (
                  <p className="text-red-500 text-sm">{errors.discountMoney}</p>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={inputClasses}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className={labelClasses}>Expiration Date</label>
              <input
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                className={inputClasses}
              />
              {errors.expirationDate && (
                <p className="text-red-500 text-sm">{errors.expirationDate}</p>
              )}
            </div>
          </div>
          <div>
            <label className={labelClasses}>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={inputClasses}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity}</p>
            )}
          </div>
          {errorsMess && (
            <div className="text-red-500 mb-2 font-bold text-center">
              {errorsMess}
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="hover:bg-red-700 bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
            <button
              type="submit"
              className="hover:bg-blue-700 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVoucherModal;
