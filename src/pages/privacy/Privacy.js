// Privacy.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivacyImage from "../../assets/images/PrivacyImage.jpg";
import PrivacyList from "./PrivacyList";
import GeneralPolicy from "./GeneralPolicy";
import Regulations from "./Regulations";
import PrivacyPolicy from "./PrivacyPolicy";
import Complaints from "./Complaints";

const Privacy = () => {
  return (
    <div className=" dark:bg-neutral-900 min-h-screen p-6 font-manrope">
      <div className="max-w-7xl mx-auto mt-5">
        <div className="relative mb-20">
          <img
            src={PrivacyImage}
            alt="Hero Image"
            className="w-full h-96 object-cover rounded-xl shadow-md"
            crossorigin="anonymous"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-3xl md:text-6xl font-bold">
              Chính sách & Quy định
            </h1>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <PrivacyList />
        <div className="flex-1 md:ml-8 mt-8 md:mt-0">
          <Routes>
            <Route path="general" element={<GeneralPolicy />} />
            <Route path="regulations" element={<Regulations />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="complaints" element={<Complaints />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
