import React from "react";
import Header from "./pages/header/Header";
import Menu from "./Menu"; // Import component Menu
import "./Layout.css"; // Style for layout

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <Menu /> {/* Include Menu component here */}
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;