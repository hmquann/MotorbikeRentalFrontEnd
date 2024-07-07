import React, { useState, useEffect } from "react";
import axios from "axios";

const inputClasses =
  "mt-1 block w-full p-2 border border-zinc-300 rounded-md dark:text-green-800 font-medium";
const labelClasses = "block text-md font-bold text-slate-500 dark:text-neutral-300";

const AddModel = ({ showModal, setShowModal, onModelCreated }) => {
  const [formData, setFormData] = useState({
    modelName: "",
    cylinderCapacity: "",
    fuelType: "",
    fuelConsumption: "",
    modelType: "",
    brand: {
      brandId: "",
    },
  });
  const [brands, setBrands] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [modelTypes, setModelTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorsMess, setErrorsMess] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/brand/getAllBrand"
        );
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands", error);
      }
    };

    fetchBrands();
  }, []);
  useEffect(() => {
    const fetchFuelTypes = async () => {
      try {
        const response = await axios.get(
          "https://rentalmotorbikebe.azurewebsites.net/api/model/fuelTypes"
        );
        setFuelTypes(response.data);
      } catch (error) {
        console.error("Error fetching fuel types", error);
      }
    };

    fetchFuelTypes();
  }, []);

  useEffect(() => {
    const fetchModelTypes = async () => {
      try {
        const response = await axios.get(
          "https://rentalmotorbikebe.azurewebsites.net/api/model/modelTypes"
        );
        setModelTypes(response.data);
      } catch (error) {
        console.error("Error fetching model types", error);
      }
    };

    fetchModelTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if (!value.trim()) {
      newErrors[name] = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } is required`;
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);

    if (name === "brandId") {
      setFormData({
        ...formData,
        brand: {
          brandId: parseInt(value),
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.modelName) newErrors.modelName = "Model Name is required";
    if (!formData.cylinderCapacity)
      newErrors.cylinderCapacity = "Cylinder Capacity is required";
    if (!formData.fuelType) newErrors.fuelType = "Fuel Type is required";
    if (!formData.fuelConsumption)
      newErrors.fuelConsumption = "Fuel Consumption is required";
    if (!formData.modelType) newErrors.modelType = "Model Type is required";
    if (!formData.brand.brandId) newErrors.brandId = "Brand is required";
    return newErrors;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    axios
      .post("https://rentalmotorbikebe.azurewebsites.net/api/model/addModel", {
        modelName: formData.modelName,
        cylinderCapacity: formData.cylinderCapacity,
        fuelType: formData.fuelType,
        fuelConsumption: formData.fuelConsumption,
        modelType: formData.modelType,
        brand: {
          brandId: formData.brand.brandId,
        },
      })
      .then((response) => {
        setFormData({
          modelName: "",
          cylinderCapacity: "",
          fuelType: "",
          fuelConsumption: "",
          modelType: "",
          brandId: "",
        });
        setErrors({});
        setShowModal(false);
        onModelCreated();
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setErrorsMess("Model has been existed");
        }
        console.error("There was an error creating the model!", error);
      });
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="bg-gray-200 to-zinc-500 p-4 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="bg-zinc-300 text-slate-600 p-2 rounded-t-lg">
          <h2 className="text-lg-lg font-bold">Model Details</h2>
        </div>
        <form className="space-y-4 p-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="input-wrapper">
              <label className={labelClasses}>Model Name</label>
              <input
                type="text"
                placeholder="Model Name"
                name="modelName"
                value={formData.modelName}
                onChange={handleChange}
                className={inputClasses}
              />
              {errors.modelName && (
                <span className="text-red-500 text-sm">{errors.modelName}</span>
              )}
            </div>
            <div>
              <label className={labelClasses}>Cylinder Capacity</label>
              <input
                type="text"
                placeholder="Cylinder Capacity"
                name="cylinderCapacity"
                value={formData.cylinderCapacity}
                onChange={handleChange}
                className={inputClasses}
              />
              {errors.cylinderCapacity && (
                <span className="text-red-500 text-sm">
                  {errors.cylinderCapacity}
                </span>
              )}
            </div>
            <div>
              <label className={labelClasses}>Fuel Consumption</label>
              <input
                type="text"
                placeholder="Fuel Consumption"
                name="fuelConsumption"
                value={formData.fuelConsumption}
                onChange={handleChange}
                className={inputClasses}
              />
              {errors.fuelConsumption && (
                <span className="text-red-500 text-sm">
                  {errors.fuelConsumption}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Fuel Type</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Select Fuel Type</option>
                {fuelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.fuelType && (
                <p className="text-red-500 text-sm">{errors.fuelType}</p>
              )}
            </div>
            <div>
              <label className={labelClasses}>Model Type</label>
              <select
                name="modelType"
                value={formData.modelType}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Select Model Type</option>
                {modelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.modelType && (
                <p className="text-red-500 text-sm">{errors.modelType}</p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClasses}>Brand</label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </option>
              ))}
            </select>
            {errors.brandId && (
              <p className="text-red-500 text-sm">{errors.brandId}</p>
            )}
          </div>
          {errorsMess && (
            <div className="text-red-500 mb-2 font-bold text-center">
              {errorsMess}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="hover:bg-red-700 bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
            <button
              type="submit"
              className="hover:bg-blue-700 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModel;
