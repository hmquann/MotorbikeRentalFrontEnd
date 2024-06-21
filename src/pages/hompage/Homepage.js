import React from "react";
import Filter from "./Filter";
import MotorbikeList from "./MotorbikeList";
import SearchMotorbike from "./SearchMotorbike";
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
    <span className="text-green-500 font-bold">hơn 8000</span> xe máy đời mới khắp Việt Nam
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

  {/* Đây là nơi chèn component SearchMotorbike */}
  <div className="flex justify-center mt-8">
    <div style={{ width: '100%' }}>
      <SearchMotorbike />
    </div>
  </div>
</div>

    </div>
    <div className="flex justify-center">
      <div style={{ width: '95%' }}>
      <MotorbikeList/>
      </div>
    </div>
       
    </section>
  );
};

export default Homepage;



 
    
 

