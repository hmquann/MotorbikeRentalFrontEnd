import React, { useEffect, useState } from "react";
import SearchMotorbike from "../filter/SearchMotorbike";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // Đúng cách import với phiên bản mới
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiClient from "../../axiosConfig";
import Benefit from "./Benefit";
import Construction from "./Construction";
import MotorRentalAd from "./MotorRentalAd";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation"; // Import navigation styles

const Homepage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await apiClient.get("/api/blogs/getAllBlogs");
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
    <section className="relative min-h-screen font-manrope">
      {/* Phần nội dung giữ nguyên */}
      <div className="relative flex justify-center">
        <img
          src="/image/homepage.jpg"
          alt="Hero Image"
          className="w-full max-w-screen-xl h-auto object-cover rounded-2xl"
          crossorigin="anonymous"
        />
        <div className="absolute mt-20 inset-0 flex flex-col justify-center items-center text-center text-white rounded-2xl font-normal">
          <h1 className="text-xl md:text-6xl font-black text-center max-w-xl">
            MiMotor - Cùng Bạn Đến Mọi Hành Trình
          </h1>
          <div className="w-32 md:w-72 bg-white h-px mx-auto mt-4 md:mt-6"></div>
          <p className="mt-4 md:mt-8 text-lg md:text-xl text-center font-bold">
            Trải nghiệm sự khác biệt từ{" "}
            <span className="text-green-700 font-bold">hơn 200</span> xe máy đời
            mới khắp Việt Nam
          </p>
        </div>
      </div>
      <div className="">
        <div>
          <SearchMotorbike />
        </div>
      </div>
      <Benefit />
      <Construction />
      <MotorRentalAd />
      <Box mt={8} px={12} mb={10}>
        <Typography variant="h4" className="text-center font-manrope mb-4">
          MiMotor Blogs
        </Typography>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{ delay: 7000 }}
          loop
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog.id}>
              <Card
                onClick={() => goToBlogDetail(blog.id)}
                className="cursor-pointer flex flex-col items-center justify-center p-4    hover:shadow-xl transition-shadow duration-300 ease-in-out"
                style={{ height: "100%", width: "100%" }} // Điều chỉnh chiều cao cố định
              >
                {extractFirstImage(blog.content) ? (
                  <CardMedia
                    component="img"
                    image={extractFirstImage(blog.content)}
                    alt={blog.title}
                    className="w-full h-48 object-cover mb-4"
                    style={{ height: "250px" }} // Cố định chiều cao ảnh
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-200 mb-4 rounded-lg">
                    <Typography variant="h6" component="p">
                      No Image
                    </Typography>
                  </div>
                )}
                <CardContent
                  className="w-full flex-grow flex flex-col justify-between"
                  style={{ height: "100px" }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    className="text-justify"
                  >
                    {blog.title}
                  </Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
          {/* Nút điều hướng */}
          <div
            className="swiper-button-prev p-6 rounded-full"
            style={{ color: "rgb(34, 197, 94)" }}
          ></div>
          <div
            className="swiper-button-next p-6 rounded-full"
            style={{ color: "rgb(34, 197, 94)" }}
          ></div>
        </Swiper>
      </Box>
    </section>
  );
};

export default Homepage;
