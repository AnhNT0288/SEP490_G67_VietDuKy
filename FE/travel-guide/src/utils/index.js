import { STATUS_PENDING_TOUR } from "../constants/app.constant";

export const clearParams = (params) => {
  return Object.keys(params).reduce((acc, key) => {
    if (
      params[key] !== null &&
      params[key] !== undefined &&
      params[key] !== ""
    ) {
      acc[key] = params[key];
    }
    return acc;
  }, {});
};

export const getStatusPendingTour = (status) => {
  switch (status) {
    case STATUS_PENDING_TOUR.PENDING:
      return "Chờ duyệt";
    case STATUS_PENDING_TOUR.ACCEPTED:
      return "Đã duyệt";
    case STATUS_PENDING_TOUR.REJECTED:
      return "Đã từ chối";
    default:
      return "";
  }
};

export const calculateAgeAndType = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  // Xác định loại dựa trên độ tuổi
  let type = "adult"; // Mặc định là người lớn
  if (age < 2) {
    type = "infant"; // Em bé
  } else if (age < 12) {
    type = "child"; // Trẻ em
  }

  // Gán label cho từng type
  const label =
    type === "adult" ? "Người lớn" : type === "child" ? "Trẻ em" : "Em bé";

  return { age, type, label };
};
