import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import { Form, FloatingLabel } from "react-bootstrap";
import apiClient from "../../axiosConfig";

const EditModel = ({ showModal, setShowModal, onModelUpdated, modelData }) => {
  const [formData, setFormData] = useState({
    modelName: modelData?.modelName || "",
    cylinderCapacity: modelData?.cylinderCapacity || "",
    fuelType: modelData?.fuelType || "",
    fuelConsumption: modelData?.fuelConsumption || "",
    modelType: modelData?.modelType || "",
    brand: {
      brandId: modelData?.brand?.brandId || "",
    },
  });
  const [brands, setBrands] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [modelTypes, setModelTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorsMess, setErrorsMess] = useState("");

  const [cylinderCapacityLabel, setCylinderCapacityLabel] = useState("Dung tích xi lanh (CC)");
  const [fuelConsumptionLabel, setFuelConsumptionLabel] = useState("Nhiên liệu tiêu hao (l/ 100km)");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await apiClient.get("/api/brand/getAllBrand");
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
        const response = await apiClient.get("/api/model/fuelTypes");
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
        const response = await apiClient.get("/api/model/modelTypes");
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
    'XeDien': 'Xe Điện',
    'XeGanMay' : 'Xe Gắn Máy'
  };
  const fuelTypeMap = {
    'GASOLINE' : 'Xăng',
    'ELECTRIC' : 'Điện'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/;
    if (name === "cylinderCapacity") {
      if (value === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      } else if (!/^\d+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Dung tích xi lanh phải là chữ số",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    } else if (name === "fuelConsumption") {
      if (!/^\d*\.?\d*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Nhiên liệu tiêu hao phải là chữ số",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    } else {
      if (!regex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Không được chứa ký tự đặc biệt.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    }

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

    if (name === "modelType") {
        updateLabels(value);
      }
    };
  
    const updateLabels = (modelType) => {
      if (modelType === "XeDien") {
        setCylinderCapacityLabel("Công suất (W)");
        setFuelConsumptionLabel("Quãng đường đi được (km)");
      } else {
        setCylinderCapacityLabel("Dung tích xi lanh (CC)");
        setFuelConsumptionLabel("Nhiên liệu tiêu hao (l/ 100km)");
      }
  };

  useEffect(() => {
    if (modelData?.modelType) {
      updateLabels(modelData.modelType);
    }
  }, [modelData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.modelName.trim() || !formData.modelType.trim() || !formData.brand || !formData.cylinderCapacity ||
             !formData.fuelConsumption || !formData.fuelType) {
      setErrorsMess("Hãy điền đủ thông tin.");
      return;
    }
    if(errors.modelName || errors.cylinderCapacity || errors.fuelConsumption){
      return
    }
    apiClient
      .put(`/api/model/update/${modelData.modelId}`, {
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
        onModelUpdated();
      })
      .catch((error) => {
        if (error.response.status === 500) {
          setErrorsMess("Mẫu xe này đã tồn tại");
        }
        console.error("There was an error updating the model!", error);
      });
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" className="font-manrope">
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa mẫu xe</Modal.Title>
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
                  isInvalid={!!errors.modelName}
                />
                  <Form.Control.Feedback type="invalid">
                   {errors.modelName}
            </Form.Control.Feedback>
              </FloatingLabel>
            </div>
            <div>
              <FloatingLabel label={cylinderCapacityLabel} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Cylinder Capacity"
                  name="cylinderCapacity"
                  value={formData.cylinderCapacity}
                  onChange={handleChange}
                  isInvalid={!!errors.cylinderCapacity}
                />
                 <Form.Control.Feedback type="invalid">
                   {errors.cylinderCapacity}
            </Form.Control.Feedback>
              </FloatingLabel>
            </div>
            <div>
              <FloatingLabel label={fuelConsumptionLabel} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Fuel Consumption"
                  name="fuelConsumption"
                  value={formData.fuelConsumption}
                  onChange={handleChange}
                  isInvalid={!!errors.fuelConsumption}
                />
                 <Form.Control.Feedback type="invalid">
                   {errors.fuelConsumption}
            </Form.Control.Feedback>
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
                      {fuelTypeMap[type] || type}
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
        <button className="px-4 py-2 hover:bg-red-700 bg-red-600 text-white rounded-lg mr-2 transition hover:scale-105" onClick={() => setShowModal(false)}>
          Hủy
        </button>
        <button className="px-4 py-2 hover:bg-blue-700 bg-blue-600 text-white rounded-lg mr-2 transition hover:scale-105" onClick={handleSubmit}>
          Cập nhật
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModel;
