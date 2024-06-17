// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import io from "socket.io-client";

// const socket = io("http://localhost:9092"); // URL của SocketIO server

// const ChatMessage = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [userName, setUserName] = useState("");

//   useEffect(() => {
//     fetchMessages();

//     socket.on("message", (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const fetchMessages = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/chat/all");
//       setMessages(response.data);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (newMessage.trim() === "" || userName.trim() === "") {
//       return;
//     }

//     try {
//       const message = {
//         userName: userName,
//         message: newMessage,
//         user: {
//           id: 1, // Thay bằng ID thực tế của user
//         },
//       };
//       const response = await axios.post(
//         "http://localhost:8080/chat/send",
//         message
//       );
//       socket.emit("message", response.data); // Gửi tin nhắn qua WebSocket
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Chat</h2>
//       <div>
//         <input
//           type="text"
//           placeholder="Your name"
//           value={userName}
//           onChange={(e) => setUserName(e.target.value)}
//         />
//       </div>
//       <div>
//         <input
//           type="text"
//           placeholder="Type a message"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//       <div>
//         {messages.map((message) => (
//           <div key={message.id}>
//             <strong>{message.userName}:</strong> {message.message}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;
