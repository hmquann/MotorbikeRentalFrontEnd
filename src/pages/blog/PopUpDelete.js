import React from 'react';

const PopUpDelete = ({ onDelete, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg mb-4">Bạn có chắc chắn muốn xóa blog này?</h2>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
            onClick={onDelete}
          >
            Xóa
          </button>
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
            onClick={onCancel}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpDelete;