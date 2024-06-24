import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const sharedClasses = {
  blueGradient: 'bg-gradient-to-r from-zinc-400 to-cyan-800',
  zincBorders: 'border-t border-zinc-200 dark:border-zinc-700',
  button: 'px-4 py-2 rounded-lg',
};

const UserWallet = () => {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showAmountInput, setShowAmountInput] = useState(false); // Trạng thái để điều khiển hiển thị phần nhập số tiền
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchUserBalance();
    }
  }, []);

  const fetchUserBalance = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`http://localhost:8080/api/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const user = response.data;
        setBalance(user.balance);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        localStorage.setItem("balance", user.balance);
      } else {
        console.error("Failed to fetch user balance");
      }
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
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

  useEffect(() => {
    const handleWindowFocus = () => {
      fetchUserBalance();
    };

    window.addEventListener("focus", handleWindowFocus);
    return () => {
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  const handleDepositClick = () => {
    setShowAmountInput((prevShowAmountInput) => !prevShowAmountInput);
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-800 py-40 px-10 rounded-lg shadow-md max-w-5xl  mx-auto">
      <div className={`${sharedClasses.blueGradient} shadow-md rounded-lg p-4 w-full md:w-1/2 mx-auto`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{lastName}'s Wallet</h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-600">Balance : {balance} VND</p>
          </div>
          <svg
        class="w-12 h-12 rounded-full bg-white p-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 14l9-5-9-5-9 5 9 5z"
        ></path>
      </svg>
        </div>
        <div className={`${sharedClasses.zincBorders} pt-4`}>
          <button className={`hover:bg-cyan-700 bg-cyan-600 text-white mr-2 ${sharedClasses.button}`} onClick={handleDepositClick}>Deposit</button>
        </div>
        {showAmountInput && (
          <div className="mt-4">
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full px-3 py-3 border rounded-md"
              value={amount}
              onChange={handleAmountChange}
            />
            <button className={`hover:from-zinc-700 hover:to-pink-800 bg-gradient-to-r from-zinc-600 to-pink-800 text-white mt-2 ${sharedClasses.button}`} onClick={handlePayment}>Add Money</button>
          </div>
        )}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default UserWallet;
