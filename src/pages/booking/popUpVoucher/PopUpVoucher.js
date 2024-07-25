import { faExclamationCircle, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const PopUpVoucher = ({ onCloseVoucher, discounts, discountValue }) => {
  const [value, setValue] = useState();
  const calculateDaysLeft = (expirationDate) => {
    const today = new Date();
    const expiryDate = new Date(expirationDate);
    const timeDifference = expiryDate - today;
    const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysLeft;
  };
  const formatDiscountMoney = (discountMoney) => {
    if (typeof discountMoney === "number") {
      return discountMoney.toLocaleString("vi-VN") + "đ";
    }
    return discountMoney; // giữ nguyên nếu không phải là số
  };

  const handleValue = (value) => {
    discountValue(value);
    onCloseVoucher();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-card rounded-lg shadow-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
            Mã khuyến mãi
          </h2>
          <button
            onClick={onCloseVoucher}
            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            &times;
          </button>
        </div>
        <input
          type="text"
          placeholder="Nhập mã khuyến mãi"
          className="border border-zinc-300 dark:border-zinc-600 rounded-md p-2 w-full mb-4"
        />
        {discounts
          .filter((discount) => calculateDaysLeft(discount.expirationDate) > 0)
          .map((discount) => (
            <div key={discount.id} className="mb-1">
              <div className="flex justify-between p-2">
                <div>
                  <span className="text-zinc-800 dark:text-white font-semibold">
                    {discount.name}
                  </span>
                  <br />
                  <span className="text-zinc-800 dark:text-white text-xs">
                    Giảm {formatDiscountMoney(discount.discountMoney)}
                  </span>
                  <p className="text-orange-500 dark:text-zinc-500 text-sm ">
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                    ></FontAwesomeIcon>{" "}
                    Hết hạn sau {calculateDaysLeft(discount.expirationDate)}{" "}
                    ngày
                  </p>
                </div>
                <div>
                  <button
                    className="bg-green-500 text-white rounded-md px-3 py-2"
                    onClick={() => handleValue(discount)}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PopUpVoucher;
