import React, { useState, useEffect } from "react";
import axios from "axios";
import { Range } from "react-range";
import { format, addDays } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import MotorbikeList from "../hompage/MotorbikeList";
import MotorbikeSchedulePopUp from "../booking/schedule/MotorbikeSchedulePopUp";
import Modal from "react-bootstrap/Modal";
import MapboxSearchPopUp from "./MapboxSearchPopUp";
import apiClient from "../../axiosConfig";

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

function SetPriceRangeModal({
  minValueProp,
  maxValueProp,
  modelTypeProp,
  onUpdateValues,
  onUpdateModelType,
  ...props
}) {
  const sharedClasses = {
    label: "block text-lg font-semibold text-foreground",
    input:
      "block appearance-none w-full bg-card border border-border text-foreground py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring focus:border-primary",
    selectContainer: "relative",
    selectIcon:
      "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground",
    priceLabel: "block text-muted-foreground mb-1",
    priceContainer:
      "border border-border rounded p-2 text-center text-foreground",
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
    const totalWidth = 400000; // max value of the range
    return (rangeWidth / totalWidth) * 100;
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Bộ lọc nâng cao
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-4 space-y-4">

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
              step={20000}
              min={0}
              max={400000}
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
                      left: `${(values[0] / 400000) * 100}%`,
                      width: `${getFillWidth()}%`,
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
                <label className={sharedClasses.priceLabel}>
                  Giá thấp nhất
                </label>
                <div className={sharedClasses.priceContainer}>{values[0]}đ</div>
              </div>
              <div className="flex items-center justify-center w-1/12 text-muted-foreground">
                -
              </div>
              <div className="w-1/2">
                <label className={sharedClasses.priceLabel}>Giá cao nhất</label>
                <div className={sharedClasses.priceContainer}>{values[1]}đ</div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={props.onHide} className="btn btn-primary">
          Đóng
        </button>
      </Modal.Footer>
    </Modal>
  );
}

