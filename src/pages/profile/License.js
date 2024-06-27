import React, { useState } from "react";
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
  note: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg",
  info: "text-sm",
  image: "rounded-lg w-full",
  label: "block text-sm font-medium text-zinc-700 dark:text-zinc-300",
  content:
    "bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white p-2 rounded-lg",
};
const License = () => {
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const [changeLicense, setChangeLicense] = useState(false);
  const [previewImage, setPreviewImage] = useState();
  const [formLicenseData, setFormLicenseData] = useState({
    licenseNumber: "",
    birthOfDate: "",
    licenseImageFile: "",
  });
  const handleSubmit = async () => {
    setChangeLicense(false);
    const formData = new FormData();
    formData.append("licenseNumber", formLicenseData.licenseNumber);
    formData.append("birthOfDate", formLicenseData.birthOfDate);
    formData.append("licenseImageFile", formLicenseData.licenseImageFile);
    
    try {
      const response = await fetch("http://localhost:8080/api/license/uploadLicense", {
        headers: {
            "Authorization": userData.token,
          },
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File uploaded successfully!");
      } else {
        console.error("File upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setFormLicenseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  console.log(formLicenseData);
  return (
    <div className={cardClasses}>
      <div className={sharedClasses.card}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={sharedClasses.title}>
            Driver's license{" "}
            <span className="ml-2 bg-red-100 dark:bg-green-700 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
              {userData.license
                ? userData.license.status === true
                  ? "Verified"
                  : "Not Verified"
                : "Empty"}
            </span>
          </h2>

          <div className="flex items-center space-x-2">
            <button
              className={sharedClasses.button}
              onClick={handleChangeLicense}
            >
              {userData.license ? "Edit" : "Upload"}
            </button>
          </div>
        </div>
        <div className={sharedClasses.note}>
          <p className={sharedClasses.info}>
            Note: To avoid any issues during the rental process,{" "}
            <span className="font-semibold">the person booking</span> on
            MiMOTORBIKE (with verified driver's license){" "}
            <span className="font-semibold">MUST ALSO</span> phải là{" "}
            <span className="font-semibold">be the person receiving</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={sharedClasses.title}>Image</h3>
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
                  userData.license && userData.license.licenseImageUrl
                    ? userData.license.licenseImageUrl
                    : "https://placehold.co/600x400"
                }
                alt="License Image"
                className={sharedClasses.image}
              />
            )}
          </div>
          <div>
            <h3 className={sharedClasses.title}>Information</h3>
            <div className="space-y-4">
              <div>
                <label className={sharedClasses.label}>License's number</label>
                {changeLicense == false ? (
                  <div className={sharedClasses.content}>
                    {userData.license
                      ? userData.license.licenseNumber
                      : "Not yet"}
                  </div>
                ) : (
                  <input
                    className={sharedClasses.content}
                    name="licenseNumber"
                    value={formLicenseData.licenseNumber}
                    placeholder={
                      userData.license
                        ? userData.license.licenseNumber
                        : "Not yet"
                    }
                    onChange={handleChangeValue}
                  />
                )}
              </div>
              <div>
                <label className={sharedClasses.label}>Date of birth</label>
                {changeLicense == false ? (
                  <div className={sharedClasses.content}>
                    {userData.license
                      ? userData.license.birthOfDate
                      : "Not yet"}
                  </div>
                ) : (
                  <input
                    className={sharedClasses.content}
                    name="birthOfDate"
                    value={formLicenseData.birthOfDate}
                    placeholder={
                      userData.license
                        ? userData.license.birthOfDate
                        : "Not yet"
                    }
                    onChange={handleChangeValue}
                  />
                )}
              </div>
              <div>
                <label className={sharedClasses.label}>Full name</label>
                <div className={sharedClasses.content}>
                  {userData.license
                    ? userData.firstName.concat(" ", userData.lastName)
                    : "Not yet"}
                </div>
              </div>
            </div>
            {changeLicense == false ? (
              " "
            ) : 
              <button
                onClick={handleSubmit}
                className="mt-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
               >Upload</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default License;
