import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import MotorbikeList from '../hompage/MotorbikeList';
import SearchMotorbike from './SearchMotorbike';
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
const Filter = () => {
  const navigate = useNavigate();
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState();
  const [filterBrands, setFilterBrands] = useState([]);
  const [showBrandPopup, setShowBrandPopup] = useState(false);
  const [showModelPopup, setShowModelPopup] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const[loading,setLoading]=useState(false);
  const [error, setError] = useState(null);
  const location=useLocation();
  const filterAddressAndTime=location.state.filterList;
  const [filterList,setFilterList]=useState({
    startDate:filterAddressAndTime.startDate,
    endDate:filterAddressAndTime.endDate,
    address:filterAddressAndTime.address,
    brandId:"",
    modelType:"",
    isDelivery:"",
    minPrice:"",
    maxPrice:"",
    isFiveStar:""
}
  );
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
            updatedFilterList.isDelivery = !isSelected;
            break;
          case 'rate':
            updatedFilterList.isFiveStar = !isSelected;
            break;
          case 'electric':
            updatedFilterList.electric = !isSelected;
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
    } else if (buttonName === 'modelType') {
      setShowModelPopup(true); // Show model dropdown
    }
    handleSearchMotor()
    console.log(selectedButtons);
    console.log(filterList); 
  };

  const buttons = [
    {name:'modelType',label:'Loại xe',svg:(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clipRule="evenodd" />
  </svg>
  )},
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
   ,
    {name:'electric',label:'Xe Điện',svg:(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
    <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clip-rule="evenodd" />
  </svg>
  )},
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
  const handleSearchMotor = async () => {
      

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/motorbike/filter', filterList, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Data sent successfully:', response.data);
      const listMotor=response.data;
      navigate('/filter', { state: { filterList,listMotor } });
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };
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

  {/* Đây là nơi chèn component SearchMotorbike */}
  <div className="flex justify-center mt-8">
    <div style={{ width: '100%' }}>
      <SearchMotorbike />
    </div>
  </div>
</div>

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
      <MotorbikeList/>
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

{showModelPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Chọn loại xe</h2>
            <div className="grid grid-cols-1 gap-4">
              <label htmlFor="modelType" className="text-zinc-700 font-semibold">Loại xe</label>
              <select
                id="modelType"
                className="mt-2 px-4 py-2 rounded-lg border border-gray-300 text-zinc-700"
                onChange={(e) => setFilterList({ ...filterList, modelType: e.target.value })}
              >
                <option value="">Chọn loại xe</option>
                  <option value="XeSo">Xe số</option>
                  <option value="XeTayGa">Xe tay ga</option>
                  <option value="XeConTay">Xe côn tay</option>
                  <option value="XeDien">Xe điện</option>
              </select>
              </div>
            <div className="mt-4 flex justify-end">
              <button className={`${buttonClassesPrimary} ml-2`} onClick={handleModelPopupClose}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
