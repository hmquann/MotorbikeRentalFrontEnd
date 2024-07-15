import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "./apiConstants";

export const useSocket = (room, userId) => {
  const [socket, setSocket] = useState();
  const [socketResponse, setSocketResponse] = useState({
    room: "",
    content: "",
    userId: "",
    messageType: "",
    createdDateTime: "",
  });
  const [isConnected, setConnected] = useState(false);
  const sendData = useCallback(
    (payload) => {
      socket.emit("send_message", {
        room: room,
        content: payload.content,
        userId: userId,
        messageType: "CLIENT",
      });
    },
    [socket, room]
  );
  useEffect(() => {
    const s = io(SOCKET_BASE_URL, {
      reconnection: false,
      query: `room=${room}&username=${userId}`, //"room=" + room+",username="+username,
    });
    setSocket(s);
    s.on("connect", () => setConnected(true));
    s.on("read_message", (res) => {
      console.log(res);
      setSocketResponse({
        room: res.room,
        content: res.content,
        userId: res.userId,
        messageType: res.messageType,
        createdDateTime: res.createdDateTime,
      });
    });
    return () => {
      s.disconnect();
    };
  }, [room]);

  return { socketResponse, isConnected, sendData };
};

export default useSocket;
