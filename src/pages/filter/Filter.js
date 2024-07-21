import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Range } from 'react-range';
import { format, addDays } from 'date-fns';
import { useNavigate,useLocation } from "react-router-dom";
import MotorbikeList from '../hompage/MotorbikeList';
import MotorbikeSchedulePopUp from '../booking/schedule/MotorbikeSchedulePopUp';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const buttonClasses =
"px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105";
const textClasses = "text-zinc-600 dark:text-zinc-300";
const bgClasses = "bg-zinc-200";
const borderClasses = "border border-zinc-600 dark:border-zinc-300";
const cardClasses =
"bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out";
const badgeClasses = "text-xs px-2 py-1 rounded-full font-semibold";
const buttonClasses1 =
"bg-white text-zinc-700 py-1 px-2 rounded-full shadow hover:bg-zinc-100 dark:bg-zinc-600 dark:hover:bg-zinc-500";
const buttonClassesPrimary =
"bg-green-500 text-white px-4 py-2 rounded-full shadow-lg transform transition duration-300 hover:scale-105";


function SetPriceRangeModal({ minValueProp, maxValueProp, modelTypeProp, onUpdateValues, onUpdateModelType, ...props }) {
  const sharedClasses = {
    label: 'block text-lg font-semibold text-foreground',
    input: 'block appearance-none w-full bg-card border border-border text-foreground py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring focus:border-primary',
    selectContainer: 'relative',
    selectIcon: 'pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground',
    priceLabel: 'block text-muted-foreground mb-1',
    priceContainer: 'border border-border rounded p-2 text-center text-foreground',
  };

  const [values, setValues] = useState([minValueProp, maxValueProp]);
  const [modelType, setModelType] = useState(modelTypeProp);

  const handleChange = (newValues) => {
    setValues(newValues);
    onUpdateValues(newValues);
  };

  const handleModelTypeChange = (event) => {
    const newModelType = event.target.value;
    setModelType(newModelType);
    onUpdateModelType(newModelType);
  };

  const getFillWidth = () => {
    const rangeWidth = values[1] - values[0];
    const totalWidth = 100000; // max value of the range
    return (rangeWidth / totalWidth) * 100;
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Bộ lọc nâng cao
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-4 space-y-4">
          <div>
            <label className={sharedClasses.label}>Sắp xếp</label>
            <div className={sharedClasses.selectContainer}>
              <select className={sharedClasses.input}>
                <option>Tối ưu</option>
              </select>
              <div className={sharedClasses.selectIcon}>
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className={sharedClasses.label}>Loại xe</label>
            <div className={sharedClasses.selectContainer}>
              <select 
                id="modelType" 
                className="mt-2 px-4 py-2 rounded-lg border border-gray-300 text-zinc-700" 
                onChange={handleModelTypeChange} 
                value={modelType}
              >
                <option value="">Chọn loại xe</option>
                <option value="XeSo">Xe số</option>
                <option value="XeTayGa">Xe tay ga</option>
                <option value="XeConTay">Xe côn tay</option>
                <option value="XeDien">Xe điện</option>
              </select>
            </div>
          </div>
          <div>
            <label className={sharedClasses.label}>Mức giá</label>
            <Range
              step={10000}
              min={0}
              max={100000}
              values={values}
              onChange={handleChange}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer relative"
                >
                  {children}
                  <div
                    className="absolute bg-primary h-2 rounded-lg"
                    style={{
                      left: `${values[0] / 100000 * 100}%`,
                      width: `${getFillWidth()}%`
                    }}
                  />
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  className="w-4 h-4 bg-primary rounded-full cursor-pointer"
                />
              )}
            />
            <div className="flex justify-between mt-4">
              <div className="w-1/2">
                <label className={sharedClasses.priceLabel}>Giá thấp nhất</label>
                <div className={sharedClasses.priceContainer}>{values[0]}K</div>
              </div>
              <div className="flex items-center justify-center w-1/12 text-muted-foreground">-</div>
              <div className="w-1/2">
                <label className={sharedClasses.priceLabel}>Giá cao nhất</label>
                <div className={sharedClasses.priceContainer}>{values[1]}K</div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={props.onHide} className="btn btn-primary">Đóng</button>
      </Modal.Footer>
    </Modal>
  );
}


