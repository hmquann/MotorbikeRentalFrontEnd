import React, { useEffect, useState } from "react";
import axios from "axios";

const inputClasses =
  "mt-1 block w-full p-2 border border-zinc-300 rounded-md dark:text-green-800 font-medium";
const labelClasses = "block text-md font-bold text-slate-500 dark:text-neutral-300";

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
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.code) newErrors.code = "Code is required";
    if (!formData.voucherType) newErrors.voucherType = "Voucher Type is required";
    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.expirationDate) newErrors.expirationDate = "Expiration Date is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (formData.voucherType === "PERCENTAGE" && !formData.discountPercent) newErrors.discountPercent = "Discount Percent is required";
    if (formData.voucherType === "FIXED_MONEY" && !formData.discountMoney) newErrors.discountMoney = "Discount Money is required";
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
          setErrorsMess("Voucher code has been existed");
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="form-container">
        <div className="bg-zinc-300 text-slate-600 p-2 rounded-t-lg">
          <h2 className="text-lg font-bold">{isDetailView ? "Voucher Details" : "Add Discount"}</h2>
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
                disabled={isDetailView && !isEditing} 
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
                disabled={isDetailView && !isEditing} 
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
              disabled={isDetailView && !isEditing} 
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
                disabled={isDetailView && !isEditing} 
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
                  disabled={isDetailView && !isEditing} 
                  min="1"
                  max="100"
                />
                {errors.discountPercent && (
                  <p className="text-red-500 text-sm">{errors.discountPercent}</p>
                )}
              </div>
            )}
            {formData.voucherType === "PERCENTAGE" && (
              <div>
                <label className={labelClasses}>Max Discount Money (VND) </label>
                <input
                  type="number"
                  name="maxDiscountMoney"
                  value={formData.maxDiscountMoney}
                  onChange={handleChange}
                  className={inputClasses}
                  disabled={isDetailView && !isEditing} 
                />
                 {errors.maxDiscountMoney && (
                  <p className="text-red-500 text-sm">{errors.maxDiscountMoney}</p>
                )}
              </div>
            )}
            {formData.voucherType === "FIXED_MONEY" && (
              <div>
                <label className={labelClasses}>Discount Money (VND) </label>
                <input
                  type="number"
                  name="discountMoney"
                  value={formData.discountMoney}
                  onChange={handleChange}
                  className={inputClasses}
                  disabled={isDetailView && !isEditing} 
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
                disabled={isDetailView && !isEditing} 
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
                disabled={isDetailView && !isEditing} 
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
              disabled={isDetailView && !isEditing} 
              min="1"
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
              onClick={handleClose}
              className="hover:bg-red-700 bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
            {isDetailView && !isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="hover:bg-yellow-600 bg-yellow-500 text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>
            )}
            {!isDetailView || isEditing ? (
              <button
                type="submit"
                className="hover:bg-blue-700 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountDetailModal;