export const timeStampConverter = (javaDate) => {
  const date = new Date(javaDate);

  const hours = date.getHours().toString().padStart(2, "0"); // Lấy giờ và format thành chuỗi 2 chữ số (01, 02, ..., 12)
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Lấy phút và format thành chuỗi 2 chữ số (01, 02, ..., 59)

  return `${hours}:${minutes}`;
};
