import React, { useEffect, useState } from "react";
import axios from "axios";
import AddBrand from "./AddBrand";
import EditBrand from "./EditBrand";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import apiClient from "../../axiosConfig";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";


const buttonClasses = "px-4 py-2 rounded-lg";
const tableCellClasses = "px-6 py-4 whitespace-nowrap";
const actionButtonClasses = "text-blue-500 rounded-full hover:bg-white  px-3 py-2";
const deleteButtonClasses = "text-red-500";

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);//page size khai bao thuong cx dc ma
  const [totalPages, setTotalPages] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [brandToEdit, setBrandToEdit] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const fetchBrands = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get(
        `/api/brand/getAllBrand/${currentPage}/${pageSize}`
      );
      const totalElements = response.data.totalElements;
      const totalPages = Math.ceil(totalElements / pageSize);
      setTimeout(() =>{
        setBrands(response.data.content || []); 
        setTotalPages(response.data.totalPages); 
        setIsLoading(false)
      },500)
     
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]); // Đảm bảo luôn là mảng
    }
    console.log(totalPages);
  };

  useEffect(() => {
    fetchBrands();
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
  
  const handleEdit = (brand) => {
    setBrandToEdit(brand);
    setShowEditModal(true);
  };
  
  return (
    <div className="max-w-5xl mx-auto p-4 bg-zinc-100 font-manrope ">
      <div className="bg-gradient-to-r from-slate-500 from-60% to-zinc-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-4xl font-bold">Quản lý thương hiệu xe</h2>
        <div>
          <button
            className={`${buttonClasses} hover:bg-blue-700 bg-blue-600 text-white rounded-full `}
            onClick={() => setShowModal(true)}
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
                className={`${tableCellClasses} text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/3`}
              >
                Tên
              </th>
              <th
                className={`${tableCellClasses} text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/3`}
              >
                Nguốn gốc
              </th>
              <th
                className={`${tableCellClasses} text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/3`}
              >
                Hoạt động
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
            brands.map((brand, index) => (
              <tr
                key={brand.brandId}
                className={`text-center transition duration-300 ease-in-out hover:bg-slate-300 ${index % 2 === 0 ? 'bg-white-100' : 'bg-gray-100'}`}
              >
                <td className={tableCellClasses}>{brand.brandName}</td>
                <td className={tableCellClasses}>{brand.origin}</td>
                <td className={tableCellClasses}>
                  <button
                    className={`${actionButtonClasses} mr-2`}
                    onClick={() => handleEdit(brand)}
                  >
                    <FaRegEdit />

                  </button>
                </td>
              </tr>
            ))
            )}
          
          </tbody>
        </table>
        <div className="px-6 py-3 bg-zinc-50 flex justify-between items-center">
          <div className="text-sm text-zinc-700">
            Đang hiển thị <span className="font-medium">{brands.length}</span> trên{" "}
            <span className="font-medium">{brands.length}</span> bản ghi
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
      </div>
      {showModal && (
        <AddBrand
          showModal={showModal}
          setShowModal={setShowModal}
          onBrandCreated={fetchBrands}
        />
      )}
      {showEditModal && (
        <EditBrand
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          brandToEdit={brandToEdit}
          onBrandUpdated={fetchBrands}
        />
      )}
    </div>
  );
};

export default BrandList;
