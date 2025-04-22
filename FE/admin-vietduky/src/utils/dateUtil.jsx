import moment from "moment";

export const formatDate = (dateString) => {
  return moment(dateString).format("DD/MM/YYYY");
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