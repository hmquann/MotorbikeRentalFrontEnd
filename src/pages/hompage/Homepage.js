import React, { useEffect, useState } from "react";
import Filter from "../filter/Filter";
import MotorbikeList from "./MotorbikeList";
import SearchMotorbike from "../filter/SearchMotorbike";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { Navigation } from "@mui/icons-material";
import { Pagination } from "react-bootstrap";
import { darkScrollbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Homepage = () => {
  const buttonClasses =
    "px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105";
  const textClasses = "text-zinc-600 dark:text-zinc-300";
  const bgClasses = "bg-zinc-200";
  const borderClasses = "border border-zinc-600 dark:border-zinc-300";
  const cardClasses =
    "bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out";
  const badgeClasses = "text-xs px-2 py-1 rounded-full font-semibold";
  const buttonClasses1 =
    "bg-white text-zinc-700 py-1 px-2 rounded-full shadow hover:bg-zinc-100 dark:bg-zinc-600 dark:hover:bg-zinc-500";
  const buttonClassesPrimary =
    "bg-green-500 text-white px-4 py-2 rounded-full shadow-lg transform transition duration-300 hover:scale-105";
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/blogs/getAllBlogs"
      );
      const sortedBlogs = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);
  const extractFirstImage = (content) => {
    const imgTagMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgTagMatch ? imgTagMatch[1] : null;
  };
  const goToBlogDetail = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <section className="relative bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="relative">
        <img
          src="https://imgcdnblog.carbay.com/wp-content/uploads/2019/12/16150859/Ducati-Streetfighter-v4s2.jpg"
          alt="Hero Image"
          className="w-full h-96 object-cover rounded-b-lg shadow-md"
          crossorigin="anonymous"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4 bg-black bg-opacity-50 rounded-b-lg">
          <h1 className="text-4xl font-bold mb-4">
            MiMotor - Cùng Bạn Đến Mọi Hành Trình
          </h1>
          <p className="mt-4 text-lg">
            Trải nghiệm sự khác biệt từ{" "}
            <span className="text-green-500 font-bold">hơn 8000</span> xe máy
            đời mới khắp Việt Nam
          </p>
          <div className="mt-6 flex space-x-4">
            <button className={buttonClassesPrimary}>Xe tự lái</button>
            <button className={`${buttonClasses} ${bgClasses} ${textClasses}`}>
              Xe có tài xế
            </button>
            <button className={`${buttonClasses} ${bgClasses} ${textClasses}`}>
              Thuê xe dài hạn{" "}
              <span className="ml-2 bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                Mới
              </span>
            </button>
          </div>

          <div className="flex justify-center mt-8">
            <div style={{ width: "100%" }}>
              <SearchMotorbike />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 px-4">
        <Swiper
          spaceBetween={10}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          className="mt-8 px-4"
        >
          {blogs.map((blog, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <div className="p-4 w-full max-w-xs">
                {extractFirstImage(blog.content) && (
                  <img
                    src={extractFirstImage(blog.content)}
                    alt="Blog"
                    className="w-full h-40 object-cover rounded-t-lg cursor-pointer"
                    onClick={() => goToBlogDetail(blog.id)}
                  />
                )}
                <div className="p-2">
                  <h2 className="text-lg font-semibold mt-2">{blog.title}</h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Homepage;
