import moment from "moment";

export const formatDate = (dateString) => {
  return moment(dateString).format("DD/MM/YYYY");
};

export const formatYMD = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number); // Tách và chuyển đổi thành số
  const formattedDay = String(day).padStart(2, '0'); // Đảm bảo ngày có 2 chữ số
  const formattedMonth = String(month).padStart(2, '0'); // Đảm bảo tháng có 2 chữ số
  return `${year}-${formattedMonth}-${formattedDay}`; // Trả về định dạng yyyy-mm-dd
};

export const formatDayDMY = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const excelDateToJSDate = (serial) => {
  const utc_days = Math.floor(serial - 25569);
  const date_info = new Date(utc_days * 86400 * 1000);
  return date_info.toISOString().split("T")[0]; // YYYY-MM-DD
};

export const formatTime = (timeString) => {
  if (!timeString || typeof timeString !== "string") return "";

  const parts = timeString.split(":");
  const hours = parts[0];
  const minutes = parts[1];

  return `${hours}:${minutes}`;
};