const Filter = () => {
  const navigate = useNavigate();
  const [addressPopUp, setAddressPopUp] = useState(false);
  const [openMapboxSearch, setOpenMapBoxSearch] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState();
  const [filterBrands, setFilterBrands] = useState([]);
  const [schedulePopUp, setSchedulePopUp] = useState(false);
  const [showBrandPopup, setShowBrandPopup] = useState(false);
  const [showModelPopup, setShowModelPopup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const location = useLocation();
  const filterAddressAndTime = location.state?.filterList || [];
  const [address, setAddress] = useState(filterAddressAndTime.address);
  const [listMotor, setListMotor] = useState(location.state?.listMotor || []);
  const handleUpdateValues = (newValues) => {
    console.log(newValues);
    setFilterList((prevFilterList) => ({
        ...prevFilterList,
        minPrice: newValues[0],
        maxPrice: newValues[1],
    }));
    console.log(filterList);
};
  const [page, setPage] = useState(0);
  const pageSize = 24;
  const handleUpdateModelType = (newModelType) => {
    setFilterList({ ...filterList, modelType: newModelType });
  };
  const [filterList, setFilterList] = useState({
    startDate: filterAddressAndTime.startDate,
    endDate: filterAddressAndTime.endDate,
    longitude: filterAddressAndTime.longitude,
    latitude: filterAddressAndTime.latitude,
    brandId: "",
    modelType: "",
    isDelivery: "",
    minPrice: 0,
    maxPrice: 400000,
    isFiveStar: "",
  });
  console.log(filterList.longitude,filterList.latitude)
  const handleOpenSchedulePopup = () => {
    setSchedulePopUp(true);
  };
  useEffect(() => {
    apiClient
      .get("/api/brand/getAllBrand")
      .then((response) => setBrands(response.data))
      .catch((error) =>
        console.error("Error fetching other entities 1:", error)
      );
  }, []);

  const handleButtonClick = (buttonName) => {
    setSelectedButtons((prevSelectedButtons) => {
      const isSelected = prevSelectedButtons.includes(buttonName);
      const updatedButtons = isSelected
        ? prevSelectedButtons.filter((name) => name !== buttonName)
        : [...prevSelectedButtons, buttonName];

      setFilterList((prevFilterList) => {
        const updatedFilterList = { ...prevFilterList };
        switch (buttonName) {
          case "delivery":
            updatedFilterList.isDelivery = isSelected ? "" : true;
            break;
          case "rate":
            updatedFilterList.isFiveStar = isSelected ? "" : true;
            break;
          default:
            break;
        }
        return updatedFilterList;
      });

      return updatedButtons;
    });

    if (buttonName === "brand") {
      setShowBrandPopup(true);
    } else if (buttonName === "filter") {
      setModalShow(true);
    }

    console.log(selectedButtons);
    console.log(filterList);
  };

  const buttons = [
    {
      name: "brand",
      label: "Hãng xe",
      svg: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.25 11.9998C21.25 14.3198 20.39 16.4598 18.97 18.0698C17.55 19.6998 15.57 20.8298 13.33 21.1398C12.9 21.2098 12.46 21.2398 12 21.2398C11.54 21.2398 11.11 21.2098 10.67 21.1398C8.43 20.8298 6.45 19.6998 5.03 18.0698C3.61 16.4598 2.75 14.3198 2.75 11.9998C2.75 9.67977 3.61 7.53977 5.03 5.92977C6.45 4.29977 8.43 3.16977 10.67 2.85977C11.1 2.78977 11.54 2.75977 12 2.75977C12.46 2.75977 12.89 2.78977 13.33 2.85977C15.57 3.16977 17.55 4.29977 18.97 5.92977C20.39 7.53977 21.25 9.67977 21.25 11.9998Z"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M11.67 21.1496C11.03 20.4796 8 17.1696 8 11.9996C8 6.82961 11.03 3.51961 11.67 2.84961"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M12.33 21.1496C12.97 20.4796 16 17.1696 16 11.9996C16 6.82961 12.97 3.51961 12.33 2.84961"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M2.75 12H21.25"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      ),
    },
    {
      name: "rate",
      label: "Chủ xe 5 sao",
      svg: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.3502 5.51906L16.3502 8.37906C15.8202 8.75906 15.0602 8.52906 14.8302 7.91906L12.9402 2.87906C12.6202 2.00906 11.3902 2.00906 11.0702 2.87906L9.17022 7.90906C8.94022 8.52906 8.19022 8.75906 7.66022 8.36906L3.66022 5.50906C2.86022 4.94906 1.80022 5.73906 2.13022 6.66906L6.29022 18.3191C6.43022 18.7191 6.81022 18.9791 7.23022 18.9791H16.7602C17.1802 18.9791 17.5602 18.7091 17.7002 18.3191L21.8602 6.66906C22.2002 5.73906 21.1402 4.94906 20.3502 5.51906Z"
            stroke="black"
          ></path>
          <path d="M7 21.5H17" stroke="black" stroke-linecap="round"></path>
          <path d="M9 13H15" stroke="black" stroke-linecap="round"></path>
        </svg>
      ),
    },
    {
      name: "delivery",
      label: "Giao nhận xe tận nơi",
      svg: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.50511 8.86499H4.80511C3.66511 8.86499 2.74512 9.78499 2.74512 10.925V18.115C2.74512 19.255 3.66511 20.175 4.80511 20.175H19.1951C20.3351 20.175 21.2551 19.255 21.2551 18.115V10.925"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M16.1154 8.86499H10.2754"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M16.1152 16.0549H19.1952C20.3352 16.0549 21.2552 16.9749 21.2552 18.1149C21.2552 19.2549 20.3352 20.1749 19.1952 20.1749H16.1152"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M16.1152 5.7749H19.1952C20.3352 5.7749 21.2552 6.6949 21.2552 7.8349"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M21.2549 18.115V7.83496"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M16.1152 5.7749V16.0549"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M2.75488 14.0049H6.86488C7.43488 14.0049 7.89488 14.3949 7.89488 14.8849C7.89488 15.3749 8.35488 15.7649 8.92488 15.7649H9.95488C10.5249 15.7649 10.9849 16.1549 10.9849 16.6449V17.5249V20.1649"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M8.40495 3.82495C6.98495 3.82495 5.83496 4.97495 5.83496 6.39495C5.83496 8.15495 8.13495 10.735 8.23495 10.845C8.32495 10.945 8.48497 10.945 8.57497 10.845C8.67497 10.735 10.975 8.15495 10.975 6.39495C10.975 4.97495 9.82495 3.82495 8.40495 3.82495Z"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M8.40562 7.37497C8.89716 7.37497 9.29562 6.9765 9.29562 6.48497C9.29562 5.99344 8.89716 5.59497 8.40562 5.59497C7.91409 5.59497 7.51562 5.99344 7.51562 6.48497C7.51562 6.9765 7.91409 7.37497 8.40562 7.37497Z"
            fill="black"
          ></path>
        </svg>
      ),
    },

    {
      name: "filter",
      label: "Bộ lọc",
      svg: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.7932 3.23242H14.1665"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M1.83325 3.23242H10.0532"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M11.4266 4.59305C12.185 4.59305 12.7999 3.98415 12.7999 3.23305C12.7999 2.48194 12.185 1.87305 11.4266 1.87305C10.6681 1.87305 10.0532 2.48194 10.0532 3.23305C10.0532 3.98415 10.6681 4.59305 11.4266 4.59305Z"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M12.7932 12.7656H14.1665"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M1.83325 12.7656H10.0532"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M11.4266 14.1263C12.185 14.1263 12.7999 13.5174 12.7999 12.7663C12.7999 12.0151 12.185 11.4062 11.4266 11.4062C10.6681 11.4062 10.0532 12.0151 10.0532 12.7663C10.0532 13.5174 10.6681 14.1263 11.4266 14.1263Z"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M5.94653 8H14.1665"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M1.83325 8H3.20658"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <path
            d="M4.57328 9.36063C5.33175 9.36063 5.94664 8.75173 5.94664 8.00063C5.94664 7.24952 5.33175 6.64062 4.57328 6.64062C3.81481 6.64062 3.19995 7.24952 3.19995 8.00063C3.19995 8.75173 3.81481 9.36063 4.57328 9.36063Z"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      ),
    },
    // Add more buttons as needed
  ];
  const handleBrandSelect = (brand) => {
    filterList.brandId == brand.brandId
      ? setFilterList({ ...filterList, brandId: "" })
      : setFilterList({ ...filterList, brandId: brand.brandId });
    // Close brand popup
  };

  const handleModelPopupClose = () => {
    setShowModelPopup(false);
  };
  const handlePopUpSubmit = (data) => {
    // Handle data submission to destination page
    setFilterList({
      ...filterList,
      startDate: data.startDateTime,
      endDate: data.endDateTime,
    });

    // Perform any further actions here
  };
  const handleSearchMotor = async () => {
    const { modelType, ...newFilterList } = filterList;
    if (modelType) {
      newFilterList.modelType = modelType;
    }
    setLoading(true);
    try {
      const response = await apiClient.post(
        `/api/motorbike/filter/${page}/${pageSize}`,
        newFilterList,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Data sent successfully:", response.data);
      setListMotor(response.data.content);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchGeocodeData = async () => {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
            address
          )}&access_token=pk.eyJ1Ijoibmd1eWVua2llbjAyIiwiYSI6ImNseDNpem83bjByM3cyaXF4NTZqOWFhZWIifQ.pVT0I74tSdI290kImTlphQ`
        );

        if (response.status === 200 && response.data) {
          const coordinates = response.data.features[0].geometry.coordinates;
          setFilterList((prevState) => ({
            ...prevState,
            longitude: coordinates[0],
            latitude: coordinates[1],
          }));
        } else {
          console.error("Error: Invalid response status or data.");
        }
      } catch (error) {
        console.error("Error making Axios request:", error);
      }
    };

    if (address) {
      fetchGeocodeData();
    }
  }, [address]);
  useEffect(() => {
    handleSearchMotor(filterList);
  }, [filterList]);
  const handleRequestError = (error) => {
    if (error.response) {
      console.error("Error response:", error.response);
      console.error("Status code:", error.response.status);
      console.error("Data:", error.response.data);

      if (error.response.status === 404) {
        setError(
          "Error 404: Not Found. The requested resource could not be found."
        );
      } else if (error.response.status === 409) {
        setError(error.response.data);
      } else {
        setError(
          `Error ${error.response.status}: ${
            error.response.data.message || "An error occurred."
          }`
        );
      }
    } else if (error.request) {
      console.error("Error request:", error.request);
      setError("No response received. Please check your network connection.");
    } else {
      console.error("Error message:", error.message);
      setError("An error occurred. Please try again.");
    }
  };
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setAddress(location.place_name);
    setOpenMapBoxSearch(false);
  };
  return (
    <div className="bg-zinc-100 mx-auto w-full font-manrope">
      <div className="w-full top-20 bg-white cursor-pointer border-t border-t-zinc-300">
        <div className="mx-auto relative max-w-7xl pt-3">
          <div className="flex justify-center  py-5relative">
            <div className="flex gap-8">
              <div
                className="flex items-center gap-2"
                onClick={() => setOpenMapBoxSearch(true)}
              >
                <div class="wrap-svg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2.75C8.31 2.75 5.3 5.76 5.3 9.45C5.3 14.03 11.3 20.77 11.55 21.05C11.79 21.32 12.21 21.32 12.45 21.05C12.71 20.77 18.7 14.03 18.7 9.45C18.7 5.76 15.69 2.75 12 2.75Z"
                      stroke="#767676"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M12.3849 11.7852C13.6776 11.5795 14.5587 10.3647 14.3529 9.07204C14.1472 7.77936 12.9325 6.89824 11.6398 7.104C10.3471 7.30976 9.46597 8.52449 9.67173 9.81717C9.87749 11.1099 11.0922 11.991 12.3849 11.7852Z"
                      stroke="#767676"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                <span>{address}</span>
              </div>
              <div
                className="flex items-center space-x-1"
                onClick={handleOpenSchedulePopup}
              >
                <div class="wrap-svg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.86 4.81V2.75"
                      stroke="#767676"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M17.14 4.81V2.75"
                      stroke="#767676"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M18.05 3.78003H5.95C4.18 3.78003 2.75 5.21003 2.75 6.98003V18.06C2.75 19.83 4.18 21.26 5.95 21.26H18.06C19.83 21.26 21.26 19.83 21.26 18.06V6.98003C21.25 5.21003 19.82 3.78003 18.05 3.78003Z"
                      stroke="#767676"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M2.75 7.8999H21.25"
                      stroke="#767676"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M18 12C18.5523 12 19 11.5523 19 11C19 10.4477 18.5523 10 18 10C17.4477 10 17 10.4477 17 11C17 11.5523 17.4477 12 18 12Z"
                      fill="#767676"
                    ></path>
                    <path
                      d="M14 12C14.5523 12 15 11.5523 15 11C15 10.4477 14.5523 10 14 10C13.4477 10 13 10.4477 13 11C13 11.5523 13.4477 12 14 12Z"
                      fill="#767676"
                    ></path>
                    <path
                      d="M10 12C10.5523 12 11 11.5523 11 11C11 10.4477 10.5523 10 10 10C9.44772 10 9 10.4477 9 11C9 11.5523 9.44772 12 10 12Z"
                      fill="#767676"
                    ></path>
                    <path
                      d="M6 12C6.55228 12 7 11.5523 7 11C7 10.4477 6.55228 10 6 10C5.44772 10 5 10.4477 5 11C5 11.5523 5.44772 12 6 12Z"
                      fill="#767676"
                    ></path>
                    <path
                      d="M18 15.49C18.5523 15.49 19 15.0423 19 14.49C19 13.9377 18.5523 13.49 18 13.49C17.4477 13.49 17 13.9377 17 14.49C17 15.0423 17.4477 15.49 18 15.49Z"
                      fill="#767676"
                    ></path>
                    <path
                      d="M14 15.49C14.5523 15.49 15 15.0423 15 14.49C15 13.9377 14.5523 13.49 14 13.49C13.4477 13.49 13 13.9377 13 14.49C13 15.0423 13.4477 15.49 14 15.49Z"
                      fill="#767676"
                    ></path>
                    <path
                      d="M10 15.49C10.5523 15.49 11 15.0423 11 14.49C11 13.9377 10.5523 13.49 10 13.49C9.44772 13.49 9 13.9377 9 14.49C9 15.0423 9.44772 15.49 10 15.49Z"
                      fill="#767676"
                    ></path>
                    <path
                      d="M6 15.49C6.55228 15.49 7 15.0423 7 14.49C7 13.9377 6.55228 13.49 6 13.49C5.44772 13.49 5 13.9377 5 14.49C5 15.0423 5.44772 15.49 6 15.49Z"
                      fill="#767676"
                    ></path>
                    <path
                      d="M14 18.97C14.5523 18.97 15 18.5223 15 17.97C15 17.4177 14.5523 16.97 14 16.97C13.4477 16.97 13 17.4177 13 17.97C13 18.5223 13.4477 18.97 14 18.97Z"
                      fill="#767676"
                    ></path>
                    <path
                      d="M10 18.97C10.5523 18.97 11 18.5223 11 17.97C11 17.4177 10.5523 16.97 10 16.97C9.44772 16.97 9 17.4177 9 17.97C9 18.5223 9.44772 18.97 10 18.97Z"
                      fill="#767676"
                    ></path>
                    <path
                      d="M6 18.97C6.55228 18.97 7 18.5223 7 17.97C7 17.4177 6.55228 16.97 6 16.97C5.44772 16.97 5 17.4177 5 17.97C5 18.5223 5.44772 18.97 6 18.97Z"
                      fill="#767676"
                    ></path>
                  </svg>
                </div>
                <span>
                  {filterList.startDate && filterList.endDate
                    ? `${format(
                        new Date(filterList.startDate),
                        "HH:mm, dd/MM/yyyy"
                      )} - ${format(
                        new Date(filterList.endDate),
                        "HH:mm, dd/MM/yyyy"
                      )}`
                    : "Thời gian không hợp lệ"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <MapboxSearchPopUp
          open={openMapboxSearch}
          onClose={() => setOpenMapBoxSearch(false)}
          onSelect={handleSelectLocation}
        />
        <MotorbikeSchedulePopUp
          isOpen={schedulePopUp}
          onClose={() => setSchedulePopUp(false)}
          onSubmit={handlePopUpSubmit}
        />
      </div>

      <div className=" w-full z-[999] shadow-custom bg-white">
        <div className="relative max-w-7xl mx-auto flex gap-3 justify-center py-4">
          {buttons.map((button) => (
            <button
              key={button.name}
              className={`flex items-center border rounded-full px-3 py-1 ${
                selectedButtons.includes(button.name)
                  ? "bg-green-500 text-white border-white-500"
                  : "bg-white text-black border-gray-200 hover:bg-zinc-200"
              }`}
              onClick={() => handleButtonClick(button.name)}
            >
              <span
                className={`mr-2 ${
                  selectedButtons.includes(button.name)
                    ? "text-white"
                    : "text-green-500"
                }`}
              >
                {button.svg}
              </span>
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <div style={{ width: "95%" }}>
          <MotorbikeList listMotor={listMotor} searchLongitude={filterList.longitude} searchLatitude={filterList.latitude} showDistance={true}/>
        </div>
      </div>
      {showBrandPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Chọn hãng xe</h2>
            {/* Render danh sách hãng xe từ state brands */}
            <div className="grid grid-cols-2 gap-2">
              {brands.map((brand) => (
                <button
                  key={brand.brandId}
                  className={`w-full text-black rounded px-3 py-1 ${
                    filterList.brandId && filterList.brandId === brand.brandId
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleBrandSelect(brand)}
                >
                  {brand.brandName}
                </button>
              ))}
            </div>
            <button
              className="bg-green-500 text-white rounded px-3 py-1 mt-4"
              onClick={() => setShowBrandPopup(false)}
            >
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
