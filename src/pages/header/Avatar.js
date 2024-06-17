import React from "react";
import "./Avatar.css";

const Avatar = ({ firstName, backgroundColor }) => {
  const firstLetter = firstName.charAt(0).toUpperCase();
  const style = {
    backgroundColor: backgroundColor,
  };

  return (
    <div className="avatar" style={style}>
      <span className="initial">{firstLetter}</span>
    </div>
  );
};

export default Avatar;
