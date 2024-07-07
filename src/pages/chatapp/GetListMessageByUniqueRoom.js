import axios from "axios";
import React, { useEffect, useState } from "react";

export const GetListMessageByUniqueRoom = (selectedRoom) => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async function () {
      try {
        console.log("send fetch list message request");
        setLoading(true);
        const response = await axios.get(
          "https://rentalmotorbikebe.azurewebsites.net/message/getListMessageByUniqueRoom/" +
            selectedRoom
        );
        setResponseData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedRoom]);
  console.log(responseData);
  return { responseData };
};

export default GetListMessageByUniqueRoom;
