import CryptoJS from "crypto-js";

const SECRET_KEY = "MmptjjpLi6uZ2erfV6R4fy8grkh98PgC"; // Gợi ý: đặt vào .env và import nếu cần bảo mật cao

// Hàm mã hoá
export function encrypt(text) {
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (err) {
    console.error("Lỗi mã hoá:", err);
    return "";
  }
}

// Hàm giải mã
export function decrypt(cipherText) {
  try {
    return CryptoJS.AES.decrypt(cipherText, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Lỗi giải mã:", err);
    return "";
  }
}