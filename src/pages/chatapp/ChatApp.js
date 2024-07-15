import React, { useState, useEffect } from "react";
import "./ChatApp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Message from "./Message"; // Import the Message component
import { useFetch } from "./useFetch"; // Custom hook to fetch data
import GetUserNameByEmail from "./GetUserNameByEmail";
import GetLastMessage from "./GetLastMessage";
import MessageList from "./MessageList";
import { GetListMessageByUniqueRoom } from "./GetListMessageByUniqueRoom";
import GetLastMessageAllRoom from "./GetLastMessageAllRoom";
import useSocket from "./useSocket";

function ChatApp() {
  const [listMessage, setListMessage] = useState();
  const [uniqueRooms, setUniqueRooms] = useState();
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const email = userData.email;
  console.log(email);
  const [selectedRoom, setSelectedRoom] = useState();
  const { isConnected, socketResponse, sendData } = useSocket(
    selectedRoom,
    userData.userId
  );
  const {
    responseData: message,
    error,
    loading,
  } = useFetch("/message/getAllMessageByUser/" + email); 
  console.log(message);
  useEffect(() => {
    setUniqueRooms([
      ...new Set((message || []).map((message) => message.room)),
    ]);
  }, [message]);

  const handleRoom = (uniqueRooms) => {
    setSelectedRoom(uniqueRooms);
  };

  const { responseData: lastRoom } = GetLastMessageAllRoom(email);
  console.log(lastRoom);

  const { responseData: listSelectedMessage } =
    GetListMessageByUniqueRoom(selectedRoom);
  console.log(listSelectedMessage);

  const [messageRequest, setMessageRequest] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessageRequest(value);
    setIsButtonDisabled(value.trim() === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageRequest.trim() !== "") {
      sendData({
        content: messageRequest,
      });
    }
    console.log("Message submitted:", messageRequest);
    // Thực hiện các hành động khác sau khi gửi form
    setMessageRequest(""); // Clear input
    setIsButtonDisabled(true); // Disable button
  };

  return (
    <div>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
        type="text/css"
        rel="stylesheet"
      />
      <div className="container">
        <h3 className="text-center">Messaging</h3>
        <div className="messaging">
          <div className="inbox_msg">
            <div className="inbox_people">
              <div className="headind_srch">
                <div
                  className="recent_heading"
                  style={{ visibility: "hidden" }}
                >
                  <h4>Rooms</h4>
                </div>
                <div className="srch_bar">
                  <div className="stylish-input-group">
                    <input
                      type="text"
                      className="search-bar"
                      placeholder="Search"
                    />
                    <span className="input-group-addon">
                      <button type="button">
                        <i className="fa fa-search" aria-hidden="true"></i>
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              <div className="inbox_chat">
                {loading && <div>Loading rooms...</div>}
                {error && <div>Error loading rooms: {error.message}</div>}
                {uniqueRooms &&
                  uniqueRooms.map((uniqueRooms) => (
                    <div
                      className={`chat_list ${
                        message.name === message ? "active_chat" : ""
                      }`}
                      key={message.id}
                      onClick={() => handleRoom(uniqueRooms)}
                    >
                      <div className="chat_people">
                        <div className="chat_img">
                          <img
                            src="https://bootdey.com/img/Content/avatar/avatar1.png"
                            alt="room"
                          />
                        </div>
                        <div className="chat_ib">
                          <h5>
                            <GetUserNameByEmail
                              email={uniqueRooms.replace(email, "")}
                            ></GetUserNameByEmail>
                          </h5>
                          <h7>
                            <GetLastMessage
                              uniqueRooms={uniqueRooms}
                            ></GetLastMessage>
                          </h7>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mesgs">
              <div className="msg_history">
                {listSelectedMessage && (
                  <MessageList
                    userEmail={email}
                    listSelectedMessage={listSelectedMessage}
                  />
                )}
              </div>
              <div class="type_msg">
                <form class="input_msg_write" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    class="write_msg"
                    placeholder="Type a message"
                    value={messageRequest}
                    onChange={handleInputChange}
                  />
                  <button
                    class="msg_send_btn"
                    type="submit"
                    disabled={isButtonDisabled}
                  >
                    <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
