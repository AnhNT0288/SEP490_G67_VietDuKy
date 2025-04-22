import React from "react";
import { FiSmartphone } from "react-icons/fi";

const PhoneAuth = () => {
  return (
    <button className="w-full flex items-center gap-14 bg-white border border-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-100">
      <FiSmartphone className="" size={24} />
      Đăng nhập bằng số điện thoại
    </button>
  );
};

export default PhoneAuth;
