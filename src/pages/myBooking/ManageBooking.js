import { faCalendarDays, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import RentalDocument from "../booking/rentaldocument/RentalDocument";
import PopUpConfirm from "./PopUpConfirm";
import { useNavigate } from "react-router-dom";
import PopUpSuccess from "./PopUpSuccess";

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
  const [renterName, setRenterName] = useState();
  const [pricePerDay, setPricePerDay] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [action, setAction] = useState("");
  const [showPopupSuccess, setShowPopupSuccess] = useState(false); // Add this state
  const navigate = useNavigate(); // Add this hook

  useEffect(() => {
    const fetchMotorbike = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/motorbike/getMotorbikeById/${booking.motorbikeId}`
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

        const response2 = await axios.get(
          `http://localhost:8080/api/user/${booking.renterId}`
        );
        console.log(response2.data);
        setRenterName(response2.data.firstName + " " + response2.data.lastName);
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
        : "Bạn có chắc chắn muốn từ chối chuyến này?"
    );
    setAction(actionType);
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    try {
      const status = action === "accept" ? "PENDING_DEPOSIT" : "REJECTED";
      const url = `http://localhost:8080/api/booking/changeStatus/${booking.bookingId}/${status}`;
      await axios.put(url);
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
    <div className="p-12 bg-gray">
      <div
        className={`${statusStyle.bg} ${statusStyle.text} p-4 rounded-lg flex items-center mb-6`}
      >
        <FontAwesomeIcon icon={statusStyle.icon} className="mr-2" />
        <span>{booking.status}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-6">
            <img
              className="object-cover rounded-t-lg"
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
                src="https://placehold.co/48x48"
                alt="User avatar"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="font-semibold">{renterName}</h4>
                <p className="text-gray-500">Khách thuê</p>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-gray-500">
                <FontAwesomeIcon icon={faMapPin} /> Địa điểm giao nhận xe
              </h4>
              <p className="text-gray-700">{booking.receiveLocation}</p>
              <a href="#" className="text-blue-500 underline">
                Xem bản đồ
              </a>
            </div>
            <div className="mb-6">
              <h4 className="text-gray-500">
                Tổng tiền: {booking.totalPrice.toLocaleString("vi-VN")}vnd
              </h4>
            </div>
            <div>
              <h4 className="text-gray-500">Lời nhắn riêng:</h4>
              <p className="text-gray-700">Không có lời nhắn</p>
            </div>
            <div className="flex p-1 mt-6">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded mb-2 mr-4 w-full text-center"
                style={{ backgroundColor: "rgb(240, 68, 56)" }}
                onClick={() => handleAction("reject")}
              >
                Từ chối
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded mb-2 w-full text-center"
                style={{ backgroundColor: "#5fcf86" }}
                onClick={() => handleAction("accept")}
              >
                Chấp nhận
              </button>
            </div>
            {showPopup && (
              <PopUpConfirm
                message={popupContent}
                onConfirm={handleConfirm}
                onCancel={() => setShowPopup(false)}
              />
            )}
            {showPopupSuccess && (
              <PopUpSuccess message="Bạn đã cập nhật thành công trạng thái chuyến!"></PopUpSuccess>
            )}
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
