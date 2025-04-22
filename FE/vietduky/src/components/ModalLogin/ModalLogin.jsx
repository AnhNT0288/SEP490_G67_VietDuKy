import AppleAuth from "../AuthProviders/AppleAuth";
import FacebookAuth from "../AuthProviders/FacebookAuth";
import GoogleAuth from "../AuthProviders/GoogleAuth";
import PhoneAuth from "../AuthProviders/PhoneAuth";
import { X, Plane } from "lucide-react";
import { useEffect } from "react";
import { FaFacebook, FaApple } from "react-icons/fa";
import Icons from "../Icons/Icon";

export default function ModalLogin({ onClose }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose(); // Đóng modal khi nhấn ESC
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 pt-14 rounded-lg shadow-lg max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <Plane className="absolute top-2 left-2 text-red-500" size={24} /> */}
        <img src={Icons.PlaneFly} className="absolute left-0 top-1"/>

        {/* Nút đóng modal */}
        <button
          className="absolute top-3 right-3 text-gray-800 hover:text-gray-800"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Nội dung modal */}
        <div className="relative text-center">
          <h2 className="text-lg font-semibold text-black">
            Chào mừng đến với VietDuKy
          </h2>
          <p className="text-sm text-gray-500">Chọn phương thức đăng nhập</p>
        </div>

        {/* Các nút đăng nhập */}
        <div className="mt-4 space-y-3">
          <GoogleAuth onClose={onClose} />
          <PhoneAuth onClose={onClose} />
          <FacebookAuth onClose={onClose} />
          <AppleAuth onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
