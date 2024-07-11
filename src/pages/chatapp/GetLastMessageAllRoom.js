import axios from "axios";
import React, { useEffect, useState } from "react";

export const GetLastMessageAllRoom = (email) => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(email);
  useEffect(() => {
    (async function () {
      try {
        console.log("send fetch list message request");
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8080/message/getLastMessageAllRoom/" + email
        );
        setResponseData(response.data.room);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [email]);
  console.log(responseData);
  return { responseData };
};

export default GetLastMessageAllRoom;
