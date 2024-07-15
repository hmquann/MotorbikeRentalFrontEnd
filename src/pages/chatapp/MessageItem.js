import React, { useState } from "react";
import { timeStampConverter } from "./timeUtils";
import "./ChatApp.css";

export const MessageItem = ({ message, username }) => {
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const userId = userData.userId;
  const type = message.messageType.toLowerCase();
  const self = message.userId === userId ? "_self" : "";
  console.log(message);
  const time = timeStampConverter(message.timestamp);
  console.log(message.timestamp);
  console.log(time);

  return (
    <>
      {type != "server" && self == "" && (
        <div class="incoming_msg">
          <div class="incoming_msg_img">
            {" "}
            <img
              src="https://bootdey.com/img/Content/avatar/avatar1.png"
              alt="sunil"
            />{" "}
          </div>
          <div class="received_msg">
            <div class="received_withd_msg">
              <p>{message.content}</p>
              <span class="time_date">{time}</span>
            </div>
          </div>
        </div>
      )}
      {type != "server" && self == "_self" && (
        <div class="outgoing_msg">
          <div class="sent_msg">
            <p>{message.content}</p>
            <span class="time_date">{time}</span>{" "}
          </div>
        </div>
      )}
    </>
  );
};

export default MessageItem;