const Filter = () => {
  const navigate = useNavigate();
  const[addressPopUp,setAddressPopUp]=useState(false);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState();
  const [filterBrands, setFilterBrands] = useState([]);
  const[schedulePopUp,setSchedulePopUp]=useState(false);
  const [showBrandPopup, setShowBrandPopup] = useState(false);
  const [showModelPopup, setShowModelPopup] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const[loading,setLoading]=useState(false);
  const [error, setError] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const location=useLocation();
  const filterAddressAndTime=location.state.filterList;
  const [listMotor,setListMotor]=useState(location.state.listMotor);
  const handleUpdateValues = (newValues) => {
    setFilterList({...filterList,minPrice:newValues[0]})
    setFilterList({...filterList,maxPrice:newValues[1]})
    console.log(newValues)
    console.log(filterList)
  };
  const handleUpdateModelType = (newModelType) => {
    setFilterList({...filterList,modelType:newModelType});
  };
  const [filterList,setFilterList]=useState({
    startDate:filterAddressAndTime.startDate,
    endDate:filterAddressAndTime.endDate,
    address:filterAddressAndTime.address,
    brandId:"",
    modelType:"",
    isDelivery:"",
    minPrice:0,
    maxPrice:100000,
    isFiveStar:""
}
  );
  const handleOpenSchedulePopup=()=>{
    setSchedulePopUp(true)
  }
  useEffect(() => {
    axios.get('http://localhost:8080/api/brand/getAllBrand')
      .then(response => setBrands(response.data))
      .catch(error => console.error('Error fetching other entities 1:', error));
  }, []);
  
  const handleButtonClick = (buttonName) => {
    setSelectedButtons(prevSelectedButtons => {
        const isSelected = prevSelectedButtons.includes(buttonName);
        const updatedButtons = isSelected 
            ? prevSelectedButtons.filter(name => name !== buttonName) 
            : [...prevSelectedButtons, buttonName];

        setFilterList(prevFilterList => {
            const updatedFilterList = { ...prevFilterList };
            switch (buttonName) {
                case 'delivery':
                    updatedFilterList.isDelivery = isSelected ? "": true;
                    break;
                case 'rate':
                    updatedFilterList.isFiveStar = isSelected ? "": true;
                    break;
                default:
                    break;
            }
            return updatedFilterList;
        });

        return updatedButtons;
    });

    if (buttonName === 'brand') {
        setShowBrandPopup(true);
    } else if (buttonName === 'filter') {
        setModalShow(true);
    }

    console.log(selectedButtons);
    console.log(filterList);
};

  const buttons = [
    {name:'brand',label:'Hãng xe',svg:(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" />
  </svg>)},
    { name: 'rate', label: 'Chủ xe 5 sao', svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
    

    ) },
    { name: 'delivery', label: 'Giao nhận xe tận nơi', svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
  <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
  <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
</svg>

    ) },

    { name: 'filter', label: 'Bộ lọc', svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clipRule="evenodd" />
</svg>

    ) },
    // Add more buttons as needed
  ];
  const handleBrandSelect = (brand) => {
    setFilterList({...filterList,
      brandId:brand.brandId})
    setShowBrandPopup(false); // Close brand popup
  };

  const handleModelPopupClose = () => {
    setShowModelPopup(false);
  };
  const handlePopUpSubmit = (data) => {
    // Handle data submission to destination page
    setFilterList({...filterList,startDate:data.startDateTime,endDate:data.endDateTime});
 

    // Perform any further actions here
  };
  useEffect(() => {
    fetch("https://vapi.vnappmob.com/api/province/")
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data); 
        if (data && data.results) {
          setProvinces(data.results); // Điều chỉnh theo cấu trúc dữ liệu thực tế
        } else {
          throw new Error('Invalid data format');
        } 
      })
      .catch(error => {
        setError(error);
      });
  }, []);
  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);
    // Fetch districts based on selected province
    fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)
      .then((response) => response.json())
      .then((data) => {

        if (data && data.results) {           
          setDistricts(data.results);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        setError(error);
      });
  };
  const handleDistrictChange=(event)=>{
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
  }
  const handleAddressSubmit=()=>{
    console.log(selectedDistrict)
    console.log(selectedProvince);
    const province = provinces.find(d => d.province_id === selectedProvince).province_name;
    const district = districts.find(d => d.district_id === selectedDistrict).district_name;
  setFilterList({...filterList,address:district+","+province});
  setAddressPopUp(false)
  }
  const handleSearchMotor = async () => {
    const { modelType, ...newFilterList } = filterList;
    if (modelType) {
      newFilterList.modelType = modelType;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/motorbike/filter', newFilterList, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Data sent successfully:', response.data);
      setListMotor(response.data);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleSearchMotor(filterList);
  }, [filterList]);
  const handleRequestError = (error) => {
    if (error.response) {
      console.error('Error response:', error.response);
      console.error('Status code:', error.response.status);
      console.error('Data:', error.response.data);

      if (error.response.status === 404) {
        setError('Error 404: Not Found. The requested resource could not be found.');
      } else if (error.response.status === 409) {
        setError(error.response.data);
      } else {
        setError(`Error ${error.response.status}: ${error.response.data.message || 'An error occurred.'}`);
      }
    } else if (error.request) {
      console.error('Error request:', error.request);
      setError('No response received. Please check your network connection.');
    } else {
      console.error('Error message:', error.message);
      setError('An error occurred. Please try again.');
    }
  };
  return (

  
    <div>
      <div className="relative">
        <img
          src="https://imgcdnblog.carbay.com/wp-content/uploads/2019/12/16150859/Ducati-Streetfighter-v4s2.jpg"
          alt="Hero Image"
          className="w-full h-96 object-cover rounded-b-lg shadow-md"
          crossorigin="anonymous"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4 bg-black bg-opacity-50 rounded-b-lg">
  <h1 className="text-4xl font-bold mb-4">
    MiMotor - Cùng Bạn Đến Mọi Hành Trình
  </h1>
  <p className="mt-4 text-lg">
    Trải nghiệm sự khác biệt từ{" "}
    <span className="text-green-500 font-bold">hơn 8000</span> xe máy đời mới khắp Việt Nam
  </p>
  <div className="mt-6 flex space-x-4">
    <button className={buttonClassesPrimary}>Xe tự lái</button>
    <button className={`${buttonClasses} ${bgClasses} ${textClasses}`}>
      Xe có tài xế
    </button>
    <button className={`${buttonClasses} ${bgClasses} ${textClasses}`}>
      Thuê xe dài hạn{" "}
      <span className="ml-2 bg-red-500 text-white px-2 py-1 text-xs rounded-full">
        Mới
      </span>
    </button>
  </div>

    </div>
   
</div>
<div className="flex justify-center items-center mt-8" >
  <div style={{ width: '100%' }}>
    <div className="flex items-center justify-center space-x-4 text-foreground">
      <div className='flex items-center space-x-2' onClick={()=>setAddressPopUp(true)}>
      <svg class="h-6 w-6 text-green-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  
      <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="11" r="3" />  
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" /></svg>
        <span>{filterList.address}</span>
      </div>
      <div className='flex items-center space-x-2' onClick={(handleOpenSchedulePopup)}>
      <svg class="h-6 w-6 text-green-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"> 
       <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />  <line x1="16" y1="2" x2="16" y2="6" /> 
       <line x1="8" y1="2" x2="8" y2="6" />  <line x1="3" y1="10" x2="21" y2="10" /></svg>
        <span>{format(filterList.startDate, 'HH:mm, dd/MM/yyyy')} - {format(filterList.endDate, 'HH:mm, dd/MM/yyyy')}</span>
      </div>
    </div>
  </div>
</div>           
{addressPopUp && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div name="province"
              value={selectedProvince}
              onChange={handleProvinceChange}>
            <label className="block text-sm font-medium text-gray-700">Thành phố</label>
            <select className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-sm ">
            <option value="" className="text-gray-700 bg-white">Chọn thành phố</option>
              {provinces.map((province) => (
                <option  className="text-gray-700 bg-white" key={province.province_id} value={province.province_id}>
                  {province.province_name}
                </option>
              ))}
            </select>
          </div>
          <div  name="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              >
            <label className="block text-sm font-medium text-gray-700">Quận / Huyện</label>
            <select className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-sm">
            <option className="text-gray-700 bg-white" value="">Chọn quận/huyện</option>
              {districts.map((district) => (
                <option className="text-gray-700 bg-white" key={district.district_id} value={district.district_id}>
                  {district.district_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="bg-gray-500 text-white rounded px-3 py-1"
            onClick={() => setAddressPopUp(false)}
          >
            Hủy
          </button>
          <button
            className="bg-blue-500 text-white rounded px-3 py-1"
            onClick={handleAddressSubmit}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </div>
)}
          <div className="flex justify-center mt-8" >
          <MotorbikeSchedulePopUp isOpen={schedulePopUp} onClose={() => setSchedulePopUp(false)} onSubmit={handlePopUpSubmit} />
          </div>    
 
    <div className="flex justify-center mt-8">
    
      <div className="flex flex-wrap gap-2 p-4">
        {buttons.map(button => (
          <button
            key={button.name}
            className={`flex items-center border rounded-full px-3 py-1 ${
              selectedButtons.includes(button.name) ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'
            }`}
            onClick={() => handleButtonClick(button.name)}
          >
            <span className={`mr-2 ${selectedButtons.includes(button.name) ? 'text-white' : 'text-green-500'}`}>
              {button.svg}
            </span>
            {button.label}
          </button>
        ))}
      </div>
      
  

    </div>
    <div className="flex justify-center">
      <div style={{ width: '95%' }}>
      <MotorbikeList listMotor={listMotor}/>
      </div>
    </div>
    {showBrandPopup && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Chọn hãng xe</h2>
      {/* Render danh sách hãng xe từ state brands */}
      {brands.map(brand => (
        <div key={brand.brandId} className="flex items-center mb-2">
          <button className="bg-gray-200 text-black rounded px-3 py-1 mr-2"
            onClick={() => handleBrandSelect(brand)}>
            {brand.brandName}
          </button>
        </div>
      ))}
      <button className="bg-green-500 text-white rounded px-3 py-1"
        onClick={() => setShowBrandPopup(false)}>
        Áp dụng
      </button>
    </div>
  </div>
)}
       <SetPriceRangeModal
        show={modalShow}
        onHide={() => setModalShow(false)}
          minValueProp={filterList.minPrice}
          maxValueProp={filterList.maxPrice}
          onUpdateValues={handleUpdateValues}
          onUpdateModelType={handleUpdateModelType}
      />
    </div>
  );
};

export default Filter;
