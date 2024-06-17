import React, { useState, useEffect } from "react";
import axios from "axios";

const modalOverlayClasses =
  "fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 z-50";
const modalContentClasses =
  " dark:bg-zinc-500 rounded-lg p-4 max-w-md w-full bg-gradient-to-r from-cyan-700 from-40% to-zinc-600";
const closeButtonClasses = "text-zinc-500 dark:text-zinc-300";
const inputClasses = "p-1 rounded mb-2";
const buttonClasses =
  "hover:bg-blue-700 bg-blue-600 text-white dark:text-zinc-900 py-2 px-4 rounded-lg text-right";

const AddBrand = ({ showModal, setShowModal, onBrandCreated }) => {
  const [brandName, setBrandName] = useState("");
  const [brandOrigin, setBrandOrigin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleModalClose();
      } else if (e.key === "Enter") {
        handleCreateBrand();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [brandName, brandOrigin]);

  const handleModalClose = () => {
    setShowModal(false);
    setBrandName("");
    setBrandOrigin("");
    setError("");
  };
  

  const handleCreateBrand = async () => {
    if (!brandName.trim() || !brandOrigin.trim()) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/brand/createBrand",
        {
          brandName,
          origin: brandOrigin,
        }
      );
      if (response.status === 200) {
        onBrandCreated();
        handleModalClose();
      }
    } catch (error) {
      setError(
        "Brand name already existed" 
      );
    }
  };

  if (!showModal) return null;

  return (
    <div className={modalOverlayClasses}>
      <div className={modalContentClasses}>
        <div className="flex justify-between items-center mb-4 ">
          <h2 className="text-lg-lg  font-semibold text-zinc-800 dark:text-zinc-200">
            Create Brand
          </h2>
          <button
            id="closeModal"
            className={closeButtonClasses}
            onClick={handleModalClose}
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col mb-2">
          <label
            className="block text-lg font-medium text-gray-700 mb-1"
            htmlFor="brand-name"
          >
            Brand Name
          </label>
          <input
            type="text"
            id="brand-name"
            className={`${inputClasses} bg dark:bg-white-300  `}
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </div>
        <div className="flex flex-col mb-2">
          <label
            className="block text-lg font-medium text-gray-700 mb-1"
            htmlFor="brand-origin"
          >
            Brand Origin
          </label>
          <input
            type="text"
            id="brand-origin"
            className={`${inputClasses} bg dark:bg-white-300 `}
            value={brandOrigin}
            onChange={(e) => setBrandOrigin(e.target.value)}
          />
        </div>
        {error && <div className="text-red-500 mb-2 font-bold text-center">{error}</div>}
        <button className={buttonClasses} onClick={handleCreateBrand}>
          Create
        </button>
      </div>
    </div>
  );
};

export default AddBrand;
