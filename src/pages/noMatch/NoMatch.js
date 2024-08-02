import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoMatch = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-zinc-100 dark:bg-gray-900 ">
      <div className="container flex items-center min-h-screen mx-auto font-manrope">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="text-sm font-medium text-blue-500 rounded-full bg-blue-50 dark:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">Không tìm thấy trang</h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Trang bạn tìm kiếm có vẻ không tồn tại. Xin vui lòng thử lại sau</p>
          <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="hover:bg-zinc-300 flex items-center justify-center w-1/2 px-6 py-2 text-sm text-gray-700 duration-200 bg-zinc-200 border rounded-lg gap-x-2 sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>
              <span>Quay lại</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600"
            >
              Trở về trang chủ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoMatch;
