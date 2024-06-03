import React, { useState, useEffect } from "react";
import axios from "axios";

const BUTTON_CLASS = "px-4 py-2 rounded";
const GREEN_BUTTON_CLASS = "bg-green-500 text-white " + BUTTON_CLASS;
const RED_BUTTON_CLASS = "bg-red-500 text-white " + BUTTON_CLASS;
const HEADER_CLASS = "py-3 px-4 font-semibold text-sm";
const CELL_CLASS = "py-3 px-4";

const UserInformation = () => {
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Lấy dữ liệu + cập nhật state
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/user/allUser"
      );
      const filteredUsers = response.data.filter((user) => {
        // Lọc ra các người dùng có vai trò 'USER'
        return user.roles.some((role) => role.name === "USER");
      });
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (id) => {
    setSelectedUserId(id);
    setShowConfirmation(true);
  };

  const confirmToggleUserStatus = async (id) => {
    try {
      const user = users.find((user) => user.id === id);

      await axios.patch(`http://localhost:8080/api/user/${id}/toggle`);

      // Update the local state
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      );
      setUsers(updatedUsers);

      setSelectedUserId(null);
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user); // Đặt thông tin người dùng được chọn vào state
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex justify-between items-center bg-zinc-200 p-4">
          <img src="https://placehold.co/100x40" alt="Logo" className="h-10" />
        </div>
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold">User Information</h1>
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
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className=" text-center">
                  <td
                    className={CELL_CLASS + " cursor-pointer"}
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
                        {index !== user.roles.length - 1 && ", "}
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
        </div>
      </div>
      {showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <p className="text-lg mb-4">
              {users.find((user) => user.id === selectedUserId).active
                ? "Are you sure to Deactivate?"
                : "Are you sure to Activate?"}
            </p>
            <div className="flex justify-center">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                onClick={() => confirmToggleUserStatus(selectedUserId)}
              >
                Yes
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setShowConfirmation(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedUser && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl mb-4">User Details</h2>
            <p>
              <strong>Name:</strong> {selectedUser.firstName}{" "}
              {selectedUser.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedUser.phone}
            </p>
            <p>
              <strong>Roles:</strong>{" "}
              {selectedUser.roles.map((role) => role.name).join(", ")}
            </p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg mt-6  "
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInformation;
