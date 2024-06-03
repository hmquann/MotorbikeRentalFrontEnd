import React, { useState, useEffect } from "react";
import UserInformation from "./UserInformation";

const UserData = () => {
  const [users, setUsers] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/allUser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);
 

  return (
    <div>
      <UserInformation users={users} />
    </div>
  );
};

export default UserData;
