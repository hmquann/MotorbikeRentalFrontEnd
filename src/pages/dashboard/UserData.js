import React, { useState, useEffect } from "react";
import axios from "axios";
import UserInformation from "./UserInformation";

const UserData = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/allUser/${currentPage}/${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Lọc các người dùng có vai trò 'USER' hoặc 'LESSOR'
      const filtered = response.data.content.filter((user) =>
        user.roles.some((role) => role.name === "USER" || role.name === "LESSOR")
      );

      setFilteredUsers(filtered);
      setUsers(filtered);
      setTotalPages(response.data.totalPages); // Tổng số trang từ backend
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  return (
    <div>
      <UserInformation
        users={users}
        filteredUsers={filteredUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        handlePageClick={handlePageClick}
        setUsers={setUsers}
      />
    </div>
  );
};

export default UserData;
