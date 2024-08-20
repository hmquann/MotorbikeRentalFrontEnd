import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopUp from "./TopUp";
import WithDraw from "./WithDraw";
import TransactionListModal from "./TransactionModal";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import apiClient from "../../axiosConfig";
import TransactionList from "./TransactionModal";
import PopupSuccess from "../myBooking/PopUpSuccess";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const UserWallet = () => {
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showPopupSuccess, setShowPopupSuccess] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchUserBalance();
      fetchTransactions();
    }
  }, []);

  useEffect(() => {
    const roles = localStorage.getItem("roles");
    const token = localStorage.getItem("token");

    if (token) {
      setUserRole(roles || "");
    }
  }, []);

  const isAdmin = userRole && userRole.includes("ADMIN");

  const fetchUserBalance = async () => {
    const userId = JSON.parse(localStorage.getItem("user")).userId;
    const token = localStorage.getItem("token");

    try {
      const response = await apiClient.get(`/api/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const user = response.data;
        setBalance(user.balance);
      } else {
        console.error("Failed to fetch user balance");
      }
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };

  const fetchTransactions = async () => {
    const userId = JSON.parse(localStorage.getItem("user")).userId;
    const token = localStorage.getItem("token");

    try {
      const response = await apiClient.get(`/api/transaction/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        setTransactions(response.data);
      } else {
        console.error("Failed to fetch transactions");
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  };

  const handlePayment = async (amount) => {
    const token = localStorage.getItem("token");
    const userId = JSON.parse(localStorage.getItem("user")).userId;
    const apiPayment = `/api/payment/create_payment?id=${userId}&amount=${amount}`;

    try {
      const response = await apiClient.get(apiPayment, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const paymentDto = response.data;
        if (paymentDto.status === "OK") {
          const url = paymentDto.url.replace(
            "http://localhost:8080",
            "https://rentalmotorbikewebapp.azurewebsites.net"
          );
          window.location.href = url;
        } else {
          setError("Payment initiation failed.");
        }
      } else {
        console.error("Payment initiation failed");
        setError("Payment initiation failed.");
      }
    } catch (error) {
      console.error("Error during payment initiation:", error);
      setError("Error during payment initiation.");
    }
  };

  const handleWithdraw = async (amount, bankAccount, bankName) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;
    try {
      const response = await apiClient.post(`/api/payment/withdraw`, null, {
        params: {
          id: userId,
          amount: amount,
          accountNumber: bankAccount,
          bankName: bankName,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to withdraw");
      }
      const now = new Date();
      const admin = await apiClient.get("api/user/getAdmin");
      const adminId = admin.data.id;
      await setDoc(doc(collection(db, "notifications")), {
        userId: adminId,
        message: JSON.stringify({
          title:
            '<strong style="color: rgb(34 197 94)">Yêu cầu rút tiền</strong>',
          content: `Yêu cầu rút số tiền <strong>${amount.toLocaleString()}</strong> từ tài khoản <strong>${
            user.firstName
          } ${user.lastName}</strong> vừa được gửi.`,
        }),
        timestamp: now,
        seen: false,
      });
      fetchTransactions();
      await fetchUserBalance();
      setShowPopupSuccess(true);
    } catch (error) {
      console.error("Error during withdrawal:", error);
    }
  };

  const handlePopUpSuccess = () => {
    setShowPopupSuccess(false);
  };

  const handleDepositClick = () => {
    setShowTopUpModal(true);
  };

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handleSearch = () => {
    if (showTransactions) {
      setShowTransactions(false);
      setSelectedTransactions([]);
    } else {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
      toDateObj.setHours(23, 59, 59, 999);

      const filtered = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        return transactionDate >= fromDateObj && transactionDate <= toDateObj;
      });
      if (filtered.length === 0) {
        setError("Không tìm thấy giao dịch nào");
      } else {
        setShowTransactions(true);
        setFilteredTransactions(filtered);
        setPage(0);
        setHasSearched(true);
        setSelectedTransactions(filtered);
        setError("");
      }
    }
  };

  const handleModalClose = () => {
    setFilteredTransactions([]);
    setHasSearched(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl font-manrope">
      <h1 className="text- font-bold">Ví của tôi</h1>
      <p className="mt-4 text-lg font-medium">Số dư khả dụng:</p>
      <p className="text-3xl text-green-600 font-base">
        {balance.toLocaleString()} VND
      </p>
      <div className="mt-4 flex space-x-4">
        <button
          className={`bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded transition hover:scale-105`}
          onClick={handleWithdrawClick}
        >
          Rút tiền
        </button>
        <button
          className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition hover:scale-105`}
          onClick={handleDepositClick}
        >
          Nạp tiền
        </button>
      </div>
      <h2 className="mt-8 text-3xl font-bold">Giao dịch</h2>
      <div className="mt-4 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <label htmlFor="from-date" className="text-lg">
            Từ
          </label>
          <input
            id="from-date"
            type="date"
            className="border border-zinc-300 p-2 rounded"
            value={fromDate}
            onChange={handleFromDateChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="to-date" className="text-lg">
            Đến
          </label>
          <input
            id="to-date"
            type="date"
            className="border border-zinc-300 p-2 rounded"
            value={toDate}
            onChange={handleToDateChange}
          />
        </div>
        <button
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded`}
          onClick={handleSearch}
        >
          {showTransactions ? "Ẩn giao dịch" : "Tìm"}
        </button>
      </div>
      {showTransactions && (
        <TransactionList transactions={selectedTransactions} />
      )}
      <Modal
        show={showWithdrawModal}
        onHide={() => setShowWithdrawModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Rút tiền</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WithDraw
            balance={balance}
            onClose={() => setShowWithdrawModal(false)}
            onConfirm={(amount, bankAccount, bankName) => {
              handleWithdraw(amount, bankAccount, bankName);
              setShowWithdrawModal(false);
            }}
            setError={setError}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="transition hover:scale-105"
            onClick={() => setShowWithdrawModal(false)}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      {showPopupSuccess && (
        <PopupSuccess
          show={showPopupSuccess}
          onHide={handlePopUpSuccess}
          message={
            isAdmin
              ? "Bạn đã rút tiền thành công!"
              : "Bạn đã gửi yêu cầu rút tiền thành công!"
          }
        />
      )}

      <Modal show={showTopUpModal} onHide={() => setShowTopUpModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nạp tiền</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TopUp
            onClose={() => setShowTopUpModal(false)}
            onConfirm={(amount) => {
              handlePayment(amount);
              setShowTopUpModal(false);
            }}
            setError={setError}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="transition hover:scale-105"
            onClick={() => setShowTopUpModal(false)}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      {error && (
        <div className="text-red-500 font-semibold mt-2 ml-10">{error}</div>
      )}
    </div>
  );
};

export default UserWallet;
