import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import UserCars from "./UserCars";
import apiClient from "../../axiosConfig";

const UserCard = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get(
          `/api/user/${userId}`
        );
        setUser(response.data);
      } catch (err) {
        setError(err.message);
        navigate('/noMatch')
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }
  //   if (motorbikes.length === 0) {
//     return <Box display="flex" justifyContent="center" mt={4}>No cars found</Box>;
//   }
const isEmpty = Object.keys(user).length === 0;
  return (
    <div className="bg-zinc-100 font-manrope p-6  flex justify-center   ">
      <div className="lg:max-w-3xl w-full  ">
        <div className="bg-white p-6 mb-10 rounded-lg">
          <div>
          <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center">
                  <h5 className="font-bold text-2xl">Thông tin tài khoản</h5>
                </div>
                <div className="flex items-baseline py-3 px-4 gap-1 border border-zinc-500 rounded-lg ">
                  <div class="text-green-600">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_3535_118649)">
                        <path
                          d="M15.0938 1.82812C15.0938 1.59553 15.283 1.40625 15.5156 1.40625H17.9531C18.1858 1.40625 18.375 1.59553 18.375 1.82812V4.34133H19.7812V1.82812C19.7812 0.820078 18.9612 0 17.9531 0H15.5156C14.5076 0 13.6875 0.820078 13.6875 1.82812V4.34133H15.0938V1.82812Z"
                          fill="#5FCF86"
                        ></path>
                        <path
                          d="M8.54709 22.5937C8.23987 22.1164 8.0625 21.5512 8.0625 20.9531V10.4116H1.64062C0.735984 10.4116 0 11.1476 0 12.0522V20.9531C0 21.7782 0.612234 22.4626 1.40625 22.5767V23.2967C1.40625 23.685 1.72106 23.9998 2.10938 23.9998C2.49769 23.9998 2.8125 23.685 2.8125 23.2967V22.5937H8.54709V22.5937ZM2.8125 12.9897C2.8125 12.6014 3.12731 12.2866 3.51562 12.2866C3.90394 12.2866 4.21875 12.6014 4.21875 12.9897V20.0156C4.21875 20.4039 3.90394 20.7187 3.51562 20.7187C3.12731 20.7187 2.8125 20.4039 2.8125 20.0156V12.9897Z"
                          fill="#5FCF86"
                        ></path>
                        <path
                          d="M6.5625 7.89844C6.5625 7.66584 6.75178 7.47656 6.98438 7.47656H8.0625V7.3882C8.0625 6.91641 8.17031 6.46936 8.36259 6.07031H6.98438C5.97633 6.07031 5.15625 6.89039 5.15625 7.89844V9.00539H6.5625V7.89844Z"
                          fill="#5FCF86"
                        ></path>
                        <path
                          d="M22.3594 5.74756H11.1094C10.2047 5.74756 9.46875 6.48354 9.46875 7.38818V20.9531C9.46875 21.7782 10.081 22.4626 10.875 22.5767V23.2967C10.875 23.685 11.1898 23.9998 11.5781 23.9998C11.9664 23.9998 12.2812 23.685 12.2812 23.2967V22.5937H21.1875V23.2967C21.1875 23.685 21.5023 23.9998 21.8906 23.9998C22.2789 23.9998 22.5938 23.685 22.5938 23.2967V22.5767C23.3877 22.4626 24 21.7782 24 20.9531V7.38818C24 6.4835 23.264 5.74756 22.3594 5.74756ZM13.6875 20.0156C13.6875 20.4039 13.3727 20.7187 12.9844 20.7187C12.5961 20.7187 12.2812 20.4039 12.2812 20.0156V8.32568C12.2812 7.93737 12.5961 7.62256 12.9844 7.62256C13.3727 7.62256 13.6875 7.93737 13.6875 8.32568V20.0156ZM20.4844 20.7187C20.0961 20.7187 19.7812 20.4039 19.7812 20.0156V8.32568C19.7812 7.93737 20.0961 7.62256 20.4844 7.62256C20.8727 7.62256 21.1875 7.93737 21.1875 8.32568V20.0156C21.1875 20.4039 20.8727 20.7187 20.4844 20.7187Z"
                          fill="#5FCF86"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_3535_118649">
                          <rect width="24" height="24" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span className="font-extrabold text-3xl text-green-400">{user.totalTripCount}</span>
                  <span className="font-medium text-sm">Chuyen</span>
                </div>
     
              </div>
              <div className="flex gap-9 justify-center">
                  <div className="flex flex-col items-center gap-4">
                      <div>
                      <img src="https://n1-cstg.mioto.vn/m/avatars/avatar-0.png" className="w-36 h-36 leading-normal" />
                      </div>
                      <h6 className="font-semibold text-xl">{user.firstName +' '+ user.lastName}</h6>
                  </div>
              </div>
          </div>
        </div>
        <UserCars userId={userId} />
      </div>
    </div>
  );
};

export default UserCard;
