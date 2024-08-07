import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const PrivacyList = () => {
  const sharedClasses =
    "flex items-center px-4 py-2 text-black dark:text-white no-underline border-t-2 pt-2 border-grey-500";
  
  const location = useLocation();
  
  // Kiểm tra xem đường dẫn hiện tại có phải là trang chính hay không
  const isGeneralActive = location.pathname === "/" || location.pathname === "/general";

  return (
    <div className="md:w-1/4 w-full dark:bg-zinc-800 mt-20">
      <ul className="space-y-2">
        <li>
          <NavLink
            to="general"
            end
            className={({ isActive }) =>
              `${sharedClasses} block ${
                isGeneralActive || isActive ? "font-bold border-l-4 border-l-green-500" : ""
              }`
            }
          >
            Chính sách & Quy định
          </NavLink>
        </li>
        <li>
          <NavLink
            to="regulations"
            className={({ isActive }) =>
              `${sharedClasses} block ${
                isActive ? "font-bold border-l-4 border-l-green-500" : ""
              }`
            }
          >
            Nguyên tắc chung
          </NavLink>
        </li>
        <li>
          <NavLink
            to="privacy"
            className={({ isActive }) =>
              `${sharedClasses} block ${
                isActive ? "font-bold border-l-4 border-l-green-500" : ""
              }`
            }
          >
            Chính sách bảo mật
          </NavLink>
        </li>
        <li>
          <NavLink
            to="complaints"
            className={({ isActive }) =>
              `${sharedClasses} block ${
                isActive ? "font-bold border-l-4 border-l-green-500" : ""
              }`
            }
          >
            Giải quyết khiếu nại
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default PrivacyList;
