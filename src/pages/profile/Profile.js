import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { faMotorcycle, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import UpdatePassword from "./UpdatePassword";
import ChangeEmail from "./ChangeEmail";
import License from "../license/License";
import axios from "axios";
import { useLocation } from "react-router-dom";

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

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [showPopUpPassword, setShowPopUpPassword] = useState(false);
  const [showPopUpEmail, setShowPopUpEmail] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="font-manrope">
      <div className={cardClasses}>
        <div className="flex justify-between items-start">
          <h2 className={`text-xl font-semibold ${textClasses}`}>
            Thông tin cá nhân
          </h2>
        </div>
        <div className="flex mt-4 items-center">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-pink-600 text-white text-4xl flex items-center justify-center rounded-full">
              XXX
            </div>
          </div>
          <div className="ml-6 flex flex-col justify-center">
            <div className={`text-lg font-semibold ${textClasses}`}>
              {(user.gender ? "Mr. " : "Mrs. ") +
                user.lastName +
                " " +
                user.firstName}
            </div>
          </div>
          <div className="flex-shrink-0 text-center ml-auto">
            <FontAwesomeIcon icon={faMotorcycle} />
            <br />
            <span className={`text-lg font-semibold ${greenTextClasses}`}>
              {user.totalTrip}
            </span>
            <span className={smallTextClasses}> chuyến</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={textClasses}>Email</div>
              <span className="ml-2 bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                Đã xác thực
              </span>
            </div>
            <div className="flex items-center">
              <div className="font-bold">{user.email}</div>
              <button
                className={`ml-2 ${buttonClasses}`}
                onClick={() => setShowPopUpEmail(true)}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              {showPopUpEmail && (
                <ChangeEmail
                  show={showPopUpEmail}
                  handleClose={() => setShowPopUpEmail(false)}
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={textClasses}>Số điện thoại</div>
              <span className="ml-2 bg-red-100 dark:bg-green-700 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                Chưa xác thực
              </span>
            </div>
            <div className="flex items-center">
              <div className="font-bold">{user.phone}</div>
              <button className={`ml-2 ${buttonClasses}`}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className=" py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-green-500 hover:bg-green-600 transition hover:scale-110"
              onClick={() => setShowPopUpPassword(true)}
            >
              Đổi mật khẩu
            </button>
            {showPopUpPassword && (
              <UpdatePassword
                show={() => setShowPopUpPassword(true)}
                handleClose={() => setShowPopUpPassword(false)}
              />
            )}
          </div>
        </div>
      </div>
      <div id="license">
        <License />
      </div>
    </div>
  );
};

export default Profile;
