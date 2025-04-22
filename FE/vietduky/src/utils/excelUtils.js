import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportTemplate = () => {
  const worksheet = XLSX.utils.json_to_sheet([
    { "Họ tên": "", "Số điện thoại": "", "Giới tính": "", "Ngày sinh": "", "CCCD/Hộ chiếu": "" },
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách mẫu");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(data, "danh_sach_mau.xlsx");
};
