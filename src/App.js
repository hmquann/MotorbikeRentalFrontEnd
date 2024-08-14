import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Header from "./pages/header/Header";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import NoMatch from "./pages/noMatch/NoMatch";
import PostUser from "./pages/employee/PostUser";
import UpdateUser from "./pages/employee/UpdateUser";
import Login from "./pages/login/Login";
import Forgotpassword from "./pages/forgotpassword/Forgotpassword";
import Register from "./pages/register/Register";
import Homepage from "./pages/hompage/Homepage";
import { useEffect, useRef, useState } from "react";
import Privacy from "./pages/privacy/Privacy";
import PrivacyList from "./pages/privacy/PrivacyList";
import UserInformation from "./pages/dashboard/UserInformation";
import UserData from "./pages/dashboard/UserData";
import RegisterSuccess from "./pages/register/RegisterSuccess";
import ResetNewPassword from "./pages/forgotpassword/ResetNewPassword";
import Menu from "./pages/menu/Menu";
import Booking from "./pages/booking/Booking";
import Layout from "./pages/test-layout/Layout";
import DetailBooking from "./pages/booking/detail/DetailBooking";
import Address from "./pages/booking/address/Address";
import UserWallet from "./pages/wallet/UserWallet";
import PaymentSuccess from "./pages/wallet/PaymentSuccess";
import PaymentFailed from "./pages/wallet/PaymentFailed";
import BrandList from "./pages/brand/BrandList";
import ApproveLicense from "./pages/license/ApproveLicense";
import Profile from "./pages/profile/Profile";
import VerifyChangeEmail from "./pages/profile/VerifyChangeEmail";
import Message from "./pages/chatting/Message";
import ModelList from "./pages/modelMotorbike/ModelList";
import ApproveMotorbikeRegistration from "./pages/motorbike/ApproveMotorbikeRegistration ";
import ChatApp from "./pages/chatapp/ChatApp";
import RegisterMotorbikeStep1 from "./pages/motorbike/RegisterMotorbikeStep1";
import RegisterMotorbikeStep2 from "./pages/motorbike/RegisterMotorbikeStep2";
import CreateVoucherModal from "./pages/voucher/CreateVoucherModal";

import VoucherList from "./pages/voucher/VoucherList";
import MyBooking from "./pages/myBooking/MyBooking";
import BookingDetail from "./pages/myBooking/BookingDetail";
import ManageBooking from "./pages/myBooking/ManageBooking";
import BlogEditor from "./pages/blog/BlogEditor";
import BlogList from "./pages/blog/BlogList";
import BlogDetail from "./pages/blog/BlogDetail";
import Filter from "./pages/filter/Filter";
import FeedbackModal from "./pages/booking/FeedbackModal";
import Footer from "./pages/footer/Footer";
import UserCard from "./pages/booking/UserCard";
import ChatWithFirebase from "./pages/chatWithFirebase/ChatWithFirebase";

import MapboxSearchPopUp from "./pages/filter/MapboxSearchPopUp";
import GeneralPolicy from "./pages/privacy/GeneralPolicy";
import Regulations from "./pages/privacy/Regulations";
import PrivacyPolicy from "./pages/privacy/PrivacyPolicy";
import Complaints from "./pages/privacy/Complaints";
import DashboardForAdmin from "./pages/dashboard/DashboardForAdmin";
import DashboardForLessor from "./pages/dashboard/DashboardForLessor";

function App() {
  const location = useLocation();
  const isChatPage = location.pathname === "/menu/chatting";

  return (
    <>
      <Header />
      <Routes>
        <Route path="/userCard/:userId" element={<UserCard />} />
        <Route path="/employee" element={<PostUser />} />
        <Route path="/employee/:id" element={<UpdateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route
          path="password/resetnewpassword/:token"
          element={<ResetNewPassword />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/verify/:token" element={<RegisterSuccess />} />
        <Route path="/registermotorbike" element={<RegisterMotorbikeStep1 />} />
        <Route path="/sendFeedback" element={<FeedbackModal />} />
        <Route
          path="/registermotorbike/step2"
          element={<RegisterMotorbikeStep2 />}
        />
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/privacy/*" element={<Privacy />}>
          <Route path="general" element={<GeneralPolicy />} />
          <Route path="regulation" element={<Regulations />} />
          <Route path="policy" element={<PrivacyPolicy />} />
          <Route path="complaint" element={<Complaints />} />
        </Route>
        <Route path="/filter" element={<Filter />} />
        <Route path="/privacyList" element={<PrivacyList />} />
        <Route path="/userInformation" element={<UserInformation />} />
        <Route path="/bookingDetail" element={<BookingDetail />} />
        <Route path="/manageBooking" element={<ManageBooking />} />
        <Route path="/menu" element={<Menu />}>
          <Route path="/menu/chatting" element={<ChatWithFirebase />} />
          <Route path="/menu/myBooking" element={<MyBooking />} />
          <Route path="/menu/wallet" element={<UserWallet />} />
          <Route
            path="/menu/approveMotorbike"
            element={<ApproveMotorbikeRegistration />}
          />
          <Route path="/menu/brand" element={<BrandList />} />
          <Route path="/menu/blogList" element={<BlogList />} />
          <Route path="/menu/model" element={<ModelList />} />
          <Route path="/menu/voucher" element={<VoucherList />} />
          <Route path="/menu/profile" element={<Profile />} />
          <Route path="/menu/approveLicense" element={<ApproveLicense />} />
          <Route path="/menu/userData" element={<UserData />} />
          <Route
            path="/menu/dashboardForAdmin"
            element={<DashboardForAdmin />}
          />
          <Route
            path="/menu/dashboardForLessor"
            element={<DashboardForLessor />}
          />
        </Route>

        <Route path="/booking" element={<Booking />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />

        <Route path="*" element={<NoMatch />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/createVoucher" element={<CreateVoucherModal />} />
        <Route path="/detailbooking" element={<DetailBooking />} />
        <Route path="/booking/address" element={<Address />} />
        <Route
          path="/updateEmail/:token/:newEmail"
          element={<VerifyChangeEmail />}
        />
        <Route path="/chatapp" element={<ChatApp />} />
        <Route path="/mapboxSearch" element={<MapboxSearchPopUp />} />
      </Routes>
      {!isChatPage && <Footer />}
    </>
  );
}

export default App;
