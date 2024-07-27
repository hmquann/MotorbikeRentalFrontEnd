import React, { useState } from "react";
import axios from "axios";
import UserDetail from "./UserDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const BUTTON_CLASS = "px-4 py-2 rounded w-28 flex items-center justify-center";
const GREEN_BUTTON_CLASS =
  "py-1 px-2 rounded-lg bg-green-500 text-white  hover:bg-green-600 " 
const RED_BUTTON_CLASS =
  "py-1 px-2 rounded-lg bg-red-500 text-white  hover:bg-red-600 "
const HEADER_CLASS = "py-3 px-4 font-semibold text-uppercase text-gray-500";
const CELL_CLASS = "py-3 px-4 text-md";

const UserInformation = ({
  users,
  currentPage,
  totalPages,
  handleNextPage,
  handlePreviousPage,
  handlePageClick,
  setUsers,
  handleSearch,
  searchTerm,
  isLoading,
  setIsLoading,
}) => {
  const [activeUserId, setActiveUserId] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleUserStatus = async (id) => {
    setSelectedUserId(id);
    setShowConfirmation(true);
  };

  const confirmToggleUserStatus = async (id) => {
    setIsLoading(true);
    try {
      await axios.patch(`https://rentalmotorbikewebapp.azurewebsites.net/api/user/${id}/toggle`);

      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      );

      setShowConfirmation(false);

      setTimeout(() => {
        setUsers(updatedUsers);
        setSelectedUserId(null);
        setShowConfirmation(false);
        setIsLoading(false);
      }, 1000);

      // fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 text-center bg-gradient-to-r from-slate-500 from-60% to-zinc-500">
          <h1 className="text-4xl font-bold text-white flex text-start">
            Quản lý người dùng
          </h1>
        </div>
        <div className="mt-1 mb-1 flex justify-end flex-wrap mx-auto">
          <div className="p-2 w-3/12">
            <input
              type="text"
              placeholder="Tìm theo email hoặc số điện thoại"
              value={searchTerm}
              onChange={handleSearch}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className={HEADER_CLASS}>Tên</th>
                <th className={HEADER_CLASS}>Email</th>
                <th className={HEADER_CLASS}>Điện thoại</th>
                {/* <th className={HEADER_CLASS}>Roles</th> */}
                <th className={HEADER_CLASS}>Trạng thái</th>
                <th className={HEADER_CLASS}>Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-400">
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-amber-700">
                    No user information found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className=" text-center transition duration-300 ease-in-out hover:bg-neutral-200"
                  >
                    <td className="font-semibold">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className={CELL_CLASS}>{user.email}</td>
                    <td className={CELL_CLASS}>{user.phone}</td>
                    {/* <td className={CELL_CLASS}>
                      {user.role.map((role, index) => (
                        <span key={index}>
                          {role}
                          {index !== user.role.length - 1 && ","}
                        </span>
                      ))}
                    </td> */}

                    <td className={CELL_CLASS}>
                      <span
                        className={`px-2 inline-flex text-sm leading-7 font-semibold rounded-full ${
                          user.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.active ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className={CELL_CLASS}>
                      <div className="flex justify-center space-x-4">
                        <button
                          className={`${
                            user.active ? RED_BUTTON_CLASS : GREEN_BUTTON_CLASS
                          }`}
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {/* <FontAwesomeIcon icon={faToggleOn} /> */}
                          {user.active ? <FontAwesomeIcon icon={faToggleOn} /> : <FontAwesomeIcon icon={faToggleOff} />}
                        </button>
                        <button
                          className="py-1 px-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => handleUserClick(user)}
                        >
                          <FontAwesomeIcon icon={faCircleInfo} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="px-6 py-3 bg-zinc-50 flex justify-between items-center">
            <div className="text-sm text-zinc-700">
              Đang hiển thị <span className="font-medium">{users.length}</span> trên{" "}
              <span className="font-medium">{users.length}</span> bản ghi
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
      </div>
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} >
      <Modal.Body>
        <p>
         Bạn có chắc muốn{" "}
          {statusUser?.active ? "bỏ kích hoạt" : "kích hoạt"}{" người dùng  "}
          <strong>
            {statusUser?.firstName} {statusUser?.lastName}
          </strong>
          ?
        </p>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => confirmToggleUserStatus(selectedUserId)}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
      {isModalOpen && <UserDetail user={selectedUser} onClose={closeModal} />}
    </div>
  );
};

export default UserInformation;
