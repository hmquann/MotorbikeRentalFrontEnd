import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swiper from "swiper";
import { SwiperSlide } from "swiper/react";

const Blog = () => {
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
    <div>
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
    </div>
  );
};

export default Blog;
