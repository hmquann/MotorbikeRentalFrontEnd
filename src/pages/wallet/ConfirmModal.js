import React from 'react';

const modalContainerClasses = "fixed inset-0 flex items-center justify-center bg-zinc-500 bg-opacity-50 z-50";
const modalContentClasses = "bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg mx-auto";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={modalContainerClasses}>
      <div className={modalContentClasses}>
        <p className="text-center text-zinc-900 dark:text-zinc-100">{message}</p>
        <div className="flex mt-4 justify-end">
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="px-4 py-2 ml-2 bg-green-500 text-white rounded hover:bg-green-700"
            onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
