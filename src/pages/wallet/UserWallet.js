import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopUp from "./TopUp";
import WithDraw from "./WithDraw";
import TransactionListModal from "./TransactionModal";

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
  const [modalOpen, setModalOpen] = useState(false); 
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

  const fetchUserBalance = async () => {
    const userId = JSON.parse(localStorage.getItem("user")).userId;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const response = await axios.get(
        `http://localhost:8080/api/transaction/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
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
    const apiPayment = `http://localhost:8080/api/payment/create_payment?id=${userId}&amount=${amount}`;

    try {
      const response = await axios.get(apiPayment, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const paymentDto = response.data;
        if (paymentDto.status === "OK") {
          window.location.href = paymentDto.url;
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

  const handleWithdraw = async (amount) => {
    const token = localStorage.getItem("token");
    const userId = JSON.parse(localStorage.getItem("user")).userId;
    try {
      const response = await axios.post(`http://localhost:8080/api/payment/withdraw`, null, {
        params: {
          id: userId,
          amount: amount,
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to withdraw');
      }

      const data = response.data;
      setBalance((prevBalance) => prevBalance - parseFloat(amount));
      fetchTransactions()

    } catch (error) {
      console.error('Error during withdrawal:', error);
    }
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
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      return (
        transactionDate.getFullYear() === fromDateObj.getFullYear() &&
        transactionDate.getMonth() === fromDateObj.getMonth() &&
        transactionDate.getDate() >= fromDateObj.getDate() &&
        transactionDate.getFullYear() === toDateObj.getFullYear() &&
        transactionDate.getMonth() === toDateObj.getMonth() &&
        transactionDate.getDate() <= toDateObj.getDate()
      );
    });
    if(filtered.length === 0){
      setError("No transaction found for the selected date range");
      setModalOpen(false);
    }else{
    setFilteredTransactions(filtered);
    setPage(0); 
    setHasSearched(true);
    setModalOpen(true)
    setSelectedTransactions(filtered)
    setError("")
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFilteredTransactions([]); 
    setHasSearched(false); 
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl dark:bg-zinc-800">
      <h1 className="text-3xl font-bold">My Wallet</h1>
      <p className="mt-4 text-lg font-medium">Your current balance:</p>
      <p className="text-3xl text-green-600 font-base">{balance.toLocaleString()} VND</p>
      <div className="mt-4 flex space-x-4">
        <button
          className={`bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded`}
          onClick={handleWithdrawClick}
        >
          Withdraw
        </button>
        <button
          className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded`}
          onClick={handleDepositClick}
        >
          Top-up
        </button>
      </div>
      <h2 className="mt-8 text-3xl font-bold">Transactions</h2>
      <div className="mt-4 flex space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="from-date" className="text-lg">
            From
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
            To
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
          Search
        </button>
      </div>
      {modalOpen && (
        <TransactionListModal
          transactions={selectedTransactions} 
          onClose={handleModalClose} 
        />
      )}

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-slate-200 p-4 rounded-lg shadow-lg">
            <WithDraw 
              balance={balance}
              onClose={() => setShowWithdrawModal(false)}
              onConfirm={(amount) => {
                handleWithdraw(amount);
                setShowWithdrawModal(false);
              }}
              setError={setError}
            />
          </div>
        </div>
      )}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-slate-200 p-4 rounded-lg shadow-lg">
            <TopUp 
              onClose={() => setShowTopUpModal(false)}
              onConfirm={(amount) => {
                handlePayment(amount); 
                setShowTopUpModal(false);
              }}
              setError={setError}
            />
          </div>
        </div>
      )}
      {error && <div className="text-red-500 font-medium mt-2 ml-10">{error}</div>}
    </div>
  );
};

export default UserWallet;
