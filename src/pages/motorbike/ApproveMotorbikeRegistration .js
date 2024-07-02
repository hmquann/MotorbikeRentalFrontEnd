import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import useDebounce from '../../hooks/useDebounce';

const tableCellClasses = 'px-6 py-4 whitespace-nowrap text-base font-semibold text-amber-900 ';
const buttonClasses = 'p-2 rounded-lg';
const modalOverlayClasses = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm';
const modalContentClasses = 'bg-white p-4 rounded-lg shadow-lg max-w-md w-full';
const cancelButtonClasses = 'hover:bg-red-600 bg-red-500 text-white px-3 py-2 rounded-lg';
const approveButtonClasses = 'hover:bg-green-600 bg-green-500 text-white px-4 py-2 rounded-lg mr-2';

const ApproveMotorbikeRegistration = () => {
  const [motorbikes, setMotorbikes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMotorbike, setSelectedMotorbike] = useState(null);
  const [actionType, setActionType] = useState('');
  const [userRole, setUserRole] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  

  

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem('roles'));
    setUserRole(role);
    fetchMotorbikes(currentPage, pageSize);
  }, [currentPage, pageSize, statusFilter]);

  const fetchMotorbikes = async (page, size) => {
    try {
      setIsLoading(true);
      // const status = statusFilter !== 'all' ? statusFilter : 'all';
      const response = await axios.get(`http://localhost:8080/api/motorbike/allMotorbike/${page}/${size}`);
      if (response.data) {
        const totalElements = response.data.totalElements;
        const totalPages = Math.ceil(totalElements / size);
        const validMotorbike = response.data.content.filter(
          (item) => typeof item === "object" && item !== null
        );
        setTimeout(() => {
          setMotorbikes(validMotorbike);
          setTotalPages(totalPages);
          setIsLoading(false)
        }, 500); 
      }
    } catch (error) {
      console.error('Error fetching motorbikes:', error);
      setMotorbikes([]);
    } 
  };

  const searchMotorbike = async (searchTerm, page, size) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`http://localhost:8080/api/motorbike/search`, {
        params: {
          searchTerm,
          page,
          size
        }
      });

      if (response.data) {
        const totalElements = response.data.totalElements;
        const totalPages = Math.ceil(totalElements / size);
        const validMotorbike = response.data.content.filter(
          (item) => typeof item === "object" && item !== null
        );
        setTimeout(() => {
          setMotorbikes(validMotorbike);
          setTotalPages(totalPages);
          setIsLoading(false)
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
    if (debouncedSearchTerm !== null && typeof debouncedSearchTerm === 'string' && debouncedSearchTerm.trim() !== '') {
      setIsSearching(true);
      searchMotorbike(debouncedSearchTerm, currentPage, pageSize);
    } else {
      setIsSearching(false);
      fetchMotorbikes(currentPage, pageSize);
    }
  }, [debouncedSearchTerm, currentPage, pageSize, isSearching]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset page to 0 when searching
  };

  const handleAction = (motorbike, action) => {
    setSelectedMotorbike(motorbike);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    const url = actionType === 'approve'
      ? `http://localhost:8080/api/motorbike/approve/${selectedMotorbike.id}`
      : actionType === 'reject'
      ? `http://localhost:8080/api/motorbike/reject/${selectedMotorbike.id}`
      : actionType === 'activate'
      ? `http://localhost:8080/api/motorbike/toggleStatus/${selectedMotorbike.id}`
      : `http://localhost:8080/api/motorbike/toggleStatus/${selectedMotorbike.id}`;

    axios.put(url)
      .then(response => {
        if (response.data) {
          // Update motorbikes list with updated motorbike
          setMotorbikes(filteredMotorbikes.map(motorbike => (motorbike.id === selectedMotorbike.id ? response.data : motorbike)));
          setIsModalOpen(false);
          fetchMotorbikes(currentPage, pageSize);
        } else {
          console.error(`Error ${actionType}ing motorbike: Empty response data`);
          // Handle empty response data scenario
          // Possibly show an error message to the user
        }
      })
      .catch(error => console.error(`Error ${actionType}ing motorbike:`, error));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMotorbike(null);
    setActionType('');
  };

  const isAdmin = userRole.includes('ADMIN');
  const isLessor = userRole.includes('LESSOR');

  const filteredMotorbikes = motorbikes.filter(motorbike => {
    if (isAdmin) return statusFilter === 'all' || motorbike.status === statusFilter;
    if (isLessor) {
      const lessorUserId = parseInt(localStorage.getItem('userId'), 10); // Lấy userId của lessor từ localStorage
      return (statusFilter === 'all' || motorbike.status === statusFilter) && motorbike.user && motorbike.user.id === lessorUserId;
    }
  });
  const handleStatusFilterChange = (motorbikeStatus) => {
    setStatusFilter(motorbikeStatus);
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
    <div className="p-4 rounded-lg max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-slate-500 from-60% to-zinc-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-4xl font-semibold mb-4">Motorbike Status</h1>
      </div>
      <div className="mt-1 mb-1 flex justify-end flex-wrap mx-auto">
      <div className="p-2 w-1/5">
          <input
            type="text"
            placeholder="Search By Plate"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
            <Dropdown selectedStatus={statusFilter} onStatusChange={handleStatusFilterChange} />
          </div>
      {isAdmin || isLessor ? (
        <table className="min-w-full table-fixed divide-y divide-gray-400  ">
          <thead className="bg-gray-50 ">
            <tr>
            {isAdmin && (<th className="px-6 py-3 text-left text-xm font-medium text-gray-500  uppercase tracking-wider">
                ID
              </th>)}
              {isAdmin && (<th className="px-6 py-3 text-left text-xm font-medium text-gray-500  uppercase tracking-wider">
                User Name
              </th>)}
              <th className="px-6 py-3 text-left text-xm font-medium text-gray-500  uppercase tracking-wider">
                Motorbike Name
              </th>
              <th className="px-6 py-3 text-left text-xm font-medium text-gray-500  uppercase tracking-wider">
                Motorbike Plate
              </th>
              <th className="px-6 py-3 text-left text-xm font-medium text-gray-500  uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xm font-medium text-gray-500  uppercase tracking-wider">
                Actions
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
            ) : filteredMotorbikes.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-amber-700">
                  No motorbike found
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
            {motorbike.user.firstName + " " + motorbike.user.lastName}
          </td>
        )}
        <td className={tableCellClasses}>{motorbike.model.modelName}</td>
        <td className={tableCellClasses}>{motorbike.motorbikePlate}</td>
        <td className={tableCellClasses}>{motorbike.motorbikeStatus}</td>
        <td className={tableCellClasses}>
          {isAdmin && motorbike.motorbikeStatus === 'PENDING' ? (
            <>
              <button
                className={`hover:bg-green-600 bg-green-500 text-white mr-2 ${buttonClasses}`}
                onClick={() => handleAction(motorbike, 'approve')}
              >
                Approve
              </button>
              <button
                className={`hover:bg-red-600 bg-red-500 text-white ${buttonClasses}`}
                onClick={() => handleAction(motorbike, 'reject')}
              >
                Reject
              </button>
            </>
          ) : isLessor &&
            (motorbike.motorbikeStatus === 'ACTIVE' ||
              motorbike.motorbikeStatus === 'DEACTIVE') ? (
            motorbike.motorbikeStatus === 'ACTIVE' ? (
              <button
                className={`hover:bg-red-600 bg-red-500 text-white ${buttonClasses}`}
                onClick={() => handleAction(motorbike, 'deactivate')}
              >
                Deactivate
              </button>
            ) : (
              <button
                className={`hover:bg-green-600 bg-green-500 text-white ${buttonClasses}`}
                onClick={() => handleAction(motorbike, 'activate')}
              >
                Activate
              </button>
            )
          ) : null}
        </td>
      </tr>
    ))}
  </>
)}

          </tbody>
        </table>
      ) : (
        <p className="text-red-500">You do not have permission to access this page.</p>
      )}
       <div className="px-6 py-3 bg-zinc-50 flex justify-between items-center">
          <div className="text-sm text-zinc-700">
            Showing <span className="font-medium">{filteredMotorbikes.length}</span> out of{" "}
            <span className="font-medium">{filteredMotorbikes .length}</span> entries
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

      {isModalOpen && (
        <div className={modalOverlayClasses}>
          <div className={modalContentClasses}>
            <p className="text-lg text-zinc-800 mb-4">
              Are you sure to {actionType} this motorbike?
            </p>
            <div className="flex justify-end">
              <button className={approveButtonClasses} onClick={handleConfirm}>Yes</button>
              <button className={cancelButtonClasses} onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveMotorbikeRegistration;
