import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleBackToWallet = () => {
    navigate("/menu/wallet");
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-9xl p-32 bg-zinc-100 dark:bg-800 font-manrope">
      <div className="w-32 h-32 mb-4 flex items-center justify-center bg-green-500 dark:bg-green-400 text-white text-4xl font-bold rounded-full">
        ✓
      </div>
      <h1 className="text-3xl font-bold text-green-500 dark:text-green-400 mb-2">
        Giao dịch thành công
      </h1>
      <p className="text-lg text-zinc-600 dark:text-00 text-center max-w-md">
        Bạn đã thực hiện giao dịch thành công. Cảm ơn vì đã sử dụng dịch vụ
      </p>
      <button
        id="backBtn"
        onClick={handleBackToWallet}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Quay lại Ví
      </button>
    </div>
  );
};

export default PaymentSuccess;
