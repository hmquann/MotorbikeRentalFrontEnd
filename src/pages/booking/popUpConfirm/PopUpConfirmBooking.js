import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

const PopUpConfirmBooking = ({
  motorbikeDetails,
  bookingDetails,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Xác nhận đặt xe</h2>
          <button className="text-muted-foreground" onClick={onCancel}>
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
          </button>
        </div>
        <div className="flex">
          <img
            src={motorbikeDetails.motorbikeImages[0].url}
            alt={motorbikeDetails.model.modelName}
            className="w-1/3 rounded-lg mb-4"
          />
          <div className="w-2/3 pl-4">
            <p className="mb-2 text-2xl">
              <strong>
                {motorbikeDetails.model.modelName +
                  " " +
                  motorbikeDetails.yearOfManufacture}
              </strong>
            </p>
            <p className="mb-2">
              <strong>Ngày giờ bắt đầu:</strong>{" "}
              {dayjs(bookingDetails.startDate).format("HH:mm, DD/MM/YYYY ")}
            </p>
            <p className="mb-2">
              <strong>Ngày giờ kết thúc:</strong>{" "}
              {dayjs(bookingDetails.endDate).format("HH:mm, DD/MM/YYYY ")}
            </p>
            <p className="mb-2">
              <strong>Địa điểm nhận xe:</strong>{" "}
              {bookingDetails.receiveLocation}
            </p>
            <p className="mb-2">
              <strong>Tổng tiền:</strong>{" "}
              {bookingDetails.totalPrice.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
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

export default PopUpConfirmBooking;
