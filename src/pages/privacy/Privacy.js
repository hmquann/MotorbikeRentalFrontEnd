import React from "react";
import PrivacyList from "./PrivacyList"; // Import the PolicyList component

// Shared Tailwind CSS classes
const cardContainerClass =
  "dark:bg-teal-50 dark:bg-zinc-800 p-4 rounded-lg shadow-md";
const textClass = "text-zinc-800 dark:text-dark-300";

const Privacy = () => {
  return (
    <div className="bg-zinc-100 dark:bg-neutral-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <img
            src="https://imgcdnblog.carbay.com/wp-content/uploads/2019/12/16150859/Ducati-Streetfighter-v4s2.jpg"
            alt="Hero Image"
            className="w-full h-96 object-cover rounded-b-lg shadow-md"
            crossorigin="anonymous"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold">
              Chính sách & Quy định
            </h1>
          </div>
        </div>

        <div className={`${cardContainerClass} p-6 mt-6 rounded-lg`}>
          <h2 className="text-xl font-bold mb-4 text-center">Thông báo</h2>
          <p className={textClass}>
            Motio xin thông báo về việc bổ sung{" "}
            <strong>Chính sách bảo mật</strong> liên quan đến các vấn đề mới
            trong bảo vệ dữ liệu cá nhân theo Nghị định 15/2023/NĐ-CP của Chính
            phủ Việt Nam.
          </p>
          <p className={`${textClass} mt-4`}>
            Trong quá trình thiết lập mối quan hệ giữa Motio và Người dùng, giữa
            các người dùng và nhà phụ thuộc vào từng loại hình dịch vụ chúng tôi
            cung cấp, Motio có thể thu thập và xử lý dữ liệu cá nhân của Quý
            Khách hàng. Motio cam kết đảm bảo an toàn và bảo vệ dữ liệu cá nhân
            của Quý người dùng theo quy định của pháp luật Việt Nam.
          </p>
          {/* More paragraphs here */}
        </div>

        <div className="flex flex-col md:flex-row mt-6">
          <div className="md:w-1/4">
            <PrivacyList /> {/* Use the PolicyList component here */}
          </div>

          <div className="md:w-3/4 md:ml-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chính sách & Quy định</h2>
              <h3 className="text-xl font-semibold mb-2">
                1. Trách nhiệm của khách thuê xe và chủ xe trong giao dịch cho
                thuê xe tự lái
              </h3>
              <p className={textClass}>
                Mục đích chính của các Chính sách & Quy định này là xây dựng các
                nguyên tắc cho việc thuê xe tự lái tại Việt Nam. Vì vậy, để đảm
                bảo các giao dịch thuê xe trong cộng đồng được diễn ra một cách
                thuận lợi và an toàn, chúng tôi đề nghị các bên tham gia cần
                tuân thủ các quy định dưới đây một cách nghiêm túc và có trách
                nhiệm. Đây là những nguyên tắc cơ bản mà Motio và các khách hàng
                cam kết sẽ thực hiện và tuân thủ một cách nghiêm túc và có trách
                nhiệm.
              </p>
              <ul className="list-disc list-inside mt-4 text-zinc-700 dark:text-zinc-300">
                <li>
                  Tuân thủ các quy định của pháp luật liên quan đến giao thông
                  và sử dụng phương tiện giao thông.
                </li>
                <li>
                  Xe phải có giấy tờ hợp lệ bao gồm giấy đăng ký xe (bản photo
                  công chứng), giấy đăng kiểm, bảo hiểm xe (bản photo công
                  chứng) và các giấy tờ liên quan khác.
                </li>
                <li>
                  Khách hàng phải kiểm tra kỹ lưỡng và ký vào biên bản bàn giao
                  xe.
                </li>
                <li>
                  Khách hàng phải trả xe đúng thời gian và địa điểm đã thỏa
                  thuận.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
