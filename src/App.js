import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Header from "./pages/header/Header";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NoMatch from "./pages/noMatch/NoMatch";
import PostUser from "./pages/employee/PostUser";
import UpdateUser from "./pages/employee/UpdateUser";
import Login from "./pages/login/Login";
import Forgotpassword from "./pages/forgotpassword/Forgotpassword";
import Register from "./pages/register/Register";
import Homepage from "./pages/hompage/Homepage";
import { useState } from "react";
import Privacy from "./pages/privacy/Privacy";
import PrivacyList from "./pages/privacy/PrivacyList";
import UserInformation from "./pages/dashboard/UserInformation";
import UserData from "./pages/dashboard/UserData";

import RegisterMotorbikeStep1 from "./pages/motorbike/RegisterMotorbikeStep1";
import RegisterSuccess from "./pages/register/RegisterSuccess";
import ResetNewPassword from "./pages/forgotpassword/ResetNewPassword";
import Menu from "./pages/menu/Menu";
import Booking from "./pages/booking/Booking";
import Layout from "./pages/test-layuot/Layout";
import DetailBooking from "./pages/booking/detail/DetailBooking";
import Address from "./pages/booking/address/Address";
import ChatMessage from "./pages/chatting/ChatMessage";

import UserWallet from "./pages/wallet/UserWallet";
import PaymentSuccess from "./pages/wallet/PaymentSuccess";
import PaymentFailed from "./pages/wallet/PaymentFailed";



import BrandList from "./pages/brand/BrandList";
import ModelList from "./pages/modelMotorbike/ModelList";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee" element={<PostUser />} />
        <Route path="/employee/:id" element={<UpdateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route
          path="password/resetnewpassword/:token"
          element={<ResetNewPassword />}
        />
        <Route path="/register" element={<Register />} />

        <Route path="/verify/:token" element={<RegisterSuccess />} />
        <Route
          path="/registermotorbike/step1"
          element={<RegisterMotorbikeStep1 />}
        />
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/privacyList" element={<PrivacyList />} />
        <Route path="/userInformation" element={<UserInformation />} />
        <Route path="/userData" element={<UserData />} />

        <Route path="/menu" element={<Menu />} />
        <Route path="/booking" element={<Booking />} />

        <Route path="/wallet" element={<UserWallet />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/brand" element={<BrandList />} />

        <Route path="/model" element={<ModelList />} />

        <Route path="*" element={<NoMatch />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/detailbooking" element={<DetailBooking />} />
        <Route path="/booking/address" element={<Address />} />
        <Route path="/chatmessage" element={<ChatMessage />} />
      </Routes>
    </>
  );
}

export default App;
