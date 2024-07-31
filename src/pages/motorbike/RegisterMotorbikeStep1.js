import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Homepage from "../hompage/Homepage";
import { useNavigate } from "react-router-dom";
import apiClient from "../../axiosConfig";
import { fontFamily } from "@mui/system";
import { Form, Button } from 'react-bootstrap';

const sharedClasses = {
  bgGreen: 'bg-green-500',
  textWhite: 'text-white',
  roundedLG: 'rounded-lg',
  shadow: 'shadow',
  p4: 'p-4',
  p6: 'p-6',
  mt4: 'mt-4',
  mx4: 'mx-4',
  flex: 'flex',
  justifyCenter: 'justify-center',
  justifyBetween: 'justify-between',
  itemsCenter: 'items-center',
  spaceX4: 'space-x-4',
  spaceX2: 'space-x-2',
  spaceY4: 'space-y-4',
  gridCols1: 'grid-cols-1',
  gridCols2: 'grid-cols-2',
  gridCols3: 'grid-cols-3',
  gap4: 'gap-4',
  wFull: 'w-full',
  h10: 'h-10',
  w8: 'w-8',
  h8: 'h-8',
  mb4: 'mb-4',
  mdGridRow: 'md:flex-row',
  mdGridCol: 'md:grid-cols-2',
  textCenter: 'text-center',
  textLeft: 'text-left',
  textSm: 'text-sm',
  textLg: 'text-lg',
  fontSemibold: 'font-semibold',
  border: 'border',
  borderZinc300: 'border-zinc-300',
  roundedFull: 'rounded-full',
};

// const Navbar = () => {
//   return (
//     <nav className={`bg-white dark:bg-zinc-800 ${sharedClasses.shadow} ${sharedClasses.p4} ${sharedClasses.flex} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter}`}>
//       <div className={`${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.spaceX4}`}>
//         <img src="https://placehold.co/50x50" alt="Logo" className={sharedClasses.h10} />
//         <button className={`${sharedClasses.bgGreen} ${sharedClasses.textWhite} px-4 py-2 ${sharedClasses.roundedLG}`}>About</button>
//         <button className={`${sharedClasses.bgGreen} ${sharedClasses.textWhite} px-4 py-2 ${sharedClasses.roundedLG}`}>Trips</button>
//         <button className={`${sharedClasses.bgGreen} ${sharedClasses.textWhite} px-4 py-2 ${sharedClasses.roundedLG}`}>Car Rent</button>
//         <button className={`${sharedClasses.bgGreen} ${sharedClasses.textWhite} px-4 py-2 ${sharedClasses.roundedLG}`}>Contact</button>
//       </div>
//       <button className={`${sharedClasses.bgGreen} ${sharedClasses.textWhite} px-4 py-2 ${sharedClasses.roundedLG}`}>User</button>
//     </nav>
//   );
// };

const StepIndicator = ({ stepNumber, stepText }) => {
  return (
    <div className={`${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.spaceX2}`}>
      <div className={`bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 ${sharedClasses.roundedFull} ${sharedClasses.w8} ${sharedClasses.h8} ${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.justifyCenter}`}>{stepNumber}</div>
      <span>{stepText}</span>
    </div>
  );
};

const FormInput = ({ label, placeholder,name,value }) => {
  return (
    <div className={sharedClasses.mb4}>
      <h2 className={`${sharedClasses.textLg} ${sharedClasses.fontSemibold}`}>{label}</h2>
      <input type="text"name={name} value={value} className={`${sharedClasses.wFull} mt-2 p-2 ${sharedClasses.border} ${sharedClasses.borderZinc300} ${sharedClasses.roundedLG}`} placeholder={placeholder} />
    </div>
  );
};

