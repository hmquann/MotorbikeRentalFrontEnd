import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form, FloatingLabel } from "react-bootstrap";

const inputClasses = "mt-1 block w-full p-2 border border-zinc-300 rounded-md dark:text-green-800 font-medium";
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
          "http://localhost:8080/api/model/fuelTypes"
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
          "http://localhost:8080/api/model/modelTypes"
        );
        setModelTypes(response.data);
      } catch (error) {
        console.error("Error fetching model types", error);
      }
    };

    fetchModelTypes();
  }, []);
  const modelTypeMap = {
    'XeSo': 'Xe Số',
    'XeTayGa': 'Xe Tay Ga',
    'XeConTay': 'Xe Côn Tay',
    'XeDien': 'Xe Điện'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    if (!value.trim()) {
      newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
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
    if (!formData.cylinderCapacity) newErrors.cylinderCapacity = "Cylinder Capacity is required";
    if (!formData.fuelType) newErrors.fuelType = "Fuel Type is required";
    if (!formData.fuelConsumption) newErrors.fuelConsumption = "Fuel Consumption is required";
    if (!formData.modelType) newErrors.modelType = "Model Type is required";
    if (!formData.brand.brandId) newErrors.brandId = "Brand is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (!formData.modelName.trim() || !formData.modelType.trim() || !formData.brand || !formData.cylinderCapacity.trim() ||
             !formData.fuelConsumption || !formData.fuelType) {
      setErrorsMess("Hãy điền đủ thông tin.");
      return;
    }
    axios
      .post("http://localhost:8080/api/model/addModel", {
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
          brand: {
            brandId: "",
          },
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

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thêm mẫu xe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FloatingLabel label="Tên mẫu" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Model Name"
                  name="modelName"
                  value={formData.modelName}
                  onChange={handleChange}
                />
              </FloatingLabel>
            </div>
            <div>
              <FloatingLabel label="Dung tích xi lanh" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Cylinder Capacity"
                  name="cylinderCapacity"
                  value={formData.cylinderCapacity}
                  onChange={handleChange}
                />
              </FloatingLabel>
            </div>
            <div>
              <FloatingLabel label="Nhiên liệu tiêu hao" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Fuel Consumption"
                  name="fuelConsumption"
                  value={formData.fuelConsumption}
                  onChange={handleChange}
                  required
                />
              </FloatingLabel>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FloatingLabel label="Loại nhiên liệu" className="mb-3">
                <Form.Select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                >
                  <option value="">Chọn loại nhiên liệu</option>
                  {fuelTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </FloatingLabel>
            </div>
            <div>
              <FloatingLabel label="Loại xe" className="mb-3">
                <Form.Select
                  name="modelType"
                  value={formData.modelType}
                  onChange={handleChange}
                >
                  <option value="">Chọn loại xe</option>
                  {modelTypes.map((type) => (
                    <option key={type} value={type}>
                     {modelTypeMap[type] || type}
                    </option>
                  ))}
                </Form.Select>
              </FloatingLabel>
            </div>
          </div>

          <div>
            <FloatingLabel label="Thương hiệu" className="mb-3">
              <Form.Select
                name="brandId"
                value={formData.brand.brandId}
                onChange={handleChange}
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.brandId} value={brand.brandId}>
                    {brand.brandName}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </div>
          {errorsMess && (
            <div className="text-red-500 mb-2 font-bold text-center">
              {errorsMess}
            </div>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="px-4 py-2 hover:bg-red-700 bg-red-600 text-white rounded-lg mr-2" onClick={() => setShowModal(false)}>
          Hủy
        </button>
        <button className="px-4 py-2 hover:bg-blue-700 bg-blue-600 text-white rounded-lg mr-2" onClick={handleSubmit}>
          Lưu
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddModel;
