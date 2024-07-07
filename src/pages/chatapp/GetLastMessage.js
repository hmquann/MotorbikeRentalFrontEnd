import axios from "axios";
import React, { useEffect, useState } from "react";

export const GetLastMessage = (uniqueRooms) => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(uniqueRooms.uniqueRooms);
  useEffect(() => {
    (async function () {
      try {
        console.log("send fetch last message request");
        setLoading(true);
        const response = await axios.get(
          "https://rentalmotorbikebe.azurewebsites.net/message/getLastMessageByUniqueRoom/" +
            uniqueRooms.uniqueRooms
        );
        setResponseData(response.data.content);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [uniqueRooms]);
  return responseData;
};

export default GetLastMessage;
