import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

const sharedClasses = {
  mt4: "mt-4",
  wFull: "w-full",
  bgGreen500: "bg-green-500",
  textWhite: "text-white",
  py2: "py-2",
  rounded: "rounded",
};

const PopUpLicense = ({
  onClose,
  messageLicense,
  buttonLicense,
  buttonBackHomePage,
}) => {
  const navigate = useNavigate();
  const handleNavigateLicense = () => {
    navigate("/menu/profile#license");
  };
  const handleNavigateHomePage = () => {
    navigate("/homepage");
  };
  console.log(buttonBackHomePage);
  console.log(buttonLicense);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div
        className="popup-location-form bg-white rounded-lg p-8 shadow-lg mb-4"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #ccc",
        }}
      >
        <FontAwesomeIcon
          icon={faCircleExclamation}
          style={{ color: "red", fontSize: "48px", marginBottom: "16px" }}
        />
        <span className="mb-4 text-center">{messageLicense}</span>
        {buttonLicense ? (
          <button
            type="button"
            className={`text-lg ${sharedClasses.mt4} ${sharedClasses.wFull} ${sharedClasses.bgGreen500} ${sharedClasses.textWhite} ${sharedClasses.py2} ${sharedClasses.rounded}`}
            onClick={handleNavigateLicense}
          >
            {buttonLicense}
          </button>
        ) : (
          <button
            type="button"
            className={`text-lg ${sharedClasses.mt4} ${sharedClasses.wFull} ${sharedClasses.bgGreen500} ${sharedClasses.textWhite} ${sharedClasses.py2} ${sharedClasses.rounded}`}
            onClick={handleNavigateHomePage}
          >
            {buttonBackHomePage}
          </button>
        )}
      </div>
    </div>
  );
};

export default PopUpLicense;
