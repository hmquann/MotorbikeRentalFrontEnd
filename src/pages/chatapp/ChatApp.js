import React, { useState, useEffect } from "react";
import "./ChatApp.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Message from "./Message"; // Import the Message component
import { useFetch } from "./useFetch"; // Custom hook to fetch data
import GetUserNameByEmail from "./GetUserNameByEmail";
import GetLastMessage from "./GetLastMessage";

function ChatApp() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [uniqueRooms,setUniqueRooms] = useState();
  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);
  const email = userData.email;
  console.log(email);
  const [username, setUsername] = useState("John Doe"); // Assuming a static username for now
  const {
    responseData: message,
    error,
    loading,
  } = useFetch("/message/getAllMessageByUser/" + email); // Fetch rooms
  // useEffect(() => {
  //   if (rooms && rooms.length > 0) {
  //     setSelectedRoom(rooms[0].name); // Select the first room by default
  //   }
  // }, [rooms]);
  console.log(message);

  useEffect(()=>{
     setUniqueRooms([...new Set((message || []).map(message => message.room))]);
  },[message])
  console.log(uniqueRooms);


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
                <div className="recent_heading">
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
                      onClick={() => setSelectedRoom(message.room)}
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
                              email={uniqueRooms.replace(email, '')}
                            ></GetUserNameByEmail>
                          </h5>
                          <h7>
                            <GetLastMessage uniqueRooms={uniqueRooms}></GetLastMessage>
                          </h7>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mesgs">
              {selectedRoom ? (
                <Message room={selectedRoom} username={username} />
              ) : (
                <div>Select a room to start chatting</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
