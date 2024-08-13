import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const containerClasses = "max-w-sm mx-auto p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-lg font-manrope";
const titleClasses = "text-center text-md font-semibold text-zinc-900 dark:text-zinc-100";
const textClasses = "text-center text-zinc-700 dark:text-zinc-300 mt-2";
const inputClasses = "w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md";
const buttonContainerClasses = "flex mt-4 border border-zinc-300 dark:border-zinc-700 rounded-md";
const buttonClasses = " p-2 border-r border-zinc-300 dark:border-zinc-700";
const buttonLastClasses = "w-full p-2";

const Withdraw = ({balance, onClose, onConfirm, setError }) => {
  const [amount, setAmount] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("");
  const [localError, setLocalError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setLocalError("Hãy nhập số tiền bạn muốn rút.");
      return;
    }

    if (parseFloat(amount) > balance) {
      setLocalError("Số dư không đủ, vui lòng nhập lại.");
      return;
    }
    setShowConfirmModal(true)

  };
  const handleWithdrawConfirm = async () =>{
    setIsLoading(true)
    setShowConfirmModal(false)
    setTimeout(async () => {
      try {
        await onConfirm(amount);  
        setIsLoading(false);      
        onClose();               
      } catch (error) {
        setIsLoading(false);      
        setError("Failed to initiate withdrawal.");  
      }
    }, 2000);  // Giả lập loading trong 2 giây
  }
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); 
    setAmount(value);

    if (value === "") {
      setFormattedAmount(""); 
    } else {
      const numberValue = parseFloat(value);
      setFormattedAmount(numberValue.toLocaleString());
    }

    setLocalError(""); 
  };

  return (
    <div className={containerClasses}>
      {/* <h2 className={titleClasses}>Rút tiền</h2> */}
      <p className={textClasses}>
        Số dư của bạn là {balance.toLocaleString()} VND. Hãy nhập số tiền bạn muốn rút.
      </p>
      <div className="mt-4">
        <input
          type="text"
          className={inputClasses}
          placeholder="Nhập số tiền"
          value={formattedAmount}
          onChange={handleChange}
        />
      </div>
      {localError && <div className="text-red-500 mt-2">{localError}</div>}
      <div className={buttonContainerClasses}>
        {/* <button 
          className={`${buttonClasses} hover:bg-red-500 text-zinc-700 dark:text-zinc-300 transition hover:scale-105`} 
          onClick={onClose}>
          Hủy
        </button> */}
        <button 
          className={`${buttonLastClasses} hover:bg-green-500 text-blue-600 dark:text-blue-400 transition hover:scale-105`} 
          onClick={handleConfirm}>
          Rút
        </button>
      </div>
      {isLoading && (
        <div className="mt-4 text-center">
          <div className="loader" />
          <p className="text-orange-700 dark:text-zinc-300">Đang xử lý...</p>
        </div>
      )}
    <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc muốn rút {formattedAmount} VND?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className='transition hover:scale-105' onClick={() => setShowConfirmModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" className='transition hover:scale-105' onClick={handleWithdrawConfirm}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Withdraw;
