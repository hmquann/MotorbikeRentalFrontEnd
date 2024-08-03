import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import axios from "axios";
import {
  MagnifyingGlassIcon,
  CameraIcon,
  PhotoIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const userEmail = userData ? userData.email : null;

  const chatRef = useRef(null);

  const getRoomId = (user1, user2) => {
    if (!user1 || !user2) return null;
    return [user1, user2].sort().join("_");
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        if (selectedUser && userEmail) {
          const roomId = getRoomId(userEmail, selectedUser.email);
          if (roomId) {
            const q = query(
              collection(db, `rooms/${roomId}/messages`),
              orderBy("createdAt")
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
              const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setMessages(msgs);
              setLoading(false);
            });

            return () => unsubscribe();
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser, userEmail]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (userEmail) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/booking/getListUserFromBookingToChat/${userData.userId}`
          );
          const uniqueUsers = response.data.map((user) => ({
            email: user.email,
            userName: user.firstName + " " + user.lastName,
          }));
          setUsers(uniqueUsers);
        } catch (error) {
          console.error("Error fetching users: ", error);
        }
      }
    };

    fetchUsers();
  }, [userEmail, userData.id]);

  // Cuộn đến phần tử cuối cùng của danh sách tin nhắn
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleNewUser = () => {
    // if (
    //   newUserEmail &&
    //   newUserEmail !== userEmail &&
    //   !users.some((user) => user.email === newUserEmail)
    // ) {
    //   setUsers([{ email: newUserEmail, userName: "Unknown" }, ...users]);
    //   setSelectedUser({ email: newUserEmail, userName: "Unknown" });
    //   setNewUserEmail("");
    // }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "" && selectedUser && userEmail) {
      const roomId = getRoomId(userEmail, selectedUser.email);
      if (roomId) {
        try {
          setNewMessage("");
          await addDoc(collection(db, `rooms/${roomId}/messages`), {
            createdAt: new Date(),
            content: newMessage.trim(),
            userEmail: userEmail,
            seen: false,
          });
        } catch (error) {
          console.error("Error sending message: ", error);
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div ref={chatRef} className="chat-container">
      <div className="flex h-screen p-0 max-w-5xl mx-auto bg-white rounded-xl font-manrope flex-col lg:flex-row">
        <div className="w-full lg:w-1/4 border-r border-gray-300 p-4">
          <div className="flex items-center mb-4">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Search..."
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <button
              className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
              onClick={handleNewUser}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
          <ul>
            {users.map((user) => (
              <li
                key={user.email}
                className={`flex items-center p-2 rounded-lg cursor-pointer ${
                  user.email === selectedUser?.email ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <img
                  src="https://n1-cstg.mioto.vn/m/avatars/avatar-0.png"
                  className="w-10 h-10 rounded-full mr-3"
                  alt="Avatar"
                />
                <div className="ml-4">
                  <p className="font-medium">{user.userName}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {selectedUser ? (
          <div className="flex flex-col flex-1 p-2 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                <div className="spinner-border text-primary"></div>
              </div>
            )}
            <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
              <div className="flex items-center">
                <img
                  src="https://n1-cstg.mioto.vn/m/avatars/avatar-0.png"
                  className="w-10 h-10 rounded-full mr-3"
                  alt="Avatar"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold">
                    {selectedUser.userName}
                  </h2>
                </div>
              </div>
            </div>
            {/* Đặt chiều cao tối đa và cho phép cuộn nội dung tin nhắn */}
            <div className="flex-1 overflow-auto mb-4 h-full">
              <ul>
                {messages.map((msg) => (
                  <li
                    key={msg.id}
                    className={`flex flex-col mb-2 ${
                      msg.userEmail === userEmail ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-lg p-2 mr-1 rounded-lg break-words ${
                        msg.userEmail === userEmail
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 mr-1">
                      {new Date(msg.createdAt.toDate()).toLocaleString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </li>
                ))}
                {/* Ref để cuộn đến cuối tin nhắn */}
                <div ref={messagesEndRef}></div>
              </ul>
            </div>
            <form onSubmit={handleSendMessage} className="flex">
              <textarea
                className="flex-1 border border-gray-300 rounded-lg p-2 resize-none"
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="submit"
                className={`ml-2 p-2 text-white rounded-lg ${
                  newMessage.trim()
                    ? "bg-green-500 opacity-100"
                    : "bg-green-500 opacity-50"
                }`}
                disabled={!newMessage.trim()}
              >
                <FontAwesomeIcon icon={faPaperPlane} size="lg" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Chọn người dùng để nhắn tin
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
