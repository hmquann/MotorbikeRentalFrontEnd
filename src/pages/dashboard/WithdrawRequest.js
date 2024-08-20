import React, { useEffect, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import useDebounce from "../../hooks/useDebounce";
import apiClient from "../../axiosConfig";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFilter } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

const buttonClasses = "py-1 px-2 rounded-lg transition hover:scale-105";
const tableCellClasses = "px-6 py-4 whitespace-nowrap text-md";
const actionButtonClasses = "text-blue-500 rounded-lg hover:bg-white px-2 py-2";

const WithdrawRequest = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [requestToView, setRequestToView] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("PENDING");

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, currentPage]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/api/transaction/withdrawList`, {
        params: {
          status: selectedStatus,
          page: currentPage,
          size: pageSize,
        },
      });

      if (response.data && response.data.content) {
        const totalElements = response.data.totalElements;
        const totalPages = Math.ceil(totalElements / pageSize);
        const validRequests = response.data.content.filter(
          (item) => typeof item === "object" && item !== null
        );
        setTimeout(() => {
          setRequests(validRequests);
          setTotalPages(totalPages);
          setIsLoading(false);
        }, 500);
      } else {
        console.log("No content found in API response");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    }
  };
  const handleApprove = (request) => {
    setRequestToApprove(request);
    setIsModalOpen(true);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setStatusFilter(status);
    setCurrentPage(0);
  };

  const handleSubmit = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.post(
        `/api/payment/approveWithdrawal`,
        null,
        {
          params: { transactionId: requestId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchRequests();
        setIsModalOpen(false);
      } else {
        // alert("Duyệt yêu cầu thất bại");
      }
    } catch (error) {
        console.error("Error during approval:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, pageSize]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(0, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisiblePages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 0) {
        endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
      } else if (endPage === totalPages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`hover:bg-sky-200 px-3 py-1 border border-zinc-300 text-zinc-500 rounded-md ${
            currentPage === i ? "bg-sky-600 text-white" : ""
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  const handleView = (request) => {
    setRequestToView(request);
    setShowViewModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-zinc-100 font-manrope">
      <div className="bg-gradient-to-r from-slate-500 from-60% to-zinc-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-4xl font-bold">Quản lý yêu cầu rút tiền</h2>
      </div>
      <div className=" py-2 bg-white flex justify-between items-center flex-wrap mx-auto">
        <div>
        <i className="whitespace-pre-wrap text-red-500 ml-2">(*) Nếu trong 1 ngày mà bạn không duyệt yêu cầu rút tiền thì đơn rút tiền sẽ bị hủy</i>
        </div>
        <div className="flex items-center">
        <span className="mr-3 text-lg">
          <FontAwesomeIcon icon={faFilter} />
        </span>
        <Dropdown className="mr-5">
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedStatus === "PENDING" && "Chưa hoàn thành"}
            {selectedStatus === "SUCCESS" && "Đã hoàn thành"}
            {selectedStatus === "FAILED" && "Thất bại"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleStatusChange("PENDING")}>
              Chưa hoàn thành
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("SUCCESS")}>
              Đã hoàn thành
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleStatusChange("FAILED")}>
              Thất bại
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-b-lg">
        <table className="min-w-full table-fixed divide-y divide-zinc-200">
          <thead className="bg-zinc-100">
            <tr>
              <th
                className={`px-6 py-4 text-center text-x font-large text-zinc-500 uppercase tracking-wider whitespace-nowrap`}
              >
                Người dùng
              </th>
              <th
                className={`px-6 py-4 text-center text-x font-large text-zinc-500 uppercase tracking-wider whitespace-nowrap`}
              >
                Số tiền
              </th>
              <th
                className={`px-6 py-4 text-center text-x font-large text-zinc-500 uppercase tracking-wider whitespace-nowrap `}
              >
                Số thẻ ngân hàng
              </th>
              <th
                className={`px-6 py-4 text-center text-x font-large text-zinc-500 uppercase tracking-wider whitespace-nowrap`}
              >
                Ngân hàng
              </th>
              <th
                className={`px-6 py-4 text-center text-x font-large text-zinc-500 uppercase tracking-wider whitespace-nowrap`}
              >
                Nội dung
              </th>
              <th
                className={`px-6 py-4 text-center text-x font-large text-zinc-500 uppercase tracking-wider whitespace-nowrap`}
              >
                Thời gian
              </th>
              {selectedStatus === "PENDING" ? (
                <>
                  <th
                    className={`px-6 py-4 text-center text-x font-large text-zinc-500 uppercase tracking-wider whitespace-nowrap`}
                  >
                    Hành động
                  </th>
                </>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200 text-center">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="p-4">
                  <div className="flex justify-center items-center">
                    <Box sx={{ display: "flex" }}>
                      <CircularProgress />
                    </Box>
                  </div>
                </td>
              </tr>
            ) : requests.length > 0 ? (
              requests.map((request, index) => (
                <tr
                  key={request.id}
                  className={`text-center transition duration-300 ease-in-out hover:bg-slate-300 ${
                    index % 2 === 0 ? "bg-white-100" : "bg-gray-100"
                  }`}
                >
                  <td className="whitespace-nowrap px-6 py-4 font-bold text-gray-900">
                    {request.user.firstName} {request.user.lastName}
                  </td>
                  <td className={tableCellClasses}>
                    {request.amount.toLocaleString()}
                  </td>
                  <td className={tableCellClasses}>{request.accountNumber}</td>
                  <td className={tableCellClasses}>{request.bankName}</td>
                  <td className={tableCellClasses} style={{ whiteSpace: "pre-wrap" }}>{request.description}</td>
                  <td className={tableCellClasses} style={{ whiteSpace: "pre-wrap" }}>
                  {format(
                    new Date(request.transactionDate),
                    "dd/MM/yyyy HH:mm:ss"
                  )}
                  </td>
                  {selectedStatus === "PENDING" ? 
                  <>
                                    <td className={tableCellClasses}>
                    <button
                      className={`hover:bg-green-600 bg-green-500 text-white mr-2 ${buttonClasses}`}
                      onClick={() => handleApprove(request)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  </td>
                  </> : <></>}

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={tableCellClasses}>
                  Không có yêu cầu rút tiền nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        <div className="px-6 py-3 bg-zinc-50 flex justify-between items-center min-w-full">
          <div className="text-sm text-zinc-700">
            Đang hiển thị <span className="font-medium">{requests.length}</span>{" "}
            trên <span className="font-medium">{requests.length}</span> bản ghi
          </div>
          <div className="flex space-x-1">
            {currentPage > 0 && (
              <button
                className="px-3 py-1 border border-zinc-300 text-zinc-500 rounded-md bg-zinc-200 hover:bg-zinc-300"
                onClick={handlePreviousPage}
              >
                Trước
              </button>
            )}
            {renderPageNumbers()}
            {currentPage < totalPages - 1 && (
              <button
                className="px-3 py-1 border border-zinc-300 text-zinc-500 rounded-md bg-zinc-200 hover:bg-zinc-300"
                onClick={handleNextPage}
              >
                Sau
              </button>
            )}
          </div>
        </div>

      {isModalOpen && (
        <Modal
          show={isModalOpen}
          onHide={() => setIsModalOpen(false)}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-lg text-zinc-800">
              Bạn có chắc muốn{" "}
              <span className="text-red-500 font-bold">
                duyệt yêu cầu rút tiền này?
              </span>{" "}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              className="transition hover:scale-105"
              onClick={() => handleSubmit(requestToApprove.id)}
            >
              Có
            </Button>
            <Button
              variant="secondary"
              className="transition hover:scale-105"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default WithdrawRequest;
