import axios from "axios";
import React, { useEffect, useState } from "react";

export const GetLastMessage = (uniqueRooms) => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(uniqueRooms);
  useEffect(() => {
    (async function () {
      try {
        console.log("send fetch last message request");
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8080/message/getLastMessageByUniqueRoom/" +
            uniqueRooms.uniqueRooms
        );
        setResponseData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [uniqueRooms]);
  console.log(responseData);
  return responseData.content;
};

export default GetLastMessage;
