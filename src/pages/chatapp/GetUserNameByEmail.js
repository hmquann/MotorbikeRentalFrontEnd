import axios from 'axios';
import React, { useEffect, useState } from 'react';

export const GetUserNameByEmail = (email) => {
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    console.log(email);
    useEffect(() => {
      (async function () {
        try {
          console.log("send fetch userName request");
          setLoading(true);
          const response = await axios.get("http://localhost:8080/message/getUserNameByEmail/"+email.email);
          setResponseData(response.data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    }, [email]);
   
    return  responseData;
        
};

export default GetUserNameByEmail;