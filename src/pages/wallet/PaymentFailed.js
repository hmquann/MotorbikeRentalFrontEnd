import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  const handleBackToWallet = () => {
    navigate("/menu/wallet");
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-9xl mx-aut p-32 bg-slate-100 dark:bg-800 overflow-hidden font-manrope">
      <div className="w-32 h-32 mb-4 flex items-center justify-center bg-red-500 dark:bg-red-400 text-white text-4xl font-bold rounded-full">
        ✗
      </div>
      <h1 className="text-3xl font-bold text-red-500 dark:text-red-400 mb-2">
        Giao dịch thất bại
      </h1>
      <p className="text-lg text-zinc-600 dark:text-300 text-center max-w-md">
      Giao dịch của bạn đã thất bại. Vui lòng thử lại sau
      </p>
      <button
        id="backBtn"
        onClick={handleBackToWallet}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        Quay lại Ví
      </button>
    </div>
  );
};

export default PaymentFailed;
