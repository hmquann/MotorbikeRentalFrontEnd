import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, ResponsiveContainer, Line, PieChart, Pie, Cell } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';
import "./Dashboard.css";
import apiClient from '../../axiosConfig';

const Dashboard = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [locationPercentage, setLocationPercentage] = useState({});
  const [twoRecentMonthBookingCount, setTwoMonthBookingCount] = useState([]);
  
  useEffect(() => {
    apiClient.get('/dashboard/sixMonthRevenue')
      .then(response => setMonthlyRevenue(response.data))
      .catch(error => console.error('Error fetching revenue:', error));

    apiClient.get('/dashboard/mainLocationCount')
      .then(response => setLocationPercentage(response.data))
      .catch(error => console.error('Error fetching location data:', error));

    apiClient.get('/dashboard/twoRecentMonthBookingCount')
      .then(response => setTwoMonthBookingCount(response.data))
      .catch(error => console.error('Error fetching booking count data:', error));
  }, []);

  const topModels = [
    { modelName: "SH350i", bookingCount: 50 }, 
    { modelName: "Wave", bookingCount: 30 }, 
    { modelName: "Vision", bookingCount: 60 }, 
    { modelName: "AirBlade", bookingCount: 20 }, 
    { modelName: "Vespa", bookingCount: 80 }
  ];
  const colors = ['#AEC6CF', '#FFB347', '#77DD77', '#F49AC2', '#CFCFC4'];

  const dataModel = topModels.map((model, index) => ({
    name: model.modelName,
    bookings: model.bookingCount,
    fill: colors[index % colors.length],
  }));

  const dataRevenue = monthlyRevenue.map((item) => ({
    month: `${item.month}/${item.year}`,
    totalRevenue: item.totalRevenue
  }));

  const pieData = Object.entries(locationPercentage).map(([key, value], index) => ({
    name: key,
    value: value,
    fill: colors[index % colors.length]
  }));

  const getRevenueChange = () => {
    if (monthlyRevenue.length < 2) return null;
    const lastMonth = monthlyRevenue[monthlyRevenue.length - 1].totalRevenue;
    const previousMonth = monthlyRevenue[monthlyRevenue.length - 2].totalRevenue;
    const change = lastMonth - previousMonth;
    const percentageChange = ((change / previousMonth) * 100).toFixed(2);

    return {
      change,
      percentageChange,
      isIncrease: change > 0
    };
  };
  const getTwoMonthBookingChange = () => {
    if (twoRecentMonthBookingCount.length < 2) return null;
    const lastMonth = twoRecentMonthBookingCount[twoRecentMonthBookingCount.length - 2].bookingCount;
    const previousMonth = twoRecentMonthBookingCount[twoRecentMonthBookingCount.length - 1].bookingCount;
    const change = lastMonth - previousMonth;
    const percentageChange = ((change / previousMonth) * 100).toFixed(2);

    return {
      change,
      percentageChange,
      isIncrease: change > 0
    };
  };

  const revenueChange = getRevenueChange();
  const bookingChange=getTwoMonthBookingChange();
  return (
    <div className="dashboard-container">
      <div className="top-container">
        <div className="rectangle">
          <h6>Doanh thu tháng này</h6>
          {monthlyRevenue.length > 0 && (
            <>
              {revenueChange && (
                <div className="revenue-change">
                  <FontAwesomeIcon 
                    icon={revenueChange.isIncrease ? faArrowTrendUp : faArrowTrendDown} 
                    style={{ color: revenueChange.isIncrease ? "#63E6BE" : "#d70f37" }} 
                  />
                  <span>{Math.abs(revenueChange.percentageChange)}%</span>
                </div>
              )}
              <h7><b>{monthlyRevenue[monthlyRevenue.length - 1].totalRevenue}</b> VND</h7>
            </>
          )}
        </div>
        <div className="rectangle">
          <h6>Số lượt booking tháng này</h6>
          {twoRecentMonthBookingCount.length > 0 && (
            <>
              {bookingChange && (
                <div className="revenue-change">
                  <FontAwesomeIcon 
                    icon={bookingChange.isIncrease ? faArrowTrendUp : faArrowTrendDown} 
                    style={{ color: bookingChange.isIncrease ? "#63E6BE" : "#d70f37" }} 
                  />
                  <span>{Math.abs(bookingChange.percentageChange)}%</span>
                </div>
              )}
              <h7><b>{twoRecentMonthBookingCount[twoRecentMonthBookingCount.length - 1].bookingCount}</b> chuyến</h7>
            </>
          )}
        </div>
        <div className="rectangle">3</div>
        <div className="rectangle">4</div>
      </div>
      <div className="chart-container">
        <div className="chart-box">
          <h4 className="chart-title">Top 5 Mẫu Xe Được Thuê Nhiều Nhất Tháng</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dataModel} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h4 className="chart-title">Doanh thu 6 tháng gần nhất</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h4 className="chart-title">Số lượt đặt xe theo địa điểm</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label>
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
