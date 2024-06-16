import React from "react";

const Popup = ({ message }) => {
  return (
    <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
};

export default Popup;
