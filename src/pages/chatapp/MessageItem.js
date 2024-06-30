import React, { useState } from "react";
import { timeStampConverter } from "./timeUtils";
import "./Message.css";

export const MessageItem = ({ message, username }) => {
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const userId = userData.userId;
  const type = message.messageType.toLowerCase();
  const self = message.userId === userId ? "_self" : "";
  console.log("aaaaaaaaaaaaa" + message.user_id);
  console.log(message);
  console.log("bbbbbbbbbbbbbbb" + userId);
  const time = timeStampConverter(message.timestamp);

  return (
    <div className={"message_item_" + type + self}>
      {type != "server" && self == "" && (
        <span className="message_item_username">{message.username}</span>
      )}
      <div className={"message_content_" + type + self}>
        <span className="message_content_value">{message.content}</span>
        <span>{time}</span>
      </div>
    </div>
  );
};

export default MessageItem;
