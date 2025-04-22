import * as XLSX from "xlsx";

const headerMap = {
  "Họ tên": "name",
  "Ngày sinh": "birth_date",
  "Số điện thoại": "phone_number",
  Passport: "passport_number",
  "Giới tính": "gender",
};

export const handleExcelUpload = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const headers = jsonData[0];
        const rows = jsonData.slice(1);

        const mappedData = rows.map((row) => {
          const obj = {};
          headers.forEach((header, index) => {
            const mappedKey = headerMap[header];
            if (mappedKey) {
              obj[mappedKey] = row[index];
            }
          });
          return obj;
        });

        resolve(mappedData);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
};
