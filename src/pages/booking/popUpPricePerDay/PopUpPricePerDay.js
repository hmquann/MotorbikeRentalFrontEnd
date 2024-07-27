import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const PopUpPricePerDay = ({ message, onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      style={{ alignItems: "baseline" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-3xl mt-12">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-center w-full">
            Đơn giá thuê
          </h2>
          <button
            className="text-muted hover:text-muted-foreground"
            onClick={onClose}
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </div>
        <div className="mt-4">
          <ul className="list-disc list-inside text-muted-foreground text-xl">
            <li>
              Giá thuê xe được tính trọn theo ngày, thời gian thuê xe ít hơn 24
              tiếng sẽ được tính trọn 1 ngày.
            </li>
            <br></br>
            <li>
              Giá thuê không bao gồm tiền xăng / tiền sạc pin. Khi kết thúc
              chuyến đi bạn vui lòng đổ xăng, sạc pin về lại mức ban đầu như khi
              nhận xe, hoặc thanh toán lại chi phí xăng xe sạc pin cho chủ xe.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PopUpPricePerDay;
