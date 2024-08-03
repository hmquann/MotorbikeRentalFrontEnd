import React, { useEffect, useState } from "react";
import Filter from "../filter/Filter";
import MotorbikeList from "./MotorbikeList";
import SearchMotorbike from "../filter/SearchMotorbike";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Container, Typography, Box, Card, CardMedia, CardContent } from '@mui/material';

// Import Swiper styles
import "swiper/css";
import { Navigation } from "@mui/icons-material";
import { Pagination } from "react-bootstrap";
import { darkScrollbar, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiClient from "../../axiosConfig";
import Benefit from "./Benefit";
import Construction from "./Construction"
import MotorRentalAd from "./MotorRentalAd.js";
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
      <div className="relative flex justify-center">
        <img
          src="/image/homepage.jpg"
          alt="Hero Image"
          className="w-full max-w-screen-xl h-auto object-cover rounded-2xl"
          crossorigin="anonymous"
        />
        <div className="absolute mt-20 inset-0 flex flex-col justify-center items-center text-center text-white rounded-2xl font-normal">
          <h1 className="text-xl md:text-6xl  font-black text-center max-w-xl">
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
      <div className="mt-8 px-4">
      <Box mt={8} px={4}>
      <div className="text-center font-manrope text-2xl">
        MIOTO Blog
      </div>
      <Grid container spacing={4} justifyContent="center">
        {blogs.map((blog) => (
          <Grid item key={blog.id} xs={12} sm={6} md={4}>
            <Card>
              {extractFirstImage(blog.content) && (
                <CardMedia
                  component="img"
                  height="200"
                  image={extractFirstImage(blog.content)}
                  alt={blog.title}
                  onClick={() => goToBlogDetail(blog.id)}
                  style={{ cursor: 'pointer' }}
                />
              )}
              <CardContent>
                <Typography variant="h6" component="h2">
                  {blog.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
      </div>
    </section>
  );
};

export default Homepage;
