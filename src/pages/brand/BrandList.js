import React, { useEffect, useState } from "react";
import axios from "axios";
import AddBrand from "./AddBrand";
import EditBrand from "./EditBrand";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const buttonClasses = "px-4 py-2 rounded-lg";
const tableCellClasses = "px-6 py-4 whitespace-nowrap";
const actionButtonClasses = "text-zinc-500 rounded-full hover:bg-yellow-400 bg-yellow-300 px-3 py-2";
const deleteButtonClasses = "text-red-500";

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false); // State for Edit Modal
  const [brandToEdit, setBrandToEdit] = useState(null); // State for brand to edit

  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/brand/getAllBrand/${currentPage}/${pageSize}`
      );
      const totalElements = response.data.totalElements;
      const totalPages = Math.ceil(totalElements / pageSize);
      setBrands(response.data.content || []); // Đảm bảo luôn là mảng
      setTotalPages(response.data.totalPages); // Lưu tổng số trang
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]); // Đảm bảo luôn là mảng
    }
    console.log(totalPages);
  };

  useEffect(() => {
    fetchBrands();
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
    <div className="max-w-5xl mx-auto p-4 bg-zinc-100">
      <div className="bg-gradient-to-r from-cyan-700 from-40% to-red-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Brand</h2>
        <div>
          <button
            className={`${buttonClasses}hover:from-zinc-700 hover:to-pink-800 bg-gradient-to-r from-red-800 to-red-700 text-white rounded-full `}
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
                Name
              </th>
              <th
                className={`${tableCellClasses} text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/3`}
              >
                Origin
              </th>
              <th
                className={`${tableCellClasses} text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/3`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200 text-center">
            {brands.map((brand, index) => (
              <tr
                key={brand.brandId}
                className={index % 2 === 0 ? "bg-stone-300" : "bg-zinc-100"}
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
            ))}
          </tbody>
        </table>
        <div className="px-6 py-3 bg-zinc-50 flex justify-between items-center">
          <div className="text-sm text-zinc-700">
            Showing <span className="font-medium">{brands.length}</span> out of{" "}
            <span className="font-medium">{brands.length}</span> entries
          </div>
          <div className="flex space-x-1">
            {currentPage > 0 && (
              <button
                className="px-3 py-1 border border-zinc-300 text-zinc-500 rounded-md bg-zinc-200 hover:bg-zinc-300"
                onClick={handlePreviousPage}
              >
                Previous
              </button>
            )}

            {renderPageNumbers()}
            {currentPage < totalPages - 1 && (
              <button
                className="px-3 py-1 border border-zinc-300 text-zinc-500 rounded-md bg-zinc-200 hover:bg-zinc-300"
                onClick={handleNextPage}
              >
                Next
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
