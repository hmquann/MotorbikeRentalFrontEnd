import React, { useState } from "react";
import { format } from 'date-fns';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const UserDetail = ({ user, onClose }) => {
  const [showMotorbikes, setShowMotorbikes] = useState(true);
  const [activeButton, setActiveButton] = useState("motorbikes");

  if (!user) return null;

  const showMotorbikesList = () => {
    setShowMotorbikes(true);
    setActiveButton("motorbikes");
  };

  const showBookingList = () => {
    setShowMotorbikes(false);
    setActiveButton("bookings");
  };
  const roleMap = {
    USER: "Người dùng",
    LESSOR: "Chủ xe",
    ADMIN: "Quản trị viên"
  };

  const mapRoles = (roles) => {
    return roles.map(role => roleMap[role] || role).join(", ");
  };

  return (
    <Modal show onHide={onClose} size="xl" >
      <Modal.Body>
        <div className="flex flex-col md:flex-row w-full gap-4 shadow-lg rounded-lg">
          {/* Left Side: User Information */}
          <div className="md:w-1/2 flex-1 p-4 rounded-lg bg-white shadow-lg">
            <div className="flex items-center flex-col">
              <img
                src="https://cdn.vectorstock.com/i/1000v/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"
                alt="Avatar"
                className="rounded-full w-20 h-20"
              />
              <h2 className="text-xl font-semibold text-center">
                {user.firstName} {user.lastName}
              </h2>
            </div>

            <div className="flex justify-between mt-4">
              <div className="flex-1 text-center">
                <div className="text-lg font-semibold text-zinc-500">Vai trò</div>
                <button
                  className={`bg-primary text-white px-3 py-1 rounded-full flex-1`}
                  style={{ minWidth: "150px" }}
                >
                  {mapRoles(user.role)}
                </button>
              </div>
              <div className="flex-1 text-center">
                <div className="text-lg font-semibold text-zinc-500">Trạng thái</div>
                <button
                  className={`px-4 py-1 rounded-full ${
                    user.active
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                  style={{ minWidth: "150px" }}
                >
                  {user.active ? "Hoạt động" : "Không hoạt động"}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-semibold">Thông tin chi tiết</h3>
              <hr className="my-3 border-t-2 border-gray-500" />
              <p>
                <strong>Họ và tên:</strong> {user.firstName} {user.lastName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Giới tính:</strong> {user.gender ? "Nam" : "Nữ"}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {user.phone}
              </p>
              <p>
                <strong>Số dư khả dụng:</strong> {user.balance.toLocaleString()} VND
              </p>
            </div>
          </div>

          {/* Right Side: Motorbike List or Booking List */}
          <div className="flex-1 p-4 rounded-lg shadow-lg bg-white">
            <div className="flex justify-between mb-3">
              <Button
                variant={activeButton === "motorbikes" ? "warning" : "light"}
                onClick={showMotorbikesList}
              >
                Xe máy
              </Button>
              <Button
                variant={activeButton === "bookings" ? "warning" : "light"}
                onClick={showBookingList}
              >
                Chuyến đi
              </Button>
            </div>
            <div
              style={{
                maxHeight: "calc(90vh - 10rem)",
                overflowY: "auto",
                minHeight: "20rem",
              }}
            >
              {showMotorbikes ? (
                <div>
                  {user.motorbikes && (
                    <i className="flex justify-end text-blue-600 text-lg font-bold mb-3 mr-3">
                      Tổng số xe: {user.motorbikes.length} chiếc
                    </i>
                  )}
                  {user.motorbikes && user.motorbikes.length > 0 ? (
                    <ul className="mt-2 space-y-4">
                      {user.motorbikes.map((motorbike, index) => (
                        <li key={motorbike.id} className="border-b border-gray-300 pb-2">
                          <p>
                            <strong>Mẫu xe:</strong> {motorbike.model.modelName}
                          </p>
                          <p>
                            <strong>Biển xe:</strong> {motorbike.motorbikePlate}
                          </p>
                          <p>
                            <strong>Địa chỉ chi tiết:</strong> {motorbike.motorbikeAddress}
                          </p>
                          {/* Add more motorbike details as needed */}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-red-600 font-medium">Không sở hữu chiếc xe nào.</p>
                  )}
                </div>
              ) : (
                <div>
                  {user.bookings && (
                    <i className="flex justify-end text-blue-600 text-lg font-bold mb-3 mr-3">
                      Tổng số chuyến đi: {user.bookings.length} chuyến
                    </i>
                  )}
                  <div>
                    {user.bookings && user.bookings.length > 0 ? (
                      <ul className="mt-2 space-y-4">
                        {user.bookings.map((booking) => (
                          <li key={booking.id} className="border-b border-gray-300 pb-2">
                            <p>
                              <strong>Start Date:</strong> {format(new Date(booking.startDate), 'dd-MM-yyyy HH:mm:ss')}
                            </p>
                            <p>
                              <strong>End Date:</strong> {format(new Date(booking.endTime), 'dd-MM-yyyy HH:mm:ss')}
                            </p>
                            <p>
                              <strong>Price:</strong> {booking.totalPrice} VND
                            </p>
                            <p>
                              <strong>Status:</strong> {booking.status}
                            </p>
                            {/* Add more booking details as needed */}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-red-600 font-medium">Không có chuyến đi nào.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" className="transition hover:scale-105" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetail;
