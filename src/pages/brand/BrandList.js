import React, { useEffect, useState } from "react";
import axios from "axios";
import AddBrand from "./AddBrand";
import EditBrand from "./EditBrand";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const buttonClasses = "px-4 py-2 rounded-lg";
const tableCellClasses = "px-6 py-4 whitespace-nowrap";
const actionButtonClasses = "text-zinc-500 rounded-full hover:bg-white  px-3 py-2";
const deleteButtonClasses = "text-red-500";

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [brandToEdit, setBrandToEdit] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const fetchBrands = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `http://localhost:8080/api/brand/getAllBrand/${currentPage}/${pageSize}`
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
    <div className="max-w-5xl mx-auto p-4 bg-zinc-100">
      <div className="bg-gradient-to-r from-slate-500 from-60% to-zinc-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Brand</h2>
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
