import React from 'react';
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

    return (
        <div className={cardClasses}>
        <div className={sharedClasses.card}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={sharedClasses.title}>
              Driver's license{" "}
              (userData.license)
              <span className="ml-2 bg-red-100 dark:bg-green-700 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                Not verified
              </span>
            </h2>

            <div className="flex items-center space-x-2">
              <button className={sharedClasses.button}>Edit</button>
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
              <img
                src="https://placehold.co/600x400"
                alt="Hình ảnh"
                className={sharedClasses.image}
              />
              {/* <p className={sharedClasses.info}>
                Vì sao tôi phải xác thực GPLX{" "}
                <span className="text-zinc-900 dark:text-white">?</span>
              </p> */}
            </div>
            <div>
              <h3 className={sharedClasses.title}>Information</h3>
              <div className="space-y-4">
                <div>
                  <label className={sharedClasses.label}>
                    License's number
                  </label>
                  <div className={sharedClasses.content}>12332123312</div>
                </div>
                <div>
                  <label className={sharedClasses.label}>Full name</label>
                  <div className={sharedClasses.content}>1233123</div>
                </div>
                <div>
                  <label className={sharedClasses.label}>Date of birth</label>
                  <div className={sharedClasses.content}>01-01-1970</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default License;