import React from "react";

const sharedClasses = {
  rounded: "rounded",
  flex: "flex",
  itemsCenter: "items-center",
  textZinc500: "text-zinc-500",
  bgBlue100: "bg-blue-100",
  textBlue800: "text-blue-800",
  px2: "px-2",
  py1: "py-1",
  bgYellow100: "bg-yellow-100",
  textYellow800: "text-yellow-800",
  bgGreen100: "bg-green-100",
  textGreen800: "text-green-800",
  textSm: "text-sm",
  textLg: "text-lg",
  spaceX2: "space-x-2",
  mt2: "mt-2",
  mt4: "mt-4",
  mt1: "mt-1",
  p2: "p-2",
  roundedFull: "rounded-full",
  bgZinc200: "bg-zinc-200",
  p4: "p-4",
  maxW7xl: "max-w-7xl",
  mxAuto: "mx-auto",
  wFull: "w-full",
  w2_3: "w-2/3",
  w1_3: "w-1/3",
  gridCols2: "grid-cols-2",
  gridCols4: "grid-cols-4",
  grid: "grid",
  gap4: "gap-4",
  block: "block",
  borderZinc300: "border-zinc-300",
  shadowSm: "shadow-sm",
  select: "select",
  textXl: "text-xl",
  fontBold: "font-bold",
  fontSemibold: "font-semibold",
  underline: "underline",
  textZinc700: "text-zinc-700",
  textGreen600: "text-green-600",
  textWhite: "text-white",
  py2: "py-2",
  bgGreen500: "bg-green-500",
  mb4: "mb-4",
  textGreen700: "text-green-700",
  textZinc300: "text-zinc-300",
};

const FeatureItem = ({ iconSrc, altText, title, description }) => (
  <div className={sharedClasses.flexItemsCenter}>
    <img aria-hidden="true" alt={altText} src={iconSrc} className={sharedClasses.mr2} />
    <div>
      <p className={sharedClasses.textZinc500}>{title}</p>
      <p className={sharedClasses.textLgFontBold}>{description}</p>
    </div>
  </div>
);


const DetailBooking = () => {
  return (
    <div
      className={`${sharedClasses.p4} ${sharedClasses.maxW7xl} ${sharedClasses.mxAuto}`}
    >
      {/* Header Section */}
      <div
        className={`flex flex-col md:flex-row justify-between items-start md:items-center ${sharedClasses.mb4}`}
      >
        <div>
          <h1 className={`text-2xl ${sharedClasses.fontBold}`}>
            SUZUKI CIAZ 2021
          </h1>
          <div
            className={`flex ${sharedClasses.itemsCenter} ${sharedClasses.textSm} ${sharedClasses.textZinc500} ${sharedClasses.mb2}`}
          >
            <span className="mr-2">⭐ 5.0</span>
            <span className="mr-2">📶 6 chuyến</span>
            <span>📍 Quận Bình Thạnh, TP. Hồ Chí Minh</span>
          </div>
          <div className={`flex ${sharedClasses.spaceX2} ${sharedClasses.mt2}`}>
            <span
              className={`${sharedClasses.bgBlue100} ${sharedClasses.textBlue800} ${sharedClasses.px2} ${sharedClasses.py1} ${sharedClasses.rounded}`}
            >
              Giao xe tận nơi
            </span>
            <span
              className={`${sharedClasses.bgYellow100} ${sharedClasses.textYellow800} ${sharedClasses.px2} ${sharedClasses.py1} ${sharedClasses.rounded}`}
            >
              Đặt xe nhanh
            </span>
            <span
              className={`${sharedClasses.bgGreen100} ${sharedClasses.textGreen800} ${sharedClasses.px2} ${sharedClasses.py1} ${sharedClasses.rounded}`}
            >
              Miễn thế chấp
            </span>
          </div>
        </div>
        <div
          className={`flex ${sharedClasses.spaceX2} ${sharedClasses.mt4} md:${sharedClasses.mt0}`}
        >
          <button
            className={`${sharedClasses.p2} ${sharedClasses.bgZinc200} ${sharedClasses.roundedFull}`}
          >
            🔗
          </button>
          <button
            className={`${sharedClasses.p2} ${sharedClasses.bgZinc200} ${sharedClasses.roundedFull}`}
          >
            ❤️
          </button>
        </div>
      </div>

      

      {/* Features Section */}
      <div
        className={`flex flex-col md:flex-row justify-between ${sharedClasses.mb4}`}
      >
        <div className={`${sharedClasses.wFull} ${sharedClasses.w2_3}`}>
          <h2
            className={`text-xl ${sharedClasses.fontSemibold} ${sharedClasses.mb2}`}
          >
            Đặc điểm
          </h2>
          <div
            className={`${sharedClasses.grid} ${sharedClasses.gridCols2} ${sharedClasses.gap4} ${sharedClasses.mb4}`}
          >
            <FeatureItem
        iconSrc="https://placehold.co/24x24"
        altText="fuel"
        title="Nhiên liệu"
        description="Điện"
      />
      <FeatureItem
        iconSrc="https://placehold.co/24x24"
        altText="consumption"
        title="NL tiêu hao"
        description="285 km/lần sạc"
      />
          </div>

          <h2
            className={`text-xl ${sharedClasses.fontSemibold} ${sharedClasses.mb2}`}
          >
            Mô tả
          </h2>
          <p className={`${sharedClasses.textZinc700} ${sharedClasses.mb4}`}>
            Cho thuê xe Ciaz 2021 số tự động
            <br />5 chỗ ngồi rộng rãi sạch sẽ
            <br />
            Trang bị camera hành trình trước sau
            <br />
            Màn hình giải trí android kết nối 4g
            <br />
            Có bảo hiểm đầy đủ
            <br />
            Chủ xe thân thiện hỗ trợ nhiệt tình
          </p>

          <h2
            className={`text-xl ${sharedClasses.fontSemibold} ${sharedClasses.mb2}`}
          >
            Các tiện nghi khác
          </h2>
          <div
            className={`${sharedClasses.grid} ${sharedClasses.gridCols4} ${sharedClasses.gap4}`}
          >
            {/* Other amenities go here */}
          </div>
        </div>

        {/* Rental Section */}
        <div
          className={`${sharedClasses.wFull} ${sharedClasses.w1_3} bg-zinc-100 ${sharedClasses.p4} ${sharedClasses.rounded}`}
        >
          <h2
            className={`text-xl ${sharedClasses.fontSemibold} ${sharedClasses.mb4}`}
          >
            745K /ngày
          </h2>
          <div className={sharedClasses.mb4}>
            <label
              className={`block text-sm font-medium ${sharedClasses.textZinc700}`}
            >
              Nhận xe
            </label>
            <input
              type="datetime-local"
              className={`mt-1 ${sharedClasses.block} w-full ${sharedClasses.borderZinc300} ${sharedClasses.rounded} ${sharedClasses.shadowSm}`}
            />
          </div>
          {/* Other rental inputs go here */}
          <button
            className={`${sharedClasses.mt4} ${sharedClasses.wFull} ${sharedClasses.bgGreen500} ${sharedClasses.textWhite} ${sharedClasses.py2} ${sharedClasses.rounded}`}
          >
            CHỌN THUÊ
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailBooking;
