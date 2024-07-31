import React, { useEffect, useState } from "react";
import CurrentBooking from "./CurrentBooking";
import HistoryBooking from "./HistoryBooking";
import "./MyBooking.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import PopUpFilter from "./PopUpFilter";

const MyBooking = () => {
  const [activeTab, setActiveTab] = useState("current");
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const defaultFilters = {
    tripType: "all",
    userId: userData.userId,
    status: "all",
    sort: "sortByBookingTimeDesc",
    startTime: null,
    endTime: null,
  };

  const [filters, setFilters] = useState(defaultFilters);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleApplyFilter = (appliedFilters) => {
    console.log("Applied filters:", appliedFilters);
    setFilters(appliedFilters);
  };

  useEffect(() => {
    // Reset filters to default when activeTab changes
    setFilters(defaultFilters);
  }, [activeTab]);

  useEffect(() => {
    if (showFilterPopup) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [showFilterPopup]);

  return (
    <div className="containerMyBooking mx-auto my-8">
      <h1 className="text-3xl font-bold mb-4 text-left">Chuyến của tôi</h1>
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
            Chuyến hiện tại
          </button>
          <button
            className={`pb-1 text-lg border-b-2 ${
              activeTab === "past"
                ? "border-green font-bold"
                : "border-transparent text-muted-foreground"
            }`}
            onClick={() => handleTabClick("past")}
          >
            Lịch sử chuyến
          </button>
        </div>
        <button
          className="border border-strong rounded-lg px-4 py-2 flex items-center text-lg"
          onClick={() => setShowFilterPopup(true)}
        >
          <FontAwesomeIcon icon={faSliders}></FontAwesomeIcon>
          &nbsp;&nbsp;Bộ lọc
        </button>
      </div>
      <div>
        {activeTab === "current" && <CurrentBooking filters={filters} />}
        {activeTab === "past" && <HistoryBooking filters={filters} />}
      </div>
      {showFilterPopup && (
        <PopUpFilter
          onClose={() => setShowFilterPopup(false)}
          onApply={handleApplyFilter}
          activeTab={activeTab}
          initialFilters={filters} // Pass current filters as initial filters
        />
      )}
    </div>
  );
};

export default MyBooking;
