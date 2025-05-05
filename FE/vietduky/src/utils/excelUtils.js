import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportTemplate = () => {
  const data = [
    {
      "Họ tên": "Nguyễn Văn A",
      "Số điện thoại": "0xxx-xxxx-xxx",
      "Giới tính": "Nam",
      "Ngày sinh": "DD/MM/YYYY",
      "Phòng đơn": "Không",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Tính độ rộng cột theo nội dung dài nhất của từng cột
  const columnWidths = Object.keys(data[0]).map((key) => {
    const maxLength = Math.max(
      key.length,
      ...data.map((item) => (item[key] ? item[key].toString().length : 0))
    );
    return { wch: maxLength + 2 }; // thêm padding 2
  });

  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách mẫu");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "danh_sach_mau.xlsx");
};
