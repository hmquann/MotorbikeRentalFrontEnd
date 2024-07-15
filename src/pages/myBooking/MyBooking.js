import React, { useState } from "react";
import CurrentBooking from "./CurrentBooking";
import "./MyBooking.css"; // Import the CSS file
import HistoryBooking from "./HistoryBooking";

const MyBooking = () => {
  const [activeTab, setActiveTab] = useState("current");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="containerMyBooking mx-auto my-8">
      <h1 className="text-3xl font-bold mb-4 text-left">My Booking</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex" style={{ color: "#767676" }}>
          <button
            className={`mr-4 pb-1 text-lg border-b-2 ${
              activeTab === "current"
                ? "border-green font-bold"
                : "border-transparent text-muted-foreground"
            }`}
            onClick={() => handleTabClick("current")}
          >
            Current Booking
          </button>
          <button
            className={`pb-1 text-lg border-b-2 ${
              activeTab === "past"
                ? "border-green font-bold"
                : "border-transparent text-muted-foreground"
            }`}
            onClick={() => handleTabClick("past")}
          >
            History Booking
          </button>
        </div>
        <button className="border border-muted-foreground rounded-lg px-4 py-2 flex items-center">
          <img
            alt="filter-icon"
            src="https://openui.fly.dev/openui/24x24.svg?text=⚙️"
            className="mr-2"
          />
          Bộ lọc
        </button>
      </div>
      <div>
        {activeTab === "current" && <CurrentBooking />}
        {activeTab === "past" && <HistoryBooking />}
      </div>
    </div>
  );
};

export default MyBooking;
