import React, { useState, useEffect } from "react";
import axios from "axios";
import apiClient from "../../axiosConfig";

const cardClasses =
  "bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto border border-zinc-300 dark:border-zinc-700 mt-8";
const textClasses = "text-zinc-900 dark:text-zinc-100";
const buttonClasses = "text-zinc-500 dark:text-zinc-300";
const badgeClasses =
  "bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-sm px-2 py-1 rounded-full";
const greenTextClasses = "text-green-600 dark:text-green-400";
const smallTextClasses = "text-zinc-500 dark:text-zinc-400";
const changePasswordButtonClasses =
  "mt-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white";
const sharedClasses = {
  title: "text-xl font-semibold text-zinc-900 dark:text-white",
  redText: "text-red-600 dark:text-red-400",
  button:
    "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white px-4 py-2 rounded-lg",
  blueButton:
    "bg-zinc-200 blue:bg-zinc-700 text-zinc-900 dark:text-white px-4 py-2 rounded-lg",
  note: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg",
  info: "text-sm",
  image: "rounded-lg w-full object-contain h-48 w-96",
  label: "block text-sm font-medium text-zinc-700 dark:text-zinc-300",
  content:
    "bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white p-2 rounded-lg",
};
function isValidLicenseNumber(str) {
  const regex = /^0\d{11}$/;
  return regex.test(str);
}
function isEnoughtEighteenYear(bod) {
  const birthDate = new Date(bod);
  if (isNaN(birthDate)) {
    throw new Error("Invalid date format");
  }
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();
  const dayDifference = currentDate.getDate() - birthDate.getDate();
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }
  return age >= 18;
}
const License = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user.userId);
  const fullName = user.firstName + " " + user.lastName;
  const [changeLicense, setChangeLicense] = useState(false);
  const [previewImage, setPreviewImage] = useState();
  const [license, setLicense] = useState();
  const [error, setError] = useState("");
  const [licenseNumberError, setLicenseNumberError] = useState("");
  const [birthDateError, setBirthOfDateError] = useState("");
  useEffect(() => {
    apiClient
      .get(
        `/api/license/getLicenseByUserId/${user.userId}`
      )
      .then((response) => setLicense(response.data))
      .catch((error) => console.error("Error fetching motorbikes:", error));
  }, [license]);
  const [formLicenseData, setFormLicenseData] = useState({
    licenseNumber: "",
    birthOfDate: "",
    licenseImageFile: "",
    licenseType: "",
  });
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("licenseNumber", formLicenseData.licenseNumber);
    formData.append("birthOfDate", formLicenseData.birthOfDate);
    formData.append("licenseImageFile", formLicenseData.licenseImageFile);
    formData.append("licenseType", formLicenseData.licenseType);
    if (licenseNumberError || birthDateError || !formLicenseData.licenseType||!formLicenseData.birthOfDate||!formLicenseData.licenseNumber) {
      setError("Hãy kiểm tra thông tin bạn nhập vào");
    } else {
      apiClient
        .post("/api/license/uploadLicense", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log("Data sent successfully:", response.data);
          setChangeLicense(false);
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
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
            // The request was made but no response was received
            console.error("Error request:", error.request);
            setError(
              "No response received. Please check your network connection."
            );
          }

          setChangeLicense(false);
        });
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormLicenseData((prevState) => ({
          ...prevState,
          licenseImageFile: file,
        }));
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeLicense = () => {
    changeLicense == true ? setChangeLicense(false) : setChangeLicense(true);
  };
  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    if (name === "licenseNumber") {
      if (!isValidLicenseNumber(value)) {
        setLicenseNumberError("Chưa đúng định dạng bằng lái xe máy");
      } else {
        setLicenseNumberError("");
      }
    }
    if (name === "birthOfDate") {
      if (!isEnoughtEighteenYear(value)) {
        setBirthOfDateError("Bạn chưa đủ 18 tuổi");
      } else {
        setBirthOfDateError("");
      }
    }
    setFormLicenseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  console.log(formLicenseData);
  return (
    <div className={cardClasses}>
      <div className={sharedClasses.card}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={sharedClasses.title}>
            Giấy phép lái xe{" "}
            {license ? (
              license.status === "APPROVED" ? (
                <span className="ml-2 bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                  Đã xác thực
                </span>
              ) : (
                <span className="ml-2 bg-red-100 dark:bg-green-700 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                  Chưa xác thực
                </span>
              )
            ) : (
              <span className="ml-2 bg-red-100 dark:bg-green-700 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                Chưa đăng ký
              </span>
            )}
          </h2>

          <div className="flex items-center space-x-2">
            <button
              className={sharedClasses.blueButton}
              onClick={handleChangeLicense}
            >
              {license ? "Chỉnh sửa" : "Đăng ký"}
            </button>
          </div>
        </div>
        <div className={sharedClasses.note}>
          <p className={sharedClasses.info}>
            Lưu ý: Để tránh mọi vấn đề trong quá trình thuê,{" "}
            <span className="font-semibold"> người đặt chỗ</span> trên
            MiMOTORBIKE bắt buộc phải có bằng lái xe đã được xác minh{" "}
            <span className="font-semibold">
              {" "}
              (không áp dụng với các loại xe gắn máy)
            </span>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={sharedClasses.title}>Hình ảnh</h3>
            {changeLicense ? (
              <>
                <input
                  type="file"
                  name="licenseImageFile"
                  accept="image/*" // Chỉ chấp nhận tệp hình ảnh
                  onChange={handleFileChange}
                  className={sharedClasses.inputFile}
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      width: "200px",
                      height: "auto",
                      marginTop: "10px",
                    }}
                    className={sharedClasses.imagePreview}
                  />
                )}
              </>
            ) : (
              <img
                src={
                  license && license.licenseImageUrl
                    ? license.licenseImageUrl
                    : "https://placehold.co/600x400"
                }
                alt="License Image"
                className={sharedClasses.image}
              />
            )}
          </div>
          <div>
            <h3 className={sharedClasses.title}>Thông tin</h3>
            <div className="space-y-4">
              <div>
                <label className={sharedClasses.label}>
                  Số đăng ký bằng lái xe
                </label>
                {changeLicense == false ? (
                  <div className={sharedClasses.content}>
                    {license ? license.licenseNumber : "Not yet"}
                  </div>
                ) : (
                  <input
                    className={sharedClasses.content}
                    name="licenseNumber"
                    value={formLicenseData.licenseNumber}
                    placeholder={license ? license.licenseNumber : "Not yet"}
                    onChange={handleChangeValue}
                  />
                )}
              </div>
              {licenseNumberError && (
                <div className="text-red-500">{licenseNumberError}</div>
              )}
              <div>
                <label className={sharedClasses.label}>
                  Ngày tháng năm sinh
                </label>
                {changeLicense == false ? (
                  <div className={sharedClasses.content}>
                    {license ? license.birthOfDate : "Not yet"}
                  </div>
                ) : (
                  <input
                    type="date"
                    className={sharedClasses.content}
                    name="birthOfDate"
                    value={formLicenseData.birthOfDate}
                    placeholder={license ? license.birthOfDate : "Not yet"}
                    onChange={handleChangeValue}
                  />
                )}
              </div>
              {birthDateError && (
                <div className="text-red-500">{birthDateError}</div>
              )}
              <div></div>
              <div>
                <label className={sharedClasses.label}>Loại bằng lái xe</label>
                {changeLicense ? (
                  <select
                    name="licenseType"
                    value={formLicenseData.licenseType}
                    onChange={handleChangeValue}
                    className={sharedClasses.content}
                  >
                    <option value="">Chọn loại bằng lái xe</option>
                    <option value="A">A</option>
                    <option value="A1">A1</option>
                  </select>
                ) : (
                  <div>
                    <div className={sharedClasses.content}>
                      {license ? license.licenseType : "Not yet"}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className={sharedClasses.label}>Họ và tên</label>
                <div className={sharedClasses.content}>
                  {license ? fullName : "Not yet"}
                </div>
              </div>
            </div>
            {error && (
                <div className="text-red-500">{error}</div>
              )}  
            {changeLicense && (
              <> 
               <div>
                Kiểm tra thông tin gplx<a href="https://gplx.gov.vn/?page=home" target="_blank"> tại đây</a>
                </div>            
                <button
                  onClick={handleSubmit}
                  className="mt-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white mr-4"
                >
                  Đăng ký
                </button>
                <button
                  onClick={() => setChangeLicense(false)}
                  className="mt-4 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
                >
                  Trở về
                </button>
               
              </>
            )}
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default License;
