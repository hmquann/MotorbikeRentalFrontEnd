import { faCalendarDays, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import RentalDocument from "../booking/rentaldocument/RentalDocument";
import PopUpConfirm from "./PopUpConfirm";
import { useNavigate } from "react-router-dom";
import PopUpSuccess from "./PopUpSuccess";
import apiClient from "../../axiosConfig";
import FeedbackModal from "../booking/FeedbackModal";

const statusTranslations = {
  PENDING: "Chờ duyệt",
  PENDING_DEPOSIT: "Chờ đặt cọc",
  DEPOSIT_MADE: "Đã đặt cọc",
  DONE: "Hoàn thành",
  RENTING: "Đang trong chuyến",
  CANCELED: "Đã hủy",
  REJECTED: "Đã từ chối",
};

const statusStyles = {
  PENDING: {
    bg: "bg-orange-200",
    text: "text-orange-600",
    icon: "fa-regular fa-clock",
  },
  PENDING_DEPOSIT: {
    bg: "bg-orange-200",
    text: "text-orange-600",
    icon: "fa-regular fa-clock",
  },
  DEPOSIT_MADE: {
    bg: "bg-green-200",
    text: "text-green-600",
    icon: "fa-solid fa-money-bill-transfer",
  },
  DONE: {
    bg: "bg-green-200",
    text: "text-green-600",
    icon: "fa-solid fa-money-bill-transfer",
  },
  RENTING: {
    bg: "bg-green-200",
    text: "text-green-600",
    icon: "fa-solid fa-motorcycle",
  },
  REJECTED: {
    bg: "bg-red-200",
    text: "text-red-600",
    icon: "fa-regular fa-circle-xmark",
  },
  CANCELED: {
    bg: "bg-red-200",
    text: "text-red-600",
    icon: "fa-regular fa-circle-xmark",
  },
};

export default function Widget() {
  const booking = JSON.parse(localStorage.getItem("booking"));
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const [motorbikeName, setMotorbikeName] = useState();
  const [lessorName, setLessorName] = useState();
  const [urlImage, setUrlImage] = useState();
  const [lessorId, setLessorId] = useState();
  const [pricePerDay, setPricePerDay] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [action, setAction] = useState("");
  const [showPopupSuccess, setShowPopupSuccess] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMotorbike = async () => {
      try {
        const response = await apiClient.get(
          `/api/motorbike/${booking.motorbikeId}`
        );
        console.log(response.data);
        setMotorbikeName(
          `${response.data.model.modelName} ${response.data.yearOfManufacture}`
        );
        setLessorName(
          `${response.data.user.firstName} ${response.data.user.lastName}`
        );
        setUrlImage(response.data.motorbikeImages[0].url);
        setLessorId(response.data.user.userId);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchMotorbike();
  }, [booking.motorbikeId]);

  const statusStyle = statusStyles[booking.status];

  const handleAction = (actionType) => {
    setPopupContent(
      actionType === "accept"
        ? "Bạn có chắc chắn muốn duyệt chuyến này?"
        : actionType === "canceled"
        ? "Bạn có chắc chắn muốn hủy chuyến này?"
        : actionType === "deposit_made"
        ? `Bạn có chắc chắn muốn thanh toán ${(
            (booking.totalPrice * 30) /
            100
          ).toLocaleString("vi-VN")}đ tiền cọc?`
        : ""
    );
    setAction(actionType);
    setShowPopup(true);
  };

  const openFeedback = () => {
    setShowFeedbackModal(true);
  };

  const closeFeedback = () => {
    setShowFeedbackModal(false);
  };

  const handleConfirm = async () => {
    try {
      let status;
      if (action === "canceled") {
        status = "CANCELED";
      } else if (action === "deposit_made") {
        status = "DEPOSIT_MADE";
      } else if (action === "complete") {
        status = "DONE";
      }
      const url = `/api/booking/changeStatus/${booking.bookingId}/${status}`;
      await apiClient.put(url);
      setShowPopup(false);
      setShowPopupSuccess(true); // Show success popup
      setTimeout(() => {
        setShowPopupSuccess(false); // Hide success popup after 3 seconds
        navigate("/menu/myBooking"); // Navigate to myBooking page
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-12 bg-gray font-manrope">
      <div
        className={`${statusStyle.bg} ${statusStyle.text} p-4 rounded-lg flex items-center mb-6`}
      >
        <FontAwesomeIcon icon={statusStyles.icon} className="mr-2" />
        <span>{statusTranslations[booking.status]}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-6">
            <img
              className="object-cover rounded-lg md:mr-4 mb-4 md:mb-0"
              style={{ height: "200px", width: "350px" }}
              src={urlImage}
              alt="Motorbike"
            />
            <div>
              <h2 className="text-2xl font-bold">{motorbikeName}</h2>
              <a href="#" className="text-blue-500 underline">
                Xem lộ trình
              </a>
              <p className="text-gray-600">{booking.receiveLocation}</p>
            </div>
          </div>
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-gray-500">
                  {" "}
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    size="lg"
                    color="gray"
                  />{" "}
                  Bắt đầu thuê xe
                </h4>
                <p className="text-gray-700">
                  {dayjs(booking.startDate).format("HH:mm - DD/MM/YYYY")}
                </p>
              </div>
              <div>
                <h4 className="text-gray-500">
                  {" "}
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    size="lg"
                    color="gray"
                  />{" "}
                  Kết thúc thuê xe
                </h4>
                <p className="text-gray-700">
                  {dayjs(booking.endDate).format("HH:mm - DD/MM/YYYY")}
                </p>
              </div>
            </div>
          </div>
          <RentalDocument></RentalDocument>
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Tài sản thế chấp</h3>
            <p className="text-gray-700">
              15 triệu (tiền mặt/chuyển khoản cho chủ xe khi nhận xe) hoặc Xe
              máy (kèm cà vẹt gốc) giá trị 15 triệu
            </p>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Điều khoản</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Quy định khác:</li>
              <li>Không sử dụng xe vào mục đích phi pháp, trái pháp luật.</li>
              <li>
                Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật.
              </li>
              <li>Không sử dụng xe thuê để cầm cố, thế chấp.</li>
              <li>Không chở hàng cấm, hàng hóa có mùi trong xe.</li>
              <li>Không chở hàng quá cước hoặc quá tải.</li>
              <li>Không hút thuốc trong xe.</li>
              <li>
                Không chở hàng cấm, hàng hóa có mùi trong xe, khách hàng vi phạm
                sẽ bị phạt vệ sinh xe sạch sẽ hoặc gửi phụ thu phí vệ sinh xe.
              </li>
              <li>
                Trân trọng cảm ơn, chúc quý khách hàng có những chuyến đi tuyệt
                vời!
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">Chính sách huỷ chuyến</h3>
            <table className="w-full border border-muted-foreground text-sm">
              <thead>
                <tr>
                  <th className="border border-muted-foreground p-2">
                    Thời Gian Hủy Chuyến
                  </th>
                  <th className="border border-muted-foreground p-2">
                    Khách Thuê Hủy Chuyến
                  </th>
                  <th className="border border-muted-foreground p-2">
                    Chủ Xe Hủy Chuyến
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-muted-foreground p-2">
                    Trong Vòng 1h Từ Lúc Đặt Cọc
                  </td>
                  <td className="border border-muted-foreground p-2 text-green-600">
                    Hoàn tiền cọc 100%
                  </td>
                  <td className="border border-muted-foreground p-2 text-green-600">
                    Hoàn tiền cọc 100%
                  </td>
                </tr>
                <tr>
                  <td className="border border-muted-foreground p-2">
                    Trước Chuyến 7 Ngày
                  </td>
                  <td className="border border-muted-foreground p-2 text-yellow-600">
                    Hoàn tiền cọc 70%
                  </td>
                  <td className="border border-muted-foreground p-2 text-yellow-600">
                    Hoàn tiền cọc 70%
                  </td>
                </tr>
                <tr>
                  <td className="border border-muted-foreground p-2">
                    Trong 7 Ngày / Trước Chuyến
                  </td>
                  <td className="border border-muted-foreground p-2 text-red-600">
                    Không hoàn tiền
                  </td>
                  <td className="border border-muted-foreground p-2 text-red-600">
                    Phạt 50%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <div className="flex items-center mb-6">
              <img
                src="https://n1-cstg.mioto.vn/m/avatars/avatar-0.png"
                alt="User avatar"
                className="w-14 h-14 rounded-full mr-4 mb-3"
              />
              <div>
                <h4 className="font-semibold">{lessorName}</h4>
                <p className="text-gray-500">Chủ xe</p>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-gray-500">
                <FontAwesomeIcon icon={faMapPin}></FontAwesomeIcon> Địa điểm
                giao nhận xe
              </h4>
              <p className="text-gray-700">{booking.receiveLocation}</p>
              <a href="#" className="text-blue-500 underline">
                Xem bản đồ
              </a>
            </div>
            <div className="mb-6">
              <h5 className="text-gray-500">
                Tổng tiền:{" "}
                <span className="font-bold">
                  {booking.totalPrice.toLocaleString("vi-VN")}đ
                </span>
              </h5>
            </div>
            <div className="mb-6">
              <h5 className="text-gray-500">
                Đặt cọc qua ứng dụng:{" "}
                <span className="font-bold">
                  {((booking.totalPrice * 30) / 100).toLocaleString("vi-VN")}đ
                </span>
              </h5>
            </div>
            <div className="mb-6">
              <h5 className="text-gray-500">
                Thanh toán khi nhận xe:{" "}
                <span className="font-bold">
                  {((booking.totalPrice * 70) / 100).toLocaleString("vi-VN")}đ
                </span>
              </h5>
            </div>
            <div className="flex p-1 mt-6 justify-center">
              {booking.status === "PENDING" && (
                <>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded mb-2 mr-4 w-full text-center transition hover:scale-105"
                    onClick={() => handleAction("canceled")}
                  >
                    Hủy chuyến
                  </button>
                </>
              )}
              {booking.status === "PENDING_DEPOSIT" && (
                <>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded mb-2 mr-4 w-full text-center transition hover:scale-105"
                    onClick={() => handleAction("canceled")}
                  >
                    Hủy chuyến
                  </button>
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:scale-105"
                    onClick={() => handleAction("deposit_made")}
                  >
                    Đặt cọc
                  </button>
                </>
              )}

              {booking.status === "DONE" && (
                <button
                onClick={openFeedback}
                className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center transition hover:scale-105">
                  Đánh giá
                </button>
              )}
            </div>
            {showPopup && (
              <PopUpConfirm
                show={showPopup}
                message={popupContent}
                onConfirm={handleConfirm}
                onCancel={() => setShowPopup(false)}
              />
            )}
            {showPopupSuccess && (
              <PopUpSuccess
                show={showPopupSuccess}
                onHide={() => setShowPopupSuccess(false)}
                message="Bạn đã cập nhật thành công trạng thái chuyến !"
              />
            )}
            <FeedbackModal
              show={showFeedbackModal}
              onHide={closeFeedback}
              bookingId={booking.bookingId}
              onFeedbackSubmitted={() => setFeedbackSent(true)}
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold mb-4">
              Phụ phí có thể phát sinh
            </h4>
            <ul className="list-none text-gray-700">
              <li>Phụ phí giao nhận xe tận nơi: 5 000đ/km</li>
              <li>Phụ phí giao nhận xe tại sân bay: 70 000đ</li>
              <li>Phụ phí xe bẩn: 100 000đ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
