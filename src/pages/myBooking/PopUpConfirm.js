import React from "react";

const PopUpConfirm = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="mb-4 text-xl">{message}</p>
        <div className="flex justify-center space-x-4">
        <button
            className="text-destructive-foreground bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-transform duration-300 transform hover:scale-105"
            onClick={onCancel}
          >
            Hủy bỏ
          </button>
          <button
            className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-transform duration-300 transform hover:scale-105"
            style={{ backgroundColor: "#22C55E" }}
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpConfirm;
