import React from "react";
import { Link } from "react-router-dom";

const sharedClasses = {
  borderLeft: "border-l-4 border-green-500",
  paddingX: "px-4",
  paddingY: "py-2",
  marginTop: "mt-2",
  backgroundColor: "bg-zinc-100",
};

const PolicyItem = ({ children, isHighlighted }) => {
  return (
    <li
      className={`${sharedClasses.paddingY} ${sharedClasses.paddingX} ${
        isHighlighted ? sharedClasses.backgroundColor : ""
      }`}
    >
      <Link to={Link} className="text-black-500 ">
        {children}
      </Link>
    </li>
  );
};

const PrivacyList = () => {
  return (
    <div className="w-full md:w-64">
      <div className={`${sharedClasses.borderLeft} ${sharedClasses.paddingX}`}>
        <h2 className="font-bold">Chính sách & Quy định</h2>
      </div>
      <ul className={sharedClasses.marginTop}>
        <PolicyItem to="/policies/general" isHighlighted>
          Chính sách & Quy định
        </PolicyItem>
        <PolicyItem to="/policies/regulations">Nghị định chung</PolicyItem>
        <PolicyItem to="/policies/privacy">Chính sách bảo mật</PolicyItem>
        <PolicyItem to="/policies/complaints">Giải quyết khiếu</PolicyItem>
      </ul>
    </div>
  );
};

export default PrivacyList;
