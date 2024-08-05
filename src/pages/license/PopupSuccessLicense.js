import React from 'react';
import { Modal } from 'react-bootstrap';

const PopupSuccessLicense = ({ show, onHide, message }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <div className="p-8 rounded bg-gray-50 font-[sans-serif]">
        <h2 className="text-gray-800 text-center text-2xl font-bold">
          Thành công
        </h2>
        <p className="text-gray-800 text-sm mt-4 text-center">
          {message}
        </p>
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={onHide}
            className="py-2 px-4 text-sm tracking-wide rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none"
          >
            OK
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PopupSuccessLicense;
