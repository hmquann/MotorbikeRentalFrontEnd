import React, { useState, useEffect } from "react";
import axios from "axios";

const inputClasses =
  "mt-1 block w-full p-2 border border-zinc-300 rounded-md text-black font-medium";
const labelClasses = "block text-md font-bold text-slate-500 dark:text-neutral-300";

const ViewModel = ({ showModal, setShowModal, modelId }) => {
  const [modelData, setModelData] = useState({
    modelName: "",
    cylinderCapacity: "",
    fuelType: "",
    fuelConsumption: "",
    modelType: "",
    brand: {
      brandId: "",
      brandName:""
    },
  });

  useEffect(() => {
    if (modelId && showModal) {
      const fetchModelDetails = async () => {
        try {
          const response = await axios.get(
            `https://rentalmotorbikebe.azurewebsites.net/api/model/${modelId}`
          );
          setModelData(response.data);
        } catch (error) {
          console.error("Error fetching model details", error);
        }
      };

      fetchModelDetails();
    }
  }, [modelId, showModal]);

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="bg-gray-100 p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="bg-zinc-200 text-slate-600 p-2 rounded-t-lg">
          <h2 className="text-lg-lg font-bold">Model Details</h2>
        </div>
        <form className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="input-wrapper">
              <label className={labelClasses}>Model Name</label>
              <input
                type="text"
                name="modelName"
                value={modelData.modelName}
                readOnly
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Cylinder Capacity</label>
              <input
                type="text"
                name="cylinderCapacity"
                value={modelData.cylinderCapacity}
                readOnly
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Fuel Consumption</label>
              <input
                type="text"
                name="fuelConsumption"
                value={modelData.fuelConsumption}
                readOnly
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Fuel Type</label>
              <input
                type="text"
                name="fuelType"
                value={modelData.fuelType}
                readOnly
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Model Type</label>
              <input
                type="text"
                name="modelType"
                value={modelData.modelType}
                readOnly
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Brand</label>
            <input
              type="text"
              name="brandName"
              value={modelData.brand?.brandName}
              readOnly
              className={inputClasses}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="hover:bg-red-700 bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewModel;
