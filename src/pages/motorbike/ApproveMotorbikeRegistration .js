import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropdown from "./Dropdown";
import useDebounce from "../../hooks/useDebounce";
import qs from "qs";
import MotorbikeDetails from "./MotorbikeDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faInfoCircle,
  faTimesCircle,
  faToggleOff,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import apiClient from "../../axiosConfig";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const tableCellClasses =
  "px-6 py-4 whitespace-nowrap text-base font-semibold text-amber-900 ";
const buttonClasses = "py-1 px-2 rounded-lg transition hover:scale-105";
const modalOverlayClasses =
  "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm";
const modalContentClasses = "bg-white p-4 rounded-lg shadow-lg max-w-md w-full";
const cancelButtonClasses =
  "hover:bg-red-600 bg-red-500 text-white px-3 py-2 rounded-lg";
const approveButtonClasses =
  "hover:bg-green-600 bg-green-500 text-white px-4 py-2 rounded-lg mr-2";

const ApproveMotorbikeRegistration = () => {
  const [motorbikes, setMotorbikes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMotorbike, setSelectedMotorbike] = useState(null);
  const [actionType, setActionType] = useState("");
  const [userRole, setUserRole] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userId, setUserId] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("roles"));
    const userId = JSON.parse(localStorage.getItem("user")).userId;
    setUserRole(role);
    setUserId(userId);
    fetchMotorbikes(currentPage, pageSize, userId, role);
  }, [currentPage, pageSize, statusFilter]);

  const fetchMotorbikes = async (page, size, userId, roles) => {
    try {
      setIsLoading(true);
      // const status = statusFilter !== 'all' ? statusFilter : 'all';
      const response = await apiClient.get(
        `/api/motorbike/allMotorbike/${page}/${size}`,
        {
          params: {
            userId: userId,
            role: roles.join(","),
            status: statusFilter,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        }
      );
      console.log(response.data);
      if (response.data) {
        const totalElements = response.data.totalElements;
        const totalPages = Math.ceil(totalElements / size);
        const validMotorbike = response.data.content.filter(
          (item) => typeof item === "object" && item !== null
        );
        setTimeout(() => {
          setMotorbikes(validMotorbike);
          setTotalPages(totalPages);
          setIsLoading(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error fetching motorbikes:", error);
      setMotorbikes([]);
    }
  };

  const fetchDetailMotorbike = async (motorbikeId) => {
    try {
      const response = await apiClient.get(
        `/api/motorbike/${motorbikeId}`
      );
      console.log(response.data);
      setSelectedMotorbike(response.data);
    } catch (error) {
      console.error("Error fetching discount details", error);
    }
  };
  const handleViewDetail = (motorbikeId) => {
    fetchDetailMotorbike(motorbikeId);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDetailModal(false);
    setSelectedMotorbike(null);
  };

  const searchMotorbike = async (searchTerm, userId, roles, page, size) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        `/api/motorbike/search`,
        {
          params: {
            searchTerm,
            status: statusFilter,
            userId: userId,
            role: roles.join(","),
            page,
            size,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        }
      );

      if (response.data) {
        const totalElements = response.data.totalElements;
        const totalPages = Math.ceil(totalElements / size);
        const validMotorbike = response.data.content.filter(
          (item) => typeof item === "object" && item !== null
        );
        setTimeout(() => {
          setMotorbikes(validMotorbike);
          setTotalPages(totalPages);
          setIsLoading(false);
        }, 500);
      } else {
        console.log("No content found in API response");
      }
    } catch (error) {
      console.error("Error searching models:", error);
      setMotorbikes([]);
    }
  };
  useEffect(() => {
    if (
      debouncedSearchTerm !== null &&
      typeof debouncedSearchTerm === "string" &&
      debouncedSearchTerm.trim() !== ""
    ) {
      setIsSearching(true);
      searchMotorbike(
        debouncedSearchTerm,
        userId,
        userRole,
        currentPage,
        pageSize
      );
    } else {
      setIsSearching(false);
      fetchMotorbikes(currentPage, pageSize, userId, userRole);
    }
  }, [
    debouncedSearchTerm,
    currentPage,
    pageSize,
    isSearching,
    userId,
    userRole,
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };
  const handleActionWithCheck = async (motorbike, action) => {
    try {
      const response = await apiClient.get(
        `/api/booking/motorbike/${motorbike.id}`
      );
      const bookings = response.data;

      const invalidStatuses = ["DEPOSIT_MADE", "BUSY", "RENTING"];
      const statusMap = {
        DEPOSIT_MADE: "Đã Cọc",
        BUSY: "Đang Bận",
        RENTING: "Đang Trong Chuyến",
      };
      const invalidBookings = bookings.filter((booking) =>
        invalidStatuses.includes(booking.status)
      );

      if (invalidBookings.length > 0) {
        const statusMessages = invalidBookings
          .map((booking) => statusMap[booking.status])
          .join(", ");
        setModalMessage(`${statusMessages}`);
        setShowModal(true);
      } else {
        handleAction(motorbike, action);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setModalMessage("Error fetching booking information.");
      setShowModal(true);
    }
  };

  const handleAction = (motorbike, action) => {
    setSelectedMotorbike(motorbike);
    setActionType(action);
    setIsModalOpen(true);
  };
  const actionTypeMap = {
    approve: "Xác nhận",
    reject: "Từ chối",
    activate: "Kích hoạt",
    deactivate: "Hủy kích hoạt",
  };

  const handleConfirm = () => {
    const url =
      actionType === "approve"
        ? `/api/motorbike/approve/${selectedMotorbike.id}`
        : actionType === "reject"
        ? `/api/motorbike/reject/${selectedMotorbike.id}`
        : actionType === "activate"
        ? `/api/motorbike/toggleStatus/${selectedMotorbike.id}`
        : `/api/motorbike/toggleStatus/${selectedMotorbike.id}`;

    apiClient
      .put(url)
      .then((response) => {
        if (response.data) {
          setMotorbikes(
            filteredMotorbikes.map((motorbike) =>
              motorbike.id === selectedMotorbike.id ? response.data : motorbike
            )
          );
          setIsModalOpen(false);
          fetchMotorbikes(currentPage, pageSize, userId, userRole);
        } else {
          console.error(
            `Error ${actionType}ing motorbike: Empty response data`
          );
        }
      })
      .catch((error) =>
        console.error(`Error ${actionType}ing motorbike:`, error)
      );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMotorbike(null);
    setActionType("");
  };
  const statusMap = {
    PENDING: "Đang chờ duyệt",
    ACTIVE: "Hoạt động",
    DEACTIVE: "Không hoạt động",
    All: "Tất cả",
  };

  const isAdmin = userRole.includes("ADMIN");
  const isLessor = userRole.includes("LESSOR");

  const filteredMotorbikes = motorbikes.filter((motorbike) => {
    if (isAdmin)
      return (
        statusFilter === "all" || motorbike.motorbikeStatus === statusFilter
      );
    if (isLessor) {
      const lessorUserId = JSON.parse(localStorage.getItem("user")).userId;
      return (
        (statusFilter === "all" ||
          motorbike.motorbikeStatus === statusFilter) &&
        motorbike.user &&
        motorbike.user.id === lessorUserId
      );
    }
  });
  const handleStatusFilterChange = (motorbikeStatus) => {
    setStatusFilter(motorbikeStatus);
    setCurrentPage(0);
  };

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

  return (
    <div className="p-4 rounded-lg max-w-5xl mx-auto font-manrope">
      <div className="bg-gradient-to-r from-slate-500 from-60% to-zinc-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-4xl font-semibold mb-4">Quản lý xe</h1>
      </div>
      <div className="mt-1 mb-1 flex justify-end flex-wrap mx-auto">
        <div className="p-2 w-full md:w-1/5">
          <input
            type="text"
            placeholder="Tìm theo biển"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <Dropdown
          selectedStatus={statusFilter}
          onStatusChange={handleStatusFilterChange}
        />
      </div>
      {isAdmin || isLessor ? (
        <div className="overflow-x-auto">
        <table className="min-w-full table-fixed divide-y divide-gray-400  ">
          <thead className="bg-gray-50 ">
            <tr>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xm font-bold text-gray-500  uppercase tracking-wider">
                  ID
                </th>
              )}
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xm font-bold text-gray-500  uppercase tracking-wider">
                  Người dùng
                </th>
              )}
              <th className="px-6 py-3 text-left text-xm font-bold text-gray-500  uppercase tracking-wider">
                Mẫu xe
              </th>
              <th className="px-6 py-3 text-left text-xm font-bold text-gray-500  uppercase tracking-wider">
                Biển xe
              </th>
              <th className="px-6 py-3 text-left text-xm font-bold text-gray-500  uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xm font-bold text-gray-500  uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black divide-y divide-gray-400 ">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="p-4">
                  <div className="flex justify-center items-center">
                  <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
                  </div>
                </td>
              </tr>
            ) : filteredMotorbikes.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-amber-700">
                  Không thấy xe nào
                </td>
              </tr>
            ) : (
              <>
                {filteredMotorbikes.map((motorbike) => (
                  <tr
                    key={motorbike.id}
                    className="border-b transition duration-300 ease-in-out hover:bg-slate-200 "
                  >
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-sky-900 ">
                        {motorbike.id}
                      </td>
                    )}
                    {isAdmin && (
                      <td className={tableCellClasses}>
                        {motorbike.user.firstName +
                          " " +
                          motorbike.user.lastName}
                      </td>
                    )}
                    <td className={tableCellClasses}>
                      {motorbike.model.modelName}
                    </td>
                    <td className={tableCellClasses}>
                      {motorbike.motorbikePlate}
                    </td>
                    <td className={tableCellClasses}>
                      <span
                        className={`px-2 inline-flex text-sm leading-7 font-semibold rounded-full ${
                          motorbike.motorbikeStatus === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : motorbike.motorbikeStatus === "PENDING"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {motorbike.motorbikeStatus === "ACTIVE"
                          ? "Hoạt động"
                          : motorbike.motorbikeStatus === "PENDING"
                          ? "Đang chờ duyệt"
                          : "Không hoạt động"}
                      </span>
                    </td>
                    <td className={tableCellClasses}>
                      {isAdmin && motorbike.motorbikeStatus === "PENDING" ? (
                        <>
                          <button
                            className={`hover:bg-green-600 bg-green-500 text-white mr-2 ${buttonClasses}`}
                            onClick={() => handleAction(motorbike, "approve")}
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            className={`hover:bg-red-600 bg-red-500 text-white mr-2 ${buttonClasses}`}
                            onClick={() => handleAction(motorbike, "reject")}
                          >
                            <FontAwesomeIcon icon={faTimesCircle} />
                          </button>
                          <button
                            className={`hover:bg-blue-600 bg-blue-500 text-white ${buttonClasses}`}
                            onClick={() => handleViewDetail(motorbike.id)}
                          >
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </button>
                        </>
                      ) : isLessor &&
                        (motorbike.motorbikeStatus === "ACTIVE" ||
                          motorbike.motorbikeStatus === "DEACTIVE") ? (
                        motorbike.motorbikeStatus === "ACTIVE" ? (
                          <>
                            <button
                              className={`hover:bg-red-600 bg-red-500 text-white  ${buttonClasses}`}
                              onClick={() =>
                                handleActionWithCheck(motorbike, "deactivate")
                              }
                            >
                              {/* <ImSwitch /> */}
                              <FontAwesomeIcon icon={faToggleOn} />
                            </button>
                            <button
                              className={`hover:bg-blue-600 bg-blue-500 text-white ml-2 ${buttonClasses}`}
                              onClick={() => handleViewDetail(motorbike.id)}
                            >
                              <FontAwesomeIcon icon={faInfoCircle} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={`hover:bg-green-600 bg-green-500 text-white ${buttonClasses}`}
                              onClick={() =>
                                handleAction(motorbike, "activate")
                              }
                            >
                              <FontAwesomeIcon icon={faToggleOff} />
                            </button>
                            <button
                              className={`hover:bg-blue-600 bg-blue-500 text-white ml-2 ${buttonClasses}`}
                              onClick={() => handleViewDetail(motorbike.id)}
                            >
                              <FontAwesomeIcon icon={faInfoCircle} />
                            </button>
                          </>
                        )
                      ) : (
                        <button
                          className={`hover:bg-blue-600 bg-blue-500 text-white ${buttonClasses}`}
                          onClick={() => handleViewDetail(motorbike.id)}
                        >
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
        </div>
      ) : (
        <p className="text-red-500">Bạn không có quyền truy cập trang này.</p>
      )}
      <div className="px-6 py-3 bg-zinc-50 flex justify-between items-center">
        <div className="text-sm text-zinc-700">
          Đang hiển thị{" "}
          <span className="font-medium">{filteredMotorbikes.length}</span> trên{" "}
          <span className="font-medium">{filteredMotorbikes.length}</span> bản
          ghi
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Lưu ý</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg text-zinc-800">
            Bạn không thể dừng hoạt động xe đang trong trạng thái{" "}
            <span className="text-red-500 font-bold">{modalMessage}</span>{" "}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="transition hover:scale-105" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {isModalOpen && (
        <Modal show={isModalOpen} onHide={handleCancel} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-lg text-zinc-800">
              Bạn có chắc muốn{" "}
              <span className="text-red-500 font-bold">
                {actionTypeMap[actionType]}
              </span>{" "}
              chiếc xe này?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" className="transition hover:scale-105" onClick={handleConfirm}>
              Có
            </Button>
            <Button variant="secondary" className="transition hover:scale-105" onClick={handleCancel}>
              Hủy
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {showDetailModal && (
        <MotorbikeDetails
          motorbike={selectedMotorbike}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ApproveMotorbikeRegistration;
