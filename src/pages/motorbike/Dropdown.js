import React, { useState } from 'react';

const dropdownButtonClasses = "inline-flex justify-center w-full rounded-md border border-zinc-300 shadow-lg mt-2 p-2 w-1/5 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
const dropdownMenuClasses = "origin-top-right absolute right-0 mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none";
const menuItemClasses = "block px-4 py-2 text-sm text-zinc-700 hover:bg-blue-200 text-decoration-none cursor-pointer";

const statusOptions = {
    all: 'All',
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    DEACTIVE: 'DEACTIVE',
  };

const Dropdown = ({selectedStatus, onStatusChange }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleStatusChange = (motorbikeStatus) => {
    onStatusChange(motorbikeStatus);
    setMenuVisible(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button id="dropdownButton" className={dropdownButtonClasses} onClick={toggleMenu}>
        {statusOptions[selectedStatus]}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {menuVisible && (
        <div id="dropdownMenu" className={dropdownMenuClasses}>
          <div className="py-" role="menu" aria-orientation="vertical" aria-labelledby="dropdownButton">
          {Object.keys(statusOptions).map((status) => (
              <a key={status} className={menuItemClasses} role="menuitem" onClick={() => handleStatusChange(status)}>
                {statusOptions[status]}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
