import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import ModalImage from "react-modal-image";
import apiClient from "../../axiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal } from "react-bootstrap";

// import ImageWithLightbox from "./ImageWithLightBox";

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
const ApproveLicense = () => {
  const [licenses, setLicenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [actionType, setActionType] = useState("");
  const [user, setUser] = useState();
  const isAdmin = JSON.parse(localStorage.getItem("roles")).includes("ADMIN");
  const fetchLicenses = async () => {
    try {
      const response = await apiClient.get(
        `/api/license/getAllLicense/${currentPage}/${pageSize}`
      );
      const totalElements = response.data.totalElements;
      const totalPages = Math.ceil(totalElements / pageSize);
      setLicenses(response.data.content || []); // Đảm bảo luôn là mảng
      setTotalPages(response.data.totalPages); // Lưu tổng số trang
      console.log(response.data.content);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setLicenses([]); // Đảm bảo luôn là mảng
    }
    console.log(totalPages);
  };

  useEffect(() => {
    fetchLicenses();
  }, [currentPage, pageSize]);
  console.log(currentPage);

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
  const handleAction = async (license, action) => {
    console.log(license);
    setSelectedLicense(license);
    setActionType(action);
    setIsModalOpen(true);
    const respone = await apiClient.get(`/api/user/${license.userId}`);
    setUser(respone.data);
    console.log(respone.data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const action =
      actionType === "approve" ? "/api/license/approve" : "/api/license/reject";

    try {
      // Gọi API sử dụng apiClient với headers
      const response = await apiClient.post(
        action,
        { licenseNumber: selectedLicense.licenseNumber },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Xử lý thành công
      console.log("Success:", response.data);
      setIsModalOpen(true);

      // Xóa giấy phép đã chọn khỏi danh sách
      const updatedLicenses = licenses.filter(
        (license) => license !== selectedLicense
      );
      setLicenses(updatedLicenses);

      setIsModalOpen(false);

      const now = new Date();
      const admin = await apiClient.get("api/user/getAdmin");
      const adminId = admin.data.id;
      const adminSystemNoti = admin.data.systemNoti;
      const licenseHolderId = user.id; // Giả sử bạn có userId của người sở hữu giấy phép từ selectedLicense
      const licenseHolderSystemNoti = user.systemNoti;

      // Send notification to admin if required
      if (
        adminSystemNoti &&
        (actionType === "approve" || actionType === "rejected")
      ) {
        await setDoc(doc(collection(db, "notifications")), {
          userId: adminId,
          message: JSON.stringify({
            title:
              '<strong style="color: rgb(90 92 95)">Kiểm duyệt GPLX</strong>',
            content:
              actionType === "approve"
                ? `Bạn đã <strong style="color: rgb(34 197 94)">phê duyệt</strong> GPLX của người dùng <strong>${
                    user.firstName + " " + user.lastName
                  }</strong>.`
                : actionType === "rejected"
                ? `Bạn đã <strong style="color: rgb(197 34 34)">từ chối phê duyệt</strong> GPLX của người dùng <strong>${
                    user.firstName + " " + user.lastName
                  }</strong>.`
                : "",
          }),
          timestamp: now,
          seen: false,
        });
      }

      // Send notification to license holder if required
      if (
        licenseHolderSystemNoti &&
        (actionType === "approve" || actionType === "rejected")
      ) {
        await setDoc(doc(collection(db, "notifications")), {
          userId: licenseHolderId,
          message: JSON.stringify({
            title:
              '<strong style="color: rgb(90 92 95)">Kiểm duyệt GPLX</strong>',
            content:
              actionType === "approve"
                ? `<strong>GPLX</strong> của bạn đã được <strong style="color: rgb(34 197 94)">phê duyệt</strong>.`
                : actionType === "rejected"
                ? `<strong>GPLX</strong> của bạn bị <strong style="color: rgb(197 34 34)">từ chối phê duyệt</strong>.`
                : "",
          }),
          timestamp: now,
          seen: false,
        });
      }
    } catch (error) {
      // Xử lý lỗi
      console.error("Error:", error);
    }
  };
  const handleClick = (license) => {
    setSelectedLicense(license);
  };

  const actionTypeMap = {
    approve: "Chấp nhận",
    rejected: "Từ chối",
  };
  return (
    <div className="p-4 rounded-lg max-w-5xl mx-auto font-manrope">
      <div className="bg-gradient-to-r from-slate-500 from-60% to-zinc-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-4xl font-semibold mb-4">Quản lý bằng lái xe</h1>
      </div>

      {isAdmin ? (
        <table className="min-w-full table-fixed divide-y divide-gray-400  ">
          <thead className="bg-gray-50 ">
            <tr>
              <th className="px-6 py-3 text-left text-xm font-bold text-gray-500  uppercase tracking-wider">
                Số bằng lái xe
              </th>
              <th className="px-6 py-3 text-left text-xm font-bold text-gray-500  uppercase tracking-wider">
                Ngày sinh
              </th>
              <th className="px-6 py-3 text-left text-xm font-bold text-gray-500  uppercase tracking-wider">
                Hình ảnh
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
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin  fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : licenses.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center text-amber-700 font-bold"
                >
                  Không có bản ghi nào
                </td>
              </tr>
            ) : (
              <>
                {licenses.map((license) => (
                  <tr
                    key={license.licenseNumber}
                    className="border-b transition duration-300 ease-in-out p-4 hover:bg-neutral-100 "
                  >
                    <td className={tableCellClasses}>
                      {license.licenseNumber}
                    </td>
                    <td className={tableCellClasses}>{license.birthOfDate}</td>

                    <td className={tableCellClasses}>
                      <ModalImage
                        small={license.licenseImageUrl}
                        large={license.licenseImageUrl}
                        className="w-28 h-14 object-cover rounded-md mr-2 mb-2"
                      />
                    </td>

                    <td
                      className={tableCellClasses}
                      onClick={() => handleClick(license)}
                    >
                      <>
                        <button
                          className={`hover:bg-green-600 bg-green-500 text-white mr-2 ${buttonClasses}`}
                          onClick={() => handleAction(license, "approve")}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          className={`hover:bg-red-600 bg-red-500 text-white ${buttonClasses}`}
                          onClick={() => handleAction(license, "rejected")}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                      </>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      ) : (
        <p className="text-red-500">Bạn không có quyền truy cập trang này</p>
      )}
      <div className="px-6 py-3 bg-zinc-50 flex justify-between items-center">
        <div className="text-sm text-zinc-700">
          Đang hiển thị <span className="font-medium">{licenses.length}</span>{" "}
          trên <span className="font-medium">{licenses.length}</span> bản ghi
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
              Tiếp
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
                {actionTypeMap[actionType]}
              </span>{" "}
              bằng lái xe này?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              className="transition hover:scale-105"
              onClick={handleSubmit}
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

export default ApproveLicense;
