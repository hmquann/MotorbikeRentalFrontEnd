import React, { useState } from "react";
import axios from "axios";

const BUTTON_CLASS = "px-4 py-2 rounded w-28 flex items-center justify-center";
const GREEN_BUTTON_CLASS =
  "bg-green-500 text-white  hover:bg-green-600 " + BUTTON_CLASS;
const RED_BUTTON_CLASS =
  "bg-red-500 text-white  hover:bg-red-600 " + BUTTON_CLASS;
const HEADER_CLASS = "py-3 px-4 font-semibold text-uppercase text-md";
const CELL_CLASS = "py-3 px-4";

const UserInformation = ({
  users,
  currentPage,
  totalPages,
  handleNextPage,
  handlePreviousPage,
  handlePageClick,
  fetchUsers,
  setUsers
}) => {
  const [activeUserId, setActiveUserId] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleUserStatus = async (id) => {
    setSelectedUserId(id);
    setShowConfirmation(true);
  };

  const confirmToggleUserStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:8080/api/user/${id}/toggle`);

      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      );
      setUsers(updatedUsers);

      setSelectedUserId(null);
      setShowConfirmation(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const statusUser = users.find((user) => user.id === selectedUserId);

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
    <div className="max-w-5xl mx-auto bg-zinc-100 p-4">
      <div className="bg-white shadow rounded-lg overflow-hidden divide-y">
        <div className="p-4 text-center bg-gradient-to-r from-slate-500 from-60% to-zinc-500">
          <h1 className="text-4xl font-bold text-white flex text-start">
            User Information
          </h1>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-zinc-200 text-center">
                <th className={HEADER_CLASS}>User Name</th>
                <th className={HEADER_CLASS}>Email</th>
                <th className={HEADER_CLASS}>Phone</th>
                <th className={HEADER_CLASS}>Roles</th>
                <th className={HEADER_CLASS}>Status</th>
                <th className={HEADER_CLASS}>Change Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-400">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className=" text-center transition duration-300 ease-in-out hover:bg-neutral-100"
                >
                  <td
                    className="font-semibold"
                    onClick={() => handleUserClick(user)}
                  >
                    {user.firstName} {user.lastName}
                  </td>
                  <td className={CELL_CLASS}>{user.email}</td>
                  <td className={CELL_CLASS}>{user.phone}</td>
                  <td className={CELL_CLASS}>
                    {user.roles.map((role, index) => (
                      <span key={index}>
                        {role.name}
                        {index !== user.roles.length - 1 && ","}
                      </span>
                    ))}
                  </td>
                  
                  <td className={CELL_CLASS}>
                    {user.active ? "Active" : "Not Active"}
                  </td>
                  <td className={CELL_CLASS}>
                    <button
                      className={`px-4 py-2 rounded ${
                        user.active ? RED_BUTTON_CLASS : GREEN_BUTTON_CLASS
                      }`}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-3 bg-zinc-50 flex justify-between items-center">
          <div className="text-sm text-zinc-700">
            Showing <span className="font-medium">{users.length}</span> out of{" "}
            <span className="font-medium">{users.length}</span> entries
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
      </div>
      {showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white text-lg p-6 rounded-lg">
          <p>
              Are you sure you want to {statusUser?.active ? "deactivate" : "activate"}{" "}
            <strong> {statusUser?.firstName} {statusUser?.lastName}?</strong>
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                onClick={() => confirmToggleUserStatus(selectedUserId)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default UserInformation;
