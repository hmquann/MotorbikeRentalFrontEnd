import React from "react";

const Footer = () => {
  return (
    <footer className="p-6 bg-white font-manrope border-t border-t-gray-200 dark:bg-neutral-900">
      <div className="mx-auto max-w-screen-xl">
        <div className="md:flex md:justify-between">
          {/* Logo và Tên MiMotor */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <img
                className="w-32 h-auto mr-4"
                src="/image/logo.png"
                alt="Logo"
              />
              <span className="text-4xl font-bold text-black dark:text-white">
                MiMotor
              </span>
            </div>

            {/* Thông tin liên hệ */}
            <div className="text-left mt-4">
              <p className="text-lg text-black dark:text-white">1900 9217</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng đài hỗ trợ: 7AM - 10PM
              </p>
              <p className="text-lg text-black dark:text-white">
                contact@mimotor.vn
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gửi mail cho MiMotor
              </p>
            </div>
          </div>

          {/* Các mục chính và mục con */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-4 mt-6">
            <div>
              <h2 className="mb-6 text-lg font-semibold text-gray-900 uppercase dark:text-white">
                Chính sách
              </h2>
              <ul className="text-gray-600 dark:text-gray-400 list-none p-0">
                <li className="mb-4">
                  <a
                    href="/privacy/general"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Chính sách và quy định
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="/privacy/regulations"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Nguyên tắc chung
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Điều khoản sử dụng
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-lg font-semibold text-gray-900 uppercase dark:text-white">
                Tìm hiểu thêm
              </h2>
              <ul className="text-gray-600 dark:text-gray-400 list-none p-0">
                <li className="mb-4">
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Về chúng tôi
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Tin tức
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Hướng dẫn sử dụng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Câu hỏi thường gặp
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-lg font-semibold text-gray-900 uppercase dark:text-white">
                Đối tác
              </h2>
              <ul className="text-gray-600 dark:text-gray-400 list-none p-0">
                <li className="mb-4">
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Đối tác 1
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Đối tác 2
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Đối tác 3
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Đối tác 4
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-lg font-semibold text-gray-900 uppercase dark:text-white">
                Liên hệ
              </h2>
              <ul className="text-gray-600 dark:text-gray-400 list-none p-0">
                <li className="mb-4">
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Liên hệ 1
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Liên hệ 2
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Liên hệ 3
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-500 no-underline hover:underline"
                  >
                    Liên hệ 4
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Đường viền dưới */}
        <hr className="my-6 border-gray-500 dark:border-gray-700 w-full" />

        {/* Bản quyền và Mạng xã hội */}
        <div className="flex flex-col items-center font-extrabold">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © 2024{" "}
            <a
              href="https://flowbite.com"
              className="text-blue-600 no-underline hover:underline"
            >
              MotorbikeRentalService
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {/* Biểu tượng mạng xã hội 1 */}
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {/* Biểu tượng mạng xã hội 2 */}
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {/* Biểu tượng mạng xã hội 3 */}
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
