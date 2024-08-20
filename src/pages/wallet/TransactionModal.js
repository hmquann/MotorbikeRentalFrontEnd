import React, { useState } from "react";
import { format } from "date-fns";

const TransactionList = ({ transactions }) => {
  const [showTransactions, setShowTransactions] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const startIndex = page * pageSize;
  const endIndex = (page + 1) * pageSize;
  const displayedTransactions = transactions.slice(startIndex, endIndex);

  if (transactions.length === 0) {
    return null;
  }

  const typeMap = {
    TOP_UP: "Nạp tiền",
    WITHDRAW: "Rút tiền",
    SUCCESS: "Thành công",
    FAILED: "Thất bại",
    PENDING: "Đang xử lý",
    DEPOSIT: "Đặt cọc",
    DEPOSIT_RECEIVE: "Nhận cọc xe",
    REFUND: "Hoàn tiền",
    REFUND_RECEIVE: "Nhận tiền hoàn",
    PUNISH: "Phạt tiền",
    PUNISH_RECEIVE: "Nhận tiền phạt từ chủ xe",
  };

  return (
    <div className="overflow-x-auto font-manrope mt-4">
      <table className=" border-collapse border border-gray-300 table-fixed w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 w-3/12">Số tiền</th>
            <th className="border border-gray-300 p-2 w-3/12">
              Thời gian giao dịch
            </th>
            <th className="border border-gray-300 p-2 w-3/12">Loại</th>
            <th className="border border-gray-300 p-3 w-3/12">Trạng thái</th>
            <th className="border border-gray-300 p-3 w-3/12">Mô tả</th>
          </tr>
        </thead>
        <tbody>
          {displayedTransactions.map((transaction) => {
            const isWithdrawalOrDeposit =
              transaction.type === "WITHDRAW" || transaction.type === "DEPOSIT" || transaction.type === "REFUND" ||  transaction.type === "PUNISH"  ;

            const amount = isWithdrawalOrDeposit
              ? `- ${transaction.amount.toLocaleString()} VND`
              : `+ ${transaction.amount.toLocaleString()} VND`;

            const amountClass = isWithdrawalOrDeposit
              ? "text-red-500"
              : "text-green-500";

            return (
              <tr key={transaction.id}>
                <td className={`border border-gray-300 p-2 ${amountClass}`}>
                  {amount}
                </td>
                <td className="border border-gray-300 p-3">
                  {format(
                    new Date(transaction.transactionDate),
                    "dd/MM/yyyy HH:mm:ss"
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {typeMap[transaction.type]}
                </td>
                <td
                  className={`border border-gray-300 p-2 ${
                    transaction.status === "SUCCESS"
                      ? "text-green-500"
                      : transaction.status === "PENDING"
                      ? "text-orange-400"
                      : "text-red-500"
                  }`}
                >
                  {typeMap[transaction.status]}
                </td>
                <td className={`border border-gray-300 p-2`}>
                  {transaction.description}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {transactions.length > pageSize && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="bg-zinc-500 hover:bg-zinc-600 text-white py-2 px-4 rounded"
          >
            Trước
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={endIndex >= transactions.length}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2"
          >
            Tiếp
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
