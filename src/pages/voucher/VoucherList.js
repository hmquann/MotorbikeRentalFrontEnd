import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import CreateVoucherModal from "./CreateVoucherModal";
import DiscountDetailModal from "./DiscountDetailModal ";
import qs from 'qs'
import { IoEyeOutline,IoTrashOutline } from "react-icons/io5";
import { set } from "date-fns";
import Modal from "react-bootstrap/Modal";
import apiClient from "../../axiosConfig";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const buttonClasses = "px-4 py-2 rounded-lg";
const tableCellClasses = "px-6 py-4 whitespace-nowrap";
const actionButtonClasses = "rounded-full hover:bg-zinc-100 px-3 py-2";

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState([]);
  const [userId, setUserId] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  useEffect(() => {
    const role = JSON.parse(localStorage.getItem('roles'));
    const userId = JSON.parse(localStorage.getItem('user')).userId
    setUserRole(role);
    setUserId(userId)
    fetchVoucher(currentPage, pageSize, role,userId);
  }, [currentPage, pageSize]);

  const fetchDiscountDetails = async (discountId) => {
    try {
      const response = await apiClient.get(`/api/discounts/${discountId}`);
      setSelectedVoucher(response.data);
    } catch (error) {
      console.error("Error fetching discount details", error);
    }
  };

  const fetchVoucher = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get(
        `/api/discounts/getAllDiscount/${currentPage}/${pageSize}`,
        {
          params:{
            roles : userRole.join(','),
            userId: userId  
          },
          paramsSerializer:params =>{
            return qs.stringify(params,{arrayFormat:'repeat'});
          }
    });
      const totalElements = response.data.totalElements;
      const totalPages = Math.ceil(totalElements / pageSize);
      const validVoucher = response.data.content.filter(
        (item) => typeof item === "object" && item !== null
      );
      setTimeout(() =>{
        setVouchers(validVoucher); 
        setTotalPages(totalPages); 
        setIsLoading(false)
      },500)
     
    } catch (error) {
      console.error("Error fetching voucher:", error);
      setVouchers([]); 
    }
  };

  useEffect(() => {
    fetchVoucher();
  }, [currentPage, pageSize,userRole,userId]);

 
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
    const maxVisiblePages = 3; // Số trang tối đa được hiển thị
    const halfVisiblePages = Math.floor(maxVisiblePages / 2); // Số trang được hiển thị ở mỗi bên của trang hiện tại
  
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
  
  const handleViewDetail = (discountId) => {
    setShowDetailModal(true);
    fetchDiscountDetails(discountId);
  };
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowDetailModal(false);
  };

  const handleDeleteClick = (voucherId) => {
    setSelectedVoucher(voucherId);
    setShowConfirmModal(true);
  };
  const handleAddDiscount = () => {
    setSelectedVoucher(null);
    setShowCreateModal(true);
    setShowDetailModal(false);
  };

  const handleDelete = async () => {
    try {
      // Remove references
      await apiClient.delete(`/api/discounts/${selectedVoucher}/remove-references`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      // Delete discount
      await apiClient.delete(`/api/discounts/delete/${selectedVoucher}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
    fetchVoucher();
    } catch (error) {
      console.error('There was an error deleting the discount!', error);
    }finally {
      setShowConfirmModal(false);
      setSelectedVoucher(null);
    }
  };
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  
  return (
    <div className="max-w-5xl mx-auto p-4 bg-zinc-100 font-manrope">
      <div className="bg-gradient-to-r from-slate-500 from-60% to-zinc-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-4xl font-bold">Quản lý khuyến mãi</h2>
        <div>
          <button
            className={`${buttonClasses} hover:bg-blue-700 bg-blue-600 text-white rounded-full `}
            onClick={handleAddDiscount}
          >
            <MdOutlineAddCircleOutline />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-b-lg">
        <table className="min-w-full table-fixed divide-y divide-zinc-200">
          <thead className="bg-zinc-100 ">
            <tr>
            <th
                className={`${tableCellClasses} text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/5`}
              >
                CODE
              </th>
            <th
                className={`${tableCellClasses} text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/5`}
              >
                Tiêu đề
              </th>
              <th
                className={`${tableCellClasses} text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/5`}
              >
                Ngày hết hạn
              </th>
              <th
                className={`${tableCellClasses} text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/5`}
              >
                Số lượng
              </th>
              <th
                className={`${tableCellClasses} text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/5 `}
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200 text-center">
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
            ):(
            vouchers.map((voucher, index) => (
              <tr
                key={voucher.id}
                className={`text-center transition duration-300 ease-in-out hover:bg-slate-300 ${index % 2 === 0 ? 'bg-white-100' : 'bg-gray-100'}`}
              >
                <td className="px-6 py-4 whitespace-nowrap font-bold">{voucher.code}</td>
                <td className={tableCellClasses}>{voucher.name}</td>
                <td className={tableCellClasses}>{formatDate(voucher.expirationDate)}</td>
                <td className={tableCellClasses}>{voucher.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className={`${actionButtonClasses} text-blue-600`}
                    onClick={() => handleViewDetail(voucher.id)}
                  >
                     <IoEyeOutline/>

                  </button>
                  <button
                         className={`${actionButtonClasses} text-red-600 `}
                        onClick={() => handleDeleteClick(voucher.id)}
                      >
                        <IoTrashOutline />
                      </button>
                </td>
              </tr>
            ))
            )}
          
          </tbody>
        </table>
        <div className="px-6 py-3 bg-zinc-50 flex justify-between items-center">
          <div className="text-sm text-zinc-700">
            Đang hiển thị <span className="font-medium">{vouchers.length}</span> trên{" "}
            <span className="font-medium">{vouchers.length}</span> bản ghi
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
      </div>
      {showCreateModal && (
        <CreateVoucherModal  onClose={handleCloseModal}
        showModal={setShowCreateModal}
        setShowModal={setShowCreateModal}
        onDiscountCreated={fetchVoucher}  />
      )}
       {setShowDetailModal && (
        <DiscountDetailModal
          showModalDetail={showDetailModal}
          setShowModalDetail={setShowDetailModal}
          voucher={selectedVoucher}
          onClose={handleCloseModal}
          isDetailView={showDetailModal}    
          fetchVoucher={fetchVoucher}  
        />
      )}
      {showConfirmModal && (
         <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
         <Modal.Header closeButton>
           <Modal.Title>Bạn có chắc muốn xóa khuyến mãi này?</Modal.Title>
         </Modal.Header>
         <Modal.Footer>
         <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="hover:bg-gray-400 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition hover:scale-105"
            >
              Hủy
            </button>
            <button
              onClick={handleDelete}
              className="hover:bg-red-700 bg-red-600 text-white px-4 py-2 rounded-lg transition hover:scale-105"
            >
              Xóa
            </button>
          </div>
         </Modal.Footer>
         
      </Modal>
      )}
    </div>
  );
};

export default VoucherList;
