import React, { useState, useEffect } from "react";
import axios from "axios";
import UserInformation from "./UserInformation";
import useDebounce from "../../hooks/useDebounce";
import apiClient from "../../axiosConfig";

const UserData = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get(
        `/api/user/allUser/${currentPage}/${pageSize}`,
      
      );

      setTimeout(() => {
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages); 
      setIsLoading(false)
      },500)
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const searchUsers = async (term, page, size) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        `/api/user/search`,
        {
          params: {
            searchTerm: term,
            page,
            size,
          },
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          // },
        }
      );

      setTimeout(() => {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (debouncedSearchTerm !== null && typeof debouncedSearchTerm === 'string' && debouncedSearchTerm.trim() !== '') {
      searchUsers(debouncedSearchTerm, currentPage, pageSize);
    } else {
      fetchUsers();
    }
  }, [debouncedSearchTerm, currentPage, pageSize]);

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); 
  };

  return (
    <div>
      <UserInformation
        users={users}
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        handlePageClick={handlePageClick}
        handleSearch={handleSearch}
        setUsers={setUsers}
        searchTerm={searchTerm}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default UserData;