const FormSelect = ({ label,value, onChange, name, options = [] , keyName,keyId,disableCondition}) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">{label}</h2>
      <select
        className="w-full mt-2 p-2 border border-zinc-300 rounded-lg"
        value={value}
        onChange={onChange}
        name={name}
      >
        <option value="" disabled={disableCondition}>-- Select --</option>
        {options.map((option) => (
          <option key={option.keyId} value={option.keyId}>
            {option[keyName]}    
          </option>
        ))}
      </select>
    </div>
  );
};
const TextAreaInput = ({ label, placeholder }) => {
  return (
    <div className={sharedClasses.mb4}>
      <h2 className={`${sharedClasses.textLg} ${sharedClasses.fontSemibold}`}>{label}</h2>
      <textarea className={`${sharedClasses.wFull} mt-2 p-2 ${sharedClasses.border} ${sharedClasses.borderZinc300} ${sharedClasses.roundedLG}`} placeholder={placeholder}></textarea>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className={`bg-white dark:bg-zinc-800 ${sharedClasses.shadow} ${sharedClasses.p6} ${sharedClasses.mt4}`}>
      <div className={`${sharedClasses.flex} ${sharedClasses.mdGridRow} ${sharedClasses.justifyBetween} ${sharedClasses.itemsCenter}`}>
        <img src="https://placehold.co/100x50" alt="Logo" className={`${sharedClasses.h10} ${sharedClasses.mb4} md:mb-0`} />
        <div className={`${sharedClasses.textCenter} ${sharedClasses.mdTextLeft}`}>
          <p className={sharedClasses.textSm}>Policy</p>
          <p className={sharedClasses.textSm}>Policies and regulations</p>
          <p className={sharedClasses.textSm}>Information security</p>
          <p className={sharedClasses.textSm}>Dispute resolution</p>
        </div>
        <div className={`${sharedClasses.textCenter} ${sharedClasses.mdTextLeft}`}>
          <p className={sharedClasses.textSm}>Find out more</p>
          <p className={sharedClasses.textSm}>General guidance</p>
          <p className={sharedClasses.textSm}>Instructions for booking</p>
          <p className={sharedClasses.textSm}>Payment Guide</p>
        </div>
        <div className={`${sharedClasses.textCenter} ${sharedClasses.mdTextLeft}`}>
          <p className={sharedClasses.textSm}>Partner</p>
          <p className={sharedClasses.textSm}>Register vehicle owner</p>
          <p className={sharedClasses.textSm}>Register for a long-term car rental</p>
        </div>
      </div>
      <div className={`${sharedClasses.textCenter} ${sharedClasses.textSm} ${sharedClasses.mt4}`}>
        <p>&copy; 2023 Company Name. All rights reserved.</p>
        <p>Address: Office A, 123 Street, City</p>
        <p>Phone: 123-456-7890</p>
      </div>
    </footer>
  );
};

const RegisterMotorbikeStep1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    motorbikePlate: "",
    modelId:"",
    yearOfManufacture: "",
    constraintMotorbike: "",
    price:"",
    overtimeFee:"",
    overtimeLimit:"",
    delivery:"",
    freeshipLimit:"",
    deliveryFee:"",
  });
  const [models, setModels] = useState([]);
  const [newModels,setNewModels]=useState([]);
  const [brands, setBrands] = useState([]);
  const[error,setError]=useState(null);
  const[loading,setLoading]=useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const[motorbikePlateError,setMotorbikePlateError]=useState('');
  const[motorbikeBrandError,setMotorbikeBrandError]=useState('');
  const[motorbikeModelError,setMotorbikeModelError]=useState('');
  const[manufactureYearError,setManufactureYearError]=useState('');
  useEffect(() => {
      apiClient.get('/api/model/getAllModel')
          .then(response => setModels(response.data))
          .catch(error => console.error('Error fetching models:', error));
         
      apiClient.get('/api/brand/getAllBrand')
          .then(response => setBrands(response.data))
          .catch(error => console.error('Error fetching other entities 1:', error));
  }, []);
  const checkPlate=(plateNumber)=>{
    const regex = /^\d{2}-[A-Z0-9]{2}-\d{5}$/;
  return regex.test(plateNumber);
  }
  const checkManufactureYear=(manufacture)=>{
    const regex=/^\d{4}$/;
    const currentYear = new Date().getFullYear();
    return (regex.test(manufacture)&&manufacture>2000&&manufacture<= currentYear)
  }
  
  useEffect(() => {  
    if (selectedBrand && selectedBrand.brandId) {
      console.log(selectedBrand)
      
      setNewModels(models.filter((model)=>model.brand.brandId==selectedBrand.brandId))
    }
  }, [selectedBrand]);
  const handleBrandsChange=(e)=>{
    const {name,value}=e.target
    setSelectedBrand(brands.find((brand) => brand.brandName == e.target.value)); 
  
   }
 
useEffect(() => {
    
  if (selectedModel) {
    console.log("Brand:"+selectedBrand+"Model:"+selectedModel)
    setFormData(prevFormData => ({
      ...prevFormData, 
        modelId: selectedModel.modelId,
    }));
  }
}, [selectedModel]);
 const handleModelChange=(e)=>{
  console.log(newModels.find((model) => model.modelName == e.target.value))
  setSelectedModel(newModels.find((model) => model.modelName == e.target.value));  
  console.log(selectedModel)
  if(e.target.value==""){
    setMotorbikeModelError("Hãy chọn mẫu xe")
  }else{
    setMotorbikeModelError("")
  }
 }

