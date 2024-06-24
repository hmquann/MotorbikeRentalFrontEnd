import React, { useState, useEffect } from "react";
import axios from "axios";

const EditBrand = ({
  showModal,
  setShowModal,
  brandToEdit,
  onBrandUpdated,
}) => {
  const [brandName, setBrandName] = useState("");
  const [origin, setOrigin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (brandToEdit) {
      setBrandName(brandToEdit.brandName || "");
      setOrigin(brandToEdit.origin || "");
    }
  }, [brandToEdit, showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!brandName) {
        setError("Brand name cannot be empty");
        return;
      }
      if (!origin) {
        setError("Origin cannot be empty");
        return;
      }
      const updatedBrand = {
        ...brandToEdit,
        brandName,
        origin,
      };
  
      await axios.patch(
        `http://localhost:8080/api/brand/updateBrand/${brandToEdit.brandId}`,
        updatedBrand
      );
  
      onBrandUpdated();
      setShowModal(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError("Brand name already existed");
          console.log(error.response);
        }
      } else if (error.request) {
        console.error("Error connecting to server:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };
  

  return (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
        <div className="bg-white p-4 rounded-lg w-1/3 bg-gradient-to-r from-cyan-700 from-40% to-zinc-600">
          <h2 className="text-lg-lg mb-4 dark:text-zinc-200">Edit Brand</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Brand Origin
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            {error && (
              <div className="text-red-500 mb-4 font-bold text-center">
                {error}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 hover:bg-gray-600 bg-gray-500 text-white rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 hover:bg-blue-600 bg-blue-500 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditBrand;
