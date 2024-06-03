import React from "react";

const Homepage = () => {
    const buttonClasses = 'px-4 py-2 rounded-lg'
    const textClasses = 'text-zinc-600 dark:text-zinc-300'
    const bgClasses = 'bg-zinc-200'
    const borderClasses = 'border border-zinc-600 dark:border-zinc-300'

  return (
    <section className="relative">
      <img
        src="https://imgcdnblog.carbay.com/wp-content/uploads/2019/12/16150859/Ducati-Streetfighter-v4s2.jpg"
        alt="Hero Image"
        className="w-full h-96 object-cover rounded-lg"
        crossorigin="anonymous"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
        <h1 className="text-4xl font-bold">
          Mioto - Cùng Bạn Đến Mọi Hành Trình
        </h1>
        <p className="mt-4 text-lg">
          Trải nghiệm sự khác biệt từ{" "}
          <span className="text-green-500">hơn 8000</span> xe gia đình đời mới
          khắp Việt Nam
        </p>
        <div className="mt-6 flex space-x-4">
          <button className={`${buttonClasses} bg-green-500 text-white`}>
            Xe tự lái
          </button>
          <button className={`${buttonClasses} ${bgClasses} ${textClasses}`}>
            Xe có tài xế
          </button>
          <button className={`${buttonClasses} ${bgClasses} ${textClasses}`}>
            Thuê xe dài hạn{" "}
            <span className="ml-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
              Mới
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
