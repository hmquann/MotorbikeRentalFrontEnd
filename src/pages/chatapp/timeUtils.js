export const timeStampConverter = (javaDate) => {
  const date = new Date(javaDate);

  // Lấy ra giờ, phút và AM/PM
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Giờ 0 phải đổi thành 12
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Lấy ngày và tháng
  const day = date.getUTCDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getUTCMonth()];

  return `${hours}:${formattedMinutes} ${ampm} | ${month} ${day}`;
};
