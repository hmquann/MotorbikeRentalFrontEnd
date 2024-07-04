import React, { useState } from "react";

const UserDetail = ({ user, onClose }) => {
  const cardClass =
    "bg-card dark:bg-card-foreground p-4 rounded-lg shadow-md bg-zinc-100 ";
  const buttonClass = "px-3 py-1 rounded-full flex-1";
  const destructiveButtonClass = "p-2 rounded-full";
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

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        className={`relative w-full md:w-5/6 lg:w-2/3 ${cardClass}`}
        style={{ maxHeight: "95vh", display: "flex", flexDirection: "column" }}
      >
        <div className="flex flex-col md:flex-row w-full gap-4">
          {/* Left Side: User Information */}
          <div className="md:w-1/2 flex-1 p-4 rounded-lg shadow-md bg-white">
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
                <div className="text-lg font-semibold text-zinc-500">Role</div>
                <button
                  className={`bg-primary text-white ${buttonClass}`}
                  style={{ minWidth: "150px" }}
                >
                  {user.role.join(", ")}
                </button>
              </div>
              <div className="flex-1 text-center">
                <div className="text-lg font-semibold text-zinc-500">
                  Status
                </div>
                <button
                  className={`px-4 py-1 rounded-full ${
                    user.active
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                  style={{ minWidth: "150px" }}
                >
                  {user.active ? "ACTIVE" : "INACTIVE"}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-semibold">Detail Information</h3>
              <hr className="my-3 border-t-2 border-gray-500" />
              <p>
                <strong>First Name:</strong> {user.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {user.lastName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Gender:</strong> {user.gender ? "Male" : "Female"}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Balance:</strong> {user.balance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Right Side: Motorbike List or Booking List */}
          <div className="flex-1 p-4 rounded-lg shadow-md bg-white  ">
            <div className="flex justify-between mb-3">
              <button
                className={`px-4 py-2 rounded ${buttonClass} ${
                  activeButton === "motorbikes"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-300 hover:bg-zinc-400"
                }`}
                onClick={showMotorbikesList}
              >
                Motorbikes
              </button>
              <button
                className={`px-4 py-2 rounded ml-3 ${buttonClass} ${
                  activeButton === "bookings"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-300 hover:bg-zinc-400"
                }`}
                onClick={showBookingList}
              >
                Bookings
              </button>
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
                    <i className="flex justify-end text-blue-600 text-lg font-bold mb-3">
                      Total of motorbikes: {user.motorbikes.length}
                    </i>
                  )}
                  {user.motorbikes && user.motorbikes.length > 0 ? (
                    <ul className="mt-2">
                      {user.motorbikes.map((motorbike) => (
                        <li key={motorbike.id}>
                          <p>
                            <strong>Model:</strong> {motorbike.model.modelName}
                          </p>
                          <p>
                            <strong>Motorbike Plate:</strong>{" "}
                            {motorbike.motorbikePlate}
                          </p>
                          <p>
                            <strong>Address Detail:</strong>{" "}
                            {motorbike.motorbikeAddress}
                          </p>
                          {/* Add more motorbike details as needed */}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-red-600 font-medium">
                      No motorbikes owned.
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold mb-3">Bookings</h3>
                  {user.bookings && user.bookings.length > 0 ? (
                    <ul className="mt-2">
                      {user.bookings.map((booking) => (
                        <li key={booking.id}>
                          <p>
                            <strong>Booking ID:</strong> {booking.id}
                          </p>
                          <p>
                            <strong>Booking Date:</strong> {booking.bookingDate}
                          </p>
                          {/* Add more booking details as needed */}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-red-600 font-medium">
                      No bookings found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-3">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
