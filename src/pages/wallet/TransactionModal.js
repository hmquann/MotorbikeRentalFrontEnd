import React, { useState } from "react";

const TransactionListModal = ({ transactions, onClose }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Transactions History</h2>
          <button
            className="text-gray-500 hover:text-gray-800 text-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 w-1/9">ID</th>
                <th className="border border-gray-300 p-2 w-1/5">Amount</th>
                <th className="border border-gray-300 p-2 w-1/3">Transaction Date</th>
                <th className="border border-gray-300 p-2 w-1/5">Type</th>
                {/* <th className="border border-gray-300 p-2 ">Processed</th> */}
                <th className="border border-gray-300 p-3 w-1/5">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="border border-gray-300 p-2">{transaction.id}</td>
                  <td className="border border-gray-300 p-2">{transaction.amount.toLocaleString()}</td>
                  <td className="border border-gray-300 p-3">
                    {new Date(transaction.transactionDate).toLocaleString('en-GB')}
                  </td>
                  <td className="border border-gray-300 p-2">{transaction.type}</td>
                  {/* <td className="border border-gray-300 p-2">
                    {transaction.processed ? "Processed" : "Not Processed"}
                  </td> */}
                  <td className={`border border-gray-300 p-2 font-bold ${
                    transaction.status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transactions.length > pageSize && (
          <div className="flex justify-end mt-4">
            <button
              className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${
                page === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
              Previous
            </button>
            <button
              className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2 ${
                endIndex >= transactions.length ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => handlePageChange(page + 1)}
              disabled={endIndex >= transactions.length}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionListModal;