const handleChange=(e)=>{
  const {name,value}=e.target;
  if (name === "motorbikePlate") {
    if (!value) {
      setMotorbikePlateError( "Hãy điền biển số xe");
    } else if (checkPlate(value)==false) {
      setMotorbikePlateError("Sai định dạng biển số xe. Ví dụ: 11-A1-11111");
    }else{
      setMotorbikePlateError("");
    }
  }

  if (name === "yearOfManufacture") {
    if (!value) {
      setManufactureYearError( "Hãy điền năm sản xuất");
    }else if(checkManufactureYear(value)==false){
      setManufactureYearError("Năm sản xuất phải từ 2000 trở lên")
    }
    else{
      setManufactureYearError("");
    }
  }
  setFormData({
    ...formData,
    [name]: value,
  });
}
const handleReturnNavigate=()=>{
  navigate("/homepage", { state: {} });
}
 const handleSunbmit=(e)=>{   
  console.log(formData)
  e.preventDefault();
  setError(null);
  if ( !formData.motorbikePlate.trim()) {
    setMotorbikePlateError("Hãy điền biển số xe")
  }else if ( !selectedModel){
    setMotorbikeModelError("Hãy chọn mẫu xe")
  }else if (!formData.yearOfManufacture.trim()){
    setManufactureYearError("Hãy điền năm sản xuất")
  }else{
    setLoading(true)
    navigate('/registermotorbike/step2', { state: {formData} });
  }
 }
  return ( 
    <div className={`min-h-screen font-manrope bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center`}>
       <h1 className="text-3xl font-extrabold mb-6 font-encode">Đăng ký xe</h1>
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg max-w-xl w-full">
      <Form onSubmit={handleSunbmit}>
          {/* Biển số xe */}
          <Form.Group className="mb-4">
            <Form.Label>Biển số xe</Form.Label>
            <Form.Control
              type="text"
              name="motorbikePlate"
              value={formData.motorbikePlate}
              onChange={handleChange}
              isInvalid={!!motorbikePlateError}
            />
            <Form.Control.Feedback type="invalid">
              {motorbikePlateError}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Hãng xe */}
          <Form.Group className="mb-4">
      <Form.Label>Hãng xe</Form.Label>
      <Form.Select
        name="brand"
        value={formData.brand}
        onChange={handleBrandsChange}
        isInvalid={!!motorbikeBrandError}
      >
        <option value="">Chọn hãng xe</option>
        {brands.map((brand) => (
          <option key={brand.brandId} value={brand.brandName}>
            {brand.brandName}
          </option>
        ))}
      </Form.Select>
      {motorbikeBrandError && <div className="text-red-500">{motorbikeBrandError}</div>}
    </Form.Group>

          {/* Mẫu xe */}
          <Form.Group className="mb-4">
      <Form.Label>Mẫu xe</Form.Label>
      <Form.Select
        name="model"
        value={formData.model}
        onChange={handleModelChange}
        isInvalid={!!motorbikeModelError}
      >
        <option value="">Chọn mẫu xe</option>
        {newModels.map((model) => (
          <option key={model.id} value={model.modelName}>
            {model.modelName}
          </option>
        ))}
      </Form.Select>
      {motorbikeModelError && <div className="text-red-500">{motorbikeModelError}</div>}
    </Form.Group>

          {/* Năm sản xuất */}
          <Form.Group className="mb-4">
            <Form.Label>Năm sản xuất</Form.Label>
            <Form.Control
              type="text"
              name="yearOfManufacture"
              value={formData.yearOfManufacture}
              onChange={handleChange}
              isInvalid={!!manufactureYearError}
            />
            <Form.Control.Feedback type="invalid">
              {manufactureYearError}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Điều kiện ràng buộc */}
          <Form.Group className="mb-4">
            <Form.Label>Điều kiện ràng buộc thuê xe</Form.Label>
            <Form.Control
              as="textarea"
              name="constraintMotorbike"
              value={formData.constraintMotorbike}
              onChange={handleChange}
              rows="3"
            />
          </Form.Group>
          {error && <div className="text-red-500 font-bold text-center">{error}</div>}

          {/* Buttons */}
          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={handleReturnNavigate}
              className="w-5/12 py-2 text-base font-bold text-white bg-zinc-400 rounded-lg hover:bg-zinc-500 transition hover:scale-105"
            >
              Quay lại
            </button>
          
            <button
              type="submit"
             className="w-5/12 py-2 text-base font-bold text-white  bg-green-500 rounded-lg hover:bg-green-600 transition hover:scale-105"
              disabled={loading}
            >
              {loading ? "Continue..." : "Tiếp tục"}
            </button>
          </div>
        </Form>
      </div>      
    </div>
  );
};

export default RegisterMotorbikeStep1;

