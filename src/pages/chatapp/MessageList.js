import React, { useEffect, useRef } from "react";
import "./Message.css";
import { MessageItem } from "./MessageItem";

export const MessageList = ({ userEmail, listSelectedMessage }) => {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [listSelectedMessage]);

  return (
    <>
      {listSelectedMessage.map((x, idx) => (
        <MessageItem key={idx} message={x} userEmail={userEmail} />
      ))}
      <div ref={messagesEndRef} />
    </>
  );
};

export default MessageList;
