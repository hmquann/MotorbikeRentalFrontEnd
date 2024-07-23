import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { format } from 'date-fns';

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

  const typeMap = {
    'TOP_UP': 'Nạp tiền',
    'WITHDRAW': 'Rút tiền',
    'SUCCESS' : 'Thành công',
    'FAILED' : 'Thất bại'
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Lịch sử giao dịch</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 table-fixed">
            <thead>
              <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 w-1/14">ID</th>
                <th className="border border-gray-300 p-2 w-2/12">Số tiền</th>
                <th className="border border-gray-300 p-2 w-4/12">Thời gian giao dịch</th>
                <th className="border border-gray-300 p-2 w-2/12">Loại</th>
                <th className="border border-gray-300 p-3 w-3/12">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="border border-gray-300 p-2">{transaction.id}</td>
                  <td className="border border-gray-300 p-2">{transaction.amount.toLocaleString()}</td>
                  <td className="border border-gray-300 p-3">
                  {format(new Date(transaction.transactionDate), 'dd/MM/yyyy HH:mm:ss')}
                  </td>
                  <td className="border border-gray-300 p-2">{typeMap[transaction.type]}</td>
                  <td className={`border border-gray-300 p-2  ${
                    transaction.status === 'SUCCESS' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {typeMap[transaction.status]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                  {transactions.length > pageSize && (
          <div className="flex justify-end mt-4">
            <Button
              variant="secondary"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Trước
            </Button>
            <Button
              variant="primary"
              onClick={() => handlePageChange(page + 1)}
              disabled={endIndex >= transactions.length}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2"
            >
              Tiếp
            </Button>
          </div>
        )}
        </div>
      </Modal.Body>
      {/* <Modal.Footer>

        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default TransactionListModal;
