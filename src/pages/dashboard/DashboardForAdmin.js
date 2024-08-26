import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import apiClient from "../../axiosConfig";
import * as echarts from "echarts";
import { fontFamily, margin, padding } from "@mui/system";
const cardClasses =
  "font-manrope bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto border border-zinc-300 dark:border-zinc-700 mt-8";

const DashboardForAdmin = () => {
  const [locationPercentage, setLocationPercentage] = useState({});
  const [topModels, setTopModels] = useState([]);
  const [allBooking, setAllBooking] = useState([]);
  const [allTransaction, setAllTransaction] = useState([]);
  const [mapData, setMapData] = useState([]);
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const userId = userData ? userData.userId : null;

  useEffect(() => {
    async function fetchData() {
      try {
        // Gọi API để lấy danh sách tất cả các booking
        const allBookingByDayResponse = await apiClient.get(
          "dashboard/getAllBooking"
        );
        setAllBooking(allBookingByDayResponse.data);

        // Gọi API để lấy tất cả doanh thu
        const allRevenue = await apiClient.get(
          `/dashboard/getAllTransactionByUserId/${userId}`
        );
        setAllTransaction(allRevenue.data);

        // Gọi API để lấy số lượng địa điểm chính
        const locationPercentageResponse = await apiClient.get(
          "/dashboard/mainLocationCount"
        );
        setLocationPercentage(locationPercentageResponse.data);

        const topModelsResponse = await apiClient.get("/dashboard/topModels");
        const topModelsArray = Object.entries(topModelsResponse.data).map(
          ([modelName, bookingCount]) => ({
            modelName,
            bookingCount,
          })
        );
        setTopModels(topModelsArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [userId]);

  // Tính toán số lượt thuê xe theo ngày và tỉ lệ hoàn thành
  function calculateBookingStatistics(bookings) {
    const daysOfWeek = [
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
      "Chủ nhật",
    ];

    const totalBookingsPerDay = Array(7).fill(0);
    const completedBookingsPerDay = Array(7).fill(0);

    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.bookingTime);
      const dayOfWeek = bookingDate.getDay(); // Trả về giá trị từ 0 (Chủ nhật) đến 6 (Thứ bảy)

      const adjustedDayOfWeek = (dayOfWeek + 6) % 7;

      totalBookingsPerDay[adjustedDayOfWeek]++;
      if (booking.status === "DONE") {
        completedBookingsPerDay[adjustedDayOfWeek]++;
      }
    });

    return {
      daysOfWeek,
      totalBookingsPerDay,
      completedBookingsPerDay,
    };
  }

  // Tính toán doanh thu trong 30 ngày gần nhất
  function calculateRevenueData(transactions) {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 30);

    const revenuePerDay = Array(30).fill(0);
    const dates = Array(30)
      .fill("")
      .map((_, i) => {
        const date = new Date(pastDate);
        date.setDate(date.getDate() + i);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      });

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      if (transactionDate >= pastDate) {
        const dayIndex = Math.floor(
          (transactionDate - pastDate) / (1000 * 60 * 60 * 24)
        );
        if (transaction.type === "DEPOSIT_RECEIVE") {
          revenuePerDay[dayIndex] += transaction.amount;
        } else if (transaction.type === "DEPOSIT") {
          revenuePerDay[dayIndex] -= transaction.amount;
        }
      }
    });

    return {
      dates,
      revenuePerDay,
    };
  }

  // Khai báo trạng thái cho dữ liệu biểu đồ
  const [doubleColumnData, setDoubleColumnData] = useState({
    title: {
      text: "Số lượt thuê xe theo ngày",
      textStyle: { fontFamily: "manrope" },
    },
    tooltip: {
      trigger: "axis",
      textStyle: { fontFamily: "manrope" },
    },
    legend: {
      data: ["Số lượt đặt xe", "Số chuyến hoàn thành"],
      top: "5%",
      right: "10%",
      textStyle: { fontFamily: "manrope" },
    },
    xAxis: {
      data: [
        "Thứ hai",
        "Thứ ba",
        "Thứ tư",
        "Thứ năm",
        "Thứ sáu",
        "Thứ bảy",
        "Chủ nhật",
      ],
      axisLabel: {
        fontFamily: "manrope",
      },
    },
    yAxis: {},
    series: [
      {
        name: "Số lượt đặt xe",
        type: "bar",
        textStyle: { fontFamily: "manrope" },
        data: [], // Sẽ được cập nhật sau
      },
      {
        name: "Số chuyến hoàn thành",
        type: "bar",
        textStyle: { fontFamily: "manrope" },
        data: [], // Sẽ được cập nhật sau
      },
    ],
  });

  useEffect(() => {
    if (allBooking.length > 0) {
      const { totalBookingsPerDay, completedBookingsPerDay } =
        calculateBookingStatistics(allBooking);

      setDoubleColumnData((prevData) => ({
        ...prevData,
        series: [
          {
            ...prevData.series[0],
            data: totalBookingsPerDay,
          },
          {
            ...prevData.series[1],
            data: completedBookingsPerDay,
          },
        ],
      }));
    }
  }, [allBooking]);

  const [lineOption, setLineOption] = useState({
    title: {
      text: "Doanh thu 30 ngày gần nhất",
      textStyle: { fontFamily: "manrope" },
    },
    tooltip: {
      trigger: "axis",
      textStyle: { fontFamily: "manrope" },
    },
    xAxis: {
      type: "category",
      data: [], // Sẽ được cập nhật sau
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [], // Sẽ được cập nhật sau
        type: "line",
      },
    ],
  });

  useEffect(() => {
    if (allTransaction.length > 0) {
      const { dates, revenuePerDay } = calculateRevenueData(allTransaction);

      setLineOption((prevOption) => ({
        ...prevOption,
        xAxis: {
          ...prevOption.xAxis,
          data: dates,
        },
        series: [
          {
            ...prevOption.series[0],
            data: revenuePerDay,
          },
        ],
      }));
    }
  }, [allTransaction]);

  const topModelsPieOption = {
    tooltip: {
      trigger: "item",
      textStyle: { fontFamily: "manrope" },
    },
    title: {
      text: "Top 5 Mẫu Xe Được Thuê Nhiều Nhất Tháng",
      left: "center",
      top: "top",
      textStyle: { fontFamily: "manrope" },
    },
    legend: {
      orient: "horizontal",
      top: "84%",
      left: "center",
      itemGap: 10,
      itemWidth: 20,
      width: "85%",
      margin: "auto",
      textStyle: {
        fontFamily: "manrope",
        overflow: "truncate",
      },
    },
    series: [
      {
        name: "Top 5 Mẫu Xe Được Thuê Nhiều Nhất Tháng",
        type: "pie",
        radius: ["40%", "65%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "manrope",
            overflow: "truncate",
          },
        },
        labelLine: {
          show: false,
        },
        data: topModels.map((model) => ({
          name: model.modelName,
          value: model.bookingCount,
        })),
      },
    ],
  };

  const locationPieOption = {
    tooltip: {
      trigger: "item",
      textStyle: { fontFamily: "manrope" },
    },
    title: {
      text: "Số lượt đặt xe theo địa điểm",
      left: "center", // Center the title horizontally
      top: "top", // Keep the title at the top
      textStyle: { fontFamily: "manrope" },
    },
    legend: {
      orient: "horizontal", // Ensure the legend is horizontal
      top: "84%", // Push the legend further down
      left: "center", // Center the legend horizontally
      itemGap: 10, // Increase spacing between legend items
      itemWidth: 20, // Adjust the icon width of each legend item
      width: "85%", // Make the legend width wider to fit all items in one row
      margin: "auto",
      textStyle: {
        fontFamily: "manrope",
        overflow: "truncate", // Truncate long legend text
      },
    },
    series: [
      {
        name: "Số lượt đặt xe theo địa điểm",
        type: "pie",
        radius: ["40%", "65%"], // Circular pie chart style
        center: ["50%", "45%"], // Move the chart up to make room for the legend
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false, // Hide labels within the chart
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "manrope",
            overflow: "truncate",
          },
        },
        labelLine: {
          show: false, // Hide label lines
        },
        data: Object.entries(locationPercentage).map(([key, value]) => ({
          name: key,
          value: value,
        })),
      },
    ],
  };
  return (
    <div>
      <div className={cardClasses}>
        <ReactECharts option={lineOption} />
      </div>
      <div className={`max-w-4xl mx-auto mt-8 flex gap-4`}>
        <div className={`${cardClasses} flex-1 m-2`}>
          <ReactECharts option={topModelsPieOption} />
        </div>
        <div className={`${cardClasses} flex-1 m-2`}>
          <ReactECharts option={locationPieOption} />
        </div>
      </div>
      <div className={cardClasses}>
        <ReactECharts option={doubleColumnData} />
      </div>
    </div>
  );
};

export default DashboardForAdmin;
