import React, { useState } from 'react';
import MapComponent from './MapComponent'; // Assume this is your MapComponent from earlier

const MapModal = ({ isOpen, onClose, startLocation, endLocation }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-lg font-bold mb-4">Lộ trình địa điểm giao nhận xe</h2>
        <MapComponent startLocal={startLocation} endLocal={endLocation} />
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default MapModal;