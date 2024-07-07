import React, { useState } from 'react';
import axios from 'axios';

const sharedInputClasses = "w-full border-zinc-300 rounded-md shadow-sm";
const sharedLabelClasses = "block text-sm font-medium text-zinc-700";

const CreateVoucherModal = () => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        voucherType: 'PERCENTAGE',
        discountPercent: '',
        maxDiscountMoney: '',
        discountMoney: '',
        startDate: '',
        expirationDate: '',
        quantity: '',
        assignToAllUser: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle special conditions based on voucherType selection
        if (name === 'voucherType') {
            if (value === 'PERCENTAGE') {
                setFormData({
                    ...formData,
                    [name]: value,
                    discountMoney: '', // Reset discountMoney if voucherType is percentage
                });
            } else if (value === 'FIXED_MONEY') {
                setFormData({
                    ...formData,
                    [name]: value,
                    discountPercent: '', // Reset discountPercent if voucherType is fixed money
                    maxDiscountMoney: '' // Reset maxDiscountMoney if voucherType is fixed money
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            const response = await axios.post('http://localhost:8080/api/admin/discounts/addDiscount', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Response:', response.data);
            console.log('Voucher created successfully!');
            setFormData({
                name: '',
                code: '',
                description: '',
                voucherType: 'PERCENTAGE',
                discountPercent: '',
                maxDiscountMoney: '',
                discountMoney: '',
                startDate: '',
                expirationDate: '',
                quantity: '',
                assignToAllUser: false
            });
        } catch (error) {
            console.error('Error creating voucher:', error);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Create Voucher</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className={sharedLabelClasses}>Name</label>
                        <input type="text" id="name" name="name" className={sharedInputClasses} value={formData.name} onChange={handleInputChange} required />
                    </div>
                    {/* Code */}
                    <div>
                        <label htmlFor="code" className={sharedLabelClasses}>Code</label>
                        <input type="text" id="code" name="code" className={sharedInputClasses} value={formData.code} onChange={handleInputChange} required />
                    </div>
                    {/* Description */}
                    <div>
                        <label htmlFor="description" className={sharedLabelClasses}>Description</label>
                        <textarea id="description" name="description" rows="3" className={sharedInputClasses} value={formData.description} onChange={handleInputChange}></textarea>
                    </div>
                    {/* Voucher Type */}
                    <div>
                        <label htmlFor="voucher-type" className={sharedLabelClasses}>Voucher Type</label>
                        <select id="voucher-type" name="voucherType" className={sharedInputClasses} value={formData.voucherType} onChange={handleInputChange}>
                            <option value="PERCENTAGE">Percentage</option>
                            <option value="FIXED_MONEY">Fixed Amount</option>
                        </select>
                    </div>
                    {/* Discount Percent */}
                    {formData.voucherType === 'PERCENTAGE' && (
                        <div>
                            <label htmlFor="discount-percent" className={sharedLabelClasses}>Discount Percent</label>
                            <input type="number" id="discount-percent" name="discountPercent" className={sharedInputClasses} value={formData.discountPercent} onChange={handleInputChange} />
                        </div>
                    )}
                    {/* Max Discount Money */}
                    {formData.voucherType === 'PERCENTAGE' && (
                        <div>
                            <label htmlFor="max-discount-money" className={sharedLabelClasses}>Max Discount Money</label>
                            <input type="number" id="max-discount-money" name="maxDiscountMoney" className={sharedInputClasses} value={formData.maxDiscountMoney} onChange={handleInputChange} />
                        </div>
                    )}
                    {/* Discount Money */}
                    {formData.voucherType === 'FIXED_MONEY' && (
                        <div>
                            <label htmlFor="discount-money" className={sharedLabelClasses}>Discount Money</label>
                            <input type="number" id="discount-money" name="discountMoney" className={sharedInputClasses} value={formData.discountMoney} onChange={handleInputChange} />
                        </div>
                    )}
                    {/* Start Date */}
                    <div>
                        <label htmlFor="start-date" className={sharedLabelClasses}>Start Date</label>
                        <input type="date" id="start-date" name="startDate" className={sharedInputClasses} value={formData.startDate} onChange={handleInputChange} />
                    </div>
                    {/* Expiration Date */}
                    <div>
                        <label htmlFor="expiration-date" className={sharedLabelClasses}>Expiration Date</label>
                        <input type="date" id="expiration-date" name="expirationDate" className={sharedInputClasses} value={formData.expirationDate} onChange={handleInputChange} />
                    </div>
                    {/* Quantity */}
                    <div>
                        <label htmlFor="quantity" className={sharedLabelClasses}>Quantity</label>
                        <input type="number" id="quantity" name="quantity" className={sharedInputClasses} value={formData.quantity} onChange={handleInputChange} />
                    </div>
                    {/* Assign to All Users */}
                    <div className="flex items-center">
                        <input type="checkbox" id="assign-all-users" name="assignToAllUser" className="h-4 w-4 text-blue-500 border-zinc-300 rounded focus:ring-blue-500" checked={formData.assignToAllUsers} onChange={handleInputChange} />
                        <label htmlFor="assign-all-users" className="ml-2 block text-sm font-medium text-zinc-700">Assign to all users</label>
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Create Voucher</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateVoucherModal;
