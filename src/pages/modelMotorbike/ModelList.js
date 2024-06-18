import React, { useEffect, useState } from "react";
import axios from "axios";
import AddModel from "./AddModel";
import ViewModel from "./ViewModel";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";

const buttonClasses = "font-semibold px-4 py-2 rounded-lg";
const tableCellClasses = " px-6 py-4 whitespace-nowrap text-amber-700";
const actionButtonClasses =
  "text-zinc-500 rounded-lg hover:bg-blue-500 bg-blue-400 px-2 py-2";

const ModelList = () => {
  const [models, setModels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modelToView, setModelToView] = useState(null);
  

  const fetchModels = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/model/getAllModel/${currentPage}/${pageSize}`
      );

      if (response.data && response.data.content) {
        const totalElements = response.data.totalElements;
        const totalPages = Math.ceil(totalElements / pageSize);
        // Lọc dữ liệu chỉ giữ lại các đối tượng hợp lệ
        const validModels = response.data.content.filter(
          (item) => typeof item === "object" && item !== null
        );
        setModels(validModels); // Đảm bảo luôn là mảng
        setTotalPages(totalPages); // Lưu tổng số trang
      } else {
        console.log("No content found in API response");
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      setModels([]); // Đảm bảo luôn là mảng
    }
  };

  useEffect(() => {
    fetchModels();
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
  
  const handleView = (model) => {
    setModelToView(model);
    setShowViewModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-zinc-100">
      <div className="bg-gradient-to-r from-cyan-700 from-40% to-red-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Models</h2>
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
                className={`px-6 py-4 text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/4`}
              >
                ID
              </th>
              <th
                className={`px-6 py-4 text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/4`}
              >
                Name
              </th>
              <th
                className={`px-6 py-4 text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/4`}
              >
                Brand
              </th>
              <th
                className={`px-6 py-4 text-center text-x font-large text-zinc-500 uppercase tracking-wider w-1/4`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200 text-center">
            {models.length > 0 ? (
              models.map((model, index) => (
                <tr
                  key={model.id}
                  className={index % 2 === 0 ? "bg-stone-300" : "bg-zinc-100"}
                >
                  <td className="whitespace-nowrap px-6 py-4 font-bold text-gray-900">{model.modelId}</td>
                  <td className={tableCellClasses}>{model.modelName}</td>
                  <td className={tableCellClasses}>{model.brand?.brandName}</td>
                  <td className={tableCellClasses}>
                    <button
                      className={`${actionButtonClasses} mr-2`}
                      onClick={() => handleView(model)}
                    >
                    <IoEyeOutline />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className={tableCellClasses}>
                  No models found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-6 py-3 bg-zinc-50 flex justify-between items-center">
          <div className="text-sm text-zinc-700">
            Showing <span className="font-medium">{models.length}</span> out of{" "}
            <span className="font-medium">{models.length}</span> entries
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
        <AddModel
          showModal={showModal}
          setShowModal={setShowModal}
          onModelCreated={fetchModels} // Truyền fetchModels để cập nhật danh sách sau khi tạo model mới
        />
      )}
      {showViewModal && (
        <ViewModel
          showModal={showViewModal}
          setShowModal={setShowViewModal}
          modelId={modelToView.modelId} // Pass the selected model ID to the ViewModel component
        />
      )}
    </div>
  );
};

export default ModelList;